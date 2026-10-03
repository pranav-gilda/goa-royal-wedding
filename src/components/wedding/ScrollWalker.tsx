import { motion, useScroll, useSpring, useTransform } from "motion/react";

/**
 * A tiny couple walks along a gold thread at the top of the screen as the
 * page scrolls: a progress bar with personality. It stays out of the way
 * (28px strip, no pointer events) and appears once you leave the hero.
 */
export default function ScrollWalker() {
  const { scrollYProgress } = useScroll();
  const smooth = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.4 });
  const left = useTransform(smooth, [0, 1], ["2%", "98%"]);
  const opacity = useTransform(scrollYProgress, [0.02, 0.07], [0, 1]);

  return (
    <motion.div
      aria-hidden="true"
      style={{ opacity }}
      className="pointer-events-none fixed inset-x-0 top-0 z-40 h-7 bg-background/90 backdrop-blur-sm"
    >
      <div className="absolute inset-x-0 top-[22px] h-px bg-primary/20" />
      <motion.div style={{ scaleX: smooth }} className="absolute inset-x-0 top-[21px] h-[2px] origin-left bg-primary/70" />
      <motion.div style={{ left }} className="walker absolute top-0 -ml-[17px] h-[24px] w-[34px]">
        <svg viewBox="0 0 34 24" className="h-full w-full">
          {/* groom */}
          <circle cx="9" cy="6" r="3.4" fill="#c98f62" />
          <path d="M5.4 5.2 C5.4 1 12.6 1 12.6 5.2 Z" fill="#e4772c" />
          <path d="M5 11 h8 l1 8 h-10 z" fill="#f3e4c4" stroke="#d9a93f" strokeWidth=".6" />
          <g className="walker-leg-a"><rect x="6" y="19" width="2.2" height="5" rx="1" fill="#8e1b3a" /></g>
          <g className="walker-leg-b"><rect x="10" y="19" width="2.2" height="5" rx="1" fill="#8e1b3a" /></g>
          {/* bride */}
          <circle cx="25" cy="6" r="3.4" fill="#d49c6e" />
          <path d="M21.2 6 C21 1 29 1 28.8 6 L28.8 11 L21.2 11 Z" fill="#c21e3a" />
          <path d="M25 3.6 L25 5" stroke="#d9a93f" strokeWidth=".8" />
          <path d="M21 11 h8 l3 13 h-14 z" fill="#c21e3a" stroke="#d9a93f" strokeWidth=".6" />
          {/* holding hands */}
          <path d="M13 14 Q17 16 21 14" stroke="#c98f62" strokeWidth="1.4" fill="none" strokeLinecap="round" />
        </svg>
      </motion.div>
    </motion.div>
  );
}
