/* Reports anonymous usage to /api/notify, which forwards a short alert to the site owner on Telegram.
   Sends: one "visit" per browser session, plus tool runs, sign-ins and sponsor clicks that other scripts report.
   Never sends emails, file names or anything typed by the visitor. Skipped on localhost and for crawlers. */
(function () {
  if (/^(localhost|127\.0\.0\.1)$/.test(location.hostname)) return;
  var ua = navigator.userAgent || "";
  if (navigator.webdriver || /bot|crawl|spider|slurp|headless|lighthouse|preview/i.test(ua)) return;
  var device = /Mobi|Android|iPhone|iPad/i.test(ua) ? "mobile" : "desktop";

  function send(event, data) {
    try {
      var payload = { event: event, page: location.pathname, device: device };
      if (data) { if (data.tool) payload.tool = data.tool; if (data.where) payload.where = data.where; }
      var body = JSON.stringify(payload);
      if (navigator.sendBeacon && navigator.sendBeacon("/api/notify", new Blob([body], { type: "application/json" }))) return;
      fetch("/api/notify", { method: "POST", headers: { "Content-Type": "application/json" }, body: body, keepalive: true });
    } catch (e) { /* alerts must never break the page */ }
  }
  window.ClipzNotify = send;

  try {
    if (!sessionStorage.getItem("clipz_seen")) { sessionStorage.setItem("clipz_seen", "1"); send("visit"); }
  } catch (e) { /* storage blocked: skip the visit alert */ }

  // Sponsor interest: the orange button, the "Your brand here" card and the email links.
  document.addEventListener("click", function (e) {
    var a = e.target && e.target.closest ? e.target.closest("a") : null;
    if (!a) return;
    var href = a.getAttribute("href") || "";
    if (/^mailto:/i.test(href)) send("sponsor_click", { where: "email" });
    else if (a.classList.contains("btn-orange") || a.classList.contains("sp-card")) send("sponsor_click", { where: location.pathname === "/" || /index\.html$/.test(location.pathname) ? "home" : "contact" });
  });
})();
