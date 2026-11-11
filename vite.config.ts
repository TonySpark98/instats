import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

/* Instats is an open-source, privacy-first web app. The build is minified but
   ships source maps, so anyone can read the original code in the browser's
   DevTools; it installs as a PWA that works fully offline. Everything runs in
   the browser — no backend, no uploads, and the bundle makes no network calls
   (Vite's modulepreload polyfill, its only fetch, is turned off). */
// Relative base by default → the built app works dropped into ANY subfolder
// (e.g. .../your-site/instats/) without knowing the path in advance. Override
// with VITE_BASE=/some/path/ if you deploy at a fixed absolute path.
const base = process.env.VITE_BASE || './';

export default defineConfig({
  base,
  build: { sourcemap: true, modulePreload: { polyfill: false } },
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon-48.png', 'apple-touch-icon.png'],
      manifest: {
        name: 'Instats — Instagram stats, private & on-device',
        short_name: 'Instats',
        description:
          'Analyze your Instagram followers and following from the official data export. 100% on your device — no login, no upload.',
        theme_color: '#09090b',
        background_color: '#09090b',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: 'maskable-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,svg,ico,woff2,json}'],
        // the app is a single document; let navigations fall back to it offline
        navigateFallback: 'index.html',
      },
    }),
  ],
});
