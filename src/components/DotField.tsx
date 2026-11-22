import { useEffect, useRef } from "react";

const GAP = 22;
const RADIUS = 180;
const LINK_DISTANCE = 44;
const SPRING = 0.06;
const DAMPING = 0.84;
const RIPPLE_SPEED = 7;
const RIPPLE_WIDTH = 70;
const RIPPLE_LIFE = 900;
const MAX_RIPPLES = 5;

type Ripple = { x: number; y: number; r: number };

function toRgb(color: string) {
  const probe = document.createElement("span");
  probe.style.color = color;
  document.body.appendChild(probe);
  const parts = getComputedStyle(probe).color.match(/\d+(\.\d+)?/g);
  probe.remove();
  return parts ? parts.slice(0, 3).join(",") : "236,232,222";
}

/**
 * The home page background: a grid of dots on springs. The pointer pushes them
 * aside, lights them in the selected product's colour and links the nearest ones.
 * A click or tap sends a ripple through the grid, and a slow wave keeps it alive
 * when nobody touches it. Static under reduced motion; paused in a hidden tab.
 */
export function DotField({ accent }: { accent?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const accentRef = useRef({ rgb: "167,139,250", source: "" });

  useEffect(() => {
    if (accent && accent !== accentRef.current.source) {
      accentRef.current = { rgb: toRgb(accent), source: accent };
    }
  }, [accent]);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    let w = 0;
    let h = 0;
    let cols = 0;
    let count = 0;
    let rgb = "236,232,222";
    let raf = 0;
    let homeX = new Float32Array(0);
    let homeY = new Float32Array(0);
    let offX = new Float32Array(0);
    let offY = new Float32Array(0);
    let velX = new Float32Array(0);
    let velY = new Float32Array(0);
    let glow = new Float32Array(0);
    const ripples: Ripple[] = [];
    const pointer = { x: -9999, y: -9999, on: false };
    const eased = { x: -9999, y: -9999 };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      cols = Math.ceil(w / GAP);
      const rows = Math.ceil(h / GAP);
      count = cols * rows;
      homeX = new Float32Array(count);
      homeY = new Float32Array(count);
      offX = new Float32Array(count);
      offY = new Float32Array(count);
      velX = new Float32Array(count);
      velY = new Float32Array(count);
      glow = new Float32Array(count);
      const ox = (w - (cols - 1) * GAP) / 2;
      const oy = (h - (rows - 1) * GAP) / 2;
      for (let i = 0; i < count; i++) {
        homeX[i] = ox + (i % cols) * GAP;
        homeY[i] = oy + Math.floor(i / cols) * GAP;
      }
    };

    const step = (time: number) => {
      eased.x += (pointer.x - eased.x) * 0.18;
      eased.y += (pointer.y - eased.y) * 0.18;

      for (const ripple of ripples) ripple.r += RIPPLE_SPEED;
      while (ripples.length && ripples[0].r > RIPPLE_LIFE) ripples.shift();

      for (let i = 0; i < count; i++) {
        const x = homeX[i];
        const y = homeY[i];
        let fx = 0;
        let fy = 0;
        let light = 0;

        if (pointer.on) {
          const dx = x - eased.x;
          const dy = y - eased.y;
          const d = Math.hypot(dx, dy);
          if (d < RADIUS && d > 0) {
            const k = 1 - d / RADIUS;
            const e = k * k;
            fx += (dx / d) * e * 1.5;
            fy += (dy / d) * e * 1.5;
            light = e;
          }
        }

        for (const ripple of ripples) {
          const dx = x - ripple.x;
          const dy = y - ripple.y;
          const d = Math.hypot(dx, dy);
          const band = 1 - Math.abs(d - ripple.r) / RIPPLE_WIDTH;
          if (band > 0 && d > 0) {
            const fade = 1 - ripple.r / RIPPLE_LIFE;
            fx += (dx / d) * band * fade * 2.6;
            fy += (dy / d) * band * fade * 2.6;
            light = Math.max(light, band * fade);
          }
        }

        const wave = Math.sin(x * 0.009 + y * 0.006 + time * 0.0007);
        velX[i] = (velX[i] + fx - offX[i] * SPRING) * DAMPING;
        velY[i] = (velY[i] + fy + wave * 0.035 - offY[i] * SPRING) * DAMPING;
        offX[i] += velX[i];
        offY[i] += velY[i];
        glow[i] += (light - glow[i]) * 0.16;
      }
    };

    const paint = () => {
      const accentRgb = accentRef.current.rgb;
      ctx.clearRect(0, 0, w, h);

      // Resting dots share one path, so the full grid stays cheap to draw.
      ctx.fillStyle = `rgba(${rgb},0.16)`;
      ctx.beginPath();
      for (let i = 0; i < count; i++) {
        if (glow[i] > 0.03) continue;
        const x = homeX[i] + offX[i];
        const y = homeY[i] + offY[i];
        ctx.moveTo(x + 0.8, y);
        ctx.arc(x, y, 0.8, 0, Math.PI * 2);
      }
      ctx.fill();

      ctx.lineWidth = 0.7;
      for (let i = 0; i < count; i++) {
        const g = glow[i];
        if (g <= 0.03) continue;
        const x = homeX[i] + offX[i];
        const y = homeY[i] + offY[i];

        // Link to the right and lower neighbours while both are lit.
        for (const j of [i + 1, i + cols]) {
          if (j >= count || (j === i + 1 && j % cols === 0)) continue;
          if (glow[j] <= 0.12 || g <= 0.12) continue;
          const nx = homeX[j] + offX[j];
          const ny = homeY[j] + offY[j];
          if (Math.hypot(nx - x, ny - y) > LINK_DISTANCE) continue;
          ctx.strokeStyle = `rgba(${accentRgb},${Math.min(g, glow[j]) * 0.42})`;
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(nx, ny);
          ctx.stroke();
        }

        ctx.fillStyle = `rgba(${accentRgb},${Math.min(0.2 + g * 0.8, 0.95)})`;
        ctx.beginPath();
        ctx.arc(x, y, 0.8 + g * 1.6, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const loop = (time: number) => {
      step(time);
      paint();
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (!reduce && !raf && !document.hidden)
        raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    const aim = (e: PointerEvent) => {
      if (!pointer.on) {
        eased.x = e.clientX;
        eased.y = e.clientY;
      }
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.on = true;
    };
    const onDown = (e: PointerEvent) => {
      aim(e);
      ripples.push({ x: e.clientX, y: e.clientY, r: 0 });
      if (ripples.length > MAX_RIPPLES) ripples.shift();
    };
    const release = () => {
      pointer.on = false;
    };
    const onUp = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") release();
    };
    const onVisibility = () => (document.hidden ? stop() : start());
    const onResize = () => {
      resize();
      paint();
    };

    rgb = toRgb(
      `hsl(${getComputedStyle(document.documentElement).getPropertyValue("--foreground").trim()})`,
    );
    resize();
    paint();
    start();

    window.addEventListener("resize", onResize);
    const themeObserver = new MutationObserver(() => {
      rgb = toRgb(
        `hsl(${getComputedStyle(document.documentElement).getPropertyValue("--foreground").trim()})`,
      );
      paint();
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    if (!reduce) {
      window.addEventListener("pointermove", aim, { passive: true });
      window.addEventListener("pointerdown", onDown, { passive: true });
      window.addEventListener("pointerup", onUp, { passive: true });
      window.addEventListener("pointercancel", release, { passive: true });
      document.documentElement.addEventListener("pointerleave", release);
      document.addEventListener("visibilitychange", onVisibility);
    }

    return () => {
      stop();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", aim);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", release);
      document.documentElement.removeEventListener("pointerleave", release);
      document.removeEventListener("visibilitychange", onVisibility);
      themeObserver.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden
      data-testid="dot-field"
      className="pointer-events-none fixed inset-0 z-0 [mask-image:linear-gradient(to_bottom,black,black_60%,rgba(0,0,0,0.25))]"
    />
  );
}
