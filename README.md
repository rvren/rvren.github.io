# rvren.github.io

Personal site of **Renjith Rajendran Viswalekshmi** — Frontend Engineering Leader.
Built with React + Vite + TypeScript, Tailwind, and framer-motion. Served at the
root user-site URL **https://rvren.github.io**.

Includes a standalone product page for **Cadence** (`/cadence`) and links to the
live **BuildBoard** app.

## Development

```bash
npm install
npm run dev      # start the dev server (http://localhost:5173)
npm run build    # type-check, build to dist/, and emit dist/404.html (SPA fallback)
npm run preview  # preview the production build locally
```

## Deployment

Pushing to `main` triggers the GitHub Actions workflow in
[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml), which builds the app
and publishes `dist/` to GitHub Pages. The build copies `index.html` to `404.html`
so client-side routes (e.g. `/cadence`) resolve on direct hits and refreshes.
