(function () {
  var JOBS = {
    generate: { label: "Generate", color: "var(--generate)" },
    edit: { label: "Edit", color: "var(--edit)" },
    captions: { label: "Captions", color: "var(--captions)" },
    voice: { label: "Voice", color: "var(--voice)" },
    avatar: { label: "Avatar", color: "var(--avatar)" }
  };

  // name, jobs, free access, description, url
  var TOOLS = [
    ["Trim video", ["edit"], "Built in", "Cut a clip down to the part you want. Runs in your browser.", "tools.html#trim", true],
    ["Video to GIF", ["edit"], "Built in", "Turn a few seconds of video into an animated GIF.", "tools.html#gif", true],
    ["Extract audio", ["edit"], "Built in", "Save the sound from a video as an MP3.", "tools.html#audio", true],
    ["Compress video", ["edit"], "Built in", "Shrink a video so it is easy to send or upload.", "tools.html#compress", true],
    ["Resize for Shorts and Reels", ["edit"], "Built in", "Change a video to 9:16, 4:5, square or wide.", "tools.html#resize", true],
    ["Speed and reverse", ["edit"], "Built in", "Slow motion, fast forward or play backwards.", "tools.html#speed", true],
    ["Merge clips", ["edit"], "Built in", "Join two or more videos into one.", "tools.html#merge", true],
    ["Add text watermark", ["edit"], "Built in", "Put your name or handle on a video.", "tools.html#watermark", true],

    ["Luma Dream Machine", ["generate"], "Credits", "Turns a text prompt or a still image into a short clip.", "https://lumalabs.ai/dream-machine"],
    ["Runway", ["generate", "edit"], "Credits", "Text and image to video, plus green screen and object removal. Free credits are limited.", "https://runwayml.com"],
    ["Pika", ["generate"], "Credits", "Short clips from text or images, with effects that animate objects in a photo.", "https://pika.art"],
    ["Hailuo AI", ["generate"], "Credits", "Text to video and image to video. Free accounts get a credit allowance.", "https://hailuoai.video"],
    ["Kling AI", ["generate"], "Credits", "Text and image to video with a free credit allowance.", "https://klingai.com"],
    ["ComfyUI", ["generate"], "Open source", "Node-based app for running open video models on your own graphics card.", "https://www.comfy.org"],

    ["DaVinci Resolve", ["edit"], "Free plan", "Professional editor and colour tool. The free version covers most work.", "https://www.blackmagicdesign.com/products/davinciresolve"],
    ["CapCut", ["edit", "captions"], "Free plan", "Editor with auto captions, background removal and effects. Some features need Pro.", "https://www.capcut.com"],
    ["Clipchamp", ["edit", "voice"], "Free plan", "Browser editor from Microsoft with auto captions and text to speech.", "https://clipchamp.com"],
    ["Kapwing", ["edit", "captions"], "Free plan", "Online editor for subtitles, resizing and clean-up. Free exports may carry a watermark.", "https://www.kapwing.com"],
    ["Descript", ["edit", "captions"], "Free plan", "Edit video by editing its transcript. Delete a word and the clip is cut.", "https://www.descript.com"],
    ["Video2X", ["edit"], "Open source", "Upscales video and adds frames using local models.", "https://github.com/k4yt3x/video2x"],

    ["Subtitle Edit", ["captions"], "Open source", "Subtitle editor for Windows with built-in Whisper speech recognition.", "https://www.nikse.dk/subtitleedit"],
    ["Buzz", ["captions"], "Open source", "Transcribes audio and video offline on your computer using Whisper.", "https://github.com/chidiwilliams/buzz"],

    ["ElevenLabs", ["voice"], "Free plan", "Realistic text to speech and dubbing. The free plan has a monthly character limit.", "https://elevenlabs.io"],

    ["HeyGen", ["avatar"], "Free plan", "Presenter videos from a script. The free plan is limited.", "https://www.heygen.com"],
    ["D-ID", ["avatar"], "Trial", "Animates a photo so it speaks your script. Starts with free trial credits.", "https://www.d-id.com"]
  ];

  // Timeline clips: track, start %, width %, label
  var CLIPS = {
    generate: [[3, 24, "Text to clip"], [32, 20, "Image to clip"]],
    edit: [[2, 28, "Trim and cut"], [32, 24, "Resize to 9:16"], [60, 22, "Upscale"]],
    captions: [[10, 38, "Auto subtitles"], [54, 22, "Translate"]],
    voice: [[2, 28, "Voiceover"], [44, 30, "Narration"]],
    avatar: [[18, 36, "Talking presenter"]]
  };

  var state = { job: "all", q: "" };
  var $ = function (id) { return document.getElementById(id); };

  /* timeline */
  var body = $("tlbody");
  Object.keys(JOBS).forEach(function (k) {
    var tr = document.createElement("div");
    tr.className = "track";
    var lab = document.createElement("span");
    lab.className = "track-label";
    lab.textContent = JOBS[k].label;
    var lane = document.createElement("div");
    lane.className = "lane";
    CLIPS[k].forEach(function (c) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "clip";
      b.style.cssText = "left:" + c[0] + "%;width:" + c[1] + "%;--c:" + JOBS[k].color;
      b.textContent = c[2];
      b.dataset.job = k;
      b.dataset.s = c[0];
      b.dataset.e = c[0] + c[1];
      b.setAttribute("aria-pressed", "false");
      b.onclick = function () { setJob(state.job === k ? "all" : k, true); };
      lane.appendChild(b);
    });
    tr.appendChild(lab);
    tr.appendChild(lane);
    body.insertBefore(tr, $("head"));
  });

  var clips = [].slice.call(document.querySelectorAll(".clip"));
  var head = $("head"), tc = $("tc");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function frame(p) {
    head.style.setProperty("--p", p);
    var f = Math.floor(p * 30 * 24);
    var s = Math.floor(f / 24);
    tc.textContent = "00:00:" + pad(s) + ":" + pad(f % 24);
    clips.forEach(function (c) {
      c.classList.toggle("on", p * 100 >= +c.dataset.s && p * 100 <= +c.dataset.e);
    });
  }
  if (reduce) { frame(0.4); }
  else {
    var t0 = performance.now();
    (function tick(now) {
      frame(((now - t0) / 24000) % 1);
      requestAnimationFrame(tick);
    })(t0);
  }

  /* bin */
  var chips = $("chips"), rows = $("rows"), empty = $("empty");
  function match(t, key) { return key === "all" || (key === "builtin" ? t[2] === "Built in" : t[1].indexOf(key) > -1); }
  function chip(key, label, color) {
    var count = TOOLS.filter(function (t) { return match(t, key); }).length;
    var b = document.createElement("button");
    b.type = "button";
    b.className = "chip";
    b.dataset.k = key;
    if (color) b.style.setProperty("--c", color);
    b.innerHTML = (color ? "<i></i>" : "") + label + " <em>" + count + "</em>";
    b.onclick = function () { setJob(key, false); };
    chips.appendChild(b);
  }
  chip("all", "All");
  Object.keys(JOBS).forEach(function (k) { chip(k, JOBS[k].label, JOBS[k].color); });
  chip("builtin", "Built in", "var(--edit)");

  function setJob(k, scroll) {
    state.job = k;
    draw();
    if (scroll && k !== "all") $("tools").scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
  }

  function draw() {
    [].forEach.call(chips.children, function (b) { b.setAttribute("aria-pressed", b.dataset.k === state.job); });
    clips.forEach(function (c) { c.setAttribute("aria-pressed", c.dataset.job === state.job); });
    rows.textContent = "";
    var n = 0;
    TOOLS.forEach(function (t) {
      if (!match(t, state.job)) return;
      var hay = (t[0] + " " + t[3] + " " + t[1].join(" ") + " " + t[2]).toLowerCase();
      if (state.q && hay.indexOf(state.q) < 0) return;
      n++;
      var li = document.createElement("li");
      li.className = "row";
      var name = document.createElement("span");
      name.className = "name";
      var a = document.createElement("a");
      a.href = t[4]; a.textContent = t[0];
      if (!t[5]) { a.target = "_blank"; a.rel = "noopener noreferrer"; };
      name.appendChild(a);
      var jobs = document.createElement("span");
      jobs.className = "jobs";
      t[1].forEach(function (j) {
        var s = document.createElement("span");
        s.className = "job";
        s.style.setProperty("--c", JOBS[j].color);
        s.innerHTML = "<i></i>";
        s.appendChild(document.createTextNode(JOBS[j].label));
        jobs.appendChild(s);
      });
      var acc = document.createElement("span");
      acc.className = "acc"; acc.textContent = t[2];
      var d = document.createElement("p");
      d.className = "desc"; d.textContent = t[3];
      var o = document.createElement("a");
      o.className = "open"; o.href = t[4];
      if (!t[5]) { o.target = "_blank"; o.rel = "noopener noreferrer"; }
      o.textContent = t[5] ? "Use →" : "Open ↗";
      o.setAttribute("aria-label", "Open " + t[0]);
      [name, jobs, acc, d, o].forEach(function (x) { li.appendChild(x); });
      rows.appendChild(li);
    });
    empty.hidden = n > 0;
  }

  $("q").addEventListener("input", function (e) { state.q = e.target.value.trim().toLowerCase(); draw(); });
  draw();
})();
