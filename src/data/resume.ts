export const profile = {
  name: "Renjith Rajendran Viswalekshmi",
  shortName: "Renjith Rajendran",
  title: "Frontend Engineering Leader",
  subtitle: "Design Systems · AI-Native Developer Tooling",
  location: "Sunnyvale, CA",
  email: "rv.renjith2@gmail.com",
  linkedin: "https://linkedin.com/in/rvrenjith",
  github: "https://github.com/rvren",
  resumeUrl: "/resume.pdf",
  tagline:
    "Frontend engineering leader with 14+ years building production UIs and 4+ years managing teams — equally at home as a Staff/Principal IC or an Engineering Manager.",
  summary:
    "Most recently led the React/TypeScript console for Rafay’s GPU PaaS — the product behind the company’s $11M → $31M ARR jump, demoed at NVIDIA GTC and the India AI Summit by GPU-datacenter customers running on Rafay. Architected the design system that replaced Material UI across the company, built a Claude-native frontend repo that lets non-engineers ship code via prompts, and runs a distributed 7-person UI organization across the US and India.",
};

export const impact: { stat: string; label: string; detail: string }[] = [
  {
    stat: "$11M → $31M",
    label: "ARR at Rafay",
    detail:
      "The GPU PaaS console is the surface customers evaluate, buy, and operate the product through; demoed at NVIDIA GTC and the India AI Summit.",
  },
  {
    stat: "Material UI → in-house",
    label: "Design system replacement",
    detail:
      "Replaced Material UI across the console with an in-house React + Tailwind + shadcn/ui design system; now the standard for every Rafay product surface.",
  },
  {
    stat: "Prompts → PRs",
    label: "Agentic frontend repo",
    detail:
      "Authored repo-level Claude skills and a sandbox-to-PR workflow so PMs, designers, and support engineers ship UI changes via prompts.",
  },
  {
    stat: "7 engineers",
    label: "Distributed UI team",
    detail:
      "Across Sunnyvale and Bengaluru — hiring, performance, planning, and weekly delivery.",
  },
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
    title: "Engineering Manager",
    company: "Rafay Systems",
    location: "Sunnyvale, CA",
    period: "Sep 2023 — Present",
    bullets: [
      "Own the frontend for Rafay’s GPU PaaS — React/TypeScript console covering workflow orchestration, billing, and observability; the product central to the company’s $11M → $31M ARR growth and the demos at NVIDIA GTC and the India AI Summit.",
      "Manage 7 UI engineers across Sunnyvale and Bengaluru: hiring, performance management, mentorship, sprint planning, and weekly delivery alignment with product.",
      "Architected the React + Tailwind + shadcn/ui design system that replaced Material UI; unified visual language across the console, cut the legacy dependency footprint, and standardized component primitives for all new work.",
      "Built a Claude-native workflow inside the frontend repos: standardized the code so agents can navigate it, authored repo-level skills, and shipped a sandbox that turns plain-English requirements into reviewable PRs — PMs, designers, and support engineers now ship UI changes directly.",
      "Designed the React Flow-based authoring and visualization tools for AI-driven infrastructure workflows — the primary UX for building and running GPU jobs on Rafay.",
      "Drove engineering quality across the codebase: led the JSX → TSX migration, grew test coverage, and put security and design guardrails in CI.",
    ],
  },
  {
    title: "Lead UI Engineer",
    company: "Rafay Systems",
    location: "Bengaluru, India",
    period: "Oct 2021 — Sep 2023",
    bullets: [
      "Shipped four production services from zero in React: Environment Manager, Cost Management, Service Mesh, and Network Policy.",
      "Built Rafay’s first design system on Material UI v5 — adopted across every internal web application and used until the 2024 redesign.",
      "Led a team of 5 frontend engineers: resource planning, OKRs via Lattice, sprint planning, and estimation.",
      "Improved console performance: reduced bundle size, eliminated re-render storms in key flows, and memoized expensive computations with hooks.",
      "Stood up end-to-end testing with Cypress as the team’s first automated UI test framework.",
    ],
  },
  {
    title: "Senior Software Engineer II / Lead",
    company: "Akamai Technologies",
    location: "Bengaluru, India",
    period: "May 2018 — Sep 2021",
    bullets: [
      "Redesigned the Enterprise Application Access client used by 20,000+ Akamai employees, partnering with security and product on the zero-trust access UX.",
      "Built Angular admin applications for enterprise access configuration and policy management.",
      "Owned npm supply-chain security for the team: tracked and remediated CVEs and added automated dependency checks in CI to prevent regressions.",
      "Promoted from Senior SWE II to Lead during this period; recognized as Exceptional Contributor (2019).",
    ],
  },
  {
    title: "Senior Frontend Engineer",
    company: "HealthifyMe",
    location: "Bengaluru, India",
    period: "May 2017 — Apr 2018",
    bullets: [
      "Built the React Native mobile app used by HealthifyMe’s nutritionist coaching staff in production.",
      "Built D3.js dashboards used by the CEO in board and investor presentations.",
      "Shipped dashboards for ads, diet/workout planning, and coaching workflows; integrated WebViews for mobile marketing campaigns.",
    ],
  },
  {
    title: "Technology Lead",
    company: "Sporthood",
    location: "Bengaluru, India",
    period: "Apr 2016 — Apr 2017",
    bullets: [
      "Built web and React Native apps for game management and scoring; digitized workflows that cut operational paperwork by 80%.",
    ],
  },
  {
    title: "Co-Founder",
    company: "Tymslot",
    location: "Bengaluru, India",
    period: "Aug 2015 — Apr 2016",
    bullets: [
      "Co-founded a booking product; scaled to 3,000+ bookings within 6 months. Owned product, engineering (4 web apps in JavaScript/PHP), and operations end-to-end.",
    ],
  },
  {
    title: "PL/SQL Developer",
    company: "Tata Consultancy Services",
    location: "Bengaluru, India",
    period: "Dec 2010 — Aug 2015",
    bullets: [
      "Optimized stored procedures and SQL performance with EXPLAIN PLAN, SQL Trace, and TKProf; handled change requests and production incidents.",
    ],
  },
];

