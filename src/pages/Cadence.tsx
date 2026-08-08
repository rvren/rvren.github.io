import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  AppWindow,
  BookMarked,
  Briefcase,
  CalendarClock,
  CalendarDays,
  Gauge,
  HeartPulse,
  Lightbulb,
  Network,
  Search,
  ShieldCheck,
  StickyNote,
  Timer,
  TrendingUp,
} from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { Section } from "@/components/Section";
import { cn } from "@/lib/utils";

// Source is private; public macOS builds are published to rvren/cadence-releases.
const RELEASES_URL = "https://github.com/rvren/cadence-releases/releases/latest";
const LATEST_API = "https://api.github.com/repos/rvren/cadence-releases/releases/latest";

/**
 * Resolve direct DMG download URLs for the latest release from the public GitHub
 * API. A universal build serves both architectures; falls back to the releases
 * page if the request fails or is rate-limited.
 */
interface MacBuild {
  name: string;
  url: string;
  size: number;
  arch: string; // "Apple Silicon" | "Intel" | "Universal" | "macOS"
}

function archOf(name: string): string {
  const n = name.toLowerCase();
  if (n.includes("universal")) return "Universal";
  if (n.includes("arm64") || n.includes("aarch64")) return "Apple Silicon";
  if (n.includes("x64") || n.includes("x86") || n.includes("intel")) return "Intel";
  return "macOS";
}

function useLatestMacDownloads(): { armLink?: string; intelLink?: string; builds: MacBuild[]; version?: string } {
  const [state, setState] = useState<{ armLink?: string; intelLink?: string; builds: MacBuild[]; version?: string }>({
    builds: [],
  });
  useEffect(() => {
    let alive = true;
    fetch(LATEST_API)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("release lookup failed"))))
      .then(
        (rel: {
          tag_name?: string;
          assets?: { name: string; browser_download_url: string; size: number }[];
        }) => {
          if (!alive) return;
          // Every .dmg installer, Apple Silicon listed first.
          const builds: MacBuild[] = (rel.assets ?? [])
            .filter((a) => a.name.toLowerCase().endsWith(".dmg"))
            .map((a) => ({ name: a.name, url: a.browser_download_url, size: a.size, arch: archOf(a.name) }))
            .sort((a, b) => (a.arch === "Apple Silicon" ? -1 : b.arch === "Apple Silicon" ? 1 : 0));
          const arm = builds.find((b) => b.arch === "Apple Silicon" || b.arch === "Universal")?.url;
          const intel = builds.find((b) => b.arch === "Intel" || b.arch === "Universal")?.url;
          setState({ armLink: arm, intelLink: intel, builds, version: rel.tag_name });
        },
      )
      .catch(() => {
        /* keep the releases-page fallback */
      });
    return () => {
      alive = false;
    };
  }, []);
  return state;
}

/**
 * Best-effort detect the Mac CPU architecture so we can offer the right build.
 * Chromium exposes it via userAgentData high-entropy hints (reliable); Safari/
 * Firefox fall back to the WebGL renderer string (Apple GPU → arm64, Intel/AMD →
 * x64). Returns null when we can't tell — the UI then shows both explicitly.
 */
async function detectMacArch(): Promise<"arm64" | "x64" | null> {
  const uaData = (navigator as unknown as {
    userAgentData?: {
      getHighEntropyValues?: (h: string[]) => Promise<{ architecture?: string }>;
    };
  }).userAgentData;
  if (uaData?.getHighEntropyValues) {
    try {
      const v = await uaData.getHighEntropyValues(["architecture"]);
      if (v.architecture === "arm") return "arm64";
      if (v.architecture === "x86") return "x64";
    } catch {
      /* ignore */
    }
  }
  try {
    const canvas = document.createElement("canvas");
    const gl = (canvas.getContext("webgl") ||
      canvas.getContext("experimental-webgl")) as WebGLRenderingContext | null;
    const dbg = gl?.getExtension("WEBGL_debug_renderer_info");
    const r = dbg && gl ? String(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL)) : "";
    if (/intel|amd|radeon/i.test(r)) return "x64";
    if (/apple/i.test(r)) return "arm64";
  } catch {
    /* ignore */
  }
  return null;
}

