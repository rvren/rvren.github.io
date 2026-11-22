#!/usr/bin/env node
// Snapshot each product's recent commit activity into src/data/activity.json.
//
// Several product repos are private, so the static site cannot ask GitHub itself.
// Run this locally (it uses your `gh` login) before deploying:  npm run activity
//
// Per product: commits per week for the last 12 weeks, summed across its repos,
// and the date of the latest commit on any of them.

import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";

const OWNER = "rvren";
const WEEKS = 12;
const WEEK_MS = 7 * 86_400_000;
const SNAPSHOT = new URL("../src/data/activity.json", import.meta.url);
const previous = JSON.parse(readFileSync(SNAPSHOT, "utf8"));

// GitHub's weekly buckets start on Sunday (UTC).
function weekStart(ms) {
  const d = new Date(ms);
  return Date.UTC(
    d.getUTCFullYear(),
    d.getUTCMonth(),
    d.getUTCDate() - d.getUTCDay(),
  );
}

// The last known history of a product, moved along so each bar stays on its own week.
function carriedOver(name, now) {
  const entry = previous.products?.[name];
  if (!entry) return null;
  const elapsed = Math.round(
    (weekStart(now) - weekStart(Date.parse(previous.generatedAt))) / WEEK_MS,
  );
  const weekly = [
    ...entry.weekly.slice(elapsed),
    ...new Array(elapsed).fill(0),
  ];
  return { weekly: weekly.slice(-WEEKS), lastCommit: entry.lastCommit };
}

// Product name (as in src/data/projects.ts) → the repos its work lands in.
const PRODUCTS = {
  Windtunnel: ["windtunnel"],
  Apogee: ["apogee"],
  plinth: ["plinth"],
  // The Sightglass app's source lives in history-lens; getsightglass is its site.
  Sightglass: ["history-lens", "getsightglass"],
  BuildBoard: ["buildboard"],
  OpenHub: ["openhub"],
};

function gh(path) {
  return JSON.parse(execFileSync("gh", ["api", path], { encoding: "utf8" }));
}

// GitHub computes repo statistics lazily and answers {} until they are ready.
async function weekly(repo) {
  for (let attempt = 0; attempt < 8; attempt++) {
    const stats = gh(`repos/${OWNER}/${repo}/stats/participation`);
    if (Array.isArray(stats.all)) return stats.all.slice(-WEEKS);
    await new Promise((r) => setTimeout(r, 2000));
  }
  throw new Error(
    `GitHub did not return statistics for ${repo}; run again in a minute.`,
  );
}

const out = {
  generatedAt: new Date().toISOString(),
  weeks: WEEKS,
  products: {},
};

for (const [name, repos] of Object.entries(PRODUCTS)) {
  const sum = new Array(WEEKS).fill(0);
  let lastCommit = null;
  try {
    for (const repo of repos) {
      (await weekly(repo)).forEach((n, i) => (sum[i] += n));
      const [latest] = gh(`repos/${OWNER}/${repo}/commits?per_page=1`);
      const at =
        latest?.commit?.committer?.date ?? latest?.commit?.author?.date;
      if (at && (!lastCommit || at > lastCommit)) lastCommit = at;
    }
  } catch (e) {
    // A repo the token cannot see answers 404. Keep that product's last known history
    // so it cannot stop the refresh for the others or lose its chart.
    if (!/HTTP 404/.test(`${e.stderr ?? ""}${e.message}`)) throw e;
    const kept = carriedOver(name, Date.parse(out.generatedAt));
    if (kept) out.products[name] = kept;
    console.warn(
      `${name.padEnd(11)} kept last snapshot: this token cannot read its repo`,
    );
    continue;
  }
  out.products[name] = { weekly: sum, lastCommit };
  console.log(
    `${name.padEnd(11)} ${sum.join(" ").padEnd(40)} last ${lastCommit}`,
  );
}

writeFileSync(SNAPSHOT, JSON.stringify(out, null, 2) + "\n");
console.log("wrote src/data/activity.json");
