/* Builds /blog/*.html, /blog/index.html, sitemap.xml and robots.txt from scripts/posts.js.
   Usage: node scripts/build-blog.js */
const fs = require("fs");
const path = require("path");
const posts = require("./posts.js");

const ROOT = path.join(__dirname, "..");
const SITE = "https://clipztool.vercel.app";
const DATE = "2026-11-13";
const JOBS = {
  generate: { label: "Generate", color: "#5fc0ae" },
  edit: { label: "Edit", color: "#d9a441" },
  captions: { label: "Captions", color: "#86a3e0" },
  voice: { label: "Voice", color: "#d9829b" },
  avatar: { label: "Avatar", color: "#a996e0" }
};

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
posts.forEach((p) => {
  p.slug = slugify(p.name);
  const words = [p.title, p.intro, p.free, p.verdict].concat(p.who, p.start, p.watch).join(" ").split(/\s+/).length;
  p.minutes = Math.max(2, Math.round(words / 190));
});
const slugs = new Set();
posts.forEach((p) => { if (slugs.has(p.slug)) throw new Error("Duplicate slug " + p.slug); slugs.add(p.slug); });

const FONTS = '<link rel="preconnect" href="https://fonts.googleapis.com">\n<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,400..900&family=IBM+Plex+Mono:wght@400;500&display=swap">';

function head(title, desc, urlPath, extra) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${SITE}${urlPath}">
<meta name="theme-color" content="#0a0a0a">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:type" content="article">
<meta property="og:url" content="${SITE}${urlPath}">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
${FONTS}
<link rel="stylesheet" href="/styles.css">${extra || ""}
</head>
<body>
`;
}

const header = `<header class="top">
  <a class="mark" href="/" aria-label="Clipztool home"><span class="mark-clip" aria-hidden="true"></span>Clipztool</a>
  <nav aria-label="Main">
    <a href="/tools.html">Editor</a>
    <a href="/#tools">The bin</a>
    <a href="/blog/" aria-current="page">Blog</a>
    <a href="/#free">How free is free</a>
    <span id="auth-slot" class="auth-slot"></span>
  </nav>
</header>
`;

const footer = `<footer>
  <p>Plans, prices and limits change often. Check each site before you build a project around it.</p>
  <p class="dim">Clipztool is independent and is not affiliated with any tool listed. Links to other sites open the official pages. <a href="/contact.html">Sponsor or contact</a></p>
</footer>

<script src="/auth.js"></script>
`;

const tagsHtml = (p) => p.jobs.map((j) => `<span class="job" style="--c:${JOBS[j].color}"><i></i>${JOBS[j].label}</span>`).join(" ");

function postPage(p) {
  const related = posts.filter((q) => q !== p && q.jobs[0] === p.jobs[0]).slice(0, 3);
  const more = related.length ? related : posts.filter((q) => q !== p).slice(0, 3);
  const cta = p.tool
    ? `<aside class="callout">
    <p class="eyebrow mono">Try it now</p>
    <h2>Use ${esc(p.name)} in the Clipztool editor</h2>
    <p>It runs in your browser and your video is never uploaded. A free account is needed, and you sign in with an email link.</p>
    <a class="btn" href="/tools.html#${p.tool}">Open ${esc(p.name)}</a>
  </aside>`
    : `<aside class="callout">
    <p class="eyebrow mono">Go to the tool</p>
    <h2>Visit ${esc(p.name)}</h2>
    <p>This opens the official site in a new tab. Clipztool is not affiliated with ${esc(p.name)}, and we do not earn anything from this link.</p>
    <a class="btn" href="${esc(p.url)}" target="_blank" rel="noopener noreferrer">Open ${esc(p.name)} ↗</a>
  </aside>`;
  const ld = {
    "@context": "https://schema.org", "@type": "Article", headline: p.title, description: p.desc,
    datePublished: DATE, dateModified: DATE, author: { "@type": "Organization", name: "Clipztool" },
    publisher: { "@type": "Organization", name: "Clipztool" }, mainEntityOfPage: `${SITE}/blog/${p.slug}.html`
  };
  return head(`${p.title} · Clipztool`, p.desc, `/blog/${p.slug}.html`,
      `\n<script type="application/ld+json">${JSON.stringify(ld)}</script>`) + header + `
