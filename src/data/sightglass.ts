/**
 * Sightglass — the product page's content, in one place.
 *
 * Every number here is checked against the app's source, not estimated. The
 * page this feeds is a claim about software someone is about to install, so a
 * flattering number that turns out to be wrong costs more than a modest one
 * that is right. Where the app is deliberately unfinished — the Cloud tiers —
 * this says so rather than implying a backend that does not exist.
 *
 * Last reconciled against history-lens @ 0.3.159:
 *   10 screens (App.tsx NAV_ITEMS) · 7 skins (lib/skins.ts) ·
 *   61 catalogued features, 55 local + 6 opt-in (lib/featureCatalog.ts) ·
 *   9 browsers (main/browsers.ts)
 */

export const product = {
  name: "Sightglass",
  tagline: "See where your attention goes.",
  /** One paragraph, for the page hero and the portfolio card alike. */
  summary:
    "A local-first macOS app that puts a focus timer and your own browsing, app and calendar history in one place — then tells you something true about your day. Everything is computed on your machine; nothing is uploaded.",
  platform: "macOS 12+ · Apple Silicon and Intel",
  releasesUrl: "https://github.com/rvren/cadence-releases/releases/latest",
  latestApi: "https://api.github.com/repos/rvren/cadence-releases/releases/latest",
} as const;

/** The claim the whole product rests on, said plainly. */
export const premise = [
  "Time-tracking apps know what you opened. Focus apps know when you sat down. Neither knows both, because the honest version has to run on your machine — and almost nothing does.",
  "Sightglass reads your browser history, app usage and calendar locally, keeps them in one SQLite file you own, and derives every number from that. No account, no upload, no telemetry. Unplug the network and it still works.",
];

export interface Screen {
  name: string;
  blurb: string;
  detail: string;
}

/** The ten screens, as the app's own nav orders them. */
export const screens: Screen[] = [
  {
    name: "Today",
    blurb: "One briefing, not a dashboard",
    detail:
      "A single composed read on the day: your score, what's open on the calendar, the tasks worth doing, and one rotating insight that is different each time you open it.",
  },
  {
    name: "Focus",
    blurb: "A Pomodoro timer that knows what you did",
    detail:
      "Configurable intervals, a floating always-on-top mini timer, offline ambient sound, session tasks and a distraction parking lot — with every session recorded against what you actually browsed.",
  },
  {
    name: "Calendar",
    blurb: "The shape of your day",
    detail:
      "A true-to-scale timeline where a meeting's width is its length, overlapping invites stack rather than hide, and free stretches are drawn across the whole day. Upcoming days show what's booked next to what that weekday usually costs you.",
  },
  {
    name: "Wellbeing",
    blurb: "Scores, budgets, streaks — and Pulse",
    detail:
      "A weekly wellbeing score, per-category budgets, forgiving streaks, and Pulse: a live read on cognitive load and day strain that tells flow from frayed. Not a heart rate — it is derived from how you are actually working.",
  },
  {
    name: "Insights",
    blurb: "Your tools, read on device",
    detail:
      "Optional connections to GitHub, Jira, Slack and Google Workspace. Credentials stay in the Mac's keychain and never reach the interface; each run is logged where you can see it.",
  },
  {
    name: "Apps",
    blurb: "Where the desktop time goes",
    detail:
      "Real app usage by name, with daily limits you can set per app and a gentle in-app nudge as you approach one — not a bare system notification you'll dismiss without reading.",
  },
  {
    name: "Work",
    blurb: "The things you actually worked on",
    detail:
      "Pull requests, tickets and builds recovered from URLs already in your history — no integration required. Drill into any one of them for how many separate days it kept pulling you back.",
  },
  {
    name: "Atlas",
    blurb: "A map of your attention",
    detail:
      "Your sites, apps and projects as a treemap where area is the time, paired with claims the map itself is the evidence for. Step through them and the map lights up the territory each one is about.",
  },
  {
    name: "Trends",
    blurb: "The numbers behind your browsing",
    detail:
      "Summary, timeline, categories and sessions across your whole history, plus a per-domain deep dive for any site you visit — first seen, return rhythm, time of day, and the pages within it.",
  },
  {
    name: "Settings & Data",
    blurb: "It is your database",
    detail:
      "Export anything as CSV, JSON, Markdown or HTML. Exclude domains so they are never stored at all, set a retention window, back up or restore the database, or delete the lot.",
  },
];

