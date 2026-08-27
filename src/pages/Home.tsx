import { ArrowUpRight } from "lucide-react";
import {
  SiClaude,
  SiCursor,
  SiCypress,
  SiDocker,
  SiElectron,
  SiFigma,
  SiGit,
  SiJavascript,
  SiMui,
  SiReact,
  SiRedux,
  SiShadcnui,
  SiStorybook,
  SiTailwindcss,
  SiTypescript,
  SiVite,
  SiWebpack,
} from "react-icons/si";
import type { IconType } from "react-icons";
import { Link } from "react-router-dom";
import { education, experience, profile } from "@/data/resume";
import { projects } from "@/data/projects";
import { ThemeToggle } from "@/components/ThemeToggle";

const tech: { name: string; Icon: IconType; color: string }[] = [
  { name: "React", Icon: SiReact, color: "#61DAFB" },
  { name: "TypeScript", Icon: SiTypescript, color: "#3178C6" },
  { name: "Electron", Icon: SiElectron, color: "#47848F" },
  { name: "JavaScript", Icon: SiJavascript, color: "#F7DF1E" },
  { name: "Tailwind CSS", Icon: SiTailwindcss, color: "#06B6D4" },
  { name: "shadcn/ui", Icon: SiShadcnui, color: "currentColor" },
  { name: "Material UI", Icon: SiMui, color: "#007FFF" },
  { name: "Redux", Icon: SiRedux, color: "#764ABC" },
  { name: "Storybook", Icon: SiStorybook, color: "#FF4785" },
  { name: "Cypress", Icon: SiCypress, color: "#69D3A7" },
  { name: "Vite", Icon: SiVite, color: "#646CFF" },
  { name: "Webpack", Icon: SiWebpack, color: "#1C78C0" },
  { name: "Docker", Icon: SiDocker, color: "#2496ED" },
  { name: "Figma", Icon: SiFigma, color: "#F24E1E" },
  { name: "Git", Icon: SiGit, color: "#F05032" },
  { name: "Claude", Icon: SiClaude, color: "#D97757" },
  { name: "Cursor", Icon: SiCursor, color: "currentColor" },
];

const projectVisual: Record<string, { icon: string; from: string; to: string }> = {
  Sightglass: { icon: "/sightglass-icon.svg", from: "#4f46e5", to: "#7c3aed" },
  BuildBoard: { icon: "/buildboard-icon.svg", from: "#059669", to: "#0ea371" },
};

