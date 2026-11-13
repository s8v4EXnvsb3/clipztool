# Clipztool

A small static site that lists AI video tools you can start using for free, grouped by job: generate, edit, captions, voice and avatar.

No build step and no dependencies. Open `index.html` in a browser, or serve the folder with any static host.

## Edit the list

Tools live in the `TOOLS` array at the top of `app.js`. Each entry is:

```js
["Name", ["job", "job"], "Free access", "One-sentence description.", "https://example.com"]
```

Jobs are `generate`, `edit`, `captions`, `voice` and `avatar`. Free access is one of `Free plan`, `Credits`, `Trial` or `Open source`.

Plans and limits change often, so check each tool before adding or updating it.

## Deploy

Vercel detects a plain static site, so no configuration is needed: import the repository and deploy.

## Editor (tools.html)

Eight browser tools: trim, video to GIF, extract audio, compress, resize for Shorts and Reels, speed and reverse, merge, and text watermark. They run on the visitor's device with ffmpeg compiled to WebAssembly, so videos are never uploaded.

The engine lives in `vendor/ffmpeg/` (`@ffmpeg/ffmpeg` 0.12.10 and the single-thread `@ffmpeg/core` 0.12.6). It is self-hosted so it works on any static host without special headers. The core includes FFmpeg and x264, which are licensed under the GPL; see https://ffmpeg.org/legal.html.

## Sign-in (Clerk)

The built-in editor needs an account. Sign-in uses Clerk with email links (no password).

- `auth.js` holds the Clerk **publishable** key (`pk_...`), which is public by design. Never put a secret key (`sk_...`) in the front-end.
- Clerk 6 loads two scripts from the app's Clerk domain: the core script and a separate UI script. Both are loaded in `auth.js`.
- Required Clerk dashboard settings: Email address on; Password off; verification by Email link; social logins off.
- The current key is for a **development** Clerk instance. A production instance needs a domain you own (it does not work on vercel.app). Switch the key in `auth.js` when you go live.
- The gate is client-side. The tools run in the visitor's browser, so it controls the experience but cannot stop a determined person using the files directly.
- Every page only talks to `window.ClipzAuth`, so the provider can be changed by editing `auth.js`.

## Blog and sponsors

- Guides live in `blog/`. They are generated: edit `scripts/posts.js`, then run `node scripts/build-blog.js`. It also rewrites `sitemap.xml` and `robots.txt`.
- Keep `scripts/posts.js` and the `TOOLS` list in `app.js` in step when you add or remove a tool.
- The Sponsors strip above the bin is driven by `sponsors.js`. Add an entry to `SPONSORS` to show a sponsor; empty slots link to `contact.html`.

## Analytics

Page views are counted with Vercel Web Analytics using the `@vercel/analytics` npm package. The Next.js entry (`@vercel/analytics/next`) does not apply to a static site, so `analytics.js` loads the package's browser module from `vendor/vercel-analytics/` and calls `inject()`.

- It only records data after Web Analytics is enabled for the project in the Vercel dashboard (Project, Analytics tab, Enable).
- It is cookie-free and does not run on localhost.
- To update: `npm update @vercel/analytics`, then copy `node_modules/@vercel/analytics/dist/index.mjs` over `vendor/vercel-analytics/index.js`.
- `window.ClipzTrack(name, data)` sends a custom event once analytics has loaded.
