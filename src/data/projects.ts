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
    name: "Cadence",
    tagline: "Your daily focus rhythm.",
    description:
      "A local-first desktop app that pairs a Pomodoro focus timer with digital-wellbeing insights drawn from your own browser history. Everything runs on your machine — nothing is ever uploaded.",
    tags: ["Electron", "React", "TypeScript", "Local-first", "macOS"],
    href: "/cadence",
    internal: true,
    cta: "Explore Cadence",
    year: "2026",
  },
  {
    name: "BuildBoard",
    tagline: "A visual app builder.",
    description:
      "Design screens, arrange components on a canvas, wire up data sources, and generate code. Runs entirely in the browser — no backend, state persists to localStorage.",
    tags: ["React", "Vite", "TypeScript", "zustand", "Tailwind"],
    href: "https://rvren.github.io/buildboard/",
    internal: false,
    cta: "Open the live app",
    year: "2025",
  },
];
