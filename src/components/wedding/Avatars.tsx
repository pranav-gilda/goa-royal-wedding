import type { ReactNode } from "react";

/**
 * Hand-drawn SVG guide characters. Pure vector, no images, no ids, so they
 * cost a few KB in total and can be animated with CSS alone.
 *
 * Swap the SKIN / outfit colours below to tune the likeness.
 */

export type Who = "groom" | "bride" | "dada" | "dadi";
export type Mood = "idle" | "wave" | "cheer" | "sad" | "namaste" | "pull";

const INK = "#2b1d14";
const GOLD = "#d9a93f";
const GOLD_DARK = "#a8761a";

const SKIN: Record<Who, string> = {
  groom: "#c98f62",
  bride: "#d49c6e",
  dada: "#bc8359",
  dadi: "#c68d63",
};

const TORSO = "M8 140 C8 112 28 98 48 94 L72 94 C92 98 112 112 112 140 Z";

function Face({ mood, skin, brow = INK, mouthY = 0 }: { mood: Mood; skin: string; brow?: string; mouthY?: number }) {
  const happy = mood === "cheer";
  const sad = mood === "sad";
  return (
    <g>
      <ellipse cx="37" cy="60" rx="4.5" ry="7" fill={skin} />
      <ellipse cx="83" cy="60" rx="4.5" ry="7" fill={skin} />
      <ellipse cx="60" cy="58" rx="23" ry="27" fill={skin} />
      <path d="M60 60 Q57.5 66 61.5 67" stroke="#000" strokeOpacity=".22" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      <circle cx="45" cy="67" r="4.5" fill="#e0675a" opacity=".2" />
      <circle cx="75" cy="67" r="4.5" fill="#e0675a" opacity=".2" />
      <g className="av-blink">
        {happy ? (
          <>
            <path d="M45.5 59 Q50 53.5 54.5 59" stroke={INK} strokeWidth="2.2" fill="none" strokeLinecap="round" />
            <path d="M65.5 59 Q70 53.5 74.5 59" stroke={INK} strokeWidth="2.2" fill="none" strokeLinecap="round" />
          </>
        ) : (
          <>
            <circle cx="50" cy="58" r="2.6" fill={INK} />
            <circle cx="70" cy="58" r="2.6" fill={INK} />
            <circle cx="50.8" cy="57.1" r=".8" fill="#fff" />
            <circle cx="70.8" cy="57.1" r=".8" fill="#fff" />
          </>
        )}
      </g>
      {sad ? (
        <>
          <path d="M44 53 Q50 51 56 48.5" stroke={brow} strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M64 48.5 Q70 51 76 53" stroke={brow} strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M45 62 q-2.2 4 0 6 q2.2 -2 0 -6z" fill="#7cc4ff" />
        </>
      ) : (
        <>
          <path d="M44 51 Q50 47.5 56 50" stroke={brow} strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M64 50 Q70 47.5 76 51" stroke={brow} strokeWidth="2" fill="none" strokeLinecap="round" />
        </>
      )}
      <g transform={`translate(0 ${mouthY})`}>
        {happy ? (
          <>
            <path d="M50 69 Q60 84 70 69 Z" fill="#7a2a2a" />
            <ellipse cx="60" cy="77" rx="4" ry="2.4" fill="#e36b6b" />
          </>
        ) : sad ? (
          <path d="M53 76 Q60 69.5 67 76" stroke="#7a3128" strokeWidth="2.2" fill="none" strokeLinecap="round" />
        ) : (
          <path d="M52 71 Q60 77.5 68 71" stroke="#7a3128" strokeWidth="2.2" fill="none" strokeLinecap="round" />
        )}
      </g>
    </g>
  );
}

function Neck({ skin }: { skin: string }) {
  return (
    <g>
      <rect x="52" y="80" width="16" height="18" fill={skin} />
      <path d="M52 82 Q60 92 68 82 L68 92 L52 92 Z" fill="#000" opacity=".13" />
    </g>
  );
}

