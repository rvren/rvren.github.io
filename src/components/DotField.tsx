import { useEffect, useRef } from "react";

/**
 * A quiet grid of dots behind the home page. Dots near the pointer lift, grow and
 * drift away from it; everything else stays still. Colour follows the theme's
 * --foreground token, so it works on both grounds. Static under reduced motion.
 */
export function DotField() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const GAP = 22;
    const RADIUS = 170;
    let w = 0;
    let h = 0;
    let rgb = "236,232,222";
    let raf = 0;
    // eased pointer, and its target
    const p = { x: -9999, y: -9999 };
    const t = { x: -9999, y: -9999 };

    const readColor = () => {
      const v = getComputedStyle(document.documentElement)
        .getPropertyValue("--foreground")
        .trim();
      const probe = document.createElement("span");
      probe.style.color = `hsl(${v})`;
      document.body.appendChild(probe);
      const c = getComputedStyle(probe).color.match(/\d+(\.\d+)?/g);
      probe.remove();
      if (c) rgb = c.slice(0, 3).join(",");
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
    };

    const draw = () => {
      p.x += (t.x - p.x) * 0.12;
      p.y += (t.y - p.y) * 0.12;
      ctx.clearRect(0, 0, w, h);
      const ox = (w % GAP) / 2;
      const oy = (h % GAP) / 2;
      for (let y = oy; y < h; y += GAP) {
        for (let x = ox; x < w; x += GAP) {
          const dx = x - p.x;
          const dy = y - p.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          const k = d < RADIUS ? 1 - d / RADIUS : 0;
          const e = k * k;
          const push = e * 7;
          const nx = d > 0 ? x + (dx / d) * push : x;
          const ny = d > 0 ? y + (dy / d) * push : y;
          ctx.fillStyle = `rgba(${rgb},${0.15 + e * 0.5})`;
          ctx.beginPath();
          ctx.arc(nx, ny, 0.8 + e * 1.1, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      const settled = Math.abs(t.x - p.x) < 0.3 && Math.abs(t.y - p.y) < 0.3;
      raf = settled ? 0 : requestAnimationFrame(draw);
    };

    const kick = () => {
      if (!raf) raf = requestAnimationFrame(draw);
    };

    const onMove = (e: PointerEvent) => {
      t.x = e.clientX;
      t.y = e.clientY;
      if (p.x < -9000) {
        p.x = t.x;
        p.y = t.y;
      }
      kick();
    };
    const onLeave = () => {
      t.x = t.y = p.x = p.y = -9999;
      kick();
    };

    readColor();
    resize();
    draw();

    const onResize = () => {
      resize();
      kick();
    };
    window.addEventListener("resize", onResize);
    const themeObserver = new MutationObserver(() => {
      readColor();
      kick();
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    if (!reduce) {
      window.addEventListener("pointermove", onMove, { passive: true });
      document.addEventListener("pointerleave", onLeave);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      themeObserver.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 [mask-image:linear-gradient(to_bottom,black,black_55%,transparent)]"
    />
  );
}
