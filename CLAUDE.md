# rvren.github.io — project notes

Personal site for Renjith Rajendran Viswalekshmi, served at the root user-site URL
**https://rvren.github.io**.

## Stack
- React 18 + Vite + TypeScript, Tailwind (`darkMode: "class"`, HSL CSS-var tokens),
  framer-motion, react-router-dom.
- Fonts: **Sora** (display — name/titles, `font-display`), **Inter** (body/sans),
  **Geist Mono** (meta labels/dates). All self-hosted via `@fontsource*` (no CDN).
- Routes: `/` (Home, résumé-driven) and `/cadence` (standalone product page for the
  Cadence desktop app; download links to `github.com/rvren/history-lens/releases`).

## Deployment
- Push to `main` → GitHub Actions (`.github/workflows/deploy.yml`) builds and publishes
  `dist/` to GitHub Pages. Node 22.
- `npm run build` copies `index.html` → `dist/404.html` so client-side routes (e.g.
  `/cadence`) resolve on direct hits / refreshes (SPA fallback).

## Conventions

### `/cadence` is a fully standalone product page
The Cadence page must read as a self-contained product landing that can be shared on its
own. **It must not show the owner's personal name/branding or any link back to the
portfolio** — no "← Renjith", no "Back to work", no footer name link. The header on
`/cadence` is just the theme toggle; the footer is just the "Cadence · a local-first
desktop app" tagline. The portfolio's own "RRV" mark stays on the home page (`/`) only.
Keep it this way for any future changes to the page.
