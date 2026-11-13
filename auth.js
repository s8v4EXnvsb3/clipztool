/* Clipztool sign-in: passwordless magic links through Supabase Auth.
   The URL and key below are public by design (publishable key). Never put a secret key in this file. */
(function () {
  var SB_URL = "https://ymmuwicqtmtztwydgpfy.supabase.co";
  var SB_KEY = "sb_publishable_bNPA44zwtLw91JdPQyJJKQ_QiFIF15l";
  var COOLDOWN = 60;

  /* An expired or reused link comes back as #error=...; read it before the client clears the hash. */
  var urlError = null;
  (function () {
    var h = location.hash.replace(/^#/, "");
    if (/(^|&)error(_code|_description)?=/.test(h)) {
      var p = new URLSearchParams(h);
      urlError = p.get("error_code") === "otp_expired"
        ? "That sign-in link has expired or was already used. Enter your email to get a new one."
        : (p.get("error_description") || "Sign-in did not work. Please try again.");
    }
  })();

  var sb = null, user = null, listeners = [];
  try {
    sb = window.supabase.createClient(SB_URL, SB_KEY, { auth: { flowType: "implicit", detectSessionInUrl: true, persistSession: true, autoRefreshToken: true } });
  } catch (e) { sb = null; }

  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
  function store(k, v) { try { if (v == null) localStorage.removeItem(k); else localStorage.setItem(k, v); } catch (e) {} }
  function friendly(err) {
    var m = (err && err.message) || "";
    if ((err && err.status === 429) || /rate limit|too many|seconds/i.test(m)) return "Too many sign-in emails were requested. Wait a minute and try again.";
    if (/invalid.*email|email.*invalid/i.test(m)) return "That email address does not look right.";
    return "We could not send the link. Check your connection and try again.";
  }

  /* ---- the sign-in form, used in the dialog and in the editor gate ---- */
  function mountForm(root, opts) {
    opts = opts || {};
    root.textContent = "";
    var form = el("form", "auth-form");
    form.noValidate = false;
    var lab = el("label", "sr", "Email address"); lab.htmlFor = "auth-email-" + (mountForm.n = (mountForm.n || 0) + 1);
    var inp = el("input"); inp.type = "email"; inp.id = lab.htmlFor; inp.required = true; inp.autocomplete = "email"; inp.placeholder = "you@example.com"; inp.inputMode = "email";
    var btn = el("button", "btn", "Email me a sign-in link"); btn.type = "submit";
    var msg = el("p", "auth-msg"); msg.setAttribute("role", "status"); msg.setAttribute("aria-live", "polite");
    var fine = el("p", "auth-fine dim", "No password. New here? The same link creates your account.");
    form.appendChild(lab); form.appendChild(inp); form.appendChild(btn);
    root.appendChild(form); root.appendChild(msg); root.appendChild(fine);
    if (opts.error) { msg.textContent = opts.error; msg.className = "auth-msg err"; }

    function sent(email) {
      root.textContent = "";
      root.appendChild(el("h3", "auth-sent", "Check your inbox"));
      var p = el("p", "auth-sentp"); p.appendChild(document.createTextNode("We sent a sign-in link to "));
      p.appendChild(el("strong", null, email)); p.appendChild(document.createTextNode(". Open it on this device to continue. It works once and expires in an hour. Check spam if you do not see it."));
      root.appendChild(p);
      var row = el("div", "auth-row");
      var again = el("button", "btn alt", ""); again.type = "button";
      var other = el("button", "linklike", "Use a different email"); other.type = "button";
      row.appendChild(again); row.appendChild(other); root.appendChild(row);
      var left = COOLDOWN, timer;
      function tick() { if (left > 0) { again.disabled = true; again.textContent = "Resend in " + left + "s"; left--; timer = setTimeout(tick, 1000); } else { again.disabled = false; again.textContent = "Resend the link"; } }
      tick();
      again.onclick = function () { clearTimeout(timer); mountForm(root, opts); root.querySelector("input").value = email; root.querySelector("form").requestSubmit(); };
      other.onclick = function () { clearTimeout(timer); mountForm(root, opts); root.querySelector("input").focus(); };
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!sb) { msg.textContent = "Sign-in is unavailable right now. Reload the page and try again."; msg.className = "auth-msg err"; return; }
      var email = inp.value.trim().toLowerCase();
      if (!email) return;
      btn.disabled = true; btn.textContent = "Sending..."; msg.textContent = ""; msg.className = "auth-msg";
      store("clipz_next", opts.next || null);
      sb.auth.signInWithOtp({ email: email, options: { emailRedirectTo: location.origin + (opts.path || "/") } }).then(function (r) {
        if (r.error) { btn.disabled = false; btn.textContent = "Email me a sign-in link"; msg.textContent = friendly(r.error); msg.className = "auth-msg err"; }
        else sent(email);
      }, function () { btn.disabled = false; btn.textContent = "Email me a sign-in link"; msg.textContent = friendly(); msg.className = "auth-msg err"; });
    });
  }

  /* ---- dialog ---- */
  var dlg = null, dlgBody = null, dlgTitle = null, dlgLead = null;
  function buildDialog() {
    dlg = el("dialog", "auth-dlg"); dlg.setAttribute("aria-labelledby", "auth-ttl");
    var close = el("button", "auth-x", "×"); close.type = "button"; close.setAttribute("aria-label", "Close");
    dlgTitle = el("h2", null, "Create your free account"); dlgTitle.id = "auth-ttl";
    dlgLead = el("p", "dim");
    dlgBody = el("div", "auth-body");
    dlg.appendChild(close); dlg.appendChild(dlgTitle); dlg.appendChild(dlgLead); dlg.appendChild(dlgBody);
    document.body.appendChild(dlg);
    close.onclick = function () { dlg.close ? dlg.close() : dlg.removeAttribute("open"); };
    dlg.addEventListener("click", function (e) { if (e.target === dlg) close.onclick(); });
  }
  function requireLogin(opts) {
    opts = opts || {};
    if (!dlg) buildDialog();
    dlgLead.textContent = opts.message || "Enter your email and we will send you a link. It takes a few seconds.";
    mountForm(dlgBody, { path: opts.path || "/", next: opts.next, error: opts.error || urlError });
    if (dlg.showModal) { if (!dlg.open) dlg.showModal(); } else dlg.setAttribute("open", "");
    var i = dlgBody.querySelector("input"); if (i) i.focus();
  }

  /* ---- header widget ---- */
  function render() {
    var slot = document.getElementById("auth-slot");
    if (!slot) return;
    slot.textContent = "";
    if (user) {
      var who = el("span", "who mono", user.email || "Signed in"); who.title = user.email || "";
      var out = el("button", "linklike", "Sign out"); out.type = "button";
      out.onclick = function () { sb.auth.signOut(); };
      slot.appendChild(who); slot.appendChild(out);
    } else {
      var inb = el("button", "signin", "Sign in"); inb.type = "button";
      inb.onclick = function () { requireLogin({ path: location.pathname.indexOf("tools") > -1 ? "/tools.html" : "/", next: null }); };
      slot.appendChild(inb);
    }
  }

  var ready = sb
    ? sb.auth.getSession().then(function (r) { user = r.data && r.data.session ? r.data.session.user : null; }, function () { user = null; })
    : Promise.resolve();
  ready.then(render);
  if (sb) sb.auth.onAuthStateChange(function (ev, s) { user = s ? s.user : null; render(); listeners.forEach(function (f) { f(user); }); });
  document.addEventListener("DOMContentLoaded", render);

  window.ClipzAuth = {
    ready: ready,
    user: function () { return user; },
    onChange: function (f) { listeners.push(f); },
    requireLogin: requireLogin,
    mountForm: mountForm,
    urlError: function () { return urlError; }
  };
})();
