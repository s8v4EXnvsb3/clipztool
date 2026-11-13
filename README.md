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

## Sign-in (Supabase)

The built-in editor needs an account. Sign-in is passwordless: visitors enter their email and get a magic link, powered by Supabase Auth.

- `auth.js` holds the project URL and the **publishable** key, which are public by design. Never put a secret or `service_role` key in the front-end.
- `vendor/supabase/supabase.js` is `@supabase/supabase-js` 2.58.0, self-hosted.
- Auth settings (Site URL, allowed redirect URLs) live in the Supabase project. If the domain changes, update both in the Supabase dashboard under Authentication, URL Configuration.
- The gate is client-side. The tools run in the visitor's browser, so it controls the user experience but cannot technically stop a determined person from using the files directly.
- Supabase's built-in email sender is limited to a few emails per hour. Before a real launch, add a custom SMTP provider in the Supabase dashboard under Authentication, Emails.

## Blog and sponsors

- Guides live in `blog/`. They are generated: edit `scripts/posts.js`, then run `node scripts/build-blog.js`. It also rewrites `sitemap.xml` and `robots.txt`.
- Keep `scripts/posts.js` and the `TOOLS` list in `app.js` in step when you add or remove a tool.
- The Sponsors strip above the bin is driven by `sponsors.js`. Add an entry to `SPONSORS` to show a sponsor; empty slots link to `contact.html`.
