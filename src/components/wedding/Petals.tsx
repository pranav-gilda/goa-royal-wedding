/**
 * Slowly drifting marigold petals. Pure CSS transforms (compositor only),
 * fixed positions (no Math.random, so server and client agree), hidden for
 * visitors who prefer reduced motion.
 */
const PETALS = [
  { left: 6, size: 12, dur: 17, delay: 0, drift: 26 },
  { left: 17, size: 9, dur: 21, delay: 6, drift: -20 },
  { left: 29, size: 14, dur: 19, delay: 2, drift: 30 },
  { left: 41, size: 10, dur: 23, delay: 9, drift: -26 },
  { left: 54, size: 13, dur: 18, delay: 4, drift: 22 },
  { left: 66, size: 9, dur: 22, delay: 11, drift: -30 },
  { left: 78, size: 12, dur: 20, delay: 1, drift: 24 },
  { left: 90, size: 10, dur: 24, delay: 7, drift: -22 },
];

export default function Petals({ count = 8, className = "" }: { count?: number; className?: string }) {
  return (
    <div aria-hidden="true" className={`petals pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      {PETALS.slice(0, count).map((p, i) => (
        <span
          key={i}
          className="petal"
          style={
            {
              left: `${p.left}%`,
              width: p.size,
              height: p.size * 1.3,
              animationDuration: `${p.dur}s`,
              animationDelay: `-${p.delay}s`,
              "--drift": `${p.drift}px`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
