# rvren.github.io — project notes

Personal site for Renjith Rajendran Viswalekshmi, served at the root user-site URL
**https://rvren.github.io**.

## Stack
- React 18 + Vite + TypeScript, Tailwind (`darkMode: "class"`, HSL CSS-var tokens),
  framer-motion, react-router-dom.
- Fonts: **Sora** (display — name/titles, `font-display`), **Inter** (body/sans),
  **Geist Mono** (meta labels/dates). All self-hosted via `@fontsource*` (no CDN).
- Routes: `/` (Home, résumé-driven) and `/sightglass` (standalone product page for the
  Sightglass desktop app). `/cadence` 301s to `/sightglass` — the page was shared at the
  old URL before the app was renamed, so that path has to keep resolving.
- Downloads come from `github.com/rvren/cadence-releases`. That repo name is **frozen**:
  installed copies already poll it, so renaming it would break auto-update for everyone
  running the app. The product is Sightglass; the release bucket keeps its old name.

## Deployment
- Push to `main` → GitHub Actions (`.github/workflows/deploy.yml`) builds and publishes
  `dist/` to GitHub Pages. Node 22.
- `npm run build` copies `index.html` → `dist/404.html` so client-side routes (e.g.
  `/sightglass`) resolve on direct hits / refreshes (SPA fallback).

## Conventions

### `/sightglass` is a fully standalone product page
The page must read as a self-contained product landing that can be shared on its own.
**It must not show the owner's personal name/branding or any link back to the
portfolio** — no "← Renjith", no "Back to work", no footer name link. The header on
`/sightglass` is just the theme toggle; the footer is just the "Sightglass · a local-first
desktop app" tagline. The portfolio's own "RRV" mark stays on the home page (`/`) only.
Keep it this way for any future changes to the page.

### Product claims are sourced, not remembered
Everything the product page quotes lives in `src/data/sightglass.ts`, reconciled against
the app's own source and stamped with the version it was checked at. This matters because
the page previously advertised "30+ hand-tuned themes" for an app that ships **seven**,
and described a Pomodoro timer two rewrites after it had become a ten-screen product. When
the app changes, update that file — do not edit counts inline in the page.
