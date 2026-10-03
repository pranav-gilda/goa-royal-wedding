# Voice notes

Drop recordings here and they switch on automatically (nothing to wire up).
Until a file exists, that moment just shows its caption.

| File name            | Plays when                                    | Who          |
| -------------------- | --------------------------------------------- | ------------ |
| `welcome.mp3`        | The envelope opens (after pulling the thread) | Hrishi & Nandita |
| `blessing.mp3`       | The scroll unrolls                            | Dadaji / Dadiji / parents |
| `thanks.mp3`         | After an RSVP is sent                         | Hrishi & Nandita |

- `.mp3`, `.m4a`, `.wav` or `.ogg` all work. A phone voice memo is fine.
- Keep each clip to about 5-10 seconds (under ~100 KB). Mono, quiet room, phone close to the mouth.
- The caption shown on screen must match what is said. Edit the text at the top of
  `src/components/wedding/Intro.tsx` (`WELCOME`, `BLESSING`) and in `RsvpSection.tsx` (thank-you line).
