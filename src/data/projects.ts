export type Project = {
  name: string;
  tagline: string;
  description: string;
  tags: string[];
  href: string;
  internal: boolean; // true → in-app route, false → external link
  cta: string;
  year: string;
};

export const projects: Project[] = [
  {
    name: "Sightglass",
    tagline: "See where your attention goes.",
    description:
      "A local-first macOS app that puts a focus timer and your own browsing, app and calendar history in one place — ten screens, sixty-odd features, every number computed on your machine. No account, no telemetry, nothing uploaded.",
    tags: ["Electron", "React", "TypeScript", "SQLite", "Local-first", "macOS"],
    href: "/sightglass",
    internal: true,
    cta: "Explore Sightglass",
    year: "2026",
  },
  {
    name: "BuildBoard",
    tagline: "Design, then ship.",
    description:
      "A local-first design-to-code studio for the desktop. Build interfaces on an infinite canvas, wire in live data, manage a themed design system, and sketch architecture — then export clean React + Tailwind. What you build on the canvas is the code you ship; projects live in a local SQLite database on your machine.",
    tags: ["Electron", "React", "TypeScript", "better-sqlite3", "Tailwind"],
    href: "https://rvren.github.io/buildboard/",
    internal: false,
    cta: "Explore BuildBoard",
    year: "2026",
  },
];
