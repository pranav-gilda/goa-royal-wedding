import { useEffect, useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll, useSpring, useTransform } from "motion/react";
import { GoldDivider, Reveal } from "./decor";
import { Bubble } from "./Guide";
import { Avatar } from "./Avatars";
import Story from "./Story";

/**
 * Everything after the intro, as one continuous scroll:
 * Our Story → Day 1 (pins; scrolling down moves the events left→right) →
 * Day 2 (same) → the page carries on to Travel and RSVP.
 */

type WeddingEvent = {
  time: string;
  name: string;
  hindi: string;
  sub?: string;
  desc: string;
  color: string;
  /** Shown as "(Dress code: …)". Leave out for events without one. */
  dress?: string;
};

type Day = { n: 1 | 2; hindi: string; date: string; dateHindi: string; short: string; line: { text: string; hint: string }; events: WeddingEvent[] };

// Names, times, descriptions and colours follow the family's itinerary PDF.
const DAYS: Day[] = [
  {
    n: 1,
    hindi: "पहला दिन",
    date: "Tuesday · 1 December 2026",
    dateHindi: "मंगलवार · १ दिसंबर २०२६",
    short: "Tue, 1 Dec",
    line: { text: "Do din, saat utsav. Bag bhar ke aana!", hint: "Two days, seven celebrations." },
    events: [
      { time: "2:00 – 5:00 PM", name: "Maayra", hindi: "मायरा", desc: "A celebration of love, gifts and togetherness.", color: "#9b1b3a" },
      { time: "6:30 – 10:00 PM", name: "Sangeet", hindi: "संगीत", desc: "An evening of music, dance and unforgettable performances.", color: "#4b1d7a" },
      { time: "10:00 PM onwards", name: "After Party", hindi: "उत्सव", desc: "Let the music keep you alive!", color: "#1c2f6b" },
    ],
  },
  {
    n: 2,
    hindi: "दूसरा दिन",
    date: "Wednesday · 2 December 2026",
    dateHindi: "बुधवार · २ दिसंबर २०२६",
    short: "Wed, 2 Dec",
    line: { text: "Aaj shaadi hai! Baaraat mein naachna zaroor!", hint: "It's the big day!" },
    events: [
      { time: "9:00 AM – 12:00 PM", name: "Boho Carnival", hindi: "उत्सव", desc: "Fun games, boho vibes and a perfect start to the day!", color: "#a4501c" },
      { time: "2:00 – 5:00 PM", name: "Baaraat", hindi: "बारात", desc: "Let the celebration ride in with joy and energy!", color: "#1c2f6b" },
      { time: "5:50 PM", name: "Jaimala", hindi: "जयमाला", desc: "Two hearts, one promise for a lifetime.", color: "#9b1b3a" },
      { time: "6:40 – 11:00 PM", name: "Phera", hindi: "फेरे", desc: "Promises, blessings and a celebration to remember forever.", color: "#4b1d7a" },
    ],
  },
];

/** Vertical scroll budget per event, in svh. Lower = faster sideways movement. */
const PER_PANEL = 85;
/** Share of each step where the track rests with a card centred, so it can be read. */
const HOLD = 0.45;

