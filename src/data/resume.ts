// Sourced from public/resume.pdf (Renjith_Viswalekshmi_Resume.pdf, Oct 2026). When the
// résumé changes, replace the PDF and reconcile this file against it.

export const profile = {
  name: "Renjith Rajendran Viswalekshmi",
  shortName: "Renjith Rajendran",
  title: "Builder · Maker · Tinkerer",
  subtitle: "Engineering Manager · Frontend Architecture · Design Systems",
  location: "Sunnyvale, CA",
  email: "rv.renjith2@gmail.com",
  linkedin: "https://linkedin.com/in/rvrenjith",
  github: "https://github.com/rvren",
  resumeUrl: "/resume.pdf",
  resumeFileName: "Renjith_Viswalekshmi_Resume.pdf",
};

export const intro: string[] = [
  "I build things. It is what I like to do most. For more than 14 years, I have made software that people use. I make products, developer tools and the systems that teams use to ship. The best part is always the same: a rough idea becomes a real thing.",
  "At Rafay Systems I own the frontend for the GPU PaaS console for AI infrastructure, the product at the center of the company’s 182% ARR growth. I’ve set company-wide frontend standards twice, took the monorepo from no runnable tests to nearly 25,000, and built an AI-native workflow that lets people outside the frontend team ship reviewed UI code.",
  "Things I’ve made for the love of making them",
];

export const highlights: { stat: string; label: string }[] = [
  {
    stat: "182%",
    label: "ARR growth, with the console at its center",
  },
  { stat: "~25,000", label: "tests, from none, in under 6 weeks" },
  { stat: "98%", label: "line coverage on core workspaces" },
  { stat: "7", label: "engineers across the US and India" },
];

export type Role = {
  title: string;
  company: string;
  location: string;
  period: string;
  bullets: string[];
};

export const experience: Role[] = [
  {
    title: "Engineering Manager, Frontend",
    company: "Rafay Systems",
    location: "Sunnyvale, CA",
    period: "Sep 2023 — Present",
    bullets: [
      "Own frontend architecture and direction for Rafay’s GPU PaaS — a React + TypeScript console for AI workflow orchestration, billing and observability, demoed at NVIDIA GTC and the India AI Summit.",
      "Manage 7 frontend engineers across Sunnyvale and Bengaluru; hired 5, promoted 2.",
      "Drove a React + Tailwind + shadcn/ui design system on Radix primitives that replaced Material UI on every Rafay product surface.",
      "Built the testing platform: nearly 25,000 unit and component tests in under 6 weeks, a 312-test Playwright suite, and PR gates on changed-line coverage with a rising floor.",
      "Made the repos AI-native — repo-level Claude Code skills and a sandbox that turns plain-English requirements into reviewable PRs for 6–8 PMs, designers and support engineers.",
    ],
  },
  {
    title: "Lead UI Engineer",
    company: "Rafay Systems",
    location: "Bengaluru, India",
    period: "Oct 2021 — Sep 2023",
    bullets: [
      "Led 5 frontend engineers; shipped four products from zero: Environment Manager, Cost Management, Service Mesh and Network Policy.",
      "Created Rafay’s first design system on Material UI v5 and introduced Cypress as the first E2E framework.",
    ],
  },
  {
    title: "Senior Software Engineer II / Lead",
    company: "Akamai Technologies",
    location: "Bengaluru, India",
    period: "May 2018 — Sep 2021",
    bullets: [
      "Redesigned the Enterprise Application Access client used by 20,000+ Akamai employees; built Angular admin apps for access policy.",
      "Owned npm supply-chain security; promoted to Lead and named Exceptional Contributor (2019).",
    ],
  },
  {
    title: "Senior Frontend Engineer",
    company: "HealthifyMe",
    location: "Bengaluru, India",
    period: "May 2017 — Apr 2018",
    bullets: [
      "Built D3.js dashboards used by the CEO in board and investor presentations, and the React Native app for the coaching staff.",
    ],
  },
];

export const earlier: {
  title: string;
  company: string;
  period: string;
  note: string;
}[] = [
  {
    title: "Technology Lead",
    company: "Sporthood",
    period: "2016 — 2017",
    note: "Web and React Native apps that cut paperwork by about 80%.",
  },
  {
    title: "Co-Founder",
    company: "Tymslot",
    period: "2015 — 2016",
    note: "Product, engineering and operations; 3,000+ bookings in 6 months.",
  },
  {
    title: "PL/SQL Developer",
    company: "Tata Consultancy Services",
    period: "2010 — 2015",
    note: "SQL performance tuning and production support.",
  },
];

export const skills: { group: string; items: string[] }[] = [
  {
    group: "Frontend",
    items: [
      "React",
      "TypeScript",
      "Redux",
      "React Native",
      "Tailwind CSS",
      "shadcn/ui",
      "Radix UI",
      "Storybook",
      "React Flow",
    ],
  },
  {
    group: "Quality",
    items: [
      "Vitest",
      "React Testing Library",
      "Playwright",
      "Cypress",
      "Coverage gates",
      "CI sharding",
    ],
  },
  {
    group: "Performance",
    items: [
      "Core Web Vitals",
      "Lighthouse",
      "Code splitting",
      "WCAG / ARIA",
      "i18n + RTL",
    ],
  },
  {
    group: "AI-native",
    items: [
      "Claude Code",
      "Cursor",
      "Copilot",
      "MCP servers",
      "Agentic repos",
      "Parallel agents",
    ],
  },
  {
    group: "Leadership",
    items: [
      "Frontend strategy",
      "Hiring",
      "Mentoring",
      "Performance management",
      "OKRs",
      "Distributed teams",
    ],
  },
];

export const education = {
  degree: "B.Tech, Electrical Engineering",
  school: "TKM College of Engineering, India",
  period: "2006 — 2010",
};

export const awards: string[] = [
  "Exceptional Contributor — Akamai Technologies (2019)",
  "Best Employee — HealthifyMe (2017)",
  "DELF (French language diploma) — Alliance Française de Bangalore",
];

export const languages: string[] = [
  "English",
  "Hindi",
  "Malayalam",
  "French (intermediate)",
];
