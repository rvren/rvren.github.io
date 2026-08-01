import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  BookMarked,
  Briefcase,
  CalendarDays,
  Eye,
  Gauge,
  HeartPulse,
  Lightbulb,
  Search,
  ShieldCheck,
  Timer,
  TrendingUp,
} from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { Section } from "@/components/Section";

const RELEASES_URL = "https://github.com/rvren/history-lens/releases/latest";
const LATEST_API = "https://api.github.com/repos/rvren/history-lens/releases/latest";

/**
 * Resolve direct DMG download URLs for the latest release from the public GitHub
 * API, split by architecture (a universal build serves both). Falls back to the
 * releases page (empty links) if the request fails or is rate-limited.
 */
function useLatestMacDownloads(): { armLink?: string; intelLink?: string } {
  const [links, setLinks] = useState<{ armLink?: string; intelLink?: string }>({});
  useEffect(() => {
    let alive = true;
    fetch(LATEST_API)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("release lookup failed"))))
      .then((rel: { assets?: { name: string; browser_download_url: string }[] }) => {
        if (!alive) return;
        let arm: string | undefined;
        let intel: string | undefined;
        let universal: string | undefined;
        for (const a of rel.assets ?? []) {
          const n = a.name.toLowerCase();
          if (!n.endsWith(".dmg")) continue;
          if (n.includes("universal")) universal = a.browser_download_url;
          else if (n.includes("arm64") || n.includes("aarch64")) arm = a.browser_download_url;
          else if (n.includes("x64") || n.includes("x86") || n.includes("intel"))
            intel = a.browser_download_url;
        }
        setLinks({ armLink: universal ?? arm, intelLink: universal ?? intel });
      })
      .catch(() => {
        /* keep the releases-page fallback */
      });
    return () => {
      alive = false;
    };
  }, []);
  return links;
}

/** The original Apple logo (used on the macOS download controls). */
function AppleLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M16.365 1.43c0 1.14-.417 2.2-1.11 2.99-.744.86-1.96 1.52-3.06 1.43-.13-1.1.43-2.27 1.11-3 .76-.82 2.06-1.44 3.06-1.45zM20.9 17.02c-.55 1.28-.82 1.85-1.53 2.98-.99 1.57-2.39 3.53-4.12 3.54-1.54.02-1.94-1.01-4.03-1-2.09.01-2.53 1.02-4.07 1-1.73-.01-3.05-1.78-4.04-3.35C1.3 17.8.98 13.5 2.94 11.02c.98-1.24 2.4-1.97 3.85-1.97 1.48 0 2.41 1.01 3.63 1.01 1.19 0 1.91-1.01 3.62-1.01 1.29 0 2.66.7 3.63 1.91-3.19 1.75-2.67 6.31.23 8.06z" />
    </svg>
  );
}

/** A copyable one-line shell command (for the quarantine-clear fix). */
function CopyCommand({ cmd }: { cmd: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="mt-3 flex items-center justify-between gap-3 rounded-lg border border-border bg-background/60 px-3 py-2">
      <code className="overflow-x-auto font-mono text-xs text-foreground">
        {cmd}
      </code>
      <button
        type="button"
        onClick={() => {
          navigator.clipboard?.writeText(cmd).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          });
        }}
        className="shrink-0 rounded-md border border-border px-2 py-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
      >
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}

const features = [
  {
    icon: Gauge,
    title: "Cadence Score",
    body: "One daily 0–100 score, with a letter grade and trend, that blends your focus vs goal, how on-task you stayed, how deep it went, and your consistency — the single number you check each day.",
  },
  {
    icon: Timer,
    title: "Focus timer",
    body: "A configurable Pomodoro with presets and optional auto-start, a big circular timer and a live sidebar ring, forgiving streaks (with earned freezes), and per-project tagging.",
  },
  {
    icon: Briefcase,
    title: "Work lens",
    body: "Set your work hours, then see a weekly project timesheet (with CSV / HTML export), a work-vs-personal balance, deep-work quality per project, and a gentle after-hours nudge.",
  },
  {
    icon: HeartPulse,
    title: "Wellbeing & habits",
    body: "Category time budgets, a focus goal, distraction-light-day streaks, a daily habit tracker, achievements, and a personal-records wall — momentum without the shame.",
  },
  {
    icon: TrendingUp,
    title: "Insights & categories",
    body: "Chronotype and golden hours, weekday-vs-weekend patterns, a category time-of-day heatmap, and browsing sessions & rabbit holes — over a two-tier offline taxonomy you can override.",
  },
  {
    icon: CalendarDays,
    title: "Recaps & Wrapped",
    body: "Look back at a day, week, month, or your whole year (Cadence Wrapped), plus a discovery feed of the new sites you've found — exportable, all local.",
  },
  {
    icon: BookMarked,
    title: "Bookmarks",
    body: "Smart collections surface your most-used, never-opened, recently-added, and duplicate bookmarks — with favicons extracted locally across Chromium, Firefox, Safari, and Arc.",
  },
  {
    icon: Search,
    title: "Search & reading list",
    body: "Fast full-text search with site:, before:, and after: operators, search-term insights, and a reading list of the article pages you keep returning to.",
  },
  {
    icon: Eye,
    title: "Watch & deep-dive",
    body: "Star domains to track week-over-week, open a rich per-domain profile with related sites, and add your own tags and notes to make it yours.",
  },
];