function Hand({ skin, sleeve }: { skin: string; sleeve: string }) {
  return (
    <g className="av-wave">
      <rect x="-5" y="-2" width="10" height="30" rx="4" fill={sleeve} />
      <ellipse cx="0" cy="-8" rx="6.5" ry="8" fill={skin} />
      <rect x="-6.5" y="-23" width="3" height="11" rx="1.5" fill={skin} />
      <rect x="-3" y="-25" width="3" height="13" rx="1.5" fill={skin} />
      <rect x="0.2" y="-25" width="3" height="13" rx="1.5" fill={skin} />
      <rect x="3.5" y="-22" width="3" height="10" rx="1.5" fill={skin} />
      <rect x="-10" y="-12" width="5" height="3" rx="1.5" fill={skin} transform="rotate(-30 -8 -10)" />
    </g>
  );
}

function Namaste({ skin }: { skin: string }) {
  return (
    <g>
      <path d="M60 104 C71 113 69 127 60 136 C51 127 49 113 60 104 Z" fill={skin} stroke="#000" strokeOpacity=".25" strokeWidth="1" />
      <path d="M60 106 L60 134" stroke="#000" strokeOpacity=".25" strokeWidth="1" />
    </g>
  );
}

function Sparkles() {
  const star = "M0 -6 L1.6 -1.6 L6 0 L1.6 1.6 L0 6 L-1.6 1.6 L-6 0 L-1.6 -1.6 Z";
  return (
    <g fill={GOLD}>
      {/* position on the outer <g>; the CSS animation owns the inner path's transform */}
      <g transform="translate(14 28)"><path className="av-twinkle" d={star} /></g>
      <g transform="translate(106 22) scale(.8)"><path className="av-twinkle av-twinkle-b" d={star} /></g>
      <g transform="translate(100 62) scale(.6)"><path className="av-twinkle av-twinkle-c" d={star} /></g>
    </g>
  );
}

/* ---------------------------- characters ---------------------------- */

function Groom({ mood }: { mood: Mood }) {
  const skin = SKIN.groom;
  return (
    <g>
      <path d={TORSO} fill="#f3e4c4" />
      <path d="M47 92 Q60 102 73 92 L73 97 Q60 107 47 97 Z" fill={GOLD} />
      <path d="M60 106 L60 140" stroke={GOLD_DARK} strokeWidth="1.2" />
      <circle cx="60" cy="114" r="1.8" fill={GOLD} />
      <circle cx="60" cy="124" r="1.8" fill={GOLD} />
      <circle cx="60" cy="134" r="1.8" fill={GOLD} />
      <path d="M22 108 C32 98 42 102 46 112 L62 140 L38 140 L26 122 Z" fill="#8e1b3a" />
      <path d="M22 108 C32 98 42 102 46 112" stroke={GOLD} strokeWidth="2" fill="none" />
      <Neck skin={skin} />
      <Face mood={mood} skin={skin} mouthY={2.5} />
      <path d="M48.5 69.5 Q54 65.5 60 68.5 Q66 65.5 71.5 69.5 Q66 68.5 60 71 Q54 68.5 48.5 69.5 Z" fill={INK} />
      <ellipse cx="60" cy="31" rx="27" ry="13" fill="#e4772c" />
      <path d="M33 52 C30 26 90 26 87 52 C84 44 78 42 60 42 C42 42 36 44 33 52 Z" fill="#e4772c" />
      <path d="M38 38 C48 28 72 28 82 38" stroke="#f7b15c" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M34 46 C46 39 74 39 86 46" stroke="#b9531a" strokeWidth="2.5" fill="none" />
      <path d="M33.5 50 C46 43.5 74 43.5 86.5 50 L86.5 54.5 C74 48.5 46 48.5 33.5 54.5 Z" fill={GOLD} />
      <path d="M60 33 q-5 -11 3 -19 q7 9 -3 19 Z" fill="#1f7a5a" />
      <circle cx="60" cy="38" r="3.4" fill={GOLD} />
      <circle cx="60" cy="38" r="1.5" fill="#c21e3a" />
      {mood === "wave" ? (
        <g transform="translate(99 108) rotate(-8)">
          <Hand skin={skin} sleeve="#f3e4c4" />
        </g>
      ) : null}
      {mood === "cheer" ? (
        <>
          <g transform="translate(100 112) rotate(14)"><Hand skin={skin} sleeve="#f3e4c4" /></g>
          <g transform="translate(20 112) rotate(-14)"><Hand skin={skin} sleeve="#f3e4c4" /></g>
        </>
      ) : null}
      {mood === "namaste" ? <Namaste skin={skin} /> : null}
    </g>
  );
}