export const skills: { group: string; items: string[] }[] = [
  {
    group: "Frontend",
    items: [
      "React",
      "TypeScript",
      "React Native",
      "Tailwind CSS",
      "shadcn/ui",
      "Material UI",
      "Redux",
      "Storybook",
      "React Flow",
      "HTML5",
      "CSS3",
    ],
  },
  {
    group: "Testing & quality",
    items: ["Cypress", "End-to-end testing", "CI security & design guardrails"],
  },
  {
    group: "Build & tooling",
    items: ["Vite", "Webpack", "Docker", "Git / GitHub", "Figma", "JIRA"],
  },
  {
    group: "AI-native development",
    items: [
      "Claude (agentic repos, repo-level skills, sandbox-to-PR)",
      "Cursor",
      "GitHub Copilot",
      "Prompt engineering",
      "Automated PR generation",
    ],
  },
  {
    group: "Leadership",
    items: [
      "Distributed teams (US + India)",
      "Hiring",
      "Performance management",
      "OKRs",
      "Sprint planning",
      "Cross-functional partnership",
    ],
  },
  {
    group: "Earlier stack",
    items: ["AngularJS", "Polymer", "Electron", "PHP", "PL/SQL"],
  },
];

export const education = {
  degree: "B.Tech, Electrical Engineering",
  school: "TKM College of Engineering, Kerala, India",
  period: "Sep 2006 — Aug 2010",
};

export const awards: string[] = [
  "Exceptional Contributor — Akamai Technologies (2019)",
  "Best Employee — HealthifyMe (2017)",
  "Diplôme d’Études en Langue Française (DELF) — Alliance Française de Bangalore",
];

export const languages: string[] = [
  "English (Native / Fluent)",
  "Hindi (Fluent)",
  "Malayalam (Fluent)",
  "French (Intermediate, DELF certified)",
];
