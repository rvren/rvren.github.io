import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  AppWindow,
  Braces,
  Briefcase,
  CalendarClock,
  Database,
  Gauge,
  HeartPulse,
  Lightbulb,
  Network,
  ShieldCheck,
  Timer,
  TrendingUp,
} from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { Section } from "@/components/Section";
import { cn } from "@/lib/utils";
import { RELEASES_URL, useLatestMacDownloads, useMacArch } from "@/lib/downloads";
import {
  browsers,
  counts,
  metrics,
  premise,
  privacy,
  product,
  screens,
  skins,
} from "@/data/sightglass";

/**
 * The Sightglass product page.
 *
 * Standalone by design: shareable on its own, with no personal name, no link
 * back to the portfolio, and no footer byline (see CLAUDE.md). The header here
 * is the theme toggle and nothing else.
 *
 * It also has to be *true*. The page used to claim "30+ hand-tuned themes" when
 * the app shipped seven, and described a Pomodoro-plus-wellbeing app two
 * rewrites after it had become something larger. Everything quoted here comes
 * from `@/data/sightglass`, which is reconciled against the app's source rather
 * than written from memory.
 */
const SCREEN_ICONS = [
  Lightbulb,
  Timer,
  CalendarClock,
  HeartPulse,
  Network,
  AppWindow,
  Briefcase,
  Gauge,
  TrendingUp,
  Database,
] as const;

/** Apple logo — the modern, accurate glyph (used on the download controls). */
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

