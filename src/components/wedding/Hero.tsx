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
      className="relative flex min-h-screen items-center justify-center overflow-hidden"
    >
      <motion.div style={{ y }} className="absolute inset-0">
        <img
          src={heroArt}
          alt="A royal palace by the sea at dusk, framed in gold filigree with peacocks"
          className="h-full w-full object-cover"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/25 to-background" />
      </motion.div>

      <motion.div
        style={{ opacity: fade }}
        className="relative z-10 px-6 text-center"
      >
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 1 }}
          className="font-hindi text-lg tracking-[0.35em] text-primary"
        >
          ॥ शुभ विवाह ॥
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          className="gold-text animate-shimmer mt-6 font-display text-7xl leading-none md:text-9xl"
        >
          Aarav &amp; Diya
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="mt-5 font-hindi text-2xl text-foreground/90 md:text-3xl"
        >
          आरव एवं दिया
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3, duration: 1 }}
          className="mt-8 space-y-3"
        >
          <p className="font-display text-2xl tracking-wide text-foreground md:text-3xl">
            12 &amp; 13 December 2026
          </p>
          <p className="text-sm uppercase tracking-[0.45em] text-primary">
            Goa · India
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 1 }}
          className="mt-10"
        >
          <a
            href="#rsvp"
            className="inline-block rounded-sm border border-primary/60 bg-primary/10 px-10 py-3.5 font-display text-xl tracking-widest text-primary transition hover:bg-primary/25"
          >
            RSVP
          </a>
          <p className="mt-4 font-hindi text-sm text-muted-foreground">
            आपका स्वागत है
          </p>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 1 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-primary"
      >
        <ChevronDown className="h-6 w-6 animate-bounce" />
      </motion.div>
    </section>
  );
}
