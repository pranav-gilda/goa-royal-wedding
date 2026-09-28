import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import music from "@/assets/wedding-song.mp3.asset.json";
import { Button } from "@/components/ui/button";

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
       <audio ref={audioRef} src={music.url} loop preload="none" />
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
