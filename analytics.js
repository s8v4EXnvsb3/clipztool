/* Vercel Web Analytics for a static site (the npm package @vercel/analytics/next is for Next.js apps).
   Vercel serves /_vercel/insights/script.js once Web Analytics is enabled for the project in the Vercel dashboard.
   It is cookie-free and counts page views without identifying visitors. */
(function () {
  window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };
  // Skip local development, where the script does not exist.
  if (/^(localhost|127\.0\.0\.1)$/.test(location.hostname)) return;
  var s = document.createElement("script");
  s.defer = true;
  s.src = "/_vercel/insights/script.js";
  document.head.appendChild(s);
})();
