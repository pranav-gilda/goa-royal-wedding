import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Scratch-to-reveal foil. The content sits underneath; a gold canvas covers it
 * and is erased with finger/mouse. Once ~45% is cleared the rest fades away.
 * A "Reveal" button is always available, so nobody is locked out.
 */
export default function Scratch({
  children,
  label = "Scratch to reveal",
  revealLabel = "Reveal",
  onReveal,
  className = "",
  radius = 24,
}: {
  children: ReactNode;
  label?: string;
  revealLabel?: string;
  onReveal?: () => void;
  className?: string;
  radius?: number;
}) {
  const box = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const last = useRef<{ x: number; y: number } | null>(null);
  const moves = useRef(0);
  const done = useRef(false);
  const [revealed, setRevealed] = useState(false);

  const finish = useCallback(() => {
    if (done.current) return;
    done.current = true;
    setRevealed(true);
    onReveal?.();
  }, [onReveal]);

  // Paint the foil once the box has a size.
  useEffect(() => {
    const el = box.current;
    const cv = canvas.current;
    if (!el || !cv) return;
    const paint = () => {
      if (drawing.current) return;
      const { width, height } = el.getBoundingClientRect();
      if (!width || !height) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      cv.width = Math.round(width * dpr);
      cv.height = Math.round(height * dpr);
      const ctx = cv.getContext("2d");
      if (!ctx) return;
      ctx.globalCompositeOperation = "source-over";
      ctx.scale(dpr, dpr);
      const g = ctx.createLinearGradient(0, 0, width, height);
      g.addColorStop(0, "#e9c46a");
      g.addColorStop(0.35, "#b8892b");
      g.addColorStop(0.6, "#f3dc8f");
      g.addColorStop(1, "#a97a22");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, width, height);
      ctx.strokeStyle = "rgba(255,255,255,0.14)";
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 7) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      ctx.fillStyle = "rgba(60,36,6,0.78)";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      // Shrink the label until it fits the foil, whatever the width.
      const text = `✦  ${label.toUpperCase()}  ✦`;
      const spacing = 3;
      let size = 20;
      for (; size > 10; size--) {
        ctx.font = `600 ${size}px "Cormorant Garamond", Georgia, serif`;
        if (ctx.measureText(text).width + spacing * text.length < width - 24) break;
      }
      try {
        (ctx as CanvasRenderingContext2D & { letterSpacing?: string }).letterSpacing = `${spacing}px`;
      } catch {
        /* older browsers: no letter spacing */
      }
      ctx.fillText(text, width / 2, height / 2);
    };
    paint();
    const ro = new ResizeObserver(paint);
    ro.observe(el);
    return () => ro.disconnect();
  }, [label]);

  function point(e: React.PointerEvent) {
    const r = canvas.current!.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  }

  function erase(e: React.PointerEvent) {
    const cv = canvas.current;
    const ctx = cv?.getContext("2d");
    if (!cv || !ctx) return;
    const p = point(e);
    const dpr = cv.width / cv.getBoundingClientRect().width;
    ctx.save();
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.globalCompositeOperation = "destination-out";
    ctx.lineWidth = radius * 2;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo((last.current ?? p).x, (last.current ?? p).y);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    ctx.restore();
    last.current = p;

    // Check progress every few strokes on a coarse grid (cheap).
    if (++moves.current % 6 === 0) {
      const w = 24;
      const h = 12;
      const probe = document.createElement("canvas");
      probe.width = w;
      probe.height = h;
      const pc = probe.getContext("2d");
      if (!pc) return;
      pc.drawImage(cv, 0, 0, w, h);
      const data = pc.getImageData(0, 0, w, h).data;
      let clear = 0;
      for (let i = 3; i < data.length; i += 4) if (data[i]! < 128) clear++;
      if (clear / (w * h) > 0.45) finish();
    }
  }

  return (
    <div ref={box} className={`relative overflow-hidden ${className}`}>
      <div className="h-full" aria-hidden={!revealed}>{children}</div>
      <canvas
        ref={canvas}
        aria-hidden="true"
        onPointerDown={(e) => {
          drawing.current = true;
          last.current = null;
          e.currentTarget.setPointerCapture(e.pointerId);
          erase(e);
        }}
        onPointerMove={(e) => drawing.current && erase(e)}
        onPointerUp={() => {
          drawing.current = false;
          last.current = null;
        }}
        onPointerCancel={() => {
          drawing.current = false;
          last.current = null;
        }}
        className={`absolute inset-0 h-full w-full cursor-pointer transition-opacity duration-700 ${
          revealed ? "pointer-events-none opacity-0" : "opacity-100"
        }`}
        style={{ touchAction: "none" }}
      />
      {revealed ? null : (
        <button
          type="button"
          onClick={finish}
          className="absolute bottom-1.5 right-2 z-10 rounded-sm bg-background/80 px-2 py-1 text-[11px] uppercase tracking-widest text-foreground/80 underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring"
        >
          {revealLabel}
        </button>
      )}
    </div>
  );
}
