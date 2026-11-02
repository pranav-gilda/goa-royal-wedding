import { useCallback, useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { GoldDivider, Reveal } from "./decor";
import { Bubble } from "./Guide";
import { Avatar } from "./Avatars";
import Story from "./Story";
import afterPartyArtwork from "@/assets/events/after-party.jpg";
import baaratArtwork from "@/assets/events/baarat.jpg";
import bohoCarnivalArtwork from "@/assets/events/boho-carnival.jpg";
import jaimalaArtwork from "@/assets/events/jaimala.jpg";
import maayraArtwork from "@/assets/events/maayra.jpg";
import pheraArtwork from "@/assets/events/phera.jpg";
import sangeetArtwork from "@/assets/events/sangeet.jpg";

/**
 * Everything after the intro, as one continuous scroll:
 * Our Story → Day 1 (pins; scrolling down moves the events left→right) →
 * Day 2 (same) → the page carries on to Travel and RSVP.
 */

type EventArtworkKind =
  "maayra" | "sangeet" | "after-party" | "carnival" | "baarat" | "jaimala" | "phera";

const EVENT_ARTWORK: Record<EventArtworkKind, string> = {
  maayra: maayraArtwork,
  sangeet: sangeetArtwork,
  "after-party": afterPartyArtwork,
  carnival: bohoCarnivalArtwork,
  baarat: baaratArtwork,
  jaimala: jaimalaArtwork,
  phera: pheraArtwork,
};

type WeddingEvent = {
  time: string;
  name: string;
  hindi: string;
  sub?: string;
  desc: string;
  color: string;
  art: EventArtworkKind;
  /** Shown as "(Dress code: …)". Leave out for events without one. */
  dress?: string;
};

type Day = {
  n: 1 | 2;
  hindi: string;
  date: string;
  dateHindi: string;
  short: string;
  line: { text: string; hint: string };
  events: WeddingEvent[];
};

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
      {
        time: "2:00 – 5:00 PM",
        name: "Maayra",
        hindi: "मायरा",
        desc: "A celebration of love, gifts and togetherness.",
        color: "#9b1b3a",
        art: "maayra",
      },
      {
        time: "6:30 – 10:00 PM",
        name: "Sangeet",
        hindi: "संगीत",
        desc: "An evening of music, dance and unforgettable performances.",
        color: "#4b1d7a",
        art: "sangeet",
      },
      {
        time: "10:00 PM onwards",
        name: "After Party",
        hindi: "उत्सव",
        desc: "Let the music keep you alive!",
        color: "#1c2f6b",
        art: "after-party",
      },
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
      {
        time: "9:00 AM – 12:00 PM",
        name: "Boho Carnival",
        hindi: "उत्सव",
        desc: "Fun games, boho vibes and a perfect start to the day!",
        color: "#a4501c",
        art: "carnival",
      },
      {
        time: "2:00 – 5:00 PM",
        name: "Baaraat",
        hindi: "बारात",
        desc: "Let the celebration ride in with joy and energy!",
        color: "#1c2f6b",
        art: "baarat",
      },
      {
        time: "5:50 PM",
        name: "Jaimala",
        hindi: "जयमाला",
        desc: "Two hearts, one promise for a lifetime.",
        color: "#9b1b3a",
        art: "jaimala",
      },
      {
        time: "6:40 – 11:00 PM",
        name: "Phera",
        hindi: "फेरे",
        desc: "Promises, blessings and a celebration to remember forever.",
        color: "#4b1d7a",
        art: "phera",
      },
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
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const set = () => setPw(mq.matches ? 52 : 100);
    set();
    mq.addEventListener("change", set);
    return () => mq.removeEventListener("change", set);
  }, []);

  const scrollToPanel = useCallback(
    (panel: number) => {
      const el = ref.current;
      if (!el) return;
      const top = el.getBoundingClientRect().top + window.scrollY;
      const travel = el.offsetHeight - window.innerHeight;
      const progress = Math.max(0, Math.min(panels - 1, panel)) / (panels - 1);
      el.querySelector<HTMLElement>(`[data-panel="${Math.round(panel)}"]`)?.focus({
        preventScroll: true,
      });
      window.scrollTo({ top: top + progress * travel, behavior: reduceMotion ? "auto" : "smooth" });
    },
    [panels, reduceMotion],
  );

  const scrollToSection = useCallback(
    (id: string) => {
      const target = document.getElementById(id);
      target?.focus({ preventScroll: true });
      target?.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
        block: "start",
      });
    },
    [reduceMotion],
  );

  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] });

  // Sideways input drives the same track: the page's vertical scroll is the single source of truth,
  // so horizontal wheel / swipe / arrow keys are translated into vertical scrolling.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const current = () => Math.round(p.get() * (panels - 1));
    const pinned = () => {
      const r = el.getBoundingClientRect();
      return r.top <= 1 && r.bottom >= window.innerHeight - 1;
    };
    const goTo = (k: number) => scrollToPanel(k);

    // Trackpad / shift+wheel: move continuously, one panel width ≈ one panel of vertical scroll.
    const onWheel = (e: WheelEvent) => {
      if (!pinned() || Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      e.preventDefault();
      const panelWidth = el.clientWidth * (pw / 100);
      const ratio = (PER_PANEL * window.innerHeight) / panelWidth;
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
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.2)
        goTo(current() + (dx < 0 ? 1 : -1));
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
  }, [p, panels, pw, scrollToPanel]);

  // Piecewise mapping: rest on each panel, then glide to the next.
  const step = 1 / (panels - 1);
  const inputs: number[] = [];
  const outputs: number[] = [];
  const lead = (100 - pw) / 2;
  const trackWidth = panels * pw + lead;
  for (let k = 0; k < panels; k++) {
    inputs.push(
      Math.max(0, k * step - (step * HOLD) / 2),
      Math.min(1, k * step + (step * HOLD) / 2),
    );
    outputs.push((-k * pw * 100) / trackWidth, (-k * pw * 100) / trackWidth);
  }
  const raw = useTransform(p, inputs, outputs);
  const smooth = useSpring(raw, { stiffness: 220, damping: 32, mass: 0.35 });
  const x = useTransform(smooth, (v) => `${v}%`);
  const fill = useTransform(p, [0, 1], [0, 1]);
  useMotionValueEvent(p, "change", (v) => setIdx(Math.round(v * (panels - 1))));

  const bg = dark ? "radial-gradient(ellipse at 50% 30%, #5a2330, #2a0f14 70%)" : undefined;
  const ink = dark ? "text-[#f3dc8f]" : "text-foreground";
  const muted = dark ? "text-[#f3dc8f]/70" : "text-muted-foreground";

  return (
    <section
      ref={ref}
      id={`day-${day.n}`}
      tabIndex={-1}
      aria-label={`Day ${day.n}, ${day.date}`}
      className={dark ? "" : "bg-background"}
      style={{ height: `${100 + (panels - 1) * PER_PANEL}svh`, background: bg }}
    >
      {/* pan-y: the browser keeps vertical scrolling, sideways swipes come to us */}
      <div className="sticky top-11 flex h-[calc(100svh-2.75rem)] touch-pan-y flex-col overflow-hidden">
        {day.n === 2 && !reduceMotion ? (
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 z-30 w-[38vw] origin-left bg-gradient-to-r from-[#f7e9c9]/95 via-[#e4c378]/70 to-transparent shadow-[8px_0_16px_-12px_rgba(47,25,18,.7)]"
            initial={{ rotateY: 0, opacity: 0.9 }}
            whileInView={{ rotateY: -74, opacity: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformPerspective: 900, transformOrigin: "left center" }}
          />
        ) : null}

        {/* fixed header: which day, which event */}
        <div
          className={`relative z-20 grid grid-cols-[1fr_auto] items-center gap-x-3 px-4 pt-8 ${ink}`}
        >
          <div className="min-w-0">
            <p className="font-display text-2xl font-bold leading-none">
              Day {day.n}{" "}
              <span className={`ml-1 text-sm font-normal tracking-wide ${muted}`}>of 2</span>
            </p>
            <p className={`mt-1 text-xs tracking-wide ${muted}`}>{day.short}</p>
          </div>
          <p
            aria-live="polite"
            aria-atomic="true"
            aria-label={
              idx === 0
                ? `${day.events.length} events`
                : `Event ${idx} of ${day.events.length}: ${day.events[idx - 1]?.name ?? ""}`
            }
            className={`max-w-36 truncate text-right font-display text-xs font-semibold tabular-nums sm:max-w-none sm:text-sm ${muted}`}
          >
            {idx === 0
              ? `${day.events.length} events`
              : `${idx} / ${day.events.length} · ${day.events[idx - 1]?.name ?? ""}`}
          </p>
        </div>
        <div className="relative z-20 mx-5 mt-2 h-[2px] overflow-hidden rounded-full bg-current/10">
          <motion.div
            style={{ scaleX: fill }}
            className={`h-full origin-left ${dark ? "bg-[#d9a93f]" : "bg-primary"}`}
          />
        </div>

        {/* the moving track */}
        <motion.ol
          style={{ x, paddingLeft: `${lead}%`, width: `${trackWidth}%` }}
          className="relative flex min-h-0 flex-1"
        >
          {/* title panel */}
          <li
            data-panel="0"
            tabIndex={-1}
            className="relative flex flex-none flex-col items-center justify-center px-6 text-center"
            style={{ width: `${100 / panels}%` }}
          >
            <p className={`mb-2 text-[0.65rem] font-semibold uppercase tracking-[0.3em] ${muted}`}>
              {day.n === 1 ? "The first page · 01 / 02" : "The reverse page · 02 / 02"}
            </p>
            <p className={`font-hindi text-2xl ${dark ? "text-[#f3dc8f]" : "text-primary"}`}>
              {day.hindi}
            </p>
            <h2
              className={`font-display text-[clamp(5rem,26vw,9rem)] font-bold leading-[0.9] ${ink}`}
            >
              Day {day.n}
            </h2>
            <p
              className={`mt-3 font-display text-xl font-semibold tracking-wide sm:text-2xl ${ink}`}
            >
              {day.date}
            </p>
            <p className={`mt-1 font-hindi text-lg sm:text-xl ${ink}`}>{day.dateHindi}</p>
            <div className="mt-6 flex items-end gap-2">
              <Avatar
                who={dark ? "bride" : "groom"}
                mood="cheer"
                className="h-[min(22svh,11rem)] w-auto"
              />
              <Bubble line={day.line} className="mb-5" />
            </div>
            <p className={`mt-4 text-sm ${muted}`}>
              Start with the first event, or scroll down to browse.
            </p>
            <button
              type="button"
              onClick={() => scrollToPanel(1)}
              tabIndex={idx === 0 ? 0 : -1}
              disabled={idx !== 0}
              className="mt-3 min-h-11 rounded-sm border border-primary/50 bg-card/90 px-5 py-2 font-semibold text-primary shadow-sm transition hover:bg-card focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              Start with {day.events[0]?.name ?? "the first event"}{" "}
              <span aria-hidden="true">→</span>
            </button>
          </li>

          {day.events.map((ev, k) => {
            const last = k === day.events.length - 1;
            const here = idx === k + 1;
            return (
              <li
                key={ev.name}
                data-panel={k + 1}
                tabIndex={-1}
                aria-current={here ? "step" : undefined}
                className="relative flex flex-none flex-col items-center px-5"
                style={{
                  width: `${100 / panels}%`,
                  backgroundColor: dark ? "#2a0f14" : "#faf4e5",
                  backgroundImage: `radial-gradient(ellipse at 50% 40%, color-mix(in srgb, ${ev.color} 18%, transparent), transparent 72%)`,
                }}
              >
                <div
                  aria-hidden="true"
                  className="chronicle-thread absolute top-[24%]"
                  style={{ left: k === 0 ? "50%" : 0, right: last ? "50%" : 0 }}
                />
                <p
                  className="absolute left-1/2 top-[24%] z-10 -translate-x-1/2 -translate-y-[calc(100%+34px)] whitespace-nowrap rounded-sm bg-card px-3 py-1.5 font-display text-lg font-semibold tracking-wide shadow-sm"
                  style={{ color: ev.color }}
                >
                  {ev.time}
                </p>
                <span
                  aria-hidden="true"
                  className="absolute left-1/2 top-[24%] z-10 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#f7e8c2] transition-transform duration-300"
                  style={{
                    background: ev.color,
                    boxShadow: `0 0 0 4px ${dark ? "#2a0f14" : "var(--background)"}, 0 0 0 ${here ? 10 : 6}px ${ev.color}55`,
                    transform: `translate(-50%, -50%) scale(${here ? 1.25 : 1})`,
                  }}
                />

                <article
                  className={`gold-frame relative z-10 mt-[21svh] mb-3 flex w-full max-w-sm flex-none flex-col rounded-sm bg-card/95 px-5 py-3 shadow-[0_20px_40px_-24px_rgba(60,20,10,.6)] backdrop-blur-sm transition-opacity duration-300 sm:px-6 ${
                    here ? "opacity-100" : "opacity-60"
                  }`}
                >
                  <div
                    aria-hidden="true"
                    className="relative -mx-5 -mt-3 mb-1 h-[clamp(9rem,23svh,15rem)] flex-none overflow-hidden rounded-t-sm sm:-mx-6"
                  >
                    {Math.abs(k + 1 - idx) <= 1 ? (
                      <img
                        src={EVENT_ARTWORK[ev.art]}
                        alt=""
                        loading={here ? "eager" : "lazy"}
                        decoding="async"
                        className="block h-full w-full object-cover"
                      />
                    ) : null}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#faf4e5]/35" />
                  </div>
                  <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                    {String(k + 1).padStart(2, "0")} / {String(day.events.length).padStart(2, "0")}
                  </p>
                  <h3
                    className="mt-1 whitespace-nowrap font-display text-[clamp(1.65rem,7vw,2.4rem)] font-bold uppercase leading-none tracking-wide"
                    style={{ color: ev.color }}
                  >
                    {ev.name}
                  </h3>
                  <p className="mt-1 min-h-6 font-hindi text-base text-primary">
                    {ev.hindi}
                    {ev.sub ? (
                      <span className="font-body text-muted-foreground"> · {ev.sub}</span>
                    ) : null}
                  </p>
                  <div
                    aria-hidden="true"
                    className="my-1 h-px w-16"
                    style={{ background: ev.color, opacity: 0.5 }}
                  />
                  <p className="line-clamp-2 min-h-[3.25rem] text-base leading-relaxed text-foreground">
                    {ev.desc}
                  </p>
                  {ev.dress ? (
                    <p className="mt-3 italic text-muted-foreground">(Dress code: {ev.dress})</p>
                  ) : null}
                  <div className="mt-4 grid grid-cols-[1fr_auto_1fr] items-center gap-2 border-t border-border pt-3">
                    <button
                      type="button"
                      aria-label={
                        k === 0
                          ? `Return to the Day ${day.n} introduction`
                          : `Previous event before ${ev.name}`
                      }
                      tabIndex={here ? 0 : -1}
                      disabled={!here}
                      onClick={() => scrollToPanel(k)}
                      className="min-h-11 rounded-sm border border-primary/35 px-2 text-xs font-semibold text-primary transition hover:bg-primary/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:pointer-events-none disabled:opacity-40 sm:px-3 sm:text-sm"
                    >
                      {k === 0 ? "Day intro" : "← Previous"}
                    </button>
                    <span className="whitespace-nowrap text-xs font-semibold tabular-nums text-muted-foreground">
                      {k + 1} of {day.events.length}
                    </span>
                    <button
                      type="button"
                      aria-label={
                        last
                          ? day.n === 1
                            ? "Turn to Day 2"
                            : "Continue to Travel and Stay"
                          : `Next event after ${ev.name}`
                      }
                      tabIndex={here ? 0 : -1}
                      disabled={!here}
                      onClick={() => {
                        if (!last) {
                          scrollToPanel(k + 2);
                        } else {
                          scrollToSection(day.n === 1 ? "day-2" : "travel");
                        }
                      }}
                      className="min-h-11 rounded-sm border border-primary/35 px-2 text-xs font-semibold text-primary transition hover:bg-primary/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:pointer-events-none disabled:opacity-40 sm:px-3 sm:text-sm"
                    >
                      {last ? (day.n === 1 ? "Next: Day 2 →" : "Travel & stay ↓") : "Next event →"}
                    </button>
                  </div>
                </article>
              </li>
            );
          })}
        </motion.ol>

        <p className={`relative z-20 px-5 pb-5 text-center text-xs tracking-wide ${muted}`}>
          {idx >= day.events.length
            ? day.n === 1
              ? "Last event · Next: Day 2"
              : "Last event · Travel & stay"
            : "Previous / Next, or scroll"}
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
          <h2 className="gold-text animate-shimmer mt-1 font-display text-5xl leading-tight">
            Our Story
          </h2>
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