function useMacArch(): "arm64" | "x64" | null {
  const [arch, setArch] = useState<"arm64" | "x64" | null>(null);
  useEffect(() => {
    let alive = true;
    void detectMacArch().then((a) => {
      if (alive) setArch(a);
    });
    return () => {
      alive = false;
    };
  }, []);
  return arch;
}

/** Apple logo — the modern, accurate glyph (used on the macOS download controls). */
function AppleLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M17.543 12.647c-.02-2.148 1.755-3.178 1.834-3.23-1-1.463-2.556-1.664-3.11-1.687-1.323-.134-2.583.778-3.253.778-.67 0-1.706-.759-2.808-.738-1.444.021-2.777.84-3.52 2.132-1.5 2.6-.383 6.45 1.076 8.562.714 1.033 1.565 2.194 2.68 2.153 1.075-.043 1.48-.695 2.78-.695 1.3 0 1.665.695 2.803.673 1.157-.02 1.892-1.054 2.601-2.09.82-1.198 1.157-2.36 1.176-2.42-.026-.012-2.256-.867-2.279-3.44zM15.4 6.29c.593-.72.993-1.72.884-2.716-.855.035-1.89.57-2.503 1.288-.55.637-1.031 1.657-.902 2.634.953.074 1.927-.485 2.52-1.206z" />
    </svg>
  );
}

