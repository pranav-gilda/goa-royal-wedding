/**
 * Tiny audio bus shared by the background music and the family's voice notes.
 *
 * Voice clips are optional: drop files named welcome / blessing / thanks
 * (.mp3 or .m4a) into src/assets/voice/ and they light up automatically.
 * Until then hasVoice() is false and the UI simply shows the caption.
 */

export type VoiceName = "welcome" | "blessing" | "thanks";

const files = import.meta.glob("/src/assets/voice/*.{mp3,m4a,wav,ogg}", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

export function voiceUrl(name: VoiceName): string | undefined {
  const key = Object.keys(files).find((k) => new RegExp(`/${name}\\.[a-z0-9]+$`, "i").test(k));
  return key ? files[key] : undefined;
}

export function hasVoice(name: VoiceName): boolean {
  return Boolean(voiceUrl(name));
}

const MUSIC_VOLUME = 0.3;
const DUCKED_VOLUME = 0.07;

let music: HTMLAudioElement | null = null;
let current: HTMLAudioElement | null = null;

export function registerMusic(el: HTMLAudioElement | null) {
  music = el;
}

/** Starts the background track. Call from a tap/click so browsers allow it. */
export function startMusic() {
  if (!music) return;
  music.volume = MUSIC_VOLUME;
  music.play().catch(() => {});
}

function duck(on: boolean) {
  if (music && !music.paused) music.volume = on ? DUCKED_VOLUME : MUSIC_VOLUME;
}

export function stopVoice() {
  if (current) {
    current.pause();
    current = null;
    duck(false);
  }
}

/**
 * Plays a voice note, lowering the music underneath. Resolves true when the
 * clip started, false when there is no file or the browser blocked playback.
 */
export async function playVoice(name: VoiceName, onEnd?: () => void): Promise<boolean> {
  const src = voiceUrl(name);
  if (!src) return false;
  stopVoice();
  const el = new Audio(src);
  el.volume = 1;
  el.addEventListener("ended", () => {
    if (current === el) current = null;
    duck(false);
    onEnd?.();
  });
  try {
    await el.play();
  } catch {
    return false;
  }
  current = el;
  duck(true);
  return true;
}