<main class="article-wrap">
  <nav class="crumbs mono" aria-label="Breadcrumb"><a href="/blog/">Guides</a> <span aria-hidden="true">/</span> <span>${esc(p.name)}</span></nav>
  <article class="post">
    <header class="post-head">
      <p class="post-meta mono">${tagsHtml(p)} <span>${esc(p.access)}</span> <span>${p.minutes} min read</span></p>
      <h1 class="h-post">${esc(p.title)}</h1>
      <p class="lede">${esc(p.intro)}</p>
    </header>

    <h2>Who it suits</h2>
    <ul>${p.who.map((x) => `\n      <li>${esc(x)}</li>`).join("")}
    </ul>

    <h2>Getting started</h2>
    <ol>${p.start.map((x) => `\n      <li>${esc(x)}</li>`).join("")}
    </ol>

    <h2>What you get for free</h2>
    <p>${esc(p.free)}</p>

    <h2>Things to watch</h2>
    <ul>${p.watch.map((x) => `\n      <li>${esc(x)}</li>`).join("")}
    </ul>

    <h2>The short version</h2>
    <p>${esc(p.verdict)}</p>

    ${cta}
  </article>

  <section class="related" aria-labelledby="rel-h">
    <h2 id="rel-h">More guides</h2>
    <ul class="post-list">${more.map((q) => postRow(q)).join("")}
    </ul>
    <p class="dim"><a href="/#tools">See every tool in the bin</a> or <a href="/blog/">browse all guides</a>.</p>
  </section>
</main>

` + footer + `</body>
</html>
`;
}

function postRow(p) {
  const badges = p.jobs.concat(p.access === "Built in" ? ["builtin"] : []);
  return `
      <li class="post-row" data-jobs="${esc(badges.join(" "))}">
        <a href="/blog/${p.slug}.html">
          <h3>${esc(p.title)}</h3>
          <p>${esc(p.desc)}</p>
        </a>
        <p class="post-meta mono">${tagsHtml(p)} <span>${esc(p.access)}</span> <span>${p.minutes} min</span></p>
      </li>`;
}

function indexPage() {
  const count = (k) => posts.filter((p) => (k === "all" ? true : k === "builtin" ? p.access === "Built in" : p.jobs.includes(k))).length;
  const chip = (k, label, color) => `<button type="button" class="chip" data-k="${k}" aria-pressed="${k === "all"}">${color ? `<i style="--c:${color};background:${color}"></i>` : ""}${label} <em>${count(k)}</em></button>`;
  const chips = [chip("all", "All")].concat(Object.keys(JOBS).map((k) => chip(k, JOBS[k].label, JOBS[k].color)), [chip("builtin", "Built in", "#d9a441")]).join("\n      ");
  return head("Guides to free video tools · Clipztool", `${posts.length} plain-English guides to the free AI and video tools listed on Clipztool: what each does, how to start and what to watch for.`, "/blog/") + header + `
<main class="article-wrap wide">
  <div class="ed-head">
    <p class="eyebrow mono">${posts.length} guides</p>
    <h1 class="h-ed">Guides to every tool on Clipztool.</h1>
    <p class="lede small">One short guide for each tool in the bin. What it does, who it suits, how to start and what to watch for on the free plan.</p>
  </div>
  <div class="chips" id="chips" role="group" aria-label="Filter guides by job">
      ${chips}
  </div>
  <ul class="post-list" id="plist">${posts.map(postRow).join("")}
  </ul>
</main>

` + footer + `<script>
(function () {
  var chips = document.querySelectorAll("#chips .chip"), rows = document.querySelectorAll("#plist .post-row");
  chips.forEach(function (c) {
    c.addEventListener("click", function () {
      var k = c.dataset.k;
      chips.forEach(function (x) { x.setAttribute("aria-pressed", x === c); });
      rows.forEach(function (r) { r.hidden = !(k === "all" || r.dataset.jobs.split(" ").indexOf(k) > -1); });
    });
  });
})();
</script>
</body>
</html>
`;
}

fs.mkdirSync(path.join(ROOT, "blog"), { recursive: true });
for (const f of fs.readdirSync(path.join(ROOT, "blog"))) if (f.endsWith(".html")) fs.unlinkSync(path.join(ROOT, "blog", f));
posts.forEach((p) => fs.writeFileSync(path.join(ROOT, "blog", p.slug + ".html"), postPage(p)));
fs.writeFileSync(path.join(ROOT, "blog", "index.html"), indexPage());

const urls = ["/", "/tools.html", "/blog/", "/contact.html"].concat(posts.map((p) => `/blog/${p.slug}.html`));
fs.writeFileSync(path.join(ROOT, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  urls.map((u) => `  <url><loc>${SITE}${u}</loc><lastmod>${DATE}</lastmod></url>`).join("\n") + `\n</urlset>\n`);
fs.writeFileSync(path.join(ROOT, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`);

console.log(`Built ${posts.length} posts, blog index, sitemap.xml (${urls.length} URLs), robots.txt`);
