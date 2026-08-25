import { useEffect, useState } from "react";
import { product } from "@/data/sightglass";

// The releases repo name is frozen at `cadence-releases`: existing installs
// already poll it, so renaming it there would break auto-update for everyone
// running the app. The product is Sightglass; the bucket keeps its old name.
export const RELEASES_URL = product.releasesUrl;
const LATEST_API = product.latestApi;

/**
 * Resolve direct DMG download URLs for the latest release from the public GitHub
 * API. A universal build serves both architectures; falls back to the releases
 * page if the request fails or is rate-limited.
 */
export interface MacBuild {
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

export function useLatestMacDownloads(): { armLink?: string; intelLink?: string; builds: MacBuild[]; version?: string } {
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

export function useMacArch(): "arm64" | "x64" | null {
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
