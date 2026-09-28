# Royal Marwari Wedding Invite + RSVP (Goa)

A single scrolling, grand royal wedding invitation for a 2-day, 6-function Marwari wedding in Goa. Orthodox "entire family invites you" tone with Hindi + English text, jewel-toned royal aesthetic (emerald/royal blue, gold, peacock/paisley motifs), smooth scroll animations, a short couple's story arc, background music on open, and an RSVP form that writes directly into the family's Google Sheet.

## What guests will see (one long scroll)

1. **Hero** — ornate gold-framed opening: couple's names (placeholders) in elegant Hindi + English, wedding dates, "Goa" destination, generated royal artwork (palace/paisley/peacock motifs) as placeholders for real photos later. Background instrumental music starts on open (with a visible mute toggle, since browsers require a tap to allow sound).
2. **Family invitation (orthodox style)** — formal Hindi + English invite in the traditional voice: both families' names (placeholders) warmly inviting the guest's entire family, with blessings line (e.g. शुभ विवाह).
3. **The Couple** — a very short, quick "hero & heroine" story arc: 3–4 beats (how they met → the journey → the yes) with small animated illustrations/placeholders, kept snappy.
4. **The Celebrations — 2 days, 6 functions** — event cards with Hindi + English names:
   - Day 1: Haldi (हल्दी), Mehndi (मेहंदी), Sangeet (संगीत)
   - Day 2: Wedding / Pheras (विवाह), Reception (स्वागत समारोह), Farewell dinner
   - Each card: date/time (placeholder), venue (placeholder), dress-code chip (e.g. "Shades of yellow", "Jewel tones", "Traditional red & gold") — easy to edit later.
5. **Travel & Stay (Hyderabad → Goa)** — section for travel coordination: placeholder blocks for flight/train timings, taxi & pickup-drop arrangements, and stay details. Built as a simple structured section now so details drop in later without redesign.
6. **RSVP** — royal-styled form: guest name(s), number of guests, email, phone number, attending/declining, and per-event attendance checkboxes. Thank-you confirmation on submit.
7. **Footer** — family contact note + monogram.

## Design & motion direction

- Jewel tones: deep emerald + royal blue, gold filigree, ivory panels; peacock/paisley generated motifs
- Ornamental serif display (Cormorant/Playfair) + Devanagari-supporting font (e.g. Tiro Devanagari Hindi) for Hindi text
- Smooth scroll-reveal animations (fade/rise on section entry), subtle gold shimmer, gentle parallax on hero
- Optional short looping ambient video moments in the scroll (e.g. drifting marigolds/diyas) if they elevate without slowing load — decide during build
- Background music: soft instrumental loop with autoplay-after-first-tap handling + mute control
- Mobile-first (most guests open on phones)

## How RSVP data reaches you (Google Sheets)

- You connect your Google account via the built-in Google Sheets connector (one-click in-chat card).
- On submit, the site validates and appends a row to your spreadsheet: name, guests, email, phone, attendance, events selected, timestamp.
- You'll paste your sheet link (spreadsheet ID), or I can create a fresh spreadsheet in your Drive on first use.
- All writes happen server-side; guests never see the sheet or credentials.

## Technical details

- TanStack Start single route (`src/routes/index.tsx`) with section anchors; semantic design tokens in `src/styles.css` (oklch jewel palette); fonts loaded via `<link>` in `__root.tsx`.
- RSVP submit via `createServerFn` → Google Sheets API through the Lovable connector gateway (`values:append`).
- Zod validation client- and server-side (name required, valid email, phone, guest count 1–10).
- Generated placeholder images under `src/assets/` (hero, couple story beats, event motifs, venue), clearly swappable for real photos.
- Scroll animations via Motion for React (scroll-triggered reveals); music via a small audio element with user-gesture unlock.
- Per-route `head()` metadata with wedding-specific title/description.

## Build order

1. Design tokens, fonts (incl. Devanagari), base styles
2. Hero + family invitation + couple story sections with generated placeholder art
3. Events, dress codes, travel/stay sections
4. RSVP form UI + validation + music/animation polish
5. Google Sheets connector link + server append function
6. End-to-end test: submit RSVP, verify row appears in sheet
