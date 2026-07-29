import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import {
  awards,
  education,
  experience,
  languages,
  profile,
  skills,
} from "@/data/resume";
import { projects } from "@/data/projects";

const intro = [
  "I’m a frontend engineering leader with 14+ years building production UIs and 4+ years managing teams — equally at home as a Staff/Principal IC or an engineering manager.",
  "Most recently I led the React/TypeScript console for Rafay’s GPU PaaS — the product behind the company’s growth — and architected the design system that replaced Material UI across the company. I also built a Claude-native frontend repo that lets non-engineers ship UI via prompts, and run a distributed 7-person team across the US and India.",
];

const contact = [
  { label: "Email", href: `mailto:${profile.email}` },
  { label: "LinkedIn", href: profile.linkedin },
  { label: "GitHub", href: profile.github },
  { label: "Résumé", href: profile.resumeUrl },
];

export default function Home() {
  return (
    <main className="mx-auto max-w-2xl px-6 pb-24 pt-28 sm:pt-32">
      {/* Intro */}
      <section className="animate-fade-up">
        <p className="font-mono text-[0.7rem] uppercase tracking-[0.22em] text-muted-foreground">
          {profile.title}
        </p>
        <h1 className="mt-5 font-display text-[2.5rem] font-medium leading-[1.05] sm:text-[3.25rem]">
          {profile.name}
        </h1>
        <p className="mt-3 text-muted-foreground">{profile.location}</p>

        <div className="mt-8 space-y-4 leading-relaxed text-foreground/90">
          {intro.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>

        <ul className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-sm">
          {contact.map((c) => (
            <li key={c.label}>
              <a
                href={c.href}
                target={c.href.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer"
                className="text-muted-foreground underline decoration-border underline-offset-4 transition-colors hover:text-foreground hover:decoration-foreground"
              >
                {c.label}
              </a>
            </li>
          ))}
        </ul>
      </section>

      {/* Building */}
      <Block label="Building">
        <div className="-mt-1">
          {projects.map((p) => {
            const body = (
              <div className="group flex items-start justify-between gap-4 border-t border-border py-5">
                <div>
                  <h3 className="font-display text-lg font-medium transition-colors group-hover:text-accent">
                    {p.name}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {p.description}
                  </p>
                </div>
                <ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground transition-all group-hover:text-accent group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </div>
            );
            return p.internal ? (
              <Link key={p.name} to={p.href}>
                {body}
              </Link>
            ) : (
              <a key={p.name} href={p.href} target="_blank" rel="noreferrer">
                {body}
              </a>
            );
          })}
        </div>
      </Block>

      {/* Experience */}
      <Block label="Experience">
        <div className="space-y-9">
          {experience.map((role) => (
            <article key={`${role.company}-${role.period}`}>
              <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
                <h3 className="font-display text-base font-medium">
                  {role.title}
                  <span className="text-muted-foreground"> · {role.company}</span>
                </h3>
                <span className="shrink-0 font-mono text-xs text-muted-foreground">
                  {role.period}
                </span>
              </div>
              <ul className="mt-3 space-y-1.5">
                {role.bullets.map((b, i) => (
                  <li
                    key={i}
                    className="flex gap-2.5 text-sm leading-relaxed text-muted-foreground"
                  >
                    <span className="select-none text-border">—</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </Block>

      {/* Skills */}
      <Block label="Skills">
        <dl className="text-sm">
          {skills.map((s) => (
            <div
              key={s.group}
              className="grid grid-cols-1 gap-1 border-t border-border py-3 sm:grid-cols-[8rem_1fr] sm:gap-4"
            >
              <dt className="text-muted-foreground">{s.group}</dt>
              <dd className="text-foreground/90">{s.items.join(", ")}</dd>
            </div>
          ))}
        </dl>
      </Block>

      {/* Details */}
      <Block label="Details">
        <div className="space-y-6 text-sm">
          <div>
            <p className="font-medium">{education.degree}</p>
            <p className="text-muted-foreground">
              {education.school} · {education.period}
            </p>
          </div>
          <div>
            <p className="mb-1.5 text-muted-foreground">Awards & certifications</p>
            <ul className="space-y-1 text-foreground/90">
              {awards.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="mb-1.5 text-muted-foreground">Languages</p>
            <p className="text-foreground/90">{languages.join(" · ")}</p>
          </div>
        </div>
      </Block>

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

function Block({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-16">
      <h2 className="mb-6 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </h2>
      {children}
    </section>
  );
}
