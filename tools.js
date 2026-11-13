/* Clipztool editor: eight simple video tools that run in the browser with ffmpeg.wasm. Files never leave the device. */
(function () {
  var CORE = "vendor/ffmpeg/ffmpeg-core.js", WASM = "vendor/ffmpeg/ffmpeg-core.wasm";
  var MAX_MB = 700;
  var $ = function (id) { return document.getElementById(id); };

  var H264 = ["-c:v", "libx264", "-preset", "veryfast", "-crf", "23", "-pix_fmt", "yuv420p", "-movflags", "+faststart"];
  function n(v, d) { v = parseFloat(v); return isNaN(v) ? d : v; }
  function need(c, msg) { if (!c) throw new Error(msg); }

  /* ---- tool definitions ---- */
  var TOOLS = {
    trim: {
      name: "Trim video", blurb: "Cut a clip down to the part you want to keep.",
      opts: [
        { id: "start", label: "Start (seconds)", type: "number", value: 0, min: 0, step: 0.1 },
        { id: "end", label: "End (seconds)", type: "number", value: "", min: 0, step: 0.1 }
      ],
      defaults: function (d) { return { start: 0, end: d ? +d.toFixed(1) : "" }; },
      build: function (c) {
        var s = n(c.o.start, 0), e = n(c.o.end, 0);
        need(e > s, "End time must be later than the start time.");
        return { out: "out.mp4", args: ["-ss", String(s), "-i", c.in[0], "-t", String(e - s)].concat(H264, ["-c:a", "aac"]) };
      }
    },
    gif: {
      name: "Video to GIF", blurb: "Turn a short part of a video into an animated GIF.",
      opts: [
        { id: "start", label: "Start (seconds)", type: "number", value: 0, min: 0, step: 0.1 },
        { id: "len", label: "Length (seconds, max 15)", type: "number", value: 5, min: 1, max: 15, step: 0.5 },
        { id: "w", label: "Width", type: "select", value: "480", options: [["320", "320 px (small)"], ["480", "480 px"], ["640", "640 px (large)"]] },
        { id: "fps", label: "Frames per second", type: "select", value: "12", options: [["8", "8"], ["12", "12"], ["15", "15"]] }
      ],
      defaults: function (d) { return { len: d ? Math.max(1, Math.min(5, +d.toFixed(1))) : 5 }; },
      build: function (c) {
        var len = Math.min(15, Math.max(1, n(c.o.len, 5)));
        var vf = "fps=" + c.o.fps + ",scale=" + c.o.w + ":-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse";
        return { out: "out.gif", mime: "image/gif", kind: "image",
          args: ["-ss", String(n(c.o.start, 0)), "-t", String(len), "-i", c.in[0], "-vf", vf, "-loop", "0"] };
      }
    },
    audio: {
      name: "Extract audio", blurb: "Save the sound from a video as an MP3 file.",
      opts: [{ id: "q", label: "Quality", type: "select", value: "2", options: [["2", "High"], ["4", "Medium"], ["6", "Small file"]] }],
      build: function (c) {
        need(c.info[0].audio, "This video has no audio track.");
        return { out: "out.mp3", mime: "audio/mpeg", kind: "audio",
          args: ["-i", c.in[0], "-vn", "-c:a", "libmp3lame", "-q:a", c.o.q] };
      }
    },
    compress: {
      name: "Compress video", blurb: "Make a video smaller so it is easy to send or upload.",
      opts: [
        { id: "crf", label: "Compression", type: "select", value: "28", options: [["25", "Light (best quality)"], ["28", "Balanced"], ["32", "Strong (smallest file)"]] },
        { id: "maxw", label: "Maximum width", type: "select", value: "1280", options: [["0", "Keep original"], ["1920", "1920 px"], ["1280", "1280 px"], ["854", "854 px"]] }
      ],
      build: function (c) {
        var w = +c.o.maxw;
        var vf = w ? "scale='min(" + w + ",iw)':-2" : "scale=trunc(iw/2)*2:trunc(ih/2)*2";
        return { out: "out.mp4", args: ["-i", c.in[0], "-vf", vf, "-c:v", "libx264", "-preset", "veryfast", "-crf", c.o.crf,
          "-pix_fmt", "yuv420p", "-movflags", "+faststart", "-c:a", "aac", "-b:a", "96k"] };
      }
    },
    resize: {
      name: "Resize for Shorts and Reels", blurb: "Change the shape of a video for TikTok, Reels, Shorts or YouTube.",
      opts: [
        { id: "ratio", label: "Shape", type: "select", value: "720x1280", options: [["720x1280", "Vertical 9:16 (TikTok, Reels, Shorts)"], ["720x900", "Portrait 4:5 (Instagram feed)"], ["720x720", "Square 1:1"], ["1280x720", "Wide 16:9 (YouTube)"]] },
        { id: "fit", label: "How to fit", type: "select", value: "fill", options: [["fill", "Fill the frame (crops the edges)"], ["fit", "Show everything (adds black bars)"]] }
      ],
      build: function (c) {
        var p = c.o.ratio.split("x"), W = p[0], H = p[1];
        var vf = c.o.fit === "fill"
          ? "scale=" + W + ":" + H + ":force_original_aspect_ratio=increase,crop=" + W + ":" + H + ",setsar=1"
          : "scale=" + W + ":" + H + ":force_original_aspect_ratio=decrease,pad=" + W + ":" + H + ":(ow-iw)/2:(oh-ih)/2,setsar=1";
        return { out: "out.mp4", args: ["-i", c.in[0], "-vf", vf].concat(H264, ["-c:a", "aac"]) };
      }
    },
    speed: {
      name: "Speed and reverse", blurb: "Slow motion, fast forward, or play a clip backwards.",
      opts: [{ id: "mode", label: "Effect", type: "select", value: "2", options: [["0.5", "Slow motion 0.5x"], ["0.75", "Slightly slower 0.75x"], ["1.5", "Faster 1.5x"], ["2", "Fast 2x"], ["4", "Very fast 4x"], ["rev", "Reverse (short clips only)"]] }],
      build: function (c) {
        var a = c.info[0].audio, m = c.o.mode, args = ["-i", c.in[0]];
        if (m === "rev") {
          need(c.info[0].duration <= 30, "Reverse needs a clip of 30 seconds or less. Trim it first.");
          args.push("-vf", "reverse"); if (a) args.push("-af", "areverse");
        } else {
          var f = +m;
          args.push("-vf", "setpts=PTS/" + f);
          if (a) args.push("-af", f === 4 ? "atempo=2,atempo=2" : "atempo=" + f);
        }
        if (!a) args.push("-an");
        return { out: "out.mp4", args: args.concat(H264, a ? ["-c:a", "aac"] : []) };
      }
    },
    merge: {
      name: "Merge clips", multi: true, blurb: "Join two or more videos into one, in the order shown.",
      opts: [{ id: "size", label: "Output size", type: "select", value: "1280x720", options: [["1280x720", "Wide 1280x720"], ["720x1280", "Vertical 720x1280"], ["720x720", "Square 720x720"]] }],
      build: function (c) {
        need(c.in.length >= 2, "Add at least two videos to merge.");
        var p = c.o.size.split("x"), W = p[0], H = p[1];
        var allAudio = c.info.every(function (i) { return i.audio; }), f = [], cat = "";
        c.in.forEach(function (_, i) {
          f.push("[" + i + ":v]scale=" + W + ":" + H + ":force_original_aspect_ratio=decrease,pad=" + W + ":" + H + ":(ow-iw)/2:(oh-ih)/2,setsar=1,fps=30[v" + i + "]");
          if (allAudio) f.push("[" + i + ":a]aresample=44100,aformat=channel_layouts=stereo[a" + i + "]");
          cat += "[v" + i + "]" + (allAudio ? "[a" + i + "]" : "");
        });
        f.push(cat + "concat=n=" + c.in.length + ":v=1:a=" + (allAudio ? 1 : 0) + "[v]" + (allAudio ? "[a]" : ""));
        var args = [];
        c.in.forEach(function (nm) { args.push("-i", nm); });
        args.push("-filter_complex", f.join(";"), "-map", "[v]");
        if (allAudio) args.push("-map", "[a]", "-c:a", "aac");
        return { out: "out.mp4", args: args.concat(H264), note: allAudio ? "" : "Some clips have no audio, so the merged video is silent." };
      }
    },
    watermark: {
      name: "Add text watermark", blurb: "Put your name or handle on a video.",
      opts: [
        { id: "text", label: "Text", type: "text", value: "@yourname" },
        { id: "pos", label: "Position", type: "select", value: "br", options: [["br", "Bottom right"], ["bl", "Bottom left"], ["tr", "Top right"], ["tl", "Top left"], ["c", "Center"]] },
        { id: "size", label: "Size", type: "select", value: "0.04", options: [["0.03", "Small"], ["0.04", "Medium"], ["0.06", "Large"]] }
      ],
      build: function (c) {
        need(c.o.text.trim(), "Type the text to add.");
        var W = c.info[0].w || 1280, px = Math.max(16, Math.round(W * +c.o.size));
        var cv = document.createElement("canvas"), x = cv.getContext("2d");
        var font = "700 " + px + "px system-ui, Arial, sans-serif";
        x.font = font;
        var tw = Math.ceil(x.measureText(c.o.text).width), pad = Math.round(px * 0.4);
        cv.width = tw + pad * 2; cv.height = Math.round(px * 1.5);
        x.font = font; x.textBaseline = "middle"; x.shadowColor = "rgba(0,0,0,.6)"; x.shadowBlur = px * 0.15;
        x.fillStyle = "rgba(255,255,255,.9)"; x.fillText(c.o.text, pad, cv.height / 2);
        var m = 24, pos = { br: "x=W-w-" + m + ":y=H-h-" + m, bl: "x=" + m + ":y=H-h-" + m, tr: "x=W-w-" + m + ":y=" + m, tl: "x=" + m + ":y=" + m, c: "x=(W-w)/2:y=(H-h)/2" }[c.o.pos];
        return new Promise(function (res) {
          cv.toBlob(function (b) {
            b.arrayBuffer().then(function (buf) {
              res({ out: "out.mp4", extra: [["wm.png", new Uint8Array(buf)]],
                args: ["-i", c.in[0], "-i", "wm.png", "-filter_complex", "[0:v][1:v]overlay=" + pos + ",format=yuv420p"].concat(
                  ["-c:v", "libx264", "-preset", "veryfast", "-crf", "23", "-movflags", "+faststart", "-c:a", "aac"]) });
            });
          }, "image/png");
        });
      }
    }
  };

  /* ---- engine ---- */
  var ff = null, loading = null, logBuf = [], onProgress = function () {};
  function abs(p) { return new URL(p, location.href).href; }
  function engine() {
    if (ff) return Promise.resolve(ff);
    if (loading) return loading;
    if (!window.FFmpegWASM) return Promise.reject(new Error("The video engine could not be loaded. Reload the page."));
    var f = new FFmpegWASM.FFmpeg();
    f.on("log", function (m) { logBuf.push(m.message); if (logBuf.length > 400) logBuf.shift(); });
    f.on("progress", function (p) { onProgress(p.progress); });
    loading = f.load({ coreURL: abs(CORE), wasmURL: abs(WASM) }).then(function () { ff = f; loading = null; return f; }, function (e) { loading = null; throw e; });
    return loading;
  }
  function execArgs(args) {
    return ff.exec(args).then(function (code) { if (code !== 0) throw new Error("The tool could not process this video. " + lastLog()); });
  }
  function parseInfo(txt) {
    var d = /Duration: (\d+):(\d+):(\d+(?:\.\d+)?)/.exec(txt), v = /Video:.*?,\s*(\d{2,5})x(\d{2,5})/.exec(txt);
    return { duration: d ? (+d[1]) * 3600 + (+d[2]) * 60 + parseFloat(d[3]) : 0, w: v ? +v[1] : 0, h: v ? +v[2] : 0, audio: /Audio:/.test(txt), video: /Video:/.test(txt) };
  }
  function ext(name) { var e = (name.split(".").pop() || "mp4").replace(/[^a-z0-9]/gi, "").toLowerCase(); return e.length > 5 ? "mp4" : e || "mp4"; }

  /* ---- state and UI ---- */
  var cur = "trim", files = [], durations = [], busy = false, resultUrl = null;
  var nav = $("toolnav"), form = $("opts"), list = $("filelist"), status = $("status"), bar = $("bar"), result = $("result"), runBtn = $("run"), input = $("file");

  Object.keys(TOOLS).forEach(function (k) {
    var b = document.createElement("a");
    b.href = "#" + k; b.className = "tn"; b.dataset.k = k; b.textContent = TOOLS[k].name;
    nav.appendChild(b);
  });

  function say(msg, cls) { status.textContent = msg; status.className = "status " + (cls || ""); }
  function fmtSize(b) { return b > 1048576 ? (b / 1048576).toFixed(1) + " MB" : Math.max(1, Math.round(b / 1024)) + " KB"; }
  function fmtTime(s) { s = Math.round(s); return Math.floor(s / 60) + ":" + ("0" + (s % 60)).slice(-2); }

  function renderOpts(vals) {
    var t = TOOLS[cur]; form.textContent = "";
    t.opts.forEach(function (o) {
      var w = document.createElement("div"); w.className = "field";
      var l = document.createElement("label"); l.htmlFor = "o-" + o.id; l.textContent = o.label;
      var el;
      if (o.type === "select") {
        el = document.createElement("select");
        o.options.forEach(function (p) { var op = document.createElement("option"); op.value = p[0]; op.textContent = p[1]; el.appendChild(op); });
      } else {
        el = document.createElement("input"); el.type = o.type;
        if (o.min != null) el.min = o.min; if (o.max != null) el.max = o.max; if (o.step) el.step = o.step;
      }
      el.id = "o-" + o.id;
      el.value = vals && vals[o.id] != null ? vals[o.id] : o.value;
      w.appendChild(l); w.appendChild(el); form.appendChild(w);
    });
  }
  function readOpts() { var o = {}; TOOLS[cur].opts.forEach(function (d) { o[d.id] = $("o-" + d.id).value; }); return o; }

  function renderFiles() {
    list.textContent = "";
    var multi = TOOLS[cur].multi;
    files.forEach(function (f, i) {
      var li = document.createElement("li");
      var nm = document.createElement("span"); nm.className = "fname";
      nm.textContent = (multi ? (i + 1) + ". " : "") + f.name;
      var meta = document.createElement("span"); meta.className = "mono dim";
      meta.textContent = fmtSize(f.size) + (durations[i] ? " · " + fmtTime(durations[i]) : "");
      li.appendChild(nm); li.appendChild(meta);
      if (multi) {
        [["↑", -1, "Move up"], ["↓", 1, "Move down"], ["×", 0, "Remove"]].forEach(function (a) {
          var b = document.createElement("button"); b.type = "button"; b.className = "mini"; b.textContent = a[0]; b.setAttribute("aria-label", a[2] + " " + f.name);
          b.onclick = function () {
            if (a[1] === 0) { files.splice(i, 1); durations.splice(i, 1); }
            else { var j = i + a[1]; if (j < 0 || j >= files.length) return; [files[i], files[j]] = [files[j], files[i]]; [durations[i], durations[j]] = [durations[j], durations[i]]; }
            renderFiles();
          };
          li.appendChild(b);
        });
      }
      list.appendChild(li);
    });
    $("drop-text").textContent = files.length ? (TOOLS[cur].multi ? "Add more videos" : "Choose a different video") : (TOOLS[cur].multi ? "Choose two or more videos, or drop them here" : "Choose a video, or drop it here");
    runBtn.disabled = busy || !files.length;
  }

  function readDuration(file, cb) {
    var v = document.createElement("video"), u = URL.createObjectURL(file);
    v.preload = "metadata"; v.muted = true;
    v.onloadedmetadata = function () { cb(isFinite(v.duration) ? v.duration : 0); URL.revokeObjectURL(u); };
    v.onerror = function () { cb(0); URL.revokeObjectURL(u); };
    v.src = u;
  }

  function addFiles(fl) {
    fl = [].slice.call(fl).filter(function (f) { return f.type.indexOf("video") === 0 || /\.(mp4|mov|m4v|webm|mkv|avi)$/i.test(f.name); });
    if (!fl.length) { say("Choose a video file, such as MP4, MOV or WebM.", "err"); return; }
    if (!TOOLS[cur].multi) { files = []; durations = []; fl = fl.slice(0, 1); }
    for (var i = 0; i < fl.length; i++) {
      if (fl[i].size > MAX_MB * 1048576) { say(fl[i].name + " is larger than " + MAX_MB + " MB. Browser tools need smaller files. Compress or trim it with a desktop editor first.", "err"); return; }
    }
    fl.forEach(function (f) {
      var idx = files.push(f) - 1; durations[idx] = 0;
      readDuration(f, function (d) {
        var j = files.indexOf(f); if (j < 0) return; durations[j] = d; renderFiles();
        if (!TOOLS[cur].multi && TOOLS[cur].defaults) renderOpts(Object.assign({}, readOpts(), TOOLS[cur].defaults(d)));
      });
    });
    clearResult(); say(""); renderFiles();
  }

  function clearResult() {
    result.textContent = ""; result.hidden = true; bar.hidden = true;
    if (resultUrl) { URL.revokeObjectURL(resultUrl); resultUrl = null; }
  }

  function select(k) {
    if (!TOOLS[k]) k = "trim";
    cur = k; var t = TOOLS[k];
    [].forEach.call(nav.children, function (a) { a.setAttribute("aria-current", a.dataset.k === k ? "page" : "false"); });
    $("tool-title").textContent = t.name; $("tool-blurb").textContent = t.blurb;
    input.multiple = !!t.multi;
    if (!t.multi && files.length > 1) { files = files.slice(0, 1); durations = durations.slice(0, 1); }
    renderOpts(t.defaults && durations[0] ? t.defaults(durations[0]) : null);
    clearResult(); say(""); renderFiles();
  }
  window.addEventListener("hashchange", function () { var k = location.hash.slice(1); if (!busy && TOOLS[k]) select(k); });

  input.addEventListener("change", function () { addFiles(input.files); input.value = ""; });
  var drop = $("drop");
  ["dragenter", "dragover"].forEach(function (e) { drop.addEventListener(e, function (ev) { ev.preventDefault(); drop.classList.add("over"); }); });
  ["dragleave", "drop"].forEach(function (e) { drop.addEventListener(e, function (ev) { ev.preventDefault(); drop.classList.remove("over"); }); });
  drop.addEventListener("drop", function (ev) { if (!busy) addFiles(ev.dataTransfer.files); });

  function setBusy(b) { busy = b; runBtn.disabled = b || !files.length; input.disabled = b; runBtn.textContent = b ? "Working..." : "Run"; }

  function run() {
    if (busy || !files.length) return;
    if (!ClipzAuth.user()) { showFor(null); ClipzAuth.mountForm($("gate-form"), { path: "/tools.html", next: cur, error: "Your session ended. Sign in again to continue." }); return; }
    var t = TOOLS[cur], opts = readOpts(), names = [], outName = null, spec;
    clearResult(); setBusy(true); bar.hidden = false; bar.value = 0;
    say(ff ? "Reading your video..." : "Loading the video engine (about 25 MB, first time only)...");
    onProgress = function (r) { if (r >= 0 && r <= 1) { bar.value = r; say("Processing... " + Math.round(r * 100) + "%"); } };
    var info = [];
    engine().then(function () {
      return files.reduce(function (p, f, i) {
        return p.then(function () { return f.arrayBuffer(); }).then(function (buf) {
          var nm = "in" + i + "." + ext(f.name); names.push(nm);
          return ff.writeFile(nm, new Uint8Array(buf)).then(function () {
            logBuf = [];
            return ff.exec(["-i", nm, "-t", "0.01", "-f", "null", "-"]);
          }).catch(function () {}).then(function () {
            var inf = parseInfo(logBuf.join("\n"));
            need(inf.video, f.name + " does not look like a video this tool can read.");
            if (!inf.duration) inf.duration = durations[i] || 0;
            info.push(inf);
          });
        });
      }, Promise.resolve());
    }).then(function () {
      return t.build({ in: names, o: opts, info: info });
    }).then(function (s) {
      spec = s;
      return Promise.all((s.extra || []).map(function (e) { return ff.writeFile(e[0], e[1]); }));
    }).then(function () {
      say("Processing...");
      logBuf = [];
      return execArgs(spec.args.concat([spec.out]));
    }).then(function () {
      return ff.readFile(spec.out).catch(function () { throw new Error("The tool did not produce a file. " + lastLog()); });
    }).then(function (data) {
      need(data.length > 0, "The tool produced an empty file. " + lastLog());
      showResult(new Blob([data], { type: spec.mime || "video/mp4" }), spec, t);
    }).catch(function (e) {
      var m = String(e && e.message || e);
      if (/memory|abort|RuntimeError|out of bounds/i.test(m)) { ff = null; m = "The browser ran out of memory. Try a shorter or smaller video, or compress it first."; }
      say(m, "err"); bar.hidden = true;
    }).then(function () {
      var rm = names.slice(); if (spec) { rm.push(spec.out); (spec.extra || []).forEach(function (e) { rm.push(e[0]); }); }
      return Promise.all(rm.map(function (n) { return ff ? ff.deleteFile(n).catch(function () {}) : null; }));
    }).then(function () { setBusy(false); });
  }
  function lastLog() { var l = logBuf.filter(function (x) { return /error|invalid|unable|no such/i.test(x); }).pop(); return l ? "(" + l.trim() + ")" : "Try an MP4 or MOV file."; }

  function showResult(blob, spec, t) {
    resultUrl = URL.createObjectURL(blob);
    var base = files[0].name.replace(/\.[^.]+$/, "") + "-" + cur;
    var fname = base + "." + spec.out.split(".").pop();
    var kind = spec.kind || "video", el;
    if (kind === "audio") { el = document.createElement("audio"); el.controls = true; }
    else if (kind === "image") { el = document.createElement("img"); el.alt = "Your GIF"; }
    else { el = document.createElement("video"); el.controls = true; el.playsInline = true; }
    el.src = resultUrl;
    var a = document.createElement("a"); a.className = "btn"; a.href = resultUrl; a.download = fname; a.textContent = "Download " + fname;
    var meta = document.createElement("p"); meta.className = "mono dim";
    meta.textContent = fmtSize(blob.size) + (files.length === 1 ? " · original " + fmtSize(files[0].size) : "") + (spec.note ? " · " + spec.note : "");
    result.appendChild(el); result.appendChild(meta); result.appendChild(a); result.hidden = false;
    bar.value = 1; say("Done.", "ok");
  }

  runBtn.addEventListener("click", run);

  /* Show the editor only to signed-in users. */
  function toolFromUrl() {
    var h = location.hash.slice(1);
    if (TOOLS[h]) return h;
    var nx = null;
    try { nx = localStorage.getItem("clipz_next"); localStorage.removeItem("clipz_next"); } catch (e) {}
    return nx && TOOLS[nx] ? nx : "trim";
  }
  var signedIn = false;
  function showFor(u) { signedIn = !!u; $("gate").hidden = !!u; $("app").hidden = !u; }
  select("trim");
  ClipzAuth.ready.then(function () {
    var u = ClipzAuth.user();
    showFor(u);
    var k = toolFromUrl(); select(k);
    if (location.hash !== "#" + k) history.replaceState(null, "", "#" + k);
    if (!u) ClipzAuth.mountForm($("gate-form"), { path: "/tools.html", next: k, error: ClipzAuth.urlError() });
  });
  ClipzAuth.onChange(function (u) {
    var was = signedIn;
    showFor(u);
    if (!u && was) ClipzAuth.mountForm($("gate-form"), { path: "/tools.html", next: cur });
  });

  window.__clipz = { engine: engine, TOOLS: TOOLS };
})();
