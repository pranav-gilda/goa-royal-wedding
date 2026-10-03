import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Avatar, type Mood, type Who } from "./Avatars";

export type GuideLine = { text: string; hint?: string };

/** Speech bubble with a tail pointing at the avatar. */
export function Bubble({ line, side = "left", className = "" }: { line: GuideLine; side?: "left" | "right"; className?: string }) {
  return (
    <div
      className={`relative max-w-[15.5rem] rounded-2xl border border-primary/40 bg-card px-4 py-3 text-left shadow-sm sm:max-w-xs ${className}`}
    >
      <span
        aria-hidden="true"
        className={`absolute top-1/2 h-3 w-3 -translate-y-1/2 rotate-45 border-primary/40 bg-card ${
          side === "left" ? "-left-1.5 border-b border-l" : "-right-1.5 border-r border-t"
        }`}
      />
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={line.text}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.2 }}
        >
          <p className="font-display text-lg italic leading-snug text-foreground">{line.text}</p>
          {line.hint ? <p className="mt-0.5 text-xs text-muted-foreground">{line.hint}</p> : null}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/**
 * Avatar(s) that pop in beside a speech bubble when scrolled into view.
 * Tap/click to hear another line (when more than one is supplied).
 */
export function Guide({
  who,
  mood = "wave",
  lines,
  className = "",
  flip = false,
}: {
  who: Who | Who[];
  mood?: Mood;
  lines: GuideLine[];
  className?: string;
  flip?: boolean;
}) {
  const [i, setI] = useState(0);
  const people = Array.isArray(who) ? who : [who];
  const line = lines[i % lines.length]!;
  const cycle = lines.length > 1;
  return (
    <div className={`mx-auto flex items-end justify-center gap-3 ${flip ? "flex-row-reverse" : ""} ${className}`}>
      <motion.button
        type="button"
        onClick={() => cycle && setI((n) => n + 1)}
        aria-label={cycle ? "Hear another line" : undefined}
        tabIndex={cycle ? 0 : -1}
        initial={{ opacity: 0, y: 36 }}
        whileInView={{ opacity: 1, y: 0 }}
        whileTap={{ scale: 0.94 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ type: "spring", stiffness: 160, damping: 16 }}
        className={`flex shrink-0 items-end ${cycle ? "cursor-pointer" : "cursor-default"}`}
      >
        {people.map((p) => (
          <Avatar key={p} who={p} mood={mood} className={people.length > 1 ? "-mx-2 h-24 w-20 sm:h-28 sm:w-24" : "h-24 w-20 sm:h-28 sm:w-24"} />
        ))}
      </motion.button>
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ delay: 0.35, type: "spring", stiffness: 220, damping: 18 }}
        className="mb-6"
        style={{ transformOrigin: flip ? "right center" : "left center" }}
      >
        <Bubble line={line} side={flip ? "right" : "left"} />
      </motion.div>
    </div>
  );
}