/** A copyable one-line shell command (for the quarantine-clear fix). */
function CopyCommand({ cmd }: { cmd: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="mt-3 flex items-center justify-between gap-3 rounded-lg border border-border bg-background/60 px-3 py-2">
      <code className="overflow-x-auto font-mono text-xs text-foreground">{cmd}</code>
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
    body: "One daily 0–100 score with a letter grade and trend — blending your focus vs goal, how on-task you stayed, how deep it went, and your consistency. The single number you check each day.",
  },
  {
    icon: Timer,
    title: "Focus timer",
    body: "A configurable Pomodoro with presets and auto-start, a big circular timer and a live sidebar ring, forgiving streaks with earned freezes, and tap-to-label sessions — no typing.",
  },
  {
    icon: AppWindow,
    title: "Desktop app tracking",
    body: "See time per app and per window across your whole Mac — Claude, VS Code, Slack — auto-categorized into AI, Dev, Comms and Design, and charted. Opt-in and 100% on-device.",
  },
  {
    icon: CalendarClock,
    title: "Calendar",
    body: "Connect multiple Google accounts and Apple iCloud (read-only, opt-in), choose which calendars sync, and see meetings beside your focus — free-to-focus time, your longest open block, meeting-free days.",
  },
  {
    icon: Briefcase,
    title: "Work rhythm",
    body: "See when your week's focus actually happened — day by day, colored by the kind of work — with your standout sessions, a work-vs-personal balance, and deep-work quality per label.",
  },
  {
    icon: HeartPulse,
    title: "Wellbeing & habits",
    body: "Category time budgets, a focus goal, distraction-light-day streaks, a daily habit tracker, achievements, and a personal-records wall — momentum without the shame.",
  },
  {
    icon: Network,
    title: "Site traffic & deep-dive",
    body: "Open a rich per-site profile: the areas of a site you use, the API endpoints you hit, on-site searches, related sites, and your own tags and notes.",
  },
  {
    icon: TrendingUp,
    title: "Insights & categories",
    body: "Chronotype and golden hours, weekday-vs-weekend patterns, a category time-of-day heatmap, and browsing sessions & rabbit holes — over an offline taxonomy you can override.",
  },
  {
    icon: CalendarDays,
    title: "Recaps & Wrapped",
    body: "Look back at a day, week, month, or your whole year (Cadence Wrapped), plus a discovery feed of the new sites you've found — all local, all exportable.",
  },
  {
    icon: StickyNote,
    title: "Notes & tasks",
    body: "Quick-capture thoughts and to-dos anchored to the focus session you're in (⌘⇧N from anywhere) — searchable, checkable, and kept entirely on your Mac.",
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
];

const themes = [
  { name: "Porcelain", tag: "Warm & calm", colors: ["#f4f1ea", "#e6ddcb", "#2f2b26"] },
  { name: "Aurora", tag: "Glassmorphism", colors: ["#0b1220", "#7cc4ff", "#14233b"] },
  { name: "Vault", tag: "Fintech-luxe", colors: ["#111114", "#d8b46a", "#1b1b20"] },
  { name: "Velvet", tag: "Midnight glass", colors: ["#14101f", "#b98cf0", "#1f1830"] },
  { name: "Opal", tag: "Light glass", colors: ["#f7eefb", "#c86ad6", "#ffffff"] },
  { name: "Noir", tag: "Black & white", colors: ["#0f0f0f", "#f4f4f4", "#232323"] },
];

const browsers = ["Google Chrome", "Microsoft Edge", "Brave", "Arc", "Firefox", "Safari"];

export default function Cadence() {
  const reduce = useReducedMotion();
  const { armLink, intelLink, builds } = useLatestMacDownloads();
  // Detection only highlights the likely build; both are always shown explicitly.
  const arch = useMacArch();
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
      <section className="grain relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-[0.5] [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
        <div className="pointer-events-none absolute -top-40 left-1/4 h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-accent/20 blur-3xl mask-radial" />
        <div className="pointer-events-none absolute -top-24 right-0 h-[26rem] w-[26rem] rounded-full bg-accent/10 blur-3xl mask-radial" />

        <div className="container relative pb-16 pt-32 sm:pt-40">
          <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <motion.div
                initial={reduce ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="flex items-center gap-4"
              >
                <img
                  src="/cadence-icon.svg"
                  alt="Cadence app icon"
                  className="h-16 w-16 rounded-[20px] shadow-lg ring-1 ring-border sm:h-[4.5rem] sm:w-[4.5rem]"
                />
                <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/60 px-3 py-1 font-mono text-[11px] text-muted-foreground backdrop-blur">
                  <ShieldCheck className="h-3.5 w-3.5 text-accent" />
                  100% local · nothing uploaded
                </span>
              </motion.div>

              <motion.h1
                initial={reduce ? false : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.06 }}
                className="font-serif mt-7 text-5xl font-semibold leading-[1.02] tracking-tight sm:text-7xl"
              >
                Your daily
                <br />
                focus rhythm.
              </motion.h1>

              <motion.p
                initial={reduce ? false : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.16 }}
                className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground"
              >
                <span className="text-foreground">Cadence</span> pairs a Pomodoro focus timer with
                digital-wellbeing insights from your own Mac — distilled into a single daily{" "}
                <span className="text-foreground">Cadence Score</span>. Track focus, apps, meetings,
                projects and habits, and see where your time actually goes. Everything runs
                on-device; nothing is ever uploaded.
              </motion.p>

              <motion.div
                initial={reduce ? false : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.24 }}
                className="mt-9 flex flex-wrap items-center gap-3"
              >
                {/* Both builds offered equally as direct downloads — a Mac can grab
                    either. Detection only adds a subtle "yours" hint. */}
                <a
                  href={armLink ?? RELEASES_URL}
                  target="_blank"
                  rel="noreferrer"
                  className={cn(
                    "group inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-transform hover:-translate-y-0.5",
                    arch === "arm64" && "ring-2 ring-accent ring-offset-2 ring-offset-background",
                  )}
                >
                  <AppleLogo className="h-4 w-4" />
                  Apple&nbsp;Silicon
                  {arch === "arm64" && <span className="opacity-80">· yours</span>}
                </a>
                <a
                  href={intelLink ?? RELEASES_URL}
                  target="_blank"
                  rel="noreferrer"
                  className={cn(
                    "group inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-transform hover:-translate-y-0.5",
                    arch === "x64" && "ring-2 ring-accent ring-offset-2 ring-offset-background",
                  )}
                >
                  <AppleLogo className="h-4 w-4" />
                  Intel
                  {arch === "x64" && <span className="opacity-80">· yours</span>}
                </a>
                <a
                  href="#features"
                  className="inline-flex items-center gap-2 px-2 py-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  Explore features
                </a>
              </motion.div>
              <p className="mt-3 font-mono text-xs text-muted-foreground">
                Two Mac builds ·{" "}
                <span className="text-foreground">Apple Silicon</span> = M1/M2/M3/M4 ·{" "}
                <span className="text-foreground">Intel</span> = older Macs. Not sure? Apple menu →
                About This Mac.
              </p>
            </div>

            {/* Hero visual — a glass panel with the live Score ring. */}
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="glass accent-glow relative rounded-[28px] p-6 sm:p-8"
            >
              <div className="mb-5 flex items-center justify-between">
                <span className="inline-flex items-center gap-2 font-mono text-xs text-muted-foreground">
                  <Gauge className="h-3.5 w-3.5 text-accent" /> Today
                </span>
                <span className="rounded-full border border-border px-2 py-0.5 font-mono text-[11px] text-accent">
                  Grade A−
                </span>
              </div>
              <ScoreRing />
              <div className="mt-6 grid grid-cols-3 gap-3 text-center">
                {[
                  ["Focus", "3h 40m"],
                  ["On-task", "92%"],
                  ["Streak", "12d"],
                ].map(([k, v]) => (
                  <div key={k} className="rounded-xl border border-border bg-background/50 py-3">
                    <div className="font-mono text-lg font-semibold tabular-nums">{v}</div>
                    <div className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                      {k}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <div className="container">
        {/* Features */}
        <Section id="features" index="01" title="What's inside">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <Reveal key={f.title} delay={i * 0.04}>
                <div className="glass group flex h-full flex-col rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-accent/50">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-accent/12 text-accent transition-colors group-hover:bg-accent/20">
                    <f.icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 font-semibold tracking-tight">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Section>

        {/* Themes */}
        <Section id="themes" index="02" title="Make it yours">
          <Reveal>
            <p className="mb-8 max-w-2xl text-muted-foreground">
              Cadence ships with a deep set of hand-tuned themes — warm and calm, airy
              glassmorphism, fintech-luxe premium, and a strictly black-and-white Noir — each in
              light and dark. Every element recolors to match.
            </p>
          </Reveal>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {themes.map((t, i) => (
              <Reveal key={t.name} delay={i * 0.05}>
                <div className="glass overflow-hidden rounded-2xl p-4 transition-transform duration-300 hover:-translate-y-1">
                  <div className="flex h-16 items-end gap-1.5">
                    {t.colors.map((c, ci) => (
                      <span
                        key={ci}
                        className="flex-1 rounded-md ring-1 ring-black/5"
                        style={{ backgroundColor: c, height: `${60 + ci * 18}%` }}
                      />
                    ))}
                  </div>
                  <h3 className="mt-3 text-sm font-semibold tracking-tight">{t.name}</h3>
                  <p className="font-mono text-[11px] text-muted-foreground">{t.tag}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Section>

        {/* Cadence Score callout */}
        <Section id="score" index="03" title="One number for your day">
          <Reveal>
            <div className="glass relative overflow-hidden rounded-3xl p-8 sm:p-12">
              <div className="pointer-events-none absolute right-[-6rem] top-[-6rem] h-64 w-64 rounded-full bg-accent/15 blur-3xl" />
              <div className="relative max-w-2xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 font-mono text-xs text-muted-foreground">
                  <Gauge className="h-3.5 w-3.5 text-accent" />
                  Cadence Score
                </div>
                <h3 className="font-serif mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">
                  Everything you do, in one honest daily score.
                </h3>
                <p className="mt-4 text-muted-foreground">
                  Cadence blends your focus time, how on-task you stayed, how deep your focus went,
                  and your day-to-day consistency into a single 0–100 score with a letter grade —
                  compared only to your own past, never anyone else. A quick, honest read on your
                  day, with a plain-language explanation of exactly how it's computed.
                </p>
                <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
                  {[
                    "Pomodoro timer with presets, auto-start, and tap-to-label sessions",
                    "Forgiving streaks with earned freezes, plus a focus calendar",
                    "Score history and what's moving it, day by day",
                    "A rotating daily insight and a little win when you hit your goal",
                  ].map((b) => (
                    <li key={b} className="flex gap-3 text-sm text-muted-foreground">
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        </Section>

        {/* Browsers + privacy */}
        <Section id="browsers" index="04" title="Sources & privacy">
          <div className="grid gap-5 lg:grid-cols-2">
            <Reveal>
              <div className="glass h-full rounded-2xl p-7">
                <h3 className="font-semibold tracking-tight">Supported browsers (macOS)</h3>
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
                  <span className="text-foreground">Full Disk Access</span> — the app links you
                  straight to the right settings pane. Each browser's history is copied to a temp
                  file before reading, so it works even while the browser is open.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.08}>
              <div className="glass h-full rounded-2xl p-7">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-accent/12 text-accent">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-semibold tracking-tight">Private by design</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Cadence reads your history locally and computes every insight on-device with plain,
                  deterministic rules — no account, no server, no telemetry, and no models. Set
                  never-track domains, auto-purge old history, rename any category, and export or
                  wipe your data whenever you want. It never leaves your machine.
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
        <Section id="download" index="05" title="Get Cadence">
          <Reveal>
            <div className="glass accent-glow relative overflow-hidden rounded-3xl p-8 text-center sm:p-14">
              <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-accent/12 blur-3xl" />
              <div className="relative">
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-primary text-primary-foreground">
                  <AppleLogo className="h-7 w-7" />
                </div>
                <h3 className="font-serif mt-6 text-3xl font-semibold tracking-tight sm:text-4xl">
                  Download the latest release
                </h3>
                <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">
                  Native macOS builds for Apple Silicon &amp; Intel, packaged as a DMG. Grab the one
                  for your Mac — the app auto-updates from GitHub Releases after that.
                  {arch && (
                    <>
                      {" "}
                      Yours looks like{" "}
                      <span className="text-foreground">
                        {arch === "arm64" ? "Apple Silicon" : "Intel"}
                      </span>
                      .
                    </>
                  )}
                </p>
                {/* Every build listed explicitly — no guessing. */}
                <div className="mx-auto mt-7 max-w-md space-y-2 text-left">
                  {(builds.length
                    ? builds
                    : [
                        { name: "Apple Silicon (.dmg)", url: armLink ?? RELEASES_URL, size: 0, arch: "Apple Silicon" },
                        { name: "Intel (.dmg)", url: intelLink ?? RELEASES_URL, size: 0, arch: "Intel" },
                      ]
                  ).map((b) => (
                    <a
                      key={b.name}
                      href={b.url}
                      target="_blank"
                      rel="noreferrer"
                      className="group flex items-center gap-3 rounded-xl border border-border bg-background/50 px-4 py-3 transition-colors hover:border-accent/50 hover:bg-secondary"
                    >
                      <AppleLogo className="h-5 w-5 shrink-0 text-muted-foreground" />
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-medium">
                          {b.arch === "Apple Silicon"
                            ? "Apple Silicon (arm64)"
                            : b.arch === "Intel"
                              ? "Intel (x64)"
                              : b.arch}
                        </span>
                        <span className="block text-[11px] text-muted-foreground">
                          {b.arch === "Apple Silicon"
                            ? "M1–M5 · native, fastest"
                            : b.arch === "Intel"
                              ? "Runs on any Mac — Intel, or Apple Silicon via Rosetta"
                              : "macOS"}
                          {b.size ? ` · ${Math.round(b.size / 1048576)} MB` : ""}
                        </span>
                      </span>
                      <span className="shrink-0 rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                        Download
                      </span>
                    </a>
                  ))}
                  <p className="pt-1 text-center text-[11px] text-muted-foreground">
                    On Apple Silicon the Intel build also runs (via Rosetta).
                  </p>
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
                    macOS says the app is “damaged” or from an unidentified developer?
                  </h4>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                    That's expected for a free, un-notarized app — it's ad-hoc signed and safe; macOS
                    just quarantines anything downloaded from the web. Drag Cadence into your
                    Applications folder, then clear the quarantine flag once in Terminal:
                  </p>
                  <CopyCommand cmd="xattr -cr /Applications/Cadence.app" />
                  <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                    <span className="text-foreground">Apple Silicon (M1/M2/M3):</span> running the
                    command is required — macOS won't launch a quarantined Apple-Silicon app until
                    the flag is cleared. Then open it normally. (Alternatively: right-click the app →{" "}
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
    <div className="relative mx-auto grid aspect-square w-full max-w-[300px] place-items-center">
      <svg viewBox="0 0 200 200" className="h-full w-full -rotate-90">
        <circle cx="100" cy="100" r={r} fill="none" stroke="hsl(var(--border))" strokeWidth="6" />
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
        <span className="font-mono text-6xl font-semibold leading-none tracking-tight">78</span>
        <span className="mt-1.5 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          Cadence Score
        </span>
      </div>
    </div>
  );
}
