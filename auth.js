/* Clipztool sign-in: passwordless email links through Clerk.
   The publishable key is public by design. Never put a secret key (sk_...) in this file.
   The rest of the site only talks to window.ClipzAuth, so the provider can be swapped by editing this file. */
(function () {
  var PUBLISHABLE_KEY = "pk_test_dmFsaWQtYmlzb24tMjM0NS5jbGVyay5hY2NvdW50cy5kZXYk";
  var CLERK_MAJOR = "6", UI_MAJOR = "1";
  var FRONTEND_API = atob(PUBLISHABLE_KEY.split("_")[2]).replace(/\$$/, "");

  var clerk = null, user = null, listeners = [], mounted = null;

  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
  function store(k, v) { try { if (v == null) localStorage.removeItem(k); else localStorage.setItem(k, v); } catch (e) {} }
  function toUser(u) {
    if (!u) return null;
    var a = u.primaryEmailAddress || (u.emailAddresses && u.emailAddresses[0]);
    return { id: u.id, email: a ? a.emailAddress : "" };
  }

  /* Match the black site design inside Clerk's prebuilt component (both old and new variable names). */
  var APPEARANCE = {
    variables: {
      colorPrimary: "#ecebe8", colorPrimaryForeground: "#0a0a0a", colorTextOnPrimaryBackground: "#0a0a0a",
      colorBackground: "#101010", colorForeground: "#ecebe8", colorText: "#ecebe8",
      colorMutedForeground: "#85847f", colorTextSecondary: "#85847f",
      colorInput: "#0a0a0a", colorInputForeground: "#ecebe8", colorInputBackground: "#0a0a0a", colorInputText: "#ecebe8",
      colorNeutral: "#ecebe8", colorDanger: "#ff9d9d", borderRadius: "2px",
      fontFamily: "Archivo, system-ui, sans-serif", fontFamilyButtons: "Archivo, system-ui, sans-serif"
    },
    elements: {
      rootBox: { width: "100%" },
      footerAction: { display: "none" },
      header: { display: "none" },
      cardBox: { width: "100%", boxShadow: "none", border: "none", background: "transparent" },
      card: { boxShadow: "none", border: "none", background: "transparent", padding: "0" }
    }
  };

  /* ---- load Clerk (core script plus the separate UI script that holds the sign-in screens) ---- */
  function loadScript(src, withKey) {
    return new Promise(function (res, rej) {
      var s = document.createElement('script');
      s.async = true; s.crossOrigin = 'anonymous';
      if (withKey) s.setAttribute('data-clerk-publishable-key', PUBLISHABLE_KEY);
      s.src = src; s.onload = res; s.onerror = function () { rej(new Error('Could not load ' + src)); };
      document.head.appendChild(s);
    });
  }
  var base = 'https://' + FRONTEND_API + '/npm/@clerk/';
  var ready = Promise.all([
    loadScript(base + 'clerk-js@' + CLERK_MAJOR + '/dist/clerk.browser.js', true),
    loadScript(base + 'ui@' + UI_MAJOR + '/dist/ui.browser.js', false)
  ]).then(function () {
    return window.Clerk.load({ ui: { ClerkUI: window.__internal_ClerkUICtor }, appearance: APPEARANCE, localization: { formButtonPrimary: 'Sign me in' } });
  }).then(function () {
    clerk = window.Clerk;
    user = toUser(clerk.user);
    clerk.addListener(function (r) {
      var was = !!user;
      user = toUser(r.user);
      if (user) unmountForm();
      render();
      if (was !== !!user) listeners.forEach(function (f) { f(user); });
    });
  }).catch(function (e) { console.error('Clerk failed to load', e); });

  /* ---- the sign-in form: Clerk's prebuilt component, with our own Sign in / Create account switch ---- */
  function unmountForm() {
    if (!mounted || !clerk) return;
    try { if (mounted.mode === 'up') clerk.unmountSignUp(mounted.node); else clerk.unmountSignIn(mounted.node); } catch (e) {}
    mounted = null;
  }
  function mountForm(root, opts) {
    opts = opts || {};
    unmountForm();
    root.textContent = '';
    if (opts.error) root.appendChild(el('p', 'auth-msg err', opts.error));
    if (!clerk) { root.appendChild(el('p', 'auth-msg err', 'Sign-in is unavailable right now. Reload the page and try again.')); return; }
    var dest = location.origin + (opts.path || '/tools.html') + (opts.next ? '#' + opts.next : '');
    store('clipz_next', opts.next || null);
    var tabs = el('div', 'auth-tabs'), bIn = el('button', null, 'Sign in'), bUp = el('button', null, 'Create account');
    bIn.type = 'button'; bUp.type = 'button';
    tabs.appendChild(bIn); tabs.appendChild(bUp);
    var box = el('div', 'clerk-box');
    root.appendChild(tabs); root.appendChild(box);
    function show(mode) {
      unmountForm();
      var props = { forceRedirectUrl: dest, fallbackRedirectUrl: dest, routing: 'virtual' };
      if (mode === 'up') clerk.mountSignUp(box, props); else clerk.mountSignIn(box, props);
      mounted = { node: box, mode: mode };
      bIn.setAttribute('aria-pressed', mode === 'in'); bUp.setAttribute('aria-pressed', mode === 'up');
    }
    bIn.onclick = function () { show('in'); };
    bUp.onclick = function () { show('up'); };
    show(opts.mode === 'up' ? 'up' : 'in');
  }

  /* ---- sign-in lives on the editor page: focus its form there, or go there ---- */
  function goSignIn(next) {
    var box = document.getElementById("gate-form");
    if (box) {
      var g = document.getElementById("gate"); if (g) g.scrollIntoView({ behavior: "smooth", block: "center" });
      var i = box.querySelector("input"); if (i) i.focus({ preventScroll: true });
    } else location.href = "/tools.html" + (next ? "#" + next : "");
  }

  /* ---- header widget ---- */
  function render() {
    var slot = document.getElementById("auth-slot");
    if (!slot) return;
    slot.textContent = "";
    if (user) {
      var who = el("span", "who mono", user.email || "Signed in"); who.title = user.email || "";
      var out = el("button", "signout", "Sign out"); out.type = "button";
      out.onclick = function () { clerk.signOut({ redirectUrl: location.pathname + location.hash }); };
      slot.appendChild(who); slot.appendChild(out);
    } else {
      var inb = el("button", "signin", "Sign in"); inb.type = "button";
      inb.onclick = function () { goSignIn(null); };
      slot.appendChild(inb);
    }
  }

  ready.then(render);
  document.addEventListener("DOMContentLoaded", render);

  window.ClipzAuth = {
    ready: ready,
    user: function () { return user; },
    onChange: function (f) { listeners.push(f); },
    goSignIn: goSignIn,
    mountForm: mountForm,
    urlError: function () { return null; }
  };
})();
