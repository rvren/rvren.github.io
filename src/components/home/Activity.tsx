import activity from "@/data/activity.json";

type Entry = { weekly: number[]; lastCommit: string | null };

const DAY = 86_400_000;
// A product counts as "building now" when it had a commit in the 3 weeks before
// the snapshot. A snapshot older than 30 days claims nothing, so a stale deploy
// can never say work is happening when nobody has checked.
const ACTIVE_WITHIN = 21 * DAY;
const SNAPSHOT_MAX_AGE = 30 * DAY;

const generatedAt = Date.parse(activity.generatedAt);
const products = activity.products as Record<string, Entry>;

export function activityFor(name: string) {
  const entry = products[name];
  if (!entry?.lastCommit) return null;
  const last = Date.parse(entry.lastCommit);
  const fresh = Date.now() - generatedAt < SNAPSHOT_MAX_AGE;
  const active = fresh && generatedAt - last < ACTIVE_WITHIN;
  if (!active) return null;
  return {
    weekly: entry.weekly,
    lastFourWeeks: entry.weekly.slice(-4).reduce((a, b) => a + b, 0),
    lastCommit: new Date(last),
  };
}

/** The small pulsing dot on a shelf icon: green when commits back it, amber when set by hand. */
export function LiveDot({ tone = "live" }: { tone?: "live" | "progress" }) {
  const color = tone === "live" ? "bg-emerald-400" : "bg-amber-400";
  return (
    <span className="absolute -right-0.5 -top-0.5 flex h-3 w-3" aria-hidden>
      <span
        className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-60 motion-reduce:animate-none ${color}`}
      />
      <span
        className={`relative inline-flex h-3 w-3 rounded-full border-2 border-card ${color}`}
      />
    </span>
  );
}

/** "Building now" line plus a 12-week commit chart, for an active product. */
export function ActivityStrip({ name }: { name: string }) {
  const a = activityFor(name);
  if (!a) return null;
  const max = Math.max(...a.weekly, 1);
  const date = a.lastCommit.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return (
    <div
      data-testid={`activity-${name.toLowerCase()}`}
      className="mt-7 flex flex-wrap items-end gap-x-6 gap-y-4 border-t border-border pt-5"
    >
      <div>
        <p className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70 motion-reduce:animate-none" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          Building now
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          <span className="text-foreground/90">
            {a.lastFourWeeks.toLocaleString()} commits
          </span>{" "}
          in the last 4 weeks · last commit {date}
        </p>
      </div>
      <figure className="ml-auto">
        <div className="flex h-12 items-end gap-1" aria-hidden>
          {a.weekly.map((n, i) => (
            <span
              key={i}
              className="w-2.5 rounded-[2px]"
              style={{
                height: `${Math.max((n / max) * 100, n ? 8 : 4)}%`,
                background: n ? "var(--brand)" : "hsl(var(--border))",
                opacity: n ? 0.45 + (0.55 * n) / max : 1,
              }}
            />
          ))}
        </div>
        <figcaption className="mt-1.5 text-right font-mono text-[0.62rem] text-muted-foreground">
          commits / week · 12 weeks
        </figcaption>
      </figure>
    </div>
  );
}

/** A hand-set "In progress" line, for work that commits do not show yet. */
export function InProgressStrip({ name }: { name: string }) {
  return (
    <div
      data-testid={`in-progress-${name.toLowerCase()}`}
      className="mt-7 border-t border-border pt-5"
    >
      <p className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-700 dark:text-amber-300">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-70 motion-reduce:animate-none" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-500" />
        </span>
        In progress
      </p>
      <p className="mt-2 text-xs text-muted-foreground">
        The next version is being built.
      </p>
    </div>
  );
}
