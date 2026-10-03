import { useEffect, useId, useRef } from "react";

/**
 * Golden "sling ring" portal: a canvas of sparks whipping round a ring that
 * spins open, plus a rotating mandala drawn in SVG. Everything is drawn on
 * one small canvas with additive blending; it stops itself when unmounted
 * and draws only the static ring for reduced-motion visitors.
 */

type Spark = { x: number; y: number; vx: number; vy: number; life: number; decay: number; hue: number };

const TAU = Math.PI * 2;
const easeOutBack = (t: number) => {
  const c = 1.5;
  return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2);
};

export function SparkPortal({
  mode = "ring",
  intensity = 1,
  className = "",
}: {
  /** ring: continuous spinning portal. burst: one-off explosion from the centre. */
  mode?: "ring" | "burst";
  intensity?: number;
  className?: string;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const level = useRef(intensity);
  level.current = intensity;

  useEffect(() => {
    const cv = ref.current;
    const ctx = cv?.getContext("2d");
    if (!cv || !ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      const r = cv.getBoundingClientRect();
      cv.width = Math.max(1, Math.round(r.width * dpr));
      cv.height = Math.max(1, Math.round(r.height * dpr));
    };
    resize();
    window.addEventListener("resize", resize);

    const sparks: Spark[] = [];
    let raf = 0;
    const start = performance.now();
    let last = start;
    let burstDone = false;

    const frame = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const t = (now - start) / 1000;
      const w = cv.width / dpr;
      const h = cv.height / dpr;
      const cx = w / 2;
      const cy = h / 2;
      const k = level.current;
      const rMax = Math.min(w, h) * 0.4;
      const R = mode === "ring" ? rMax * (t < 1.1 ? Math.max(0, easeOutBack(t / 1.1)) : 1) : 0;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // fade the previous frame instead of clearing it: gives every spark a trail
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = reduce ? "rgba(0,0,0,1)" : "rgba(0,0,0,0.24)";
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";

      if (mode === "ring" && !reduce) {
        const n = Math.round(16 * k);
        for (let i = 0; i < n; i++) {
          const a = Math.random() * TAU;
          const sp = (240 + Math.random() * 280) * (0.5 + 0.5 * Math.min(1, t));
          sparks.push({
            x: cx + Math.cos(a) * R,
            y: cy + Math.sin(a) * R,
            vx: -Math.sin(a) * sp + Math.cos(a) * 25,
            vy: Math.cos(a) * sp + Math.sin(a) * 25,
            life: 1,
            decay: 1.3 + Math.random() * 1.6,
            hue: 36 + Math.random() * 16,
          });
        }
      }
      if (mode === "burst" && !burstDone && !reduce) {
        burstDone = true;
        for (let i = 0; i < 220; i++) {
          const a = Math.random() * TAU;
          const sp = 120 + Math.random() * 520;
          sparks.push({ x: cx, y: cy, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life: 1, decay: 0.7 + Math.random() * 0.9, hue: 34 + Math.random() * 20 });
        }
      }

      ctx.lineCap = "round";
      for (let i = sparks.length - 1; i >= 0; i--) {
        const p = sparks[i]!;
        const ox = p.x;
        const oy = p.y;
        p.vy += 160 * dt;
        p.vx *= 1 - 0.9 * dt;
        p.vy *= 1 - 0.9 * dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.life -= p.decay * dt;
        if (p.life <= 0) {
          sparks[i] = sparks[sparks.length - 1]!;
          sparks.pop();
          continue;
        }
        ctx.strokeStyle = `hsla(${p.hue},100%,${55 + 30 * p.life}%,${Math.min(1, p.life * 1.2) * Math.max(k, 0.25)})`;
        ctx.lineWidth = 1.1 + p.life * 1.3;
        ctx.beginPath();
        ctx.moveTo(ox, oy);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
      }
      if (sparks.length > 1400) sparks.splice(0, sparks.length - 1400);

      if (mode === "ring" && R > 2) {
        ctx.strokeStyle = `hsla(44,100%,72%,${0.55 * k})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(cx, cy, R, 0, TAU);
        ctx.stroke();
        ctx.strokeStyle = `hsla(40,100%,60%,${0.14 * k})`;
        ctx.lineWidth = 10;
        ctx.stroke();
      }

      if (mode === "burst" && burstDone && sparks.length === 0) return;
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [mode]);

  return <canvas ref={ref} aria-hidden="true" className={`pointer-events-none ${className}`} />;
}

/** Rotating mandala: tick ring, Devanagari blessing on a circular path, inner petals. */
export function Mandala({ className = "" }: { className?: string }) {
  const id = useId().replace(/:/g, "");
  const ticks = Array.from({ length: 72 }, (_, i) => i * 5);
  const petals = Array.from({ length: 12 }, (_, i) => i * 30);
  return (
    <svg viewBox="-100 -100 200 200" aria-hidden="true" className={className} fill="none" stroke="#e8c26a">
      <g className="mandala-spin">
        <circle r="97" strokeWidth=".5" opacity=".7" />
        <circle r="93" strokeWidth=".9" strokeDasharray="1 3.2" />
        {ticks.map((a) => (
          <line key={a} x1="0" y1="-86" x2="0" y2={a % 30 === 0 ? -91 : -88.5} strokeWidth=".6" transform={`rotate(${a})`} />
        ))}
      </g>
      <g className="mandala-spin-rev">
        <defs>
          <path id={`ring-${id}`} d="M 0 -72 A 72 72 0 1 1 -0.01 -72" />
        </defs>
        <circle r="80" strokeWidth=".5" opacity=".6" />
        <text fill="#f3dc8f" stroke="none" fontSize="8.4" letterSpacing="1.4" style={{ fontFamily: "'Tiro Devanagari Hindi', serif" }}>
          <textPath href={`#ring-${id}`}>॥ शुभ विवाह ॥ हृदय से नाता ॥ ऋषिकेश ♥ नंदिता ॥ शुभ विवाह ॥ हृदय से नाता ॥</textPath>
        </text>
        <circle r="62" strokeWidth=".5" opacity=".6" />
      </g>
      <g className="mandala-spin">
        {petals.map((a) => (
          <ellipse key={a} cx="0" cy="-44" rx="5.5" ry="14" strokeWidth=".7" transform={`rotate(${a})`} />
        ))}
        <circle r="28" strokeWidth=".8" strokeDasharray="2 2.5" />
      </g>
    </svg>
  );
}
