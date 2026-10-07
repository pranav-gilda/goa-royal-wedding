import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Avatar } from "./Avatars";
import { Mandala, SparkPortal } from "./MagicRing";
import Petals from "./Petals";
import Scratch from "./Scratch";
import { hasVoice, playVoice, startMusic, stopVoice } from "@/lib/audio";

/**
 * Opening: a wax seal in the centre → tap → the seal cracks, a golden
 * sling-ring portal spins open → the scroll unrolls out of it → scratch the
 * foil for the date → enter.
 *
 * Shown once per browser session (sessionStorage), so opening the link again
 * later shows it again. ?intro=1 forces it, ?intro=0 skips it, and the footer
 * link replays it. Captions below must match any recorded voice notes.
 */

const WELCOME = { text: "Aa gaye aap! Hum kab se wait kar rahe the…", from: "Hrishikesh & Nandita" };

const SEEN_KEY = "hn-intro-seen";
const GOLD = "#d9a93f";
const EASE = [0.22, 1, 0.36, 1] as const;

type Stage = "seal" | "portal" | "scroll" | "revealed";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const STRANDS = [
  { l: 3, h: 30 }, { l: 10, h: 46 }, { l: 17, h: 36 }, { l: 24, h: 52 },
  { l: 76, h: 52 }, { l: 83, h: 36 }, { l: 90, h: 46 }, { l: 97, h: 30 },
];

function Beads() {
  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
      {STRANDS.map((s, i) => (
        <div key={i} className="bead-strand absolute top-0 w-2" style={{ left: `${s.l}%`, height: `${s.h}svh`, animationDelay: `-${i * 0.7}s` }}>
          <div className="h-full w-full opacity-60" style={{ backgroundImage: `radial-gradient(circle, ${GOLD} 0 2.4px, transparent 3px)`, backgroundSize: "8px 13px" }} />
          <span className="absolute -bottom-3 left-1/2 h-4 w-2.5 -translate-x-1/2" style={{ background: GOLD, clipPath: "polygon(50% 100%, 0 35%, 50% 0, 100% 35%)" }} />
        </div>
      ))}
    </div>
  );
}

function SealFace() {
  return (
    <div
      className="relative flex h-full w-full items-center justify-center rounded-full"
      style={{
        background: "radial-gradient(circle at 34% 28%, #e0464f, #a31b26 52%, #6a0d16)",
        boxShadow: "0 14px 40px rgba(0,0,0,.6), inset 0 0 0 5px rgba(255,255,255,.07), inset 0 0 0 10px rgba(0,0,0,.14), inset 0 -10px 24px rgba(0,0,0,.35)",
      }}
    >
      <svg viewBox="-50 -50 100 100" className="absolute inset-0 h-full w-full" aria-hidden="true">
        <circle r="40" fill="none" stroke="#f3c9a0" strokeOpacity=".45" strokeWidth=".8" strokeDasharray="1.5 2.2" />
        <circle r="35" fill="none" stroke="#f3c9a0" strokeOpacity=".3" strokeWidth=".6" />
      </svg>
      <span className="font-display text-[2.6rem] font-semibold leading-none tracking-wide" style={{ color: "#f6d3ac", textShadow: "0 1px 0 rgba(0,0,0,.35), 0 -1px 0 rgba(255,255,255,.15)" }}>
        H<span className="align-middle text-[1.6rem]">♥</span>N
      </span>
    </div>
  );
}

