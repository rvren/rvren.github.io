import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Download,
  Github,
  Linkedin,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Section } from "@/components/Section";
import { Reveal } from "@/components/Reveal";
import { Footer } from "@/components/Footer";
import {
  awards,
  education,
  experience,
  impact,
  languages,
  profile,
  skills,
} from "@/data/resume";
import { projects } from "@/data/projects";

export default function Home() {
  return (
    <main>
      <Hero />
      <div className="container">
        <Impact />
        <Work />
        <Apps />
        <SkillsSection />
        <About />
      </div>
      <Footer />
    </main>
  );
}

function Hero() {
  const reduce = useReducedMotion();
  return (
    <section className="relative overflow-hidden">
      {/* ambient backdrop */}
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-[0.5] [mask-image:radial-gradient(ellipse_at_top,black,transparent_75%)]" />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[38rem] w-[38rem] -translate-x-1/2 rounded-full bg-accent/10 blur-3xl mask-radial" />

      <div className="container relative pb-16 pt-36 sm:pb-24 sm:pt-44">
        <motion.p
          initial={reduce ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground"
        >
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent" />
          {profile.location}
        </motion.p>

        <motion.h1
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 max-w-4xl text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl"
        >
          {profile.title}
          <span className="text-muted-foreground/50"> — </span>
          <span className="text-accent">{profile.subtitle}</span>
        </motion.h1>

        <motion.p
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl"
        >
          {profile.tagline}
        </motion.p>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 flex flex-wrap items-center gap-3"
        >
          <a
            href="#work"
            className="group inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-transform hover:-translate-y-0.5"
          >
            View work
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </a>
          <a
            href={profile.resumeUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-5 py-2.5 text-sm font-medium transition-colors hover:bg-secondary"
          >
            <Download className="h-4 w-4" />
            Résumé
          </a>
          <div className="ml-1 flex items-center gap-1">
            <IconLink href={profile.linkedin} label="LinkedIn">
              <Linkedin className="h-[18px] w-[18px]" />
            </IconLink>
            <IconLink href={profile.github} label="GitHub">
              <Github className="h-[18px] w-[18px]" />
            </IconLink>
          </div>
        </motion.div>

        {/* summary card */}
        <Reveal delay={0.35} className="mt-16">
          <div className="max-w-3xl rounded-2xl border border-border bg-card/40 p-6 sm:p-8">
            <p className="text-base leading-relaxed text-foreground/90 sm:text-lg">
              {profile.summary}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function IconLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className="inline-flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
    >
      {children}
    </a>
  );
}

function Impact() {
  return (
    <Section id="impact" index="01" title="Selected impact">
      <div className="grid gap-4 sm:grid-cols-2">
        {impact.map((it, i) => (
          <Reveal key={it.label} delay={i * 0.06}>
            <div className="group h-full rounded-2xl border border-border bg-card/40 p-6 transition-colors hover:border-accent/40">
              <div className="text-2xl font-semibold tracking-tight text-accent sm:text-3xl">
                {it.stat}
              </div>
              <div className="mt-1 text-sm font-medium text-foreground">
                {it.label}
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {it.detail}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

function Work() {
  return (
    <Section id="work" index="02" title="Experience">
      <div className="relative">
        {/* rail */}
        <div className="absolute left-0 top-2 hidden h-full w-px bg-border sm:block" />
        <div className="space-y-12 sm:space-y-14">
          {experience.map((role, i) => (
            <Reveal key={`${role.company}-${role.period}`} delay={0.02}>
              <article className="relative sm:pl-10">
                <span className="absolute left-[-4px] top-2 hidden h-2 w-2 rounded-full bg-accent ring-4 ring-background sm:block" />
                <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                  <h3 className="text-lg font-semibold tracking-tight">
                    {role.title}
                    <span className="text-muted-foreground"> · {role.company}</span>
                  </h3>
                  <span className="shrink-0 font-mono text-xs text-muted-foreground">
                    {role.period}
                  </span>
                </div>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {role.location}
                </p>
                <ul className="mt-4 space-y-2.5">
                  {role.bullets.map((b, bi) => (
                    <li
                      key={bi}
                      className="flex gap-3 text-sm leading-relaxed text-muted-foreground"
                    >
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent/70" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}

function Apps() {
  return (
    <Section id="apps" index="03" title="Things I've built">
      <div className="grid gap-5 md:grid-cols-2">
        {projects.map((p, i) => {
          const inner = (
            <div className="flex h-full flex-col rounded-2xl border border-border bg-card/40 p-7 transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:bg-card/70">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-2xl font-semibold tracking-tight">
                    {p.name}
                  </h3>
                  <p className="mt-1 text-sm text-accent">{p.tagline}</p>
                </div>
                <span className="font-mono text-xs text-muted-foreground">
                  {p.year}
                </span>
              </div>
              <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                {p.description}
              </p>
              <div className="mt-5 flex flex-wrap gap-1.5">
                {p.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-border px-2.5 py-0.5 font-mono text-[11px] text-muted-foreground"
                  >
                    {t}
                  </span>
                ))}
              </div>
              <div className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-foreground">
                {p.cta}
                <ArrowUpRight className="h-4 w-4 text-accent transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </div>
          );
          return (
            <Reveal key={p.name} delay={i * 0.08} className="group">
              {p.internal ? (
                <Link to={p.href}>{inner}</Link>
              ) : (
                <a href={p.href} target="_blank" rel="noreferrer">
                  {inner}
                </a>
              )}
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}

function SkillsSection() {
  return (
    <Section id="skills" index="04" title="Toolkit">
      <div className="grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
        {skills.map((s, i) => (
          <Reveal key={s.group} delay={i * 0.04}>
            <div>
              <h3 className="text-sm font-medium text-foreground">{s.group}</h3>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {s.items.map((item) => (
                  <span
                    key={item}
                    className="rounded-md bg-secondary px-2.5 py-1 text-xs text-secondary-foreground"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

function About() {
  return (
    <Section id="about" index="05" title="Background">
      <div className="grid gap-10 lg:grid-cols-3">
        <Reveal>
          <div>
            <h3 className="text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">
              Education
            </h3>
            <p className="mt-4 font-medium">{education.degree}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {education.school}
            </p>
            <p className="mt-1 font-mono text-xs text-muted-foreground">
              {education.period}
            </p>
          </div>
        </Reveal>
        <Reveal delay={0.06}>
          <div>
            <h3 className="text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">
              Awards & certifications
            </h3>
            <ul className="mt-4 space-y-2">
              {awards.map((a) => (
                <li
                  key={a}
                  className="flex gap-2.5 text-sm text-muted-foreground"
                >
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent/70" />
                  {a}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
        <Reveal delay={0.12}>
          <div>
            <h3 className="text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">
              Languages
            </h3>
            <ul className="mt-4 space-y-2">
              {languages.map((l) => (
                <li
                  key={l}
                  className="flex items-center gap-2.5 text-sm text-muted-foreground"
                >
                  <span className="h-1 w-1 shrink-0 rounded-full bg-accent/70" />
                  {l}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
