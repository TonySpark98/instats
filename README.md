# Instats

**Open-source, privacy-first viewer for your Instagram data export.**
See who doesn't follow you back, your fans, mutuals, sent requests and much more —
**100% in your browser**. No login, no server, nothing is ever uploaded.

🔗 **Live:** https://www.antoniovillanacci.com/instats

> Independent tool, not affiliated with, endorsed by or connected to Instagram / Meta.

## Why it's different
Most "who unfollowed me" apps make you log in and then harvest your data.
Instats never sees your account: it only reads the **official data export** that
Instagram gives *you*, entirely **on your device**. The code is open, so you can
verify that claim yourself — and a strict Content-Security-Policy makes the
browser **block any network egress**, turning the promise into a guarantee.

## Features
**Relationships & analysis**
- Followers / following, **not following back**, **fans**, **mutuals**
- Sent / received / recent follow requests, close friends, blocked, restricted, story-hidden, removed suggestions
- **Search**, sort (A→Z, Z→A, newest, oldest) and **CSV export** per list
- Mark profiles as **seen** (persists locally) and open them on Instagram

**Changes over time (snapshots)**
- Local snapshots compare a new export with a previous one: **who unfollowed you**, new followers, who you started/stopped following
- **Export/import snapshots as files** — keep previous versions and compare across browsers/devices

**Explore everything**
- The **whole export** is parsed: 60+ file categories (profile, relationships, content, activity, interests, ads, security) grouped and searchable
- Your **profile data** (name, bio, email, phone, gender, DOB, registration, IP…) when present in the export
- A **donut chart** and stat cards summarise your follow health at a glance

**Experience**
- **Premium UI**: animated multi-colour gradient, frosted-glass cards, smooth section/step animations (respects `prefers-reduced-motion`)
- **Light & dark** themes
- **Italian & English** (follows your browser language; switchable)
- **Installable PWA**, works fully **offline**
- A clear notice + browser prompt warns that refreshing clears the in-memory analysis (saved snapshots remain)

## How to use
1. In Instagram: **Profile → menu → Accounts Center → Your information and permissions → Download your information**.
2. Choose **"Some of your information" → tick only "Followers and following"**, format **JSON** (the format Instats reads), range **All time**, then create the file.
3. Download the `.zip` Instagram emails you, open Instats and load it. You can also load the individual `.json` files, or the whole export `.zip` for the full breakdown.

Your data never leaves the page.

## Privacy & security
- No backend, no analytics, no tracking, no ads, no cookies.
- All parsing happens in your browser; the export never touches a network.
- **Strict CSP** (`connect-src 'self'`) prevents any external connection; `no-referrer` policy on outbound links.
- All user-derived strings are HTML-escaped (no DOM-XSS surface).
- Snapshots and "seen" marks live only in your browser's local storage — clear the site data to erase them.

## Develop
Plain **Vite + TypeScript**, no framework.
```bash
npm install
npm run dev      # local dev server
npm run build    # production build → dist/
npm run preview  # preview the build
```

## Deploy
The build is a static site. Run `npm run build` and serve `dist/` on any static
host (Vercel, Netlify, Cloudflare Pages, GitHub Pages…). The base path is
**relative by default**, so it works dropped into any subfolder; set
`VITE_BASE=/your/path/` to pin an absolute base. Ships as an installable,
offline-capable PWA (`vite-plugin-pwa`).

## License
MIT © Antonio Villanacci
