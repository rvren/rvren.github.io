// Products shown on the home page. Every claim and link here is sourced from the
// product's own repository (its README and brand folder) — not remembered. When a
// product changes, update this file, not the page.

export type ProductLink = {
  label: string;
  href: string;
  /** true → in-app route (react-router), false → external */
  internal?: boolean;
};

export type Product = {
  name: string;
  tagline: string;
  description: string;
  /** short lowercase status / category line shown above the name */
  kicker: string;
  icon: string;
  /** the product's brand colour, used for the hover edge and status dot */
  brand: string;
  tags: string[];
  links: ProductLink[];
  year: string;
  /**
   * Set by hand: work is underway but not yet visible in commits (see
   * src/data/activity.json for the commit-backed "Building now"). Shows an
   * "In progress" label with no numbers.
   */
  inProgress?: boolean;
  /** The line under "In progress". */
  progressNote?: string;
};

export const products: Product[] = [
  {
    name: "Windtunnel",
    tagline: "Break it before you build it.",
    description:
      "Simulates an application before it is built. Give it a requirement and five agents with competing goals use it, attack it, overload it and question it — you get the flaws, and work orders to fix them, while they are still cheap.",
    kicker: "ai agents · early build · open source",
    icon: "/products/windtunnel.svg",
    brand: "#7C5CFF",
    tags: ["Next.js", "TypeScript", "Claude", "Postgres", "Docker"],
    links: [{ label: "GitHub", href: "https://github.com/rvren/windtunnel" }],
    year: "2026",
  },
  {
    name: "plinth",
    tagline: "From how your product is used to a change you can merge.",
    description:
      "One workflow for a software vendor: it maps how the application is built, measures how it is used without holding any one user's behaviour, proposes changes in the vendor's own components, and ships an approved change as a staged rollout or a gated pull request.",
    kicker: "developer platform · private beta",
    icon: "/products/plinth.svg",
    brand: "#a78bfa",
    tags: ["TypeScript", "React", "SDK", "Monorepo"],
    links: [
      {
        label: "Ask for access",
        href: "mailto:rv.renjith2@gmail.com?subject=plinth%20access",
      },
    ],
    year: "2026",
  },
  {
    name: "Apogee",
    tagline: "How high can you fly?",
    description:
      "A 3D hangar of 527 of the world's rockets and a launch game. Orbit, flip and cut open each model, then fly it through birds and meteoroids toward the Moon. The server referees every ranked flight, so every score on the world leaderboard is flown, not submitted.",
    kicker: "3d game · in development",
    icon: "/products/apogee.svg",
    brand: "#ff7a3d",
    tags: [
      "three.js",
      "WebGPU",
      "React",
      "Cloudflare Workers",
      "Durable Objects",
    ],
    inProgress: true,
    progressNote: "Playable now. The first version is still being built.",
    links: [{ label: "Play", href: "https://apogee.rv-renjith2.workers.dev" }],
    year: "2026",
  },
  {
    name: "Sightglass",
    tagline: "See where your attention goes.",
    description:
      "A local-first macOS app that puts a focus timer and your own browsing, app and calendar history in one place — ten screens, every number computed on your machine. No account, no telemetry, nothing uploaded.",
    kicker: "macos app · shipping",
    icon: "/sightglass-icon.svg",
    brand: "#8f7bf7",
    tags: ["Electron", "React", "TypeScript", "SQLite", "Local-first"],
    inProgress: true,
    links: [
      { label: "getsightglass.ai", href: "https://getsightglass.ai/" },
      { label: "Download", href: "/sightglass", internal: true },
    ],
    year: "2026",
  },
  {
    name: "BuildBoard",
    tagline: "Design, then ship.",
    description:
      "A local-first design-to-code studio. Build interfaces on an infinite canvas, wire in live data, manage a themed design system and sketch architecture — then export clean React + Tailwind. What you build on the canvas is the code you ship.",
    kicker: "desktop app · design to code",
    icon: "/products/buildboard.svg",
    brand: "#00a865",
    tags: ["Electron", "React", "TypeScript", "SQLite", "Tailwind"],
    links: [
      { label: "Live", href: "https://rvren.github.io/buildboard/" },
      { label: "GitHub", href: "https://github.com/rvren/buildboard" },
    ],
    year: "2026",
  },
  {
    name: "OpenHub",
    tagline: "GitHub, local-first.",
    description:
      "An AI-powered desktop client for browsing open-source GitHub projects. Repos, code, PRs and issues are mirrored into a local SQLite store, so browsing is instant and works offline; explain, summarize and triage run on your own Anthropic key.",
    kicker: "desktop app · open source",
    icon: "/products/openhub.svg",
    brand: "#2BE38A",
    tags: ["Electron", "React", "SQLite", "Claude"],
    links: [{ label: "GitHub", href: "https://github.com/rvren/openhub" }],
    year: "2026",
  },
];
