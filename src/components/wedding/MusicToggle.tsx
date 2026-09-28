import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import music from "@/assets/wedding-music.mp3";

/**
 * Soft instrumental backdrop. Browsers block autoplay until the visitor
 * interacts, so we try immediately and fall back to unlocking on the
 * first tap / keypress. A visible toggle stays available throughout.
 */
export default function MusicToggle() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    el.volume = 0.3;

    const unlock = () => {
      el.play()
        .then(() => setPlaying(true))
        .catch(() => {});
    };

    el.play()
      .then(() => setPlaying(true))
      .catch(() => {
        window.addEventListener("pointerdown", unlock, { once: true });
        window.addEventListener("touchstart", unlock, { once: true });
        window.addEventListener("keydown", unlock, { once: true });
      });

    return () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("touchstart", unlock);
      window.removeEventListener("keydown", unlock);
    };
  }, []);

  const toggle = () => {
    const el = audioRef.current;
    if (!el) return;
    if (el.paused) {
      el.play()
        .then(() => setPlaying(true))
        .catch(() => {});
    } else {
      el.pause();
      setPlaying(false);
    }
  };

  return (
    <>
      <audio ref={audioRef} src={music} loop preload="auto" />
      <button
        onClick={toggle}
        aria-label={playing ? "Mute music" : "Play music"}
        className="fixed bottom-5 right-5 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-primary/50 bg-background/70 text-primary backdrop-blur transition hover:bg-primary/15"
      >
        {playing ? (
          <Volume2 className="h-5 w-5" />
        ) : (
          <VolumeX className="h-5 w-5" />
        )}
      </button>
    </>
  );
}
