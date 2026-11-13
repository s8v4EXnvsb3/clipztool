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
