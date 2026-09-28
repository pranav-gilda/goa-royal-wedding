import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { ChevronDown } from "lucide-react";
import heroArt from "@/assets/hero-art.png";

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const fade = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative flex min-h-[min(740px,90svh)] items-center justify-center overflow-hidden py-12 md:min-h-[min(850px,88svh)]"
    >
      <motion.div style={{ y }} className="absolute inset-0">
        <img
          src={heroArt}
          alt="A royal palace by the sea at dusk, framed in gold filigree with peacocks"
          className="h-full w-full object-cover object-[56%_center]"
          fetchPriority="high"
        />
        <div className="hero-shade absolute inset-0" />
      </motion.div>

      <motion.div
        style={{ opacity: fade }}
        className="relative z-10 w-full max-w-3xl px-7 pb-8 text-center"
      >
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 1 }}
          className="hero-gold font-hindi text-base md:text-lg"
        >
          ॥ शुभ विवाह ॥
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          className="hero-heading mt-5 font-display text-[clamp(3.5rem,14vw,5rem)] leading-[0.9] md:text-8xl"
        >
          Hrishikesh &amp; Nandita
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="hero-ink mt-5 font-hindi text-xl md:text-3xl"
        >
          ऋषिकेश एवं नंदिता
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3, duration: 1 }}
          className="mt-7 space-y-3"
        >
          <p className="hero-ink font-display text-2xl md:text-3xl">
            1 &amp; 2 December 2026
          </p>
          <p className="hero-gold text-xs uppercase tracking-widest md:text-sm">
            La Cabana Beach &amp; Spa · Goa
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 1 }}
          className="mt-9"
        >
          <a
            href="#rsvp"
            className="inline-flex min-h-12 items-center justify-center rounded-sm border border-primary/60 bg-background px-10 py-2 font-display text-xl text-foreground shadow-sm transition hover:bg-card"
          >
            RSVP
          </a>
          <p className="hero-ink mt-4 font-hindi text-sm">
            आपका स्वागत है
          </p>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 1 }}
        className="hero-gold absolute bottom-5 left-1/2 z-10 -translate-x-1/2"
      >
        <ChevronDown className="h-6 w-6 animate-bounce" />
      </motion.div>
    </section>
  );
}