type Veiled = { skin: string; hair: string; veil: string; veilDark: string; body: string; brow?: string; bindi: string };

function VeiledWoman({ mood, c, elder }: { mood: Mood; c: Veiled; elder?: boolean }) {
  return (
    <g>
      <path d="M26 140 L26 60 C26 18 94 18 94 60 L94 140 Z" fill={c.veilDark} />
      {elder ? <circle cx="60" cy="19" r="10" fill={c.hair} /> : null}
      <path d={TORSO} fill={c.body} />
      <path d="M46 94 Q60 114 74 94" stroke={GOLD} strokeWidth="3.2" fill="none" />
      {elder ? (
        <>
          <path d="M44 96 Q60 118 76 96" stroke="#1a1a1a" strokeWidth="1.6" fill="none" strokeDasharray="1.8 2.4" strokeLinecap="round" />
          <path d="M70 100 C84 106 96 122 98 140 L84 140 C82 124 76 112 66 104 Z" fill={c.veil} opacity=".9" />
        </>
      ) : (
        <>
          <path d="M44 96 Q60 122 76 96" stroke={GOLD} strokeWidth="2.2" fill="none" />
          <circle cx="60" cy="113" r="3" fill={GOLD} />
          <circle cx="60" cy="113" r="1.2" fill="#c21e3a" />
        </>
      )}
      <Neck skin={c.skin} />
      <Face mood={mood} skin={c.skin} brow={c.brow ?? INK} />
      <path d="M38 56 C40 33 80 33 82 56 C72 44 48 44 38 56 Z" fill={c.hair} />
      <path d="M60 36 L60 45" stroke="#000" strokeOpacity=".3" strokeWidth="1.2" />
      <path d="M30 70 C24 16 96 16 90 70 L83.5 70 C86 36 34 36 36.5 70 Z" fill={c.veil} />
      <path d="M36.5 70 C34 36 86 36 83.5 70" stroke={GOLD} strokeWidth="2.2" fill="none" />
      <path d="M30 70 C24 16 96 16 90 70" stroke={GOLD} strokeWidth="1.2" fill="none" opacity=".7" />
      {elder ? null : (
        <>
          <path d="M60 44.5 L60 48" stroke={GOLD} strokeWidth="1.3" />
          <circle cx="60" cy="49.8" r="2.4" fill={GOLD} />
          <circle cx="66.6" cy="66.2" r="3" stroke={GOLD} strokeWidth="1.2" fill="none" />
        </>
      )}
      <circle cx="60" cy="54" r={elder ? 2.3 : 1.7} fill={c.bindi} />
      <circle cx="35" cy="71" r="2.5" fill={GOLD} />
      <path d="M32.5 73 h5 l-1 5 h-3 z" fill={GOLD} />
      <circle cx="85" cy="71" r="2.5" fill={GOLD} />
      <path d="M82.5 73 h5 l-1 5 h-3 z" fill={GOLD} />
    </g>
  );
}

function Bride({ mood }: { mood: Mood }) {
  const c: Veiled = { skin: SKIN.bride, hair: "#1d1410", veil: "#c21e3a", veilDark: "#8e1229", body: "#c21e3a", bindi: "#7a1010" };
  return (
    <g>
      <VeiledWoman mood={mood} c={c} />
      {mood === "wave" ? (
        <g transform="translate(21 108) rotate(8) scale(-1 1)">
          <Hand skin={c.skin} sleeve="#c21e3a" />
        </g>
      ) : null}
      {mood === "cheer" ? (
        <>
          <g transform="translate(100 112) rotate(14)"><Hand skin={c.skin} sleeve="#c21e3a" /></g>
          <g transform="translate(20 112) rotate(-14)"><Hand skin={c.skin} sleeve="#c21e3a" /></g>
        </>
      ) : null}
      {mood === "namaste" ? <Namaste skin={c.skin} /> : null}
      {mood === "pull" ? (
        // Raised arm gripping a cord at (103, 62): the rope is passed in as an SVG child by the caller.
        <g>
          <path d="M92 110 L101 74" stroke="#c21e3a" strokeWidth="11" strokeLinecap="round" />
          <path d="M101 74 L103 68" stroke={c.skin} strokeWidth="9" strokeLinecap="round" />
          <circle cx="103" cy="62" r="7" fill={c.skin} />
          <path d="M96.5 71 h13" stroke={GOLD} strokeWidth="2.6" strokeLinecap="round" />
        </g>
      ) : null}
    </g>
  );
}

