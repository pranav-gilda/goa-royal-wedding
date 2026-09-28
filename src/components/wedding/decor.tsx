import { motion } from "motion/react";
import type { ReactNode } from "react";
import divider from "@/assets/divider.png";

export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function GoldDivider({ className = "" }: { className?: string }) {
  return (
    <img
      src={divider}
      alt=""
      width={1792}
      height={608}
      loading="lazy"
      className={`mx-auto h-10 w-auto opacity-90 md:h-14 ${className}`}
    />
  );
}

export function SectionHeading({
  hindi,
  english,
  sub,
}: {
  hindi: string;
  english: string;
  sub?: string;
}) {
  return (
    <Reveal className="text-center">
      <p className="font-hindi text-xl text-primary">{hindi}</p>
      <h2 className="gold-text animate-shimmer mt-2 font-display text-4xl md:text-5xl">
        {english}
      </h2>
      {sub ? (
        <p className="mt-3 tracking-wide text-muted-foreground">{sub}</p>
      ) : null}
      <GoldDivider className="mt-5" />
    </Reveal>
  );
}
