import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  Apple,
  BookMarked,
  Clock,
  Download,
  Github,
  LayoutGrid,
  Lightbulb,
  Search,
  ShieldCheck,
  Timer,
  TrendingUp,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Reveal } from "@/components/Reveal";
import { Section } from "@/components/Section";

const RELEASES_URL = "https://github.com/rvren/history-lens/releases/latest";
const REPO_URL = "https://github.com/rvren/history-lens";

const features = [
  {
    icon: Timer,
    title: "Pomodoro focus timer",
    body: "Configurable focus / short-break / long-break and cycles, a big circular timer with start · pause · reset · skip, and a live mini-ring in the sidebar that follows you across the app.",
  },
  {
    icon: LayoutGrid,
    title: "Sources",
    body: "Pick which browsers and profiles to attach. Each history DB is copied to a temp file before reading, so it works even while the browser is open.",
  },
  {
    icon: TrendingUp,
    title: "Overview & Timeline",
    body: "Totals, unique domains, busiest day, peak hour, and a per-browser split — plus visits over time, a weekly heatmap, and hour-of-day distribution.",
  },
  {
    icon: LayoutGrid,
    title: "Top Sites",
    body: "Ranked domains with categories you can click through to search — see where your attention actually goes.",
  },
  {
    icon: BookMarked,
    title: "Bookmarks",
    body: "A Notion-style gallery grouped by folder with real favicons extracted locally. Chromium, Firefox, Safari, and Arc pinned tabs all supported.",
  },
  {
    icon: Search,
    title: "Search & Insights",
    body: "Full-text search over titles and URLs with browser and domain filters, plus an offline category breakdown and highlights.",
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
  // Show "back to portfolio" links only when the visitor arrived via in-app
  // navigation. A fresh/direct/standalone load has location.key === "default".
  const cameFromSite = useLocation().key !== "default";
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
          {cameFromSite && (
            <Link
              to="/#apps"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to work
            </Link>
          )}

          <div className="mt-10 flex flex-col items-start gap-8 sm:flex-row sm:items-center">
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
            drawn from your own browser history — so you can work in focused
            intervals and understand where your time actually goes. Everything
            runs directly on your machine; nothing is ever uploaded.
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
              <Download className="h-4 w-4" />
              Download for macOS
            </a>
            <a
              href={REPO_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-5 py-2.5 text-sm font-medium transition-colors hover:bg-secondary"
            >
              <Github className="h-4 w-4" />
              Source
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

        {/* Focus callout */}
        <Section id="focus" index="02" title="Work in rhythm">
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl border border-border bg-card/40 p-8 sm:p-12">
              <div className="pointer-events-none absolute right-[-6rem] top-[-6rem] h-64 w-64 rounded-full bg-accent/10 blur-3xl" />
              <div className="relative grid gap-10 lg:grid-cols-2 lg:items-center">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 font-mono text-xs text-muted-foreground">
                    <Clock className="h-3.5 w-3.5 text-accent" />
                    Focus timer
                  </div>
                  <h3 className="mt-5 text-2xl font-semibold tracking-tight sm:text-3xl">
                    Focus, break, repeat — without losing the thread.
                  </h3>
                  <p className="mt-4 text-muted-foreground">
                    A task label, a big circular timer, and simple controls. The
                    timer keeps running as you move around the app, with a live
                    mini-ring in the sidebar rail. When a session ends you get a
                    desktop notification and a soft chime.
                  </p>
                  <ul className="mt-6 space-y-2.5">
                    {[
                      "Configurable focus / short-break / long-break and cycles",
                      "Local session tracking — today's total, streak, and recent sessions",
                      "Desktop notification and soft chime when a session ends",
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
                <TimerMock />
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
                  on-device. There is no account, no server, and no telemetry —
                  your data never leaves your machine. Favicons and categories
                  are resolved offline, with a colored monogram fallback.
                </p>
                <div className="mt-5 inline-flex items-center gap-2 rounded-lg bg-secondary px-3 py-2 font-mono text-xs text-muted-foreground">
                  <Lightbulb className="h-3.5 w-3.5 text-accent" />
                  Neon-glassmorphism UI · light & dark
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
                  <Apple className="h-7 w-7" />
                </div>
                <h3 className="mt-6 text-2xl font-semibold tracking-tight sm:text-3xl">
                  Download the latest release
                </h3>
                <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">
                  Universal macOS build (Apple Silicon & Intel), packaged as a
                  DMG. Grab the newest version from GitHub Releases.
                </p>
                <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
                  <a
                    href={RELEASES_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-transform hover:-translate-y-0.5"
                  >
                    <Download className="h-4 w-4" />
                    Download for macOS
                  </a>
                  <a
                    href={REPO_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-medium transition-colors hover:bg-secondary"
                  >
                    <Github className="h-4 w-4" />
                    View on GitHub
                  </a>
                </div>
                <p className="mx-auto mt-6 max-w-md text-xs leading-relaxed text-muted-foreground">
                  First launch: because the build isn't notarized, right-click
                  the app and choose <span className="text-foreground">Open</span>{" "}
                  to get past Gatekeeper.
                </p>
              </div>
            </div>
          </Reveal>
        </Section>
      </div>

      <footer className="border-t border-border">
        <div className="container flex flex-col items-center justify-between gap-3 py-10 text-xs text-muted-foreground sm:flex-row">
          {cameFromSite ? (
            <Link to="/" className="transition-colors hover:text-foreground">
              ← Renjith Rajendran Viswalekshmi
            </Link>
          ) : (
            <span />
          )}
          <span className="font-mono">Cadence · a local-first desktop app</span>
        </div>
      </footer>
    </main>
  );
}

function TimerMock() {
  const reduce = useReducedMotion();
  const r = 82;
  const c = 2 * Math.PI * r;
  const progress = 0.68;
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
      <div className="absolute flex flex-col items-center">
        <span className="font-mono text-4xl font-semibold tracking-tight">
          17:04
        </span>
        <span className="mt-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Deep work
        </span>
      </div>
    </div>
  );
}
