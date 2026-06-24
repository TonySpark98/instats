# Instats

**Open-source, privacy-first viewer for your Instagram data export.**
See who doesn't follow you back, your fans, mutuals, sent requests and more —
100% in your browser. No login, no server, nothing is ever uploaded.

> Independent tool, not affiliated with Instagram / Meta.

## Why it's different
Most "who unfollowed me" apps ask you to log in and then harvest your data.
Instats never sees your account: it only reads the **official data export**
that Instagram gives *you*, and it does it **entirely on your device**.
Because the code is open, you can verify that claim yourself.

## Features
- Followers / following, **not following back**, **fans**, **mutuals**
- Sent / received / recent follow requests, close friends, blocked, restricted…
- **Search**, sort (A→Z, Z→A, newest, oldest) and **CSV export**
- **Changes over time**: local snapshots show who unfollowed you, new followers…
- Explore the *whole* export (every file, grouped by category)
- Italian & English (follows your browser language)
- **Installable PWA**, works fully **offline**

## How to use
1. In Instagram: **Profile → menu → Accounts Center → Your information and
   permissions → Download your information**.
2. Choose **"Some of your information" → tick only "Followers and following"**,
   format **JSON**, range **All time**, then create the file.
3. Download the `.zip` Instagram emails you, open Instats and load it.
   (You can also load the individual `.json` files.)

Your data never leaves the page.

## Develop
```bash
npm install
npm run dev      # local dev server
npm run build    # production build → dist/
npm run preview  # preview the build
```

## Deploy (GitHub Pages)
A workflow in `.github/workflows/deploy.yml` builds and publishes to GitHub
Pages on every push to `main`/`master`. Just enable **Settings → Pages →
Source: GitHub Actions**. It sets the correct base path for a project page
(`/<repo>/`) automatically.

To host at the root of a domain (Cloudflare Pages, Netlify, `user.github.io`),
no extra config is needed — the default base is relative.

## Privacy
- No backend, no analytics, no tracking, no ads.
- All parsing happens in your browser; the export never touches a network.

## License
MIT © Antonio Villanacci