export default function Home() {
  return (
    <main className="mx-auto max-w-2xl px-6 pb-24 pt-10 sm:pt-16">
      {/* Header */}
      <header className="mb-14 flex items-center justify-between sm:mb-20">
        <span className="font-mono text-sm font-medium tracking-tight text-foreground">
          <span className="text-accent">//</span> RRV
        </span>
        <ThemeToggle />
      </header>

      {/* Hero */}
      <section className="animate-fade-up">
        <h1 className="font-display text-3xl font-semibold leading-tight tracking-tight sm:text-[2.6rem] sm:leading-[1.08]">
          Hey, I’m <span className="text-accent">Renjith</span>{" "}
          <span className="inline-block origin-[70%_80%] animate-wave">👋</span>
        </h1>
        <div className="mt-6 space-y-2 text-lg leading-relaxed text-muted-foreground">
          <p>
            A frontend engineering leader based in{" "}
            <span className="text-foreground">Sunnyvale, CA</span>.
          </p>
          <p>
            I build production UIs, design systems, and{" "}
            <span className="text-foreground">AI-native developer tooling</span>{" "}
            — most recently the React/TypeScript console behind Rafay’s GPU
            cloud.
          </p>
          <p>On the side I ship local-first Mac apps. If you’re building
            something ambitious, I’d love to help.</p>
        </div>

        <p className="mt-8 flex items-center gap-2.5 text-sm text-muted-foreground">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500/70" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          Leading frontend at Rafay — always open to interesting problems.
        </p>

        <div className="mt-4 flex gap-5 text-sm">
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noreferrer"
            className="text-muted-foreground underline decoration-border underline-offset-4 transition-colors hover:text-foreground hover:decoration-foreground"
          >
            LinkedIn
          </a>
          <a
            href={profile.github}
            target="_blank"
            rel="noreferrer"
            className="text-muted-foreground underline decoration-border underline-offset-4 transition-colors hover:text-foreground hover:decoration-foreground"
          >
            GitHub
          </a>
        </div>
      </section>

      {/* Tech stack */}
      <Section
        label="Tech stack"
        intro="The tools I reach for, day to day:"
        delay={80}
      >
        <div className="flex flex-wrap gap-2">
          {tech.map(({ name, Icon, color }) => (
            <span
              key={name}
              style={{ "--c": color } as React.CSSProperties}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card/40 px-3 py-1.5 text-sm text-foreground/90 transition-all duration-200 hover:-translate-y-0.5 hover:bg-card/80 hover:[border-color:var(--c)]"
            >
              <Icon size={15} color={color} aria-hidden />
              {name}
            </span>
          ))}
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          Plus AI-native workflows — Claude agents, repo-level skills, and a
          sandbox-to-PR pipeline.
        </p>
      </Section>

      {/* Projects */}
      <Section
        label="Projects"
        intro="Things I’ve designed and shipped — past and ongoing:"
        delay={160}
      >
        <div className="grid gap-5 sm:grid-cols-2">
          {projects.map((p) => {
            const v = projectVisual[p.name] ?? {
              icon: "/favicon.svg",
              from: "#334155",
              to: "#0f172a",
            };
            const card = (
              <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card/40 transition-all duration-300 hover:-translate-y-1 hover:border-foreground/20 hover:shadow-[0_24px_60px_-24px_rgba(20,20,40,0.45)]">
                <div
                  className="relative flex h-32 items-center justify-center"
                  style={{
                    backgroundImage: `linear-gradient(135deg, ${v.from}, ${v.to})`,
                  }}
                >
                  <div className="pointer-events-none absolute inset-0 opacity-50 [background:radial-gradient(circle_at_28%_18%,rgba(255,255,255,0.45),transparent_58%)]" />
                  <img
                    src={v.icon}
                    alt=""
                    className="relative h-16 w-16 rounded-[18px] shadow-lg ring-1 ring-black/10 transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="font-display text-lg font-medium">{p.name}</h3>
                  <p className="text-sm text-accent">{p.tagline}</p>
                  <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {p.description}
                  </p>
                  <ul className="mt-4 flex flex-wrap gap-x-2 gap-y-1.5">
                    {p.tags.slice(0, 4).map((t) => (
                      <li
                        key={t}
                        className="rounded-full border border-border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground"
                      >
                        {t}
                      </li>
                    ))}
                  </ul>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-foreground transition-colors group-hover:text-accent">
                    {p.cta}
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </div>
              </div>
            );
            return p.internal ? (
              <Link key={p.name} to={p.href} className="block h-full">
                {card}
              </Link>
            ) : (
              <a
                key={p.name}
                href={p.href}
                target="_blank"
                rel="noreferrer"
                className="block h-full"
              >
                {card}
              </a>
            );
          })}
        </div>
      </Section>

      {/* Experience */}
      <Section label="Experience" intro="Where I’ve worked:" delay={240}>
        <div className="-mt-2">
          {experience.map((role) => (
            <div
              key={`${role.company}-${role.period}`}
              className="flex flex-col gap-0.5 border-t border-border py-3.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4"
            >
              <h3 className="text-[0.95rem] font-medium">
                {role.title}
                <span className="text-muted-foreground"> · {role.company}</span>
              </h3>
              <span className="shrink-0 font-mono text-xs text-muted-foreground">
                {role.period}
              </span>
            </div>
          ))}
        </div>
      </Section>

      {/* Education */}
      <Section label="Education" delay={320}>
        <p className="font-medium">{education.degree}</p>
        <p className="text-sm text-muted-foreground">
          {education.school} · {education.period}
        </p>
      </Section>

      <footer className="mt-20 border-t border-border pt-6 text-xs text-muted-foreground">
        © 2026 {profile.name} ·{" "}
        <a
          href={`mailto:${profile.email}`}
          className="underline decoration-border underline-offset-4 transition-colors hover:text-foreground"
        >
          {profile.email}
        </a>
      </footer>
    </main>
  );
}

function Section({
  label,
  intro,
  children,
  delay = 0,
}: {
  label: string;
  intro?: string;
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <section
      className="mt-16 animate-fade-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </p>
      {intro && <p className="mt-3 text-muted-foreground">{intro}</p>}
      <div className="mt-6">{children}</div>
    </section>
  );
}
