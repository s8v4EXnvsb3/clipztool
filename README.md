# Roughcut

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