export default function Sightglass() {
  const reduce = useReducedMotion();
  const { armLink, intelLink, version } = useLatestMacDownloads();
  const arch = useMacArch();

  useEffect(() => {
    document.title = `${product.name} — ${product.tagline}`;
    return () => {
      document.title = "Renjith Rajendran Viswalekshmi";
    };
  }, []);

  return (
    <main className="pb-24">
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-3xl px-6 pt-28 sm:pt-36">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <img
            src="/sightglass-icon.png"
            alt=""
            width={72}
            height={72}
            className="rounded-[18px] shadow-lg"
          />

          <h1 className="mt-7 font-display text-[2.75rem] font-medium leading-[1.03] tracking-tight sm:text-[3.5rem]">
            {product.name}
          </h1>
          <p className="mt-3 font-display text-xl text-muted-foreground sm:text-2xl">
            {product.tagline}
          </p>

          <p className="mt-7 max-w-2xl text-[1.0625rem] leading-relaxed text-foreground/90">
            {product.summary}
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <DownloadButton
              primary
              href={(arch === "x64" ? intelLink : armLink) ?? RELEASES_URL}
              label={arch === "x64" ? "Download for Intel" : "Download for Apple Silicon"}
            />
            <DownloadButton
              href={(arch === "x64" ? armLink : intelLink) ?? RELEASES_URL}
              label={arch === "x64" ? "Apple Silicon" : "Intel"}
            />
          </div>
          <p className="mt-3 font-mono text-xs text-muted-foreground">
            {product.platform}
            {version ? ` · ${version}` : ""} · free
          </p>
        </motion.div>
      </section>

      {/* ── The premise ──────────────────────────────────────────────────── */}
      <Section id="why" index="01" title="Why it exists">
        <Reveal>
          <div className="max-w-2xl space-y-4 text-[1.0625rem] leading-relaxed text-foreground/90">
            {premise.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-7 sm:grid-cols-4">
            <Stat value={String(counts.screens)} label="screens" />
            <Stat value={String(counts.features)} label="features" />
            <Stat value={String(counts.browsers)} label="browsers read" />
            <Stat value="0" label="bytes uploaded" />
          </dl>
        </Reveal>
      </Section>

      {/* ── The screens ──────────────────────────────────────────────────── */}
      <Section id="screens" index="02" title="What's inside">
        <Reveal>
          <p className="mb-8 max-w-2xl text-muted-foreground">
            Ten screens. Each one answers a question you'd otherwise guess at.
          </p>
          <div className="grid gap-x-8 gap-y-9 sm:grid-cols-2">
            {screens.map((s, i) => {
              const Icon = SCREEN_ICONS[i] ?? Lightbulb;
              return (
                <div key={s.name}>
                  <Icon className="h-[18px] w-[18px] text-accent" strokeWidth={1.75} />
                  <h3 className="mt-3.5 font-display text-base font-medium tracking-tight">
                    {s.name}
                    <span className="text-muted-foreground"> · {s.blurb}</span>
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {s.detail}
                  </p>
                </div>
              );
            })}
          </div>
        </Reveal>
      </Section>

      {/* ── The metrics, each with what it won't claim ───────────────────── */}
      <Section id="metrics" index="03" title="Numbers you can trust">
        <Reveal>
          <p className="mb-8 max-w-2xl text-muted-foreground">
            Four signature reads. Each one ships with the thing it deliberately
            refuses to tell you — because a metric you can't interrogate is one
            you shouldn't believe.
          </p>
          <div className="space-y-px overflow-hidden rounded-xl border border-border">
            {metrics.map((m) => (
              <div key={m.name} className="bg-card/40 p-6">
                <h3 className="font-display text-lg font-medium tracking-tight">{m.name}</h3>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-foreground/85">
                  {m.what}
                </p>
                <p className="mt-3 flex max-w-2xl gap-2.5 text-sm leading-relaxed text-muted-foreground">
                  <span className="select-none text-accent">—</span>
                  <span>{m.honesty}</span>
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      </Section>

      {/* ── Privacy, as a boundary rather than a promise ─────────────────── */}
      <Section id="privacy" index="04" title="Where your data is">
        <Reveal>
          <div className="grid gap-8 sm:grid-cols-2">
            <div className="rounded-xl border border-border bg-card/40 p-6">
              <ShieldCheck className="h-[18px] w-[18px] text-accent" strokeWidth={1.75} />
              <h3 className="mt-3.5 font-display text-base font-medium">On your machine</h3>
              <ul className="mt-3 space-y-2">
                {privacy.local.map((l) => (
                  <li key={l} className="flex gap-2.5 text-sm leading-relaxed text-muted-foreground">
                    <span className="select-none text-border">—</span>
                    <span>{l}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-border bg-card/40 p-6">
              <Braces className="h-[18px] w-[18px] text-accent" strokeWidth={1.75} />
              <h3 className="mt-3.5 font-display text-base font-medium">
                Everything that can leave
              </h3>
              <ul className="mt-3 space-y-2">
                {privacy.outbound.map((l) => (
                  <li key={l} className="flex gap-2.5 text-sm leading-relaxed text-muted-foreground">
                    <span className="select-none text-border">—</span>
                    <span>{l}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 border-t border-border pt-4 text-sm leading-relaxed text-foreground/85">
                {privacy.note}
              </p>
            </div>
          </div>

          <div className="mt-8 rounded-xl border border-border bg-card/40 p-6">
            <h3 className="font-display text-base font-medium">Reads these browsers</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {browsers.join(" · ")}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Each history database is copied before it is read, so nothing is ever
              written back to your browser. Safari needs Full Disk Access; the app
              asks and links you straight to the setting.
            </p>
          </div>
        </Reveal>
      </Section>

      {/* ── Skins ────────────────────────────────────────────────────────── */}
      <Section id="skins" index="05" title="Seven looks">
        <Reveal>
          <p className="mb-8 max-w-2xl text-muted-foreground">
            One visual language with a handful of moods — not a gallery of
            fifty. Every skin is a full design system, tuned for light and dark.
          </p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {skins.map((t) => (
              <div key={t.name} className="rounded-xl border border-border p-3">
                <div className="flex h-14 overflow-hidden rounded-lg">
                  {t.colors.map((c) => (
                    <span key={c} className="flex-1" style={{ backgroundColor: c }} />
                  ))}
                </div>
                <h3 className="mt-3 text-sm font-medium tracking-tight">{t.name}</h3>
                <p className="text-xs text-muted-foreground">{t.tag}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </Section>

      {/* ── Download ─────────────────────────────────────────────────────── */}
      <Section id="download" index="06" title={`Get ${product.name}`}>
        <Reveal>
          <div className="rounded-2xl border border-border bg-card/40 p-8">
            <img
              src="/sightglass-icon.png"
              alt=""
              width={56}
              height={56}
              className="rounded-[14px] shadow"
            />
            <h3 className="mt-5 font-display text-3xl font-medium tracking-tight sm:text-4xl">
              Free, and yours.
            </h3>
            <p className="mt-3 max-w-xl leading-relaxed text-muted-foreground">
              No account, no trial, no upsell. {product.platform}.
              {version ? ` Latest release ${version}.` : ""}
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <DownloadButton
                primary
                href={armLink ?? RELEASES_URL}
                label="Apple Silicon"
                sub="M1 and later"
              />
              <DownloadButton
                href={intelLink ?? RELEASES_URL}
                label="Intel"
                sub="also runs on Apple Silicon"
              />
            </div>

            <p className="mt-5 text-sm text-muted-foreground">
              Or browse{" "}
              <a
                href={RELEASES_URL}
                target="_blank"
                rel="noreferrer"
                className="underline decoration-border underline-offset-4 transition-colors hover:text-foreground"
              >
                every release
              </a>
              .
            </p>

            <div className="mt-8 border-t border-border pt-6">
              <h4 className="text-sm font-medium">First launch</h4>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
                The build isn't notarised with Apple, so macOS quarantines it like
                anything else downloaded from the web. Drag {product.name} into
                Applications, then run this once:
              </p>
              <CopyCommand cmd={`xattr -cr /Applications/${product.name}.app`} />
            </div>
          </div>
        </Reveal>
      </Section>

      <footer className="mx-auto mt-20 max-w-3xl px-6 text-xs text-muted-foreground">
        <span className="font-mono">
          {product.name} · a local-first desktop app
        </span>
      </footer>
    </main>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <dt className="font-display text-3xl font-medium tracking-tight sm:text-4xl">{value}</dt>
      <dd className="mt-1 font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </dd>
    </div>
  );
}

function DownloadButton({
  href,
  label,
  sub,
  primary,
}: {
  href: string;
  label: string;
  sub?: string;
  primary?: boolean;
}) {
  return (
    <a
      href={href}
      className={cn(
        "group inline-flex items-center gap-2.5 rounded-xl px-5 py-3 transition-colors",
        primary
          ? "bg-foreground text-background hover:opacity-90"
          : "border border-border text-foreground hover:bg-card",
      )}
    >
      <AppleLogo className="h-[18px] w-[18px]" />
      <span className="text-left">
        <span className="block text-sm font-medium leading-none">{label}</span>
        {sub && (
          <span
            className={cn(
              "mt-1 block text-[11px] leading-none",
              primary ? "opacity-70" : "text-muted-foreground",
            )}
          >
            {sub}
          </span>
        )}
      </span>
    </a>
  );
}
