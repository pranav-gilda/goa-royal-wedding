import { useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll, useSpring, useTransform } from "motion/react";
import { avatarArt } from "./Avatars";

/**
 * The couple (their standing-still cut-outs) travel along a gold thread at the top of
 * the screen as the page scrolls: a progress bar with personality. They hop while the
 * page moves and stand still when it stops. No pointer events, appears after the top.
 */
export default function ScrollWalker() {
  const { scrollY, scrollYProgress } = useScroll();
  const smooth = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.4 });
  const left = useTransform(smooth, [0, 1], ["0%", "100%"]);
  const opacity = useTransform(scrollYProgress, [0.02, 0.07], [0, 1]);

  const [moving, setMoving] = useState(false);
  const stop = useRef<ReturnType<typeof setTimeout>>(undefined);
  useMotionValueEvent(scrollY, "change", () => {
    setMoving(true);
    clearTimeout(stop.current);
    stop.current = setTimeout(() => setMoving(false), 220);
  });

  const groom = avatarArt("groom", "idle");
  const bride = avatarArt("bride", "idle");

  return (
    <motion.div
      aria-hidden="true"
      style={{ opacity }}
      className="pointer-events-none fixed inset-x-0 top-0 z-40 h-11 bg-background/90 backdrop-blur-sm"
    >
      <p className="absolute inset-x-0 top-[9px] text-center font-hindi text-[1.05rem] leading-none text-primary">🌺 विवाह उत्सव 🌺</p>
      <div className="absolute inset-x-0 top-[41px] h-px bg-primary/20" />
      <motion.div style={{ scaleX: smooth }} className="absolute inset-x-0 top-[40px] h-[2px] origin-left bg-primary/70" />
      {/* inset so the pair never walks off either edge */}
      <div className="absolute inset-x-5 top-[3px]">
        <motion.div style={{ left }} className={`absolute top-0 flex -translate-x-1/2 items-end ${moving ? "" : "walker-idle"}`}>
          <img src={groom} alt="" draggable={false} className="walker-hop h-[38px] w-auto" />
          <img src={bride} alt="" draggable={false} className="walker-hop walker-hop-b -ml-[3px] h-[38px] w-auto" />
        </motion.div>
      </div>
    </motion.div>
  );
}