/** The wax seal; when cracked its two halves fly apart. */
function Seal({ cracked, onOpen }: { cracked: boolean; onOpen: () => void }) {
  const halves = [
    { clip: "inset(0 50% 0 0)", x: -110, r: -28 },
    { clip: "inset(0 0 0 50%)", x: 110, r: 28 },
  ];
  return (
    <motion.button
      type="button"
      onClick={onOpen}
      disabled={cracked}
      aria-label="Tap the seal to open the invitation"
      initial={{ scale: 0.6, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={cracked ? {} : { scale: 1.05 }}
      whileTap={cracked ? {} : { scale: 0.93 }}
      transition={{ type: "spring", stiffness: 180, damping: 14, delay: 0.25 }}
      className="relative h-40 w-40 rounded-full outline-none focus-visible:ring-4 focus-visible:ring-[#f3dc8f]/70 sm:h-44 sm:w-44"
    >
      {cracked ? null : (
        <>
          <span aria-hidden="true" className="seal-pulse absolute inset-0 rounded-full" />
          <span aria-hidden="true" className="seal-pulse seal-pulse-b absolute inset-0 rounded-full" />
        </>
      )}
      {halves.map((h, k) => (
        <motion.span
          key={k}
          className="absolute inset-0"
          style={{ clipPath: h.clip }}
          animate={cracked ? { x: h.x, rotate: h.r, opacity: 0, scale: 0.9 } : { x: 0, rotate: 0, opacity: 1, scale: 1 }}
          transition={{ duration: 0.75, ease: EASE }}
        >
          <SealFace />
        </motion.span>
      ))}
    </motion.button>
  );
}

export default function Intro() {
  const [open, setOpen] = useState(true);
  const [stage, setStage] = useState<Stage>("seal");
  const [sparks, setSparks] = useState(false);
  const [burst, setBurst] = useState(0);
  const alive = useRef(true);
  const busy = useRef(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const finish = useCallback(() => {
    stopVoice();
    setOpen(false);
  }, []);

  useEffect(() => {
    alive.current = true;
    if (document.documentElement.classList.contains("intro-seen")) {
      setOpen(false);
      return;
    }
    if (import.meta.env.DEV) {
      const s = new URLSearchParams(window.location.search).get("stage");
      if (s === "scroll" || s === "revealed") {
        busy.current = true;
        setStage(s);
      }
    }
    return () => {
      alive.current = false;
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const prev = root.style.overflow;
    root.style.overflow = "hidden";
    rootRef.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && finish();
    window.addEventListener("keydown", onKey);
    return () => {
      root.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, finish]);

  useEffect(() => {
    const replay = () => {
      document.documentElement.classList.remove("intro-seen");
      try {
        sessionStorage.removeItem(SEEN_KEY);
      } catch {
        /* storage unavailable */
      }
      busy.current = false;
      setSparks(false);
      setStage("seal");
      setOpen(true);
      window.scrollTo(0, 0);
    };
    window.addEventListener("hn-replay-intro", replay);
    return () => window.removeEventListener("hn-replay-intro", replay);
  }, []);

  const openSeal = useCallback(async () => {
    if (busy.current) return;
    busy.current = true;
    startMusic();
    void playVoice("welcome");
    setStage("portal");
    await sleep(250);
    if (!alive.current) return;
    setSparks(true);
    await sleep(1650);
    if (!alive.current) return;
    setStage("scroll");
    void playVoice("blessing");
    await sleep(1500);
    // the portal has done its job; stop the canvas so phones stay cool
    if (alive.current) setSparks(false);
  }, []);

  const portalUp = stage !== "seal";
  const scrollUp = stage === "scroll" || stage === "revealed";

  return (
    <AnimatePresence
      onExitComplete={() => {
        try {
          sessionStorage.setItem(SEEN_KEY, "1");
        } catch {
          /* storage unavailable */
        }
        document.documentElement.classList.add("intro-seen");
        window.scrollTo(0, 0);
      }}
    >
      {open ? (
        <motion.div
          key="intro"
          ref={rootRef}
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
          aria-label="Wedding invitation"
          exit={{ opacity: 0, scale: 1.06, filter: "blur(6px)" }}
          transition={{ duration: 0.8, ease: EASE }}
          className="intro-overlay fixed inset-0 z-[100] overflow-hidden text-[#f3dc8f] outline-none"
          style={{ background: "radial-gradient(ellipse at 50% 42%, #5f2633 0%, #36131c 52%, #1d090e 100%)" }}
        >
          <Beads />
          <Petals count={6} />

          <button
            type="button"
            onClick={finish}
            className="absolute right-3 top-3 z-50 min-h-11 rounded-full border border-[#d9a93f]/50 bg-black/25 px-4 text-sm tracking-wide text-[#f3dc8f] backdrop-blur hover:bg-black/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#f3dc8f]"
          >
            Skip · छोड़ें
          </button>

          {/* double gold frame, like a printed invite */}
          <motion.div
            aria-hidden="true"
            animate={{ opacity: portalUp ? 0 : 1, scale: portalUp ? 1.04 : 1 }}
            transition={{ duration: 0.6 }}
            className="pointer-events-none absolute inset-4 border border-[#d9a93f]/45 sm:inset-8"
          >
            <div className="absolute inset-2 border border-[#d9a93f]/20" />
          </motion.div>

          {/* ---------------- seal ---------------- */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pb-[18svh]">
            <motion.div animate={{ opacity: portalUp ? 0 : 1, y: portalUp ? -16 : 0 }} transition={{ duration: 0.5 }} className="mb-8 text-center">
              <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.8 }} className="font-hindi text-lg opacity-90">
                ॥ शुभ निमंत्रण ॥
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.9, ease: EASE }}
                className="mt-1 font-display text-[clamp(2rem,9vw,3.2rem)] leading-tight"
              >
                You're Invited
              </motion.p>
              <div aria-hidden="true" className="mx-auto mt-3 h-px w-40" style={{ background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)` }} />
            </motion.div>

            <Seal cracked={portalUp} onOpen={() => void openSeal()} />

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: portalUp ? 0 : 1 }}
              transition={{ delay: portalUp ? 0 : 0.9, duration: 0.5 }}
              className="mt-7 text-center"
            >
              <span className="block font-display text-xl italic">Tap the seal to open</span>
              <span className="mt-0.5 block font-hindi text-sm opacity-75">खोलने के लिए मोहर छुएँ</span>
            </motion.p>
          </div>

          {/* ---------------- golden ring portal ---------------- */}
          <AnimatePresence>
            {portalUp ? (
              <motion.div
                key="portal"
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className="absolute h-[min(150vw,92svh)] w-[min(150vw,92svh)] rounded-full"
                  initial={{ opacity: 0, scale: 0.2 }}
                  animate={{ opacity: [0, 1, 0.35], scale: [0.2, 1.1, 1] }}
                  transition={{ duration: 1.2, ease: EASE }}
                  style={{ background: "radial-gradient(circle, rgba(255,214,120,.55), rgba(255,170,60,.12) 40%, transparent 68%)" }}
                />
                <motion.div
                  className="absolute h-[min(118vw,84svh)] w-[min(118vw,84svh)]"
                  initial={{ scale: 0, rotate: -120, opacity: 0 }}
                  animate={{ scale: 1, rotate: 0, opacity: scrollUp ? 0.4 : 1 }}
                  transition={{ duration: 1.3, ease: EASE, opacity: { duration: 0.8 } }}
                >
                  <Mandala className="h-full w-full drop-shadow-[0_0_10px_rgba(255,200,90,.6)]" />
                </motion.div>
                {sparks ? <SparkPortal mode="ring" intensity={scrollUp ? 0.4 : 1} className="absolute h-[min(118vw,84svh)] w-[min(118vw,84svh)]" /> : null}
              </motion.div>
            ) : null}
          </AnimatePresence>

          {/* ---------------- guides ---------------- */}
          {(
            [
              ["groom", "left-0 sm:left-6", -1],
              ["bride", "right-0 sm:right-6", 1],
            ] as const
          ).map(([who, pos, side]) => (
            <motion.div
              key={who}
              aria-hidden="true"
              className={`pointer-events-none absolute bottom-0 z-20 ${pos}`}
              initial={{ y: "100%", opacity: 0 }}
              animate={
                scrollUp
                  ? { y: "70%", opacity: 0, x: 0, rotate: 0 }
                  : portalUp
                    ? { y: "0%", opacity: 1, x: side * -14, rotate: side * -6 }
                    : { y: "0%", opacity: 1, x: 0, rotate: 0 }
              }
              transition={{ type: "spring", stiffness: 110, damping: 15, delay: portalUp ? 0 : who === "groom" ? 0.45 : 0.6 }}
              style={{ transformOrigin: "50% 100%" }}
            >
              <div className="guide-sway" style={{ animationDelay: who === "bride" ? "-1.6s" : "0s" }}>
                <Avatar who={who} mood={portalUp ? "cheer" : "wave"} eager className="h-[min(30svh,300px)] w-auto" />
              </div>
            </motion.div>
          ))}
          <AnimatePresence>
            {stage === "portal" ? (
              <motion.p
                key="welcome"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.5 }}
                className="absolute inset-x-6 top-[9svh] z-30 mx-auto max-w-xs text-center font-display text-xl italic leading-snug drop-shadow-[0_2px_6px_rgba(0,0,0,.8)]"
              >
                “{WELCOME.text}”
              </motion.p>
            ) : null}
          </AnimatePresence>

          {/* ---------------- the scroll, out of the portal ---------------- */}
          <AnimatePresence>
            {scrollUp ? (
              <motion.div
                key="scroll"
                className="absolute inset-0 z-30 flex flex-col items-center justify-center px-4"
                initial={{ clipPath: "circle(0% at 50% 50%)" }}
                animate={{ clipPath: "circle(80% at 50% 50%)" }}
                transition={{ duration: 1, ease: EASE }}
              >
                <motion.div className="w-[min(92vw,440px)]" initial={{ scale: 0.7, rotate: -6 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 110, damping: 14 }}>
                  <div aria-hidden="true" className="relative z-10 mx-auto h-3.5 w-[104%] -translate-x-[2%] rounded-full" style={{ background: "linear-gradient(#f3dc8f, #8a5f12)", boxShadow: "0 3px 8px rgba(0,0,0,.5)" }} />
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: "auto" }}
                    transition={{ duration: 1.1, ease: EASE, delay: 0.25 }}
                    className="overflow-hidden"
                    style={{ background: "linear-gradient(90deg, #ead9ac, #f9f0d6 12%, #f9f0d6 88%, #ead9ac)" }}
                  >
                    <div className="px-6 py-6 text-center text-[#3b2a1a] sm:px-9">
                      <p className="font-hindi text-base text-[#8a5f12]">॥ श्री गणेशाय नमः ॥</p>
                      <p className="mt-3 text-[0.68rem] uppercase tracking-[0.3em] text-[#8a5f12]">With the blessings of our elders</p>
                      <h2 className="mt-3 font-display text-[clamp(1.9rem,8.5vw,2.6rem)] leading-[1.05] text-[#6b1f2c] [text-wrap:balance]">Hrishikesh weds Nandita</h2>
                      <p className="mt-2 font-hindi text-base">ऋषिकेश एवं नंदिता का शुभ विवाह</p>
                      <div aria-hidden="true" className="mx-auto my-4 h-px w-2/3" style={{ background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)` }} />

                      <Scratch
                        label="Scratch for the date"
                        radius={22}
                        onReveal={() => {
                          setStage("revealed");
                          setBurst((n) => n + 1);
                        }}
                        className="mx-auto h-[5.5rem] max-w-xs rounded-sm"
                      >
                        <div className="flex h-[5.5rem] flex-col items-center justify-center bg-[#fffaf0]">
                          <p className="font-display text-[clamp(1.5rem,7vw,2rem)] leading-none text-[#6b1f2c]">1 &amp; 2 December 2026</p>
                          <p className="mt-1.5 font-hindi text-sm text-[#8a5f12]">१ एवं २ दिसंबर २०२६</p>
                        </div>
                      </Scratch>

                      <p className="mt-3 text-[0.68rem] uppercase tracking-[0.22em] text-[#5a4630]">La Cabana Beach Resort · Ashvem, North Goa</p>
                      <AnimatePresence>
                        {stage === "revealed" ? (
                          <motion.p
                            initial={{ opacity: 0, height: 0, scale: 0.9 }}
                            animate={{ opacity: 1, height: "auto", scale: 1 }}
                            transition={{ duration: 0.7, ease: EASE, delay: 0.2 }}
                            className="overflow-hidden pt-3 font-hindi text-[1.35rem] text-[#6b1f2c]"
                          >
                            🌸 आओ सा… पधारो सा… 🌸
                          </motion.p>
                        ) : null}
                      </AnimatePresence>

                      {/* the families' sign-off, in Hindi with a Hinglish line for everyone else */}
                      <div className="mx-auto mt-4 max-w-xs border-t border-[#d9a93f]/50 pt-3">
                        <p className="font-hindi text-base text-[#8a5f12]">आदर एवं स्नेह सहित</p>
                        <p className="font-hindi text-lg leading-snug text-[#6b1f2c]">ऋषिकेश एवं नंदिता के परिवार</p>
                        <p className="mt-1 font-display text-sm italic text-[#5a4630]">With aadar &amp; sneh, from the families of Hrishikesh &amp; Nandita</p>
                        {hasVoice("blessing") ? (
                          <button type="button" onClick={() => void playVoice("blessing")} aria-label="Hear a blessing from the family" className="mt-2 rounded-full border border-[#8a5f12]/60 px-2 py-0.5 text-[0.68rem] text-[#8a5f12] hover:bg-[#8a5f12]/10">
                            ▶ Hear
                          </button>
                        ) : null}
                      </div>
                    </div>
                  </motion.div>
                  <div aria-hidden="true" className="relative z-10 mx-auto h-3.5 w-[104%] -translate-x-[2%] rounded-full" style={{ background: "linear-gradient(#f3dc8f, #8a5f12)", boxShadow: "0 5px 10px rgba(0,0,0,.5)" }} />
                </motion.div>

                <div className="mt-6 h-14">
                  <AnimatePresence>
                    {stage === "revealed" ? (
                      <motion.button
                        type="button"
                        onClick={finish}
                        initial={{ opacity: 0, y: 12, scale: 0.92 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 16, delay: 0.5 }}
                        className="shine min-h-12 overflow-hidden rounded-sm px-8 font-display text-xl text-[#2a0f14] shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f3dc8f]"
                        style={{ background: "linear-gradient(135deg, #f3dc8f, #d9a93f)" }}
                      >
                        Enter the celebration · उत्सव में पधारें
                      </motion.button>
                    ) : null}
                  </AnimatePresence>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>

          {burst ? <SparkPortal key={burst} mode="burst" className="absolute inset-0 z-40 h-full w-full" /> : null}
          {stage === "revealed" ? <Petals count={8} className="z-40" /> : null}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
