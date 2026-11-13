/* Vercel Web Analytics, using the @vercel/analytics npm package (version in package.json).
   The package's browser module is copied to vendor/vercel-analytics/index.js because this site has no bundler.
   To update: npm update @vercel/analytics, then copy node_modules/@vercel/analytics/dist/index.mjs over that file.
   Vercel serves /_vercel/insights/script.js once Web Analytics is enabled for the project in the Vercel dashboard.
   It is cookie-free. Skipped on localhost, where that script does not exist. */
(function () {
  if (/^(localhost|127\.0\.0\.1)$/.test(location.hostname)) return;
  import("/vendor/vercel-analytics/index.js").then(function (va) {
    va.inject({ mode: "production" });
    window.ClipzTrack = function (name, data) { try { va.track(name, data); } catch (e) {} };
  }).catch(function () { /* analytics must never break the page */ });
})();
