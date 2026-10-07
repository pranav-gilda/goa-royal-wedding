import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Avatar, type Mood, type Who } from "./Avatars";

/**
 * "Our Story": a stack of photo cards. Tap the top card and it flicks away
 * to reveal the next one. Drag/swipe works too. No timers, no phone frame.
 * Each card carries a short label; the story line itself is told underneath.
 *
 * Add a slide: drop the photo in src/assets/story/ and add an entry to STORY
 * with its file name (no extension). Slides without a photo show the couple's illustration.
 */

/** `pos` is the CSS object-position for the photo crop (default keeps faces in frame). */
type Slide = { file?: string; pos?: string; who?: Who[]; mood?: Mood; tag: string; line: string };

// Told by Nandita, in her words.
const STORY: Slide[] = [
  { file: "02-baby-nandita", tag: "Little Nandita", line: "Once upon a time, a little girl was growing up, unaware of the love story waiting for her." },
  { file: "01-baby-hrishi", tag: "Little Hrishikesh", line: "And somewhere else, a little boy was growing up, unaware that his forever was growing up too." },
  { file: "meet_cute", pos: "47% 75%", tag: "Our first date", line: "Years later, two strangers met… and somehow, it felt like the beginning of something that’s meant to be." },
  { file: "party_together", pos: "50% 62%", tag: "The little moments", line: "Then came the little moments — the laughs, the madness, the memories… and somewhere along the way, we fell in love." },
  { file: "couple", pos: "50% 20%", tag: "My favourite person", line: "He became my favourite person, my safest place, and my home." },
  { file: "06-couple-talks", pos: "60% 35%", tag: "Us", line: "And suddenly, “us” became our favourite chapter." },
  { file: "prayer", pos: "50% 55%", tag: "Answered prayer", line: "Somewhere in between, he became my answered prayer… and somewhere along the way, I became his home." },
  { file: "engaged", pos: "50% 18%", tag: "Engaged", line: "Until one beautiful day, forever became official. From “you and me” to “we”…" },
  { who: ["groom", "bride"], mood: "cheer", tag: "And now… the wedding!", line: "Scroll on for the celebrations ↓" },
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
          <img
            src={url}
            alt={slide.tag}
            draggable={false}
            className="h-full w-full object-cover"
            style={{ objectPosition: slide.pos ?? "50% 30%" }}
            loading={n < 2 ? "eager" : "lazy"}
          />
        ) : (
          <div className="flex h-full w-full items-end justify-center gap-1 pb-3" style={{ background: "radial-gradient(ellipse at 50% 35%, #6b2a38, #2a0f14 75%)" }}>
            {slide.who?.map((w) => (
              <Avatar key={w} who={w} mood={slide.mood ?? "idle"} className="h-[88%] w-auto max-w-[48%]" />
            ))}
          </div>
        )}
      </div>
      <div className="flex min-h-[4.5rem] items-center justify-center px-2 py-3 text-center">
        <p className="font-display text-[1.6rem] italic leading-tight text-[#3b2a1a]">{slide.tag}</p>
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
      {/* the card shrinks on short screens so the photo and its line fit on one screen */}
      <div
        className="relative aspect-[4/6] w-[min(100%,calc((100svh-20rem)*0.667))] min-w-[14rem]"
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
            aria-label={i === last ? STORY[i]!.tag : "Next photo"}
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

      {/* the story line, told under the photo; space is reserved so nothing jumps */}
      <div className="mt-8 flex min-h-[6.5rem] w-full items-start justify-center px-1" aria-live="polite">
        <AnimatePresence mode="wait" initial={false}>
          <motion.p
            key={i}
            initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -6, filter: "blur(4px)" }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="text-center font-display text-[1.45rem] italic leading-snug text-foreground sm:text-[1.6rem]"
          >
            {STORY[i]!.line}
          </motion.p>
        </AnimatePresence>
      </div>

      <div className="mt-4 flex items-center gap-4">
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
          {i === last ? "" : "Tap the photo"}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
