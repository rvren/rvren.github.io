import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Apple,
  Blocks,
  Boxes,
  Code2,
  Database,
  Download,
  HardDrive,
  LayoutTemplate,
  ShieldCheck,
  Sparkles,
  SwatchBook,
  Waypoints,
} from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { Section } from "@/components/Section";

const RELEASES_URL = "https://github.com/rvren/buildboard/releases/latest";
const LATEST_API = "https://api.github.com/repos/rvren/buildboard/releases/latest";

/**
 * Resolve direct DMG download URLs for the latest release from the public GitHub
 * API, split by architecture (a universal build serves both). Falls back to the
 * releases page (empty links) if the request fails, is rate-limited, or no
 * release has been published yet.
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

const features = [
  {
    icon: LayoutTemplate,
    title: "Infinite canvas",
    body: "Drag, drop, and arrange real components across multiple screens on a zoomable canvas — with true layout, nesting, and repeaters, not static mockups.",
  },
  {
    icon: SwatchBook,
    title: "Themed design system",
    body: "Build from tokens and reusable components with full light + dark palettes. Edit a component once and every instance across every screen updates.",
  },
  {
    icon: Database,
    title: "Live data",
    body: "Wire screens to real APIs or constant data, preview responses, map fields to props, and drive repeaters — so what you design runs on actual data.",
  },
  {
    icon: Waypoints,
    title: "Architecture",
    body: "Sketch services and interactions, and author sequence diagrams with Mermaid, right alongside the UI you're building.",
  },
  {
    icon: Code2,
    title: "Clean React export",
    body: "Generate typed React + Tailwind that matches the canvas exactly — copy a component or export the whole project as a ready-to-build codebase.",
  },
  {
    icon: HardDrive,
    title: "Local & offline",
    body: "Every project lives in a local SQLite database on your machine. No login, no cloud, no lock-in — open the app and start building.",
  },
];

export default function BuildBoard() {
  const reduce = useReducedMotion();
  const { armLink, intelLink } = useLatestMacDownloads();
  return (
    // Scope a TechCrunch-green identity to the BuildBoard page to match the app.
    <main
      style={
        {
          "--primary": "156 84% 27%",
          "--primary-foreground": "0 0% 100%",
          "--accent": "156 58% 40%",
          "--ring": "156 58% 40%",
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
              src="/buildboard-icon.svg"
              alt="BuildBoard app icon"
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
                BuildBoard
              </motion.h1>
              <motion.p
                initial={reduce ? false : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.12 }}
                className="mt-2 text-lg text-accent sm:text-xl"
              >
                Design, then ship.
              </motion.p>
            </div>
          </div>

          <motion.p
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground"
          >
            A local-first{" "}
            <span className="text-foreground">design-to-code studio</span> for
            the desktop. Build interfaces on an{" "}
            <span className="text-foreground">infinite canvas</span>, wire in{" "}
            <span className="text-foreground">live data</span>, manage a themed
            design system, sketch architecture — then export{" "}
            <span className="text-foreground">clean React + Tailwind</span>. What
            you build on the canvas <em>is</em> the code you ship. Everything
            runs on your machine.
          </motion.p>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.28 }}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <a
              href={armLink ?? RELEASES_URL}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-transform hover:-translate-y-0.5"
            >
              <Download className="h-4 w-4" />
              Download for macOS
            </a>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 font-mono text-xs text-muted-foreground">
              <ShieldCheck className="h-3.5 w-3.5 text-accent" />
              Local-first · offline · your data
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
                  <h3 className="mt-4 font-semibold tracking-tight">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {f.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </Section>

        {/* Fidelity callout */}
        <Section id="fidelity" index="02" title="What you see is what you export">
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl border border-border bg-card/40 p-8 sm:p-12">
              <div className="pointer-events-none absolute right-[-6rem] top-[-6rem] h-64 w-64 rounded-full bg-accent/10 blur-3xl" />
              <div className="relative grid gap-10 lg:grid-cols-2 lg:items-center">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 font-mono text-xs text-muted-foreground">
                    <Sparkles className="h-3.5 w-3.5 text-accent" />
                    No redraw · no drift
                  </div>
                  <h3 className="mt-5 text-2xl font-semibold tracking-tight sm:text-3xl">
                    The canvas and the code are the same thing.
                  </h3>
                  <p className="mt-4 text-muted-foreground">
                    The renderer you design in and the code generator read one
                    shared source of truth, so a visual change can never diverge
                    from its generated Tailwind. Design-system components are
                    canonical — editing a definition fans out to every instance
                    across every screen.
                  </p>
                  <ul className="mt-6 space-y-2.5">
                    {[
                      "One DesignNode + token model powers both preview and export",
                      "Edit a component once — every instance updates everywhere",
                      "Typed React + Tailwind out, copy a node or the whole project",
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
                <ExportPreview />
              </div>
            </div>
          </Reveal>
        </Section>

        {/* Ownership + stack */}
        <Section id="ownership" index="03" title="Own your work">
          <div className="grid gap-5 lg:grid-cols-2">
            <Reveal>
              <div className="h-full rounded-2xl border border-border bg-card/40 p-7">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-accent/10 text-accent">
                  <Database className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-semibold tracking-tight">
                  A local database you control
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Projects are stored in a normalized local SQLite database on
                  your machine — a plain, serializable model, no opaque blob and
                  no cloud. Zero-config: open the app and start, no login or
                  setup. The network is used only when you ask for it — data
                  sources and web fonts.
                </p>
                <div className="mt-5 inline-flex items-center gap-2 rounded-lg bg-secondary px-3 py-2 font-mono text-xs text-muted-foreground">
                  <ShieldCheck className="h-3.5 w-3.5 text-accent" />
                  Offline-first · light &amp; dark · no lock-in
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.08}>
              <div className="h-full rounded-2xl border border-border bg-card/40 p-7">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-accent/10 text-accent">
                  <Boxes className="h-5 w-5" />
                </div>
                <h3 className="font-semibold tracking-tight mt-4">
                  Built with
                </h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {[
                    "Electron",
                    "React",
                    "TypeScript",
                    "Tailwind",
                    "Zustand",
                    "better-sqlite3",
                    "framer-motion",
                    "Mermaid",
                  ].map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-border bg-secondary px-3 py-1 text-sm text-secondary-foreground"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
                  A native macOS desktop app packaged with electron-builder, with
                  a Radix/shadcn UI kit and a TechCrunch-green design language.
                </p>
              </div>
            </Reveal>
          </div>
        </Section>

        {/* Download */}
        <Section id="download" index="04" title="Get BuildBoard">
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
                  Native macOS build for Apple Silicon &amp; Intel, packaged as a
                  DMG. Grab the newest version from GitHub Releases.
                </p>
                <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
                  <a
                    href={armLink ?? RELEASES_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-transform hover:-translate-y-0.5"
                  >
                    <Download className="h-4 w-4" />
                    {armLink ? "Download for Apple Silicon" : "Download for macOS"}
                  </a>
                  {intelLink && intelLink !== armLink && (
                    <a
                      href={intelLink}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-medium transition-colors hover:bg-secondary"
                    >
                      <Download className="h-4 w-4" />
                      Download for Intel
                    </a>
                  )}
                </div>
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
        <div className="container flex items-center justify-center py-10 text-xs text-muted-foreground">
          <span className="font-mono">
            BuildBoard · a local-first design-to-code studio
          </span>
        </div>
      </footer>
    </main>
  );
}

/** A small canvas → code visual: a component preview above its generated JSX. */
function ExportPreview() {
  return (
    <div className="mx-auto grid w-full max-w-[340px] gap-3">
      {/* canvas card */}
      <div className="rounded-2xl border border-border bg-background/60 p-5">
        <div className="flex items-center gap-1.5">
          <Blocks className="h-3.5 w-3.5 text-accent" />
          <span className="font-mono text-[11px] text-muted-foreground">
            canvas
          </span>
        </div>
        <div className="mt-4 rounded-xl border border-border bg-card p-4">
          <div className="h-2.5 w-24 rounded-full bg-muted-foreground/25" />
          <div className="mt-2 h-2 w-36 rounded-full bg-muted-foreground/15" />
          <button
            type="button"
            tabIndex={-1}
            className="mt-4 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground"
          >
            Get started
          </button>
        </div>
      </div>
      {/* code card */}
      <div className="rounded-2xl border border-border bg-[hsl(220_20%_10%)] p-4 text-left">
        <div className="mb-2 flex items-center gap-1.5">
          <Code2 className="h-3.5 w-3.5 text-emerald-400" />
          <span className="font-mono text-[11px] text-slate-400">export.tsx</span>
        </div>
        <pre className="overflow-x-auto font-mono text-[11px] leading-relaxed text-slate-300">
          <code>{`<Card>
  <Heading>Welcome</Heading>
  <Text>Build once, ship it.</Text>
  <Button>Get started</Button>
</Card>`}</code>
        </pre>
      </div>
    </div>
  );
}