export interface Metric {
  name: string;
  what: string;
  honesty: string;
}

/** The signature numbers — each with the thing it deliberately does not claim. */
export const metrics: Metric[] = [
  {
    name: "Sightglass Score",
    what: "One 0–100 read on the day, with a grade and a trend against your own rolling average. Blends focus against your goal, how undistracted that focus was, how deep the longest stretch went, and consistency.",
    honesty:
      "Compared only to your own past. There is no leaderboard and no benchmark, because a score that cannot be computed against a colleague cannot later be turned into one.",
  },
  {
    name: "Pulse",
    what: "A live stress read — cognitive load now, strain accumulated today, and a state from recovering through flow to frayed.",
    honesty:
      "Derived from measured activity and context-switching, not from a wearable. It never reports a heart rate, because it cannot know one.",
  },
  {
    name: "Work objects",
    what: "The pull requests, tickets and builds in your history, grouped by the thing rather than the site — so 1,100 visits to github.com become the actual list of what you were working on.",
    honesty:
      "Opening a page is attention, not authorship. It reports what you kept returning to, never that you wrote or merged it.",
  },
  {
    name: "Shipping health",
    what: "A narrower engineering read that scores only the components it can measure, and shows you which ones those are.",
    honesty:
      "A signal it cannot see is dropped and the rest rescaled — never counted as zero. A day you didn't run the timer is unmeasured, not a bad day.",
  },
];

/** What is genuinely on-device, and what is opt-in. Stated as a boundary. */
export const privacy = {
  local: [
    "Browser history, app usage, focus sessions and calendar events live in one SQLite file in your Application Support folder.",
    "Every score, chart and insight is computed on your machine from that file.",
    "No account. No sign-up. No analytics, crash reporting or telemetry of any kind.",
    "Works fully offline — the network is only ever touched by the things listed opposite.",
  ],
  outbound: [
    "The update check, against the public GitHub releases page.",
    "Google Calendar sync, if you connect a calendar.",
    "GitHub, Jira, Slack or Google Workspace, if you connect them — tokens stay in the keychain.",
    "Claude, only if you supply your own Anthropic API key, and only for the insight you asked for.",
  ],
  note:
    "Each of those is off until you turn it on, individually. The app carries a “what leaves your device” panel that lists exactly what was sent, where and why — and turning any of it off puts you back to fully local.",
};

export const browsers = [
  "Chrome",
  "Safari",
  "Firefox",
  "Edge",
  "Brave",
  "Arc",
  "Opera",
  "Vivaldi",
  "Chromium",
];

/** Seven curated skins. The app deliberately does not ship dozens. */
export const skins: { name: string; tag: string; colors: [string, string, string] }[] = [
  { name: "Sightglass", tag: "The signature look", colors: ["#0d0f12", "#e8eaed", "#1b1f24"] },
  { name: "Cupertino", tag: "Light and familiar", colors: ["#f5f5f7", "#0071e3", "#ffffff"] },
  { name: "Frost", tag: "Cool and airy", colors: ["#f2f6fa", "#3b82f6", "#ffffff"] },
  { name: "Noir", tag: "Black and white", colors: ["#0f0f0f", "#f4f4f4", "#232323"] },
  { name: "Carbon", tag: "Deep neutral", colors: ["#121214", "#a1a1aa", "#1e1e22"] },
  { name: "Onyx Green", tag: "Terminal green", colors: ["#0a0f0a", "#4ade80", "#16281a"] },
  { name: "Ion", tag: "Electric accent", colors: ["#0b1020", "#7c8cff", "#151c33"] },
];

/** Counts quoted on the page. Kept here so they are updated together. */
export const counts = {
  screens: 10,
  features: 61,
  localFeatures: 55,
  optInFeatures: 6,
  skins: 7,
  browsers: 9,
} as const;
