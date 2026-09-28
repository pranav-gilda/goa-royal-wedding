import { Reveal, SectionHeading, GoldDivider } from "./decor";
import coupleArt from "@/assets/couple-art.png";
import venueArt from "@/assets/venue-art.png";

/* ------------------------------------------------------------------ */
/* Family invitation (orthodox tone, Hindi + English)                  */
/* ------------------------------------------------------------------ */

export function Invite() {
  return (
    <section id="invite" className="relative px-6 py-16 md:py-28">
      <SectionHeading
        hindi="सश्रद्ध शुभ निमंत्रण"
        english="The Families Invite You"
      />
      <Reveal delay={0.15} className="mt-9 md:mt-12">
        <div className="invite-card gold-frame mx-auto max-w-2xl px-6 py-10 text-center sm:px-8 md:px-14 md:py-14">
          <p className="font-hindi text-lg text-gold-dark">
            ॥ श्री गणेशाय नमः ॥
          </p>
          <p className="mt-8 text-sm uppercase tracking-[0.3em] text-gold-dark">
            With the blessings of our elders
          </p>
          <p className="mt-6 font-hindi text-lg leading-relaxed">
            शर्मा एवं गुप्ता परिवार आपके एवं आपके परिवार को
            <br />
            परम स्नेह के साथ आमंत्रित करते हैं
          </p>
          <p className="mt-8 text-base leading-relaxed opacity-80">
            We, the Sharma &amp; Gupta families, joyfully invite you and your
            family to grace the auspicious wedding of our beloved children
          </p>
          <p className="gold-text mt-8 font-display text-5xl md:text-6xl">
            Aarav weds Diya
          </p>
          <p className="mt-4 font-hindi text-xl">आरव एवं दिया का शुभ विवाह</p>
          <GoldDivider className="mt-10 opacity-70" />
          <p className="mt-8 font-display text-2xl">
            12 &amp; 13 December 2026
          </p>
          <p className="mt-2 text-sm uppercase tracking-[0.3em] opacity-70">
            La Cabana Beach &amp; Spa · Goa
          </p>
          <p className="mt-8 font-hindi text-lg leading-relaxed opacity-90">
            आपकी उपस्थिति ही हमारी सबसे बड़ी शोभा है
          </p>
          <p className="mt-2 text-sm italic opacity-70">
            Your presence is our greatest celebration.
          </p>
        </div>
      </Reveal>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Couple story — short hero & heroine arc                             */
/* ------------------------------------------------------------------ */

const STORY = [
  {
    hindi: "पहली मुलाकात",
    title: "The First Hello",
    text: "A family wedding in Hyderabad, one crowded table — and a conversation that simply refused to end.",
  },
  {
    hindi: "सफ़र",
    title: "The Journey",
    text: "Different cities, long calls, endless chai. Somewhere between it all, friendship quietly became love.",
  },
  {
    hindi: "हाँ!",
    title: "The Yes",
    text: "One nervous question, one happy yes — and now two families, one celebration, and you.",
  },
];

export function CoupleStory() {
  return (
    <section id="story" className="px-6 py-16 md:py-28">
      <SectionHeading hindi="हमारी कहानी" english="Our Little Story" />
      <div className="mx-auto mt-10 grid max-w-5xl items-center gap-9 md:mt-14 md:grid-cols-2 md:gap-12">
        <Reveal>
          <div className="gold-frame overflow-hidden rounded-sm">
            <img
              src={coupleArt}
              alt="Mughal-style painting of the couple under a marigold mandap"
              width={1200}
              height={1200}
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </div>
        </Reveal>
        <ol className="relative space-y-9 border-l border-primary/30 pl-8 md:space-y-12">
          {STORY.map((beat, i) => (
            <li key={beat.title} className="relative">
              <span className="absolute -left-[41px] top-1.5 flex h-5 w-5 items-center justify-center rounded-full border border-primary/60 bg-background">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              </span>
              <Reveal delay={i * 0.12}>
                <p className="font-hindi text-primary">{beat.hindi}</p>
                <h3 className="mt-1 font-display text-3xl">{beat.title}</h3>
                <p className="mt-3 leading-relaxed text-muted-foreground">
                  {beat.text}
                </p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Events — 2 days, 6 functions, dress codes                           */
/* ------------------------------------------------------------------ */

type WeddingEvent = {
  day: 1 | 2;
  name: string;
  hindi: string;
  time: string;
  venue: string;
  dress: string;
};

// PLACEHOLDER dates, times, venues and dress codes — easy to edit.
const EVENTS: WeddingEvent[] = [
  {
    day: 1,
    name: "Haldi",
    hindi: "हल्दी",
    time: "10:00 AM onwards",
    venue: "Palace Lawn",
    dress: "Shades of yellow",
  },
  {
    day: 1,
    name: "Mehndi",
    hindi: "मेहंदी",
    time: "3:00 PM onwards",
    venue: "Garden Pavilion",
    dress: "Bright & colourful",
  },
  {
    day: 1,
    name: "Sangeet",
    hindi: "संगीत",
    time: "7:30 PM onwards",
    venue: "Grand Ballroom",
    dress: "Jewel tones & glam",
  },
  {
    day: 2,
    name: "Baraat & Pheras",
    hindi: "विवाह",
    time: "10:30 AM onwards",
    venue: "Seaside Mandap",
    dress: "Traditional red & gold",
  },
  {
    day: 2,
    name: "Reception",
    hindi: "स्वागत समारोह",
    time: "7:00 PM onwards",
    venue: "Palace Courtyard",
    dress: "Regal formal",
  },
  {
    day: 2,
    name: "Farewell Dinner",
    hindi: "विदाई भोज",
    time: "10:30 PM onwards",
    venue: "Ocean Deck",
    dress: "Comfortable chic",
  },
];

export function Events() {
  return (
    <section id="events" className="relative px-6 py-16 md:py-28">
      <div className="absolute inset-0 bg-secondary/30" />
      <div className="relative mx-auto max-w-6xl">
        <SectionHeading
          hindi="दो दिन, छह उत्सव"
          english="Two Days of Celebration"
          sub="Day 1 · 12 December — Day 2 · 13 December · dates to confirm"
        />
        <div className="mt-10 grid gap-5 md:mt-14 md:grid-cols-2 lg:grid-cols-3">
          {EVENTS.map((event, i) => (
            <Reveal key={event.name} delay={(i % 3) * 0.12}>
              <article className="gold-frame flex h-full flex-col rounded-sm bg-card p-6 md:p-7">
                <span className="w-fit rounded-full border border-primary/40 px-3 py-1 text-xs uppercase tracking-[0.2em] text-primary">
                  Day {event.day} · दिन {event.day === 1 ? "१" : "२"}
                </span>
                <h3 className="mt-5 font-display text-3xl">{event.name}</h3>
                <p className="mt-1 font-hindi text-lg text-primary">
                  {event.hindi}
                </p>
                <dl className="mt-5 space-y-2 text-sm text-muted-foreground">
                  <div className="flex gap-2">
                    <dt className="w-16 shrink-0 uppercase tracking-wider">
                      Time
                    </dt>
                    <dd>{event.time}</dd>
                  </div>
                  <div className="flex gap-2">
                    <dt className="w-16 shrink-0 uppercase tracking-wider">
                      Where
                    </dt>
                    <dd>{event.venue}</dd>
                  </div>
                </dl>
                <p className="mt-auto pt-6">
                  <span className="inline-block rounded-full bg-primary/15 px-4 py-1.5 text-xs tracking-wide text-primary">
                    Dress code · {event.dress}
                  </span>
                </p>
              </article>
            </Reveal>
          ))}
        </div>
        <p className="mt-8 text-center text-xs tracking-wide text-muted-foreground">
          Dates, timings &amp; function spaces are placeholders — final details will be shared
          soon.
        </p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Travel & stay — Hyderabad → Goa                                     */
/* ------------------------------------------------------------------ */

const TRAVEL = [
  {
    hindi: "यात्रा",
    title: "Getting to Goa",
    text: "Direct flights from Hyderabad reach Goa in about 1 hr 20 min. Recommended flights and train options will be shared here soon.",
    chip: "Timings to follow",
  },
  {
    hindi: "पिकअप",
    title: "Taxis & Pickups",
    text: "We're arranging group pickups and drops from the airport and railway station. Share your travel plans in the RSVP below and we'll coordinate your ride.",
    chip: "Share your arrival in RSVP",
  },
  {
    hindi: "ठहराव",
    title: "Where to Stay",
    text: "Rooms are blocked for our guests at the palace resort. Booking details and codes will follow shortly.",
    chip: "Details to follow",
  },
];

export function Travel() {
  return (
    <section id="travel" className="px-6 py-16 md:py-28">
      <SectionHeading
        hindi="हैदराबाद से गोवा"
        english="Travel & Stay"
        sub="Most of us are travelling from Hyderabad — let's get there together."
      />
      <div className="mx-auto mt-10 grid max-w-6xl items-center gap-10 md:mt-14 md:grid-cols-2">
        <Reveal className="order-2 md:order-1">
          <div className="space-y-6">
            {TRAVEL.map((card, i) => (
              <Reveal key={card.title} delay={i * 0.12}>
                 <article className="gold-frame rounded-sm bg-card p-6">
                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className="min-w-0 font-display text-2xl">{card.title}</h3>
                    <span className="shrink-0 font-hindi text-primary">{card.hindi}</span>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {card.text}
                  </p>
                  <span className="mt-4 inline-block rounded-full border border-primary/40 px-3 py-1 text-xs tracking-wide text-primary">
                    {card.chip}
                  </span>
                </article>
              </Reveal>
            ))}
          </div>
        </Reveal>
        <Reveal delay={0.2} className="order-1 md:order-2">
          <div className="gold-frame overflow-hidden rounded-sm">
            <img
              src={venueArt}
              alt="Illustrative beachside venue artwork, not a photograph of La Cabana"
              width={1280}
              height={1024}
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </div>
          <p className="mt-3 text-center text-xs tracking-wide text-muted-foreground">
             Illustration only · venue photographs to follow
          </p>
        </Reveal>
      </div>
      <Reveal className="mx-auto mt-12 max-w-6xl md:mt-16">
        <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] md:items-center md:gap-10">
          <div>
            <p className="font-hindi text-primary">उत्सव स्थल</p>
            <h3 className="mt-1 font-display text-3xl md:text-4xl">La Cabana Beach &amp; Spa</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">Goa, India · the location for our celebrations</p>
            <a href="https://maps.app.goo.gl/jRkJVZuf5HE1KmC69" target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex min-h-11 items-center border-b border-primary font-display text-lg text-primary hover:text-foreground">Open directions ↗</a>
          </div>
          <iframe
            title="La Cabana Beach & Spa location in Goa"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3842.040107578203!2d73.71780637539793!3d15.642852550710758!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bbfeec8c9230e3f%3A0x9f2ddb1c1db5d407!2sLa%20Cabana%20Beach%20%26%20Spa!5e0!3m2!1sen!2sus!4v1790556698789!5m2!1sen!2sus"
            className="aspect-[4/3] w-full border border-border md:aspect-[16/10]"
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>
      </Reveal>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Footer                                                              */
/* ------------------------------------------------------------------ */

export function Footer() {
  return (
     <footer className="px-6 pb-24 pt-12 text-center md:pt-16">
      <GoldDivider />
      <div className="mx-auto mt-10 flex h-20 w-20 items-center justify-center rounded-full border border-primary/60">
        <span className="gold-text font-display text-3xl">A·D</span>
      </div>
      <p className="mt-6 text-sm text-muted-foreground">
        With love &amp; blessings · स्नेह सहित
      </p>
      <p className="font-hindi mt-1 text-lg">शर्मा एवं गुप्ता परिवार</p>
      <p className="mt-6 text-xs tracking-wide text-muted-foreground">
        Questions? WhatsApp us · +91 XXXXX XXXXX (placeholder)
      </p>
    </footer>
  );
}