function Dadi({ mood }: { mood: Mood }) {
  const c: Veiled = { skin: SKIN.dadi, hair: "#d6d6d6", veil: "#2f7d5b", veilDark: "#1f5c42", body: "#2f7d5b", bindi: "#c21e3a" };
  return (
    <g>
      <VeiledWoman mood={mood} c={c} elder />
      {mood === "namaste" ? <Namaste skin={c.skin} /> : null}
      {mood === "wave" ? (
        <g transform="translate(99 108) rotate(-8)">
          <Hand skin={c.skin} sleeve="#2f7d5b" />
        </g>
      ) : null}
    </g>
  );
}

function Dada({ mood }: { mood: Mood }) {
  const skin = SKIN.dada;
  return (
    <g>
      <path d={TORSO} fill="#efe3c8" />
      <path d="M8 140 C8 116 22 104 40 98 L52 104 L38 140 Z" fill="#d98a2b" />
      <path d="M112 140 C112 116 98 104 80 98 L68 104 L82 140 Z" fill="#d98a2b" />
      <path d="M40 98 L52 104 M80 98 L68 104" stroke={GOLD} strokeWidth="2" />
      <Neck skin={skin} />
      <path d="M36 52 C29 54 29 66 36.5 72 C34.5 64 35.5 58 40 52 Z" fill="#f2f2f2" />
      <path d="M84 52 C91 54 91 66 83.5 72 C85.5 64 84.5 58 80 52 Z" fill="#f2f2f2" />
      <Face mood={mood} skin={skin} brow="#cfcfcf" mouthY={2.5} />
      <path d="M46 34 C52 29 62 28 70 31" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity=".28" fill="none" />
      <circle cx="50" cy="58" r="7.6" stroke={INK} strokeWidth="1.7" fill="#fff" fillOpacity=".12" />
      <circle cx="70" cy="58" r="7.6" stroke={INK} strokeWidth="1.7" fill="#fff" fillOpacity=".12" />
      <path d="M57.6 57 Q60 55 62.4 57" stroke={INK} strokeWidth="1.6" fill="none" />
      <path d="M48.5 69.5 Q54 65.5 60 68.5 Q66 65.5 71.5 69.5 Q66 68.5 60 71 Q54 68.5 48.5 69.5 Z" fill="#f2f2f2" stroke="#d0d0d0" strokeWidth=".6" />
      <path d="M60 41 L60 47" stroke="#d9532b" strokeWidth="2.2" strokeLinecap="round" />
      {mood === "namaste" ? <Namaste skin={skin} /> : null}
      {mood === "wave" ? (
        <g transform="translate(99 108) rotate(-8)"><Hand skin={skin} sleeve="#d98a2b" /></g>
      ) : null}
    </g>
  );
}

/* ------------------------------ public ------------------------------ */

const NAMES: Record<Who, string> = { groom: "Hrishikesh", bride: "Nandita", dada: "Dadaji", dadi: "Dadiji" };

export function Avatar({ who, mood = "idle", className = "", children }: { who: Who; mood?: Mood; className?: string; children?: ReactNode }) {
  const body =
    who === "groom" ? <Groom mood={mood} /> : who === "bride" ? <Bride mood={mood} /> : who === "dada" ? <Dada mood={mood} /> : <Dadi mood={mood} />;
  return (
    <svg
      viewBox="0 0 120 140"
      aria-hidden="true"
      focusable="false"
      data-who={NAMES[who]}
      className={`${mood === "cheer" ? "av-bounce" : "av-bob"} ${className}`}
    >
      {body}
      {mood === "cheer" ? <Sparkles /> : null}
      {children}
    </svg>
  );
}
