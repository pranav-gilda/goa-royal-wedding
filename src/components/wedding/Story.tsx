import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Avatar, type Mood, type Who } from "./Avatars";

/**
 * "Our Story": a stack of photo cards. Tap the top card and it flicks away
 * to reveal the next one. Drag/swipe works too. No timers, no phone frame.
 *
 * Add a slide: drop the photo in src/assets/story/ and add an entry to STORY
 * with its file name. Slides without a photo show an illustration instead.
 */

type Slide = { file?: string; who?: Who[]; mood?: Mood; caption: string; sub?: string };

const STORY: Slide[] = [
  { file: "01-baby-hrishi", caption: "Guess who?", sub: "Little Hrishikesh" },
  { file: "02-baby-nandita", caption: "…and this cutie?", sub: "Little Nandita" },
  { who: ["groom", "bride"], mood: "wave", caption: "Two paths became one", sub: "More of our story, coming soon" },
  { who: ["groom", "bride"], mood: "cheer", caption: "And now… the wedding!", sub: "Scroll on for the celebrations ↓" },
];

const FILES = import.meta.glob("/src/assets/story/*.{jpg,jpeg,png,webp,avif}", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;
const src = (file?: string) =>
  file ? Object.entries(FILES).find(([k]) => k.split("/").pop()!.replace(/\.[a-z0-9]+$/i, "") === file)?.[1] : undefined;

// Each card sits at its own slight angle, like photos dropped on a table.
const TILT = [-3, 2.5, -1.5, 3, -2.5, 1.5];
const tilt = (n: number) => TILT[n % TILT.length] ?? 0;

function Card({ slide, n }: { slide: Slide; n: number }) {
  const url = src(slide.file);
  return (
    <div className="h-full w-full bg-[#fbf6ea] p-3 pb-0 shadow-[0_18px_40px_-14px_rgba(60,20,10,.55)] sm:p-4 sm:pb-0">
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#2a0f14]">
        {url ? (
          <img src={url} alt={slide.sub ?? slide.caption} draggable={false} className="h-full w-full object-cover" loading={n < 2 ? "eager" : "lazy"} />
        ) : (
          <div className="flex h-full w-full items-end justify-center" style={{ background: "radial-gradient(ellipse at 50% 35%, #6b2a38, #2a0f14 75%)" }}>
            {slide.who?.map((w) => (
              <Avatar key={w} who={w} mood={slide.mood ?? "idle"} className="-mx-4 h-[78%] w-[52%]" />
            ))}
          </div>
        )}
      </div>
      <div className="flex min-h-[5.5rem] flex-col items-center justify-center px-2 py-3 text-center">
        <p className="font-display text-[1.7rem] italic leading-tight text-[#3b2a1a]">{slide.caption}</p>
        {slide.sub ? <p className="mt-0.5 text-sm text-[#7a6650]">{slide.sub}</p> : null}
      </div>
    </div>
  );
}

export default function Story() {
  const [i, setI] = useState(0);
  const [dir, setDir] = useState<1 | -1>(1);
  const last = STORY.length - 1;

  const go = (d: 1 | -1) => {
    const n = i + d;
    if (n < 0 || n > last) return;
    setDir(d);
    setI(n);
  };

  return (
    <div className="mx-auto flex w-full max-w-[22rem] flex-col items-center sm:max-w-sm">
      <div
        className="relative aspect-[4/6] w-full"
        role="group"
        aria-roledescription="carousel"
        aria-label={`Our story, ${i + 1} of ${STORY.length}`}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") go(1);
          if (e.key === "ArrowLeft") go(-1);
        }}
      >
        {/* the rest of the pile, peeking out underneath */}
        {STORY.slice(i + 1, i + 3)
          .map((s, k) => ({ s, k }))
          .reverse()
          .map(({ s, k }) => (
            <motion.div
              key={`under-${i + 1 + k}`}
              aria-hidden="true"
              className="absolute inset-0"
              initial={false}
              animate={{ rotate: tilt(i + 1 + k), scale: 0.96 - k * 0.03, y: 10 + k * 8 }}
              transition={{ type: "spring", stiffness: 160, damping: 20 }}
            >
              <Card slide={s} n={i + 1 + k} />
            </motion.div>
          ))}

        <AnimatePresence initial={false} custom={dir}>
          <motion.button
            key={i}
            type="button"
            custom={dir}
            onClick={() => go(1)}
            disabled={i === last}
            aria-label={i === last ? STORY[i]!.caption : "Next photo"}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.7}
            onDragEnd={(_, info) => {
              if (info.offset.x < -70 || info.velocity.x < -400) go(1);
              else if (info.offset.x > 70 || info.velocity.x > 400) go(-1);
            }}
            variants={{
              enter: (d: number) => (d === 1 ? { scale: 0.96, y: 10, rotate: tilt(i), opacity: 1 } : { x: -420, rotate: -24, opacity: 0 }),
              center: { x: 0, y: 0, scale: 1, opacity: 1, rotate: tilt(i) },
              exit: (d: number) => (d === 1 ? { x: -440, y: -30, rotate: -28, opacity: 0 } : { scale: 0.96, y: 10, opacity: 0 }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "spring", stiffness: 210, damping: 24 }}
            whileTap={{ scale: 0.985 }}
            className="absolute inset-0 z-10 cursor-pointer touch-pan-y outline-none focus-visible:ring-4 focus-visible:ring-primary/50 disabled:cursor-default"
          >
            <Card slide={STORY[i]!} n={i} />
          </motion.button>
        </AnimatePresence>
      </div>

      <div className="mt-9 flex items-center gap-4">
        <button
          type="button"
          onClick={() => go(-1)}
          disabled={i === 0}
          aria-label="Previous photo"
          className="flex h-11 w-11 items-center justify-center rounded-full text-xl text-primary transition hover:bg-primary/10 disabled:opacity-0"
        >
          ‹
        </button>
        <div className="flex gap-2" aria-hidden="true">
          {STORY.map((_, k) => (
            <span key={k} className={`h-1.5 rounded-full transition-all duration-500 ${k === i ? "w-6 bg-primary" : "w-1.5 bg-primary/30"}`} />
          ))}
        </div>
        <span className="w-11" />
      </div>
      <AnimatePresence mode="wait">
        <motion.p
          key={i === last ? "end" : "tap"}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="mt-2 text-xs uppercase tracking-[0.25em] text-muted-foreground"
        >
          {i === last ? "Scroll on ↓" : "Tap the photo"}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
