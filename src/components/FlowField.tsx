import { useEffect, useRef } from "react";

const MAX_THREADS = 800;
const AREA_PER_THREAD = 1500;
const SWIRL_RADIUS = 190;
const BURST_RADIUS = 260;
const STILL_FRAMES = 120;
const TOUCH_GLOW_MS = 900;

type Thread = { x: number; y: number; vx: number; vy: number; life: number };

function toRgb(color: string) {
  const probe = document.createElement("span");
  probe.style.color = color;
  document.body.appendChild(probe);
  const parts = getComputedStyle(probe).color.match(/\d+(\.\d+)?/g);
  probe.remove();
  return parts ? parts.slice(0, 3).join(",") : "236,232,222";
}

const foreground = () =>
  toRgb(
    `hsl(${getComputedStyle(document.documentElement).getPropertyValue("--foreground").trim()})`,
  );

/**
 * The home page background: fine threads drift on a slow current. They swirl
 * around the pointer in the selected product's colour and burst away from a click
 * or tap. A still image under reduced motion; paused in a hidden tab.
 */
export function FlowField({ accent }: { accent: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const accentRef = useRef("167,139,250");

  useEffect(() => {
    accentRef.current = toRgb(accent);
  }, [accent]);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    let w = 0;
    let h = 0;
    let fg = foreground();
    let raf = 0;
    let touchTimer = 0;
    let threads: Thread[] = [];
    const pointer = { x: -9999, y: -9999, on: false };

    const seed = (t: Thread) => {
      t.x = Math.random() * w;
      t.y = Math.random() * h;
      t.vx = 0;
      t.vy = 0;
      t.life = 80 + Math.random() * 220;
    };

    const frame = (time: number) => {
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = "rgba(0,0,0,0.06)";
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = "source-over";
      ctx.lineWidth = 0.8;

      for (const t of threads) {
        const angle =
          Math.sin(t.x * 0.0032 + time * 0.00012) * 1.7 +
          Math.cos(t.y * 0.0041 - time * 0.00009) * 1.7;
        let fx = Math.cos(angle) * 0.07;
        let fy = Math.sin(angle) * 0.07;
        let lit = 0;
        if (pointer.on) {
          const dx = t.x - pointer.x;
          const dy = t.y - pointer.y;
          const d = Math.hypot(dx, dy) || 1;
          if (d < SWIRL_RADIUS) {
            const k = 1 - d / SWIRL_RADIUS;
            fx += ((-dy / d) * 0.55 + (dx / d) * 0.12) * k;
            fy += ((dx / d) * 0.55 + (dy / d) * 0.12) * k;
            lit = k;
          }
        }
        t.vx = (t.vx + fx) * 0.93;
        t.vy = (t.vy + fy) * 0.93;
        const x = t.x + t.vx;
        const y = t.y + t.vy;
        ctx.strokeStyle =
          lit > 0.05
            ? `rgba(${accentRef.current},${0.25 + lit * 0.65})`
            : `rgba(${fg},0.17)`;
        ctx.beginPath();
        ctx.moveTo(t.x, t.y);
        ctx.lineTo(x, y);
        ctx.stroke();
        t.x = x;
        t.y = y;
        t.life -= 1;
        if (t.life < 0 || x < 0 || y < 0 || x > w || y > h) seed(t);
      }
    };

    const drawStill = () => {
      for (let i = 0; i < STILL_FRAMES; i++) frame(i * 16);
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(
        Math.round((w * h) / AREA_PER_THREAD),
        MAX_THREADS,
      );
      threads = Array.from({ length: count }, () => {
        const t = { x: 0, y: 0, vx: 0, vy: 0, life: 0 };
        seed(t);
        return t;
      });
      if (reduce) drawStill();
    };

    const loop = (time: number) => {
      frame(time);
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
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.on = true;
    };
    const onDown = (e: PointerEvent) => {
      window.clearTimeout(touchTimer);
      aim(e);
      for (const t of threads) {
        const dx = t.x - e.clientX;
        const dy = t.y - e.clientY;
        const d = Math.hypot(dx, dy) || 1;
        if (d < BURST_RADIUS) {
          const force = (1 - d / BURST_RADIUS) * 9;
          t.vx += (dx / d) * force;
          t.vy += (dy / d) * force;
        }
      }
    };
    const release = () => {
      window.clearTimeout(touchTimer);
      pointer.on = false;
    };
    // A tap is instant, so hold the colour for a moment to let it show.
    const onUp = (e: PointerEvent) => {
      if (e.pointerType === "mouse") return;
      window.clearTimeout(touchTimer);
      touchTimer = window.setTimeout(release, TOUCH_GLOW_MS);
    };
    // Lifting a finger also fires pointerleave; only a mouse really leaves.
    const onLeave = (e: PointerEvent) => {
      if (e.pointerType === "mouse") release();
    };
    const onVisibility = () => (document.hidden ? stop() : start());
    // A phone's address bar changes the height while scrolling; do not restart for it.
    const onResize = () => {
      if (window.innerWidth === w && Math.abs(window.innerHeight - h) < 140)
        return;
      resize();
    };
    const themeObserver = new MutationObserver(() => {
      fg = foreground();
      if (reduce) {
        ctx.clearRect(0, 0, w, h);
        drawStill();
      }
    });

    resize();
    start();
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    window.addEventListener("resize", onResize);
    if (!reduce) {
      window.addEventListener("pointermove", aim, { passive: true });
      window.addEventListener("pointerdown", onDown, { passive: true });
      window.addEventListener("pointerup", onUp, { passive: true });
      window.addEventListener("pointercancel", release, { passive: true });
      document.documentElement.addEventListener("pointerleave", onLeave);
      document.addEventListener("visibilitychange", onVisibility);
    }

    return () => {
      stop();
      window.clearTimeout(touchTimer);
      themeObserver.disconnect();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", aim);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", release);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden
      data-testid="flow-field"
      className="pointer-events-none fixed inset-0 z-0 [mask-image:linear-gradient(to_bottom,black,black_60%,rgba(0,0,0,0.25))]"
    />
  );
}