function DayScroller({ day }: { day: Day }) {
  const dark = day.n === 2;
  const ref = useRef<HTMLDivElement>(null);
  const panels = day.events.length + 1; // title panel + one per event
  const [pw, setPw] = useState(100); // panel width in vw (narrower on desktop so neighbours peek in)
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const set = () => setPw(mq.matches ? 52 : 100);
    set();
    mq.addEventListener("change", set);
    return () => mq.removeEventListener("change", set);
  }, []);

  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] });

  // Sideways input drives the same track: the page's vertical scroll is the single source of truth,
  // so horizontal wheel / swipe / arrow keys are translated into vertical scrolling.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const restTop = (k: number) => {
      const top = el.getBoundingClientRect().top + window.scrollY;
      const travel = el.offsetHeight - window.innerHeight;
      return top + (Math.max(0, Math.min(panels - 1, k)) / (panels - 1)) * travel;
    };
    const current = () => Math.round(p.get() * (panels - 1));
    const pinned = () => {
      const r = el.getBoundingClientRect();
      return r.top <= 1 && r.bottom >= window.innerHeight - 1;
    };
    const goTo = (k: number) => window.scrollTo({ top: restTop(k), behavior: "smooth" });

    // Trackpad / shift+wheel: move continuously, one panel width ≈ one panel of vertical scroll.
    const onWheel = (e: WheelEvent) => {
      if (!pinned() || Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      e.preventDefault();
      const ratio = (PER_PANEL * window.innerHeight) / (pw * window.innerWidth);
      window.scrollBy({ top: e.deltaX * ratio });
    };

    // Touch: a sideways swipe glides to the next / previous event.
    let sx = 0;
    let sy = 0;
    const onStart = (e: TouchEvent) => {
      sx = e.touches[0]!.clientX;
      sy = e.touches[0]!.clientY;
    };
    const onEnd = (e: TouchEvent) => {
      const t = e.changedTouches[0]!;
      const dx = t.clientX - sx;
      const dy = t.clientY - sy;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.2) goTo(current() + (dx < 0 ? 1 : -1));
    };

    const onKey = (e: KeyboardEvent) => {
      if (!pinned() || (e.key !== "ArrowRight" && e.key !== "ArrowLeft")) return;
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      e.preventDefault();
      goTo(current() + (e.key === "ArrowRight" ? 1 : -1));
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("touchstart", onStart, { passive: true });
    el.addEventListener("touchend", onEnd, { passive: true });
    window.addEventListener("keydown", onKey);
    return () => {
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("touchstart", onStart);
      el.removeEventListener("touchend", onEnd);
      window.removeEventListener("keydown", onKey);
    };
  }, [p, panels, pw]);

  // Piecewise mapping: rest on each panel, then glide to the next.
  const step = 1 / (panels - 1);
  const inputs: number[] = [];
  const outputs: number[] = [];
  for (let k = 0; k < panels; k++) {
    inputs.push(Math.max(0, k * step - (step * HOLD) / 2), Math.min(1, k * step + (step * HOLD) / 2));
    outputs.push(-k * pw, -k * pw);
  }
  const raw = useTransform(p, inputs, outputs);
  const smooth = useSpring(raw, { stiffness: 220, damping: 32, mass: 0.35 });
  const x = useTransform(smooth, (v) => `${v}vw`);
  const fill = useTransform(p, [0, 1], [0, 1]);
  useMotionValueEvent(p, "change", (v) => setIdx(Math.round(v * (panels - 1))));

  const bg = dark ? "radial-gradient(ellipse at 50% 30%, #5a2330, #2a0f14 70%)" : undefined;
  const ink = dark ? "text-[#f3dc8f]" : "text-foreground";
  const muted = dark ? "text-[#f3dc8f]/70" : "text-muted-foreground";
  const thread = dark ? "border-[#d9a93f]/55" : "border-primary/45";
  const lead = (100 - pw) / 2;

  return (
    <section ref={ref} id={`day-${day.n}`} aria-label={`Day ${day.n}, ${day.date}`} className={dark ? "" : "bg-background"} style={{ height: `${100 + (panels - 1) * PER_PANEL}svh`, background: bg }}>
      {/* pan-y: the browser keeps vertical scrolling, sideways swipes come to us */}
      <div className="sticky top-0 flex h-[100svh] touch-pan-y flex-col overflow-hidden">
        {/* fixed header: which day, which event */}
        <div className={`relative z-20 flex items-baseline justify-between px-5 pt-14 ${ink}`}>
          <p className="font-display text-2xl font-bold">
            Day {day.n} <span className={`ml-1 text-sm font-normal tracking-wide ${muted}`}>{day.short}</span>
          </p>
          <p className={`font-display text-lg tabular-nums transition-opacity ${idx === 0 ? "opacity-0" : "opacity-100"} ${muted}`}>
            {String(Math.max(idx, 1)).padStart(2, "0")} / {String(day.events.length).padStart(2, "0")}
          </p>
        </div>
        <div className="relative z-20 mx-5 mt-2 h-[2px] overflow-hidden rounded-full bg-current/10">
          <motion.div style={{ scaleX: fill }} className={`h-full origin-left ${dark ? "bg-[#d9a93f]" : "bg-primary"}`} />
        </div>

        {/* the moving track */}
        <motion.ol style={{ x, paddingLeft: `${lead}vw` }} className="relative flex flex-1">
          {/* title panel */}
          <li className="relative flex flex-none flex-col items-center justify-center px-6 text-center" style={{ width: `${pw}vw` }}>
            <div aria-hidden="true" className={`absolute left-1/2 right-0 top-[28%] border-t-2 border-dashed ${thread}`} />
            <p className={`font-hindi text-2xl ${dark ? "text-[#f3dc8f]" : "text-primary"}`}>{day.hindi}</p>
            <h2 className={`font-display text-[clamp(5rem,26vw,9rem)] font-bold leading-[0.9] ${ink}`}>Day {day.n}</h2>
            <p className={`mt-3 font-display text-xl font-semibold tracking-wide sm:text-2xl ${ink}`}>{day.date}</p>
            <p className={`mt-1 font-hindi text-lg sm:text-xl ${ink}`}>{day.dateHindi}</p>
            <div className="mt-6 flex items-end gap-2">
              <Avatar who={dark ? "bride" : "groom"} mood="cheer" className="h-[min(22svh,11rem)] w-auto" />
              <Bubble line={day.line} className="mb-5" />
            </div>
            <p className={`mt-6 flex items-center gap-2 text-xs uppercase tracking-[0.3em] ${muted}`}>
              Scroll or swipe <span className="nudge-right inline-block text-base">→</span>
            </p>
          </li>

          {day.events.map((ev, k) => {
            const last = k === day.events.length - 1;
            const here = idx === k + 1;
            return (
              <li key={ev.name} className="relative flex flex-none flex-col items-center px-5" style={{ width: `${pw}vw` }}>
                {/* .-----.-----. thread */}
                <div aria-hidden="true" className={`absolute top-[28%] border-t-2 border-dashed ${thread}`} style={{ left: 0, right: last ? "50%" : 0 }} />
                <p className="absolute left-1/2 top-[28%] -translate-x-1/2 -translate-y-[calc(100%+34px)] whitespace-nowrap font-display text-lg font-semibold tracking-wide" style={{ color: dark ? "#f3dc8f" : ev.color }}>
                  {ev.time}
                </p>
                <span
                  aria-hidden="true"
                  className="absolute left-1/2 top-[28%] h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full transition-transform duration-500"
                  style={{ background: ev.color, boxShadow: `0 0 0 4px ${dark ? "#2a0f14" : "var(--background)"}, 0 0 0 ${here ? 10 : 6}px ${ev.color}55`, transform: `translate(-50%, -50%) scale(${here ? 1.25 : 1})` }}
                />

                <article
                  className={`gold-frame relative mt-[calc(28svh+1.25rem)] w-full max-w-sm rounded-sm bg-card px-6 py-7 shadow-[0_20px_40px_-24px_rgba(60,20,10,.6)] transition-[opacity,transform] duration-500 ${
                    here ? "scale-100 opacity-100" : "scale-[0.94] opacity-60"
                  }`}
                >
                  <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                    {String(k + 1).padStart(2, "0")} / {String(day.events.length).padStart(2, "0")}
                  </p>
                  <h3 className="mt-2 font-display text-[2.4rem] font-bold uppercase leading-[1.02] tracking-wide" style={{ color: ev.color }}>
                    {ev.name}
                  </h3>
                  <p className="mt-1 font-hindi text-base text-primary">
                    {ev.hindi}
                    {ev.sub ? <span className="font-body text-muted-foreground"> · {ev.sub}</span> : null}
                  </p>
                  <div aria-hidden="true" className="my-4 h-px w-16" style={{ background: ev.color, opacity: 0.5 }} />
                  <p className="text-lg leading-relaxed text-foreground">{ev.desc}</p>
                  {ev.dress ? <p className="mt-3 italic text-muted-foreground">(Dress code: {ev.dress})</p> : null}
                </article>
              </li>
            );
          })}
        </motion.ol>

        <p className={`relative z-20 px-16 pb-7 text-center text-[0.7rem] uppercase tracking-[0.25em] ${muted}`}>
          {idx >= day.events.length ? (day.n === 1 ? "Scroll on for Day 2 ↓" : "Scroll on for travel & RSVP ↓") : "All events at La Cabana, Ashvem"}
        </p>
      </div>
    </section>
  );
}

export default function Journey() {
  return (
    <div id="journey" className="relative">
      <section id="story" className="px-4 pb-16 pt-14 text-center">
        <Reveal>
          <p className="font-hindi text-xl text-primary">हमारी कहानी</p>
          <h2 className="gold-text animate-shimmer mt-1 font-display text-5xl leading-tight">Our Story</h2>
          <GoldDivider className="mt-4" />
        </Reveal>
        <div className="mt-8">
          <Story />
        </div>
      </section>

      {DAYS.map((day) => (
        <DayScroller key={day.n} day={day} />
      ))}
    </div>
  );
}
