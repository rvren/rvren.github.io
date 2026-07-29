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

### Back-to-portfolio links only on internal navigation
Standalone pages like `/cadence` can be opened directly — a shared link, the GitHub repo,
or a bookmark — where there is nothing in-site to go "back" to. **Any link that navigates
from such a page back to the portfolio must render only when the visitor arrived via
in-app (SPA) navigation.** Hide it on direct / standalone / shared / external loads.

Detect it with React Router's location key — a fresh entry has key `"default"`:

```ts
const cameFromSite = useLocation().key !== "default";
```

This is reliable because the `404.html` SPA fallback makes every direct hit a fresh load.
The rule applies to **every current and future** back link (e.g. the Cadence page's nav
"← Renjith", hero "Back to work", and footer link are all gated on `cameFromSite`).
Non-back chrome (brand marks, taglines) stays visible regardless.