const browsers = [
  "Google Chrome",
  "Microsoft Edge",
  "Brave",
  "Arc",
  "Firefox",
  "Safari",
];

export default function Cadence() {
  const reduce = useReducedMotion();
  const { armLink, intelLink } = useLatestMacDownloads();
  return (
    // Scope an indigo→blue accent to the Cadence page to match the app's identity.
    <main
      style={
        {
          "--accent": "239 84% 67%",
          "--ring": "239 84% 67%",
        } as React.CSSProperties
      }
    >
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-[0.5] [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-accent/15 blur-3xl mask-radial" />

        <div className="container relative pb-14 pt-32 sm:pt-40">
          <div className="flex flex-col items-start gap-8 sm:flex-row sm:items-center">
            <motion.img
              src="/cadence-icon.svg"
              alt="Cadence app icon"
              initial={reduce ? false : { opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="h-20 w-20 rounded-[22px] shadow-lg ring-1 ring-border sm:h-24 sm:w-24"
            />
            <div>
              <motion.h1
                initial={reduce ? false : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.05 }}
                className="text-4xl font-semibold tracking-tight sm:text-6xl"
              >
                Cadence
              </motion.h1>
              <motion.p
                initial={reduce ? false : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.12 }}
                className="mt-2 text-lg text-accent sm:text-xl"
              >
                Your daily focus rhythm.
              </motion.p>
            </div>
          </div>

          <motion.p
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground"
          >
            A local desktop app that pairs a Pomodoro{" "}
            <span className="text-foreground">focus timer</span> with{" "}
            <span className="text-foreground">digital-wellbeing insights</span>{" "}
            from your own browser history — distilled into a single daily{" "}
            <span className="text-foreground">Cadence Score</span>. Work in
            focused intervals, track projects and habits, and understand where
            your time actually goes. Everything runs on your machine; nothing is
            ever uploaded.
          </motion.p>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.28 }}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <a
              href={RELEASES_URL}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-transform hover:-translate-y-0.5"
            >
              <AppleLogo className="h-4 w-4" />
              Download for macOS
            </a>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 font-mono text-xs text-muted-foreground">
              <ShieldCheck className="h-3.5 w-3.5 text-accent" />
              100% local · nothing uploaded
            </span>
          </motion.div>
        </div>
      </section>

      <div className="container">
        {/* Features */}
        <Section id="features" index="01" title="What's inside">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <Reveal key={f.title} delay={i * 0.05}>
                <div className="flex h-full flex-col rounded-2xl border border-border bg-card/40 p-6 transition-colors hover:border-accent/40">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-accent/10 text-accent">
                    <f.icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 font-semibold tracking-tight">
                    {f.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {f.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </Section>

        {/* Cadence Score callout */}
        <Section id="score" index="02" title="One number for your day">
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl border border-border bg-card/40 p-8 sm:p-12">
              <div className="pointer-events-none absolute right-[-6rem] top-[-6rem] h-64 w-64 rounded-full bg-accent/10 blur-3xl" />
              <div className="relative grid gap-10 lg:grid-cols-2 lg:items-center">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 font-mono text-xs text-muted-foreground">
                    <Gauge className="h-3.5 w-3.5 text-accent" />
                    Cadence Score
                  </div>
                  <h3 className="mt-5 text-2xl font-semibold tracking-tight sm:text-3xl">
                    Everything you do, in one honest daily score.
                  </h3>
                  <p className="mt-4 text-muted-foreground">
                    Cadence blends your focus time, how on-task you stayed, how
                    deep your focus went, and your day-to-day consistency into a
                    single 0–100 score with a letter grade — compared only to
                    your own past, never anyone else. A quick, honest read on
                    your day, with a plain-language explanation of exactly how
                    it's computed.
                  </p>
                  <ul className="mt-6 space-y-2.5">
                    {[
                      "Pomodoro focus timer with presets, auto-start, and per-project tracking",
                      "Forgiving streaks with earned freezes, plus a focus calendar and score history",
                      "A rotating daily insight, and a little celebration when you hit your goal",
                    ].map((b) => (
                      <li
                        key={b}
                        className="flex gap-3 text-sm text-muted-foreground"
                      >
                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
                <ScoreRing />
              </div>
            </div>
          </Reveal>
        </Section>

        {/* Browsers + privacy */}
        <Section id="browsers" index="03" title="Sources & privacy">
          <div className="grid gap-5 lg:grid-cols-2">
            <Reveal>
              <div className="h-full rounded-2xl border border-border bg-card/40 p-7">
                <h3 className="font-semibold tracking-tight">
                  Supported browsers (macOS)
                </h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {browsers.map((b) => (
                    <span
                      key={b}
                      className="rounded-full border border-border bg-secondary px-3 py-1 text-sm text-secondary-foreground"
                    >
                      {b}
                    </span>
                  ))}
                </div>
                <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
                  Chrome, Edge, Brave, and Arc read as Chromium. Safari requires{" "}
                  <span className="text-foreground">Full Disk Access</span> — the
                  app links you straight to the right settings pane. Each
                  browser's history is copied to a temp file before reading, so
                  it works even while the browser is open.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.08}>
              <div className="h-full rounded-2xl border border-border bg-card/40 p-7">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-accent/10 text-accent">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-semibold tracking-tight">
                  Private by design
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Cadence reads your history locally and computes every insight
                  on-device with plain, deterministic rules — no account, no
                  server, no telemetry, and no models. Set never-track domains,
                  auto-purge old history, rename any category, and export or wipe
                  your data whenever you want. It never leaves your machine.
                </p>
                <div className="mt-5 inline-flex items-center gap-2 rounded-lg bg-secondary px-3 py-2 font-mono text-xs text-muted-foreground">
                  <Lightbulb className="h-3.5 w-3.5 text-accent" />
                  Offline heuristics · light &amp; dark · themeable
                </div>
              </div>
            </Reveal>
          </div>
        </Section>

        {/* Download */}
        <Section id="download" index="04" title="Get Cadence">
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl border border-border bg-card/50 p-8 text-center sm:p-14">
              <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-accent/10 blur-3xl" />
              <div className="relative">
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-primary text-primary-foreground">
                  <AppleLogo className="h-7 w-7" />
                </div>
                <h3 className="mt-6 text-2xl font-semibold tracking-tight sm:text-3xl">
                  Download the latest release
                </h3>
                <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">
                  Native macOS build for Apple Silicon & Intel, packaged as a
                  DMG. Grab the newest version from GitHub Releases.
                </p>
                <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
                  <a
                    href={armLink ?? RELEASES_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-transform hover:-translate-y-0.5"
                  >
                    <AppleLogo className="h-4 w-4" />
                    {armLink ? "Download for Apple Silicon" : "Download for macOS"}
                  </a>
                  {intelLink && intelLink !== armLink && (
                    <a
                      href={intelLink}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-medium transition-colors hover:bg-secondary"
                    >
                      <AppleLogo className="h-4 w-4" />
                      Download for Intel
                    </a>
                  )}
                </div>
                {(armLink || intelLink) && (
                  <p className="mt-4 text-xs text-muted-foreground">
                    <a
                      href={RELEASES_URL}
                      target="_blank"
                      rel="noreferrer"
                      className="underline underline-offset-2 transition-colors hover:text-foreground"
                    >
                      All releases &amp; notes
                    </a>
                  </p>
                )}
                <div className="mx-auto mt-8 max-w-md rounded-xl border border-border bg-background/40 p-5 text-left">
                  <h4 className="text-sm font-medium text-foreground">
                    macOS says the app is “damaged” or from an unidentified
                    developer?
                  </h4>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                    That’s expected for a free, un-notarized app — it’s ad-hoc
                    signed and safe; macOS just quarantines anything downloaded
                    from the web. Drag Cadence into your Applications folder,
                    then clear the quarantine flag once in Terminal:
                  </p>
                  <CopyCommand cmd="xattr -cr /Applications/Cadence.app" />
                  <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                    <span className="text-foreground">
                      Apple Silicon (M1/M2/M3):
                    </span>{" "}
                    running the command is required — macOS won’t launch a
                    quarantined Apple-Silicon app until the flag is cleared. Then
                    open it normally. (Alternatively: right-click the app →{" "}
                    <span className="text-foreground">Open</span>.)
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </Section>
      </div>

      <footer className="border-t border-border">
        <div className="container flex items-center justify-center py-10 text-xs text-muted-foreground">
          <span className="font-mono">Cadence · a local-first desktop app</span>
        </div>
      </footer>
    </main>
  );
}

function ScoreRing() {
  const reduce = useReducedMotion();
  const r = 82;
  const c = 2 * Math.PI * r;
  const progress = 0.78; // Cadence Score 78 / 100
  return (
    <div className="relative mx-auto grid aspect-square w-full max-w-[300px] place-items-center rounded-3xl border border-border bg-background/60 p-6">
      <svg viewBox="0 0 200 200" className="h-full w-full -rotate-90">
        <circle
          cx="100"
          cy="100"
          r={r}
          fill="none"
          stroke="hsl(var(--border))"
          strokeWidth="6"
        />
        <motion.circle
          cx="100"
          cy="100"
          r={r}
          fill="none"
          stroke="hsl(var(--accent))"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={c}
          initial={reduce ? false : { strokeDashoffset: c }}
          whileInView={{ strokeDashoffset: c * (1 - progress) }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
      <div className="absolute flex max-w-[62%] flex-col items-center text-center">
        <span className="font-mono text-5xl font-semibold leading-none tracking-tight">78</span>
        <span className="mt-1.5 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          Cadence Score
        </span>
        <span className="mt-2 rounded-full border border-border px-2 py-0.5 font-mono text-[11px] text-accent">
          Grade A−
        </span>
      </div>
    </div>
  );
}
