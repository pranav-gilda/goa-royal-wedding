# Royal Goa Wedding Invite + RSVP

A single scrolling wedding invitation site with a royal jewel-toned aesthetic (emerald/royal blue, gold, peacock motifs), covering a 2-day, 6-function celebration in Goa, with an RSVP form that writes each response directly into the couple's Google Sheet.

## What guests will see

One long, elegant page:

1. **Hero** — couple's names (placeholders), wedding dates, "Goa" destination, ornate gold-framed design with peacock/paisley motifs, generated royal artwork as placeholder imagery (swapped for real photos later).
2. **Invitation message** — a warm formal invite note with family names (placeholder text).
3. **The Celebrations** — 6 event cards across 2 days:
   - Day 1: Haldi, Mehndi, Sangeet
   - Day 2: Wedding, Reception, Farewell/After-party
   - Each card: event name, date/time (placeholder), venue (placeholder), and a dress-code chip (e.g. "Shades of yellow", "Jewel tones", "Pastels", "Traditional red & gold") — easy to edit later.
4. **Venue & Travel** — Goa location section with placeholder resort name, map placeholder, and stay/travel notes.
5. **RSVP** — a royal-styled form: guest name(s), number of guests, email, phone number, plus attending/declining and per-event attendance checkboxes. Submit shows a thank-you confirmation.
6. **Footer** — contact note and monogram.

## Design direction

- Jewel tones: deep emerald + royal blue base, gold accents, ivory text panels
- Ornamental serif display font (e.g. Cormorant/Playfair) paired with a clean body font
- Gold filigree dividers, paisley/peacock generated motifs, soft scroll animations
- Fully responsive for phone viewing (most guests will open on mobile)

## How RSVP data reaches you (Google Sheets)

- You'll connect your Google account via the built-in Google Sheets connector (one click, in-chat card).
- On submit, the site validates the form and appends a row to your spreadsheet: name, guests, email, phone, attendance, events selected, timestamp.
- You'll need to share the spreadsheet ID (paste the sheet link) — or I can create a new spreadsheet in your Drive automatically on first use.
- All sheet writes happen server-side; guests never see your sheet or credentials.

## Technical details

- TanStack Start single route (`src/routes/index.tsx`) with section anchors; semantic design tokens in `src/styles.css` (oklch jewel palette).
- RSVP submit via `createServerFn` calling the Google Sheets API through the Lovable connector gateway (`google_sheets` connector, `values:append`).
- Zod validation client- and server-side (name required, valid email, phone, guest count 1–10).
- Generated placeholder images (hero, event motifs, venue) saved under `src/assets/`; marked clearly so real photos drop in later.
- Per-route `head()` metadata with wedding-specific title/description.

## Build order

1. Design tokens + fonts + styles
2. Page sections with placeholder content and generated imagery
3. RSVP form UI + validation
4. Google Sheets connector link + server function append
5. End-to-end test: submit RSVP, verify row appears in sheet
