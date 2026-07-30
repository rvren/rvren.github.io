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
