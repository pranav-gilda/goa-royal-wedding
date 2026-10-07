import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import music from "@/assets/wedding-song.mp3.asset.json";
import { Button } from "@/components/ui/button";
import { registerMusic } from "@/lib/audio";

// A track dropped into src/assets/music/ replaces the Lovable-hosted default.
const LOCAL = Object.values(
  import.meta.glob("/src/assets/music/*.{mp3,m4a,aac,ogg}", { eager: true, query: "?url", import: "default" }) as Record<string, string>,
)[0];
const SONG = LOCAL ?? music.url;

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
    registerMusic(el);
    // Keep the button in step when the intro (or anything else) starts/stops the track.
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    el.addEventListener("play", onPlay);
    el.addEventListener("pause", onPause);

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
      registerMusic(null);
      el.removeEventListener("play", onPlay);
      el.removeEventListener("pause", onPause);
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
       <audio ref={audioRef} src={SONG} loop preload="none" />
       <Button
         type="button"
         variant="outline"
        onClick={toggle}
        aria-label={playing ? "Mute music" : "Play music"}
         className="fixed bottom-5 right-5 z-50 h-12 w-12 rounded-full border-primary/50 bg-background/90 p-0 text-primary shadow-sm backdrop-blur hover:bg-accent"
      >
        {playing ? (
          <Volume2 className="h-5 w-5" />
        ) : (
          <VolumeX className="h-5 w-5" />
        )}
       </Button>
    </>
  );
}
