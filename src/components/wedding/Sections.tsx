import { Reveal, SectionHeading, GoldDivider } from "./decor";
import coupleArt from "@/assets/couple-art.png";
import resortGardens from "@/assets/resort-gardens.webp.asset.json";
import resortSeafront from "@/assets/resort-seafront.webp.asset.json";

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
            दोनों परिवार आपको एवं आपके समस्त परिवार को
            <br />
            परम स्नेह के साथ आमंत्रित करते हैं
          </p>
          <p className="mt-8 text-base leading-relaxed opacity-80">
            With the blessings of our elders, our families warmly invite you
            and your entire family to celebrate the auspicious wedding of
          </p>
          <p className="gold-text mt-8 font-display text-5xl md:text-6xl">
            Hrishikesh weds Nandita
          </p>
          <p className="mt-4 font-hindi text-xl">ऋषिकेश एवं नंदिता का शुभ विवाह</p>
          <GoldDivider className="mt-10 opacity-70" />
          <p className="mt-8 font-display text-2xl">
            1 &amp; 2 December 2026
          </p>
          <p className="mt-2 text-sm uppercase tracking-[0.3em] opacity-70">
            La Cabana Beach Resort · Ashvem Beach, North Goa
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
    text: "Every story begins somewhere. The details of ours will be shared here soon.",
  },
  {
    hindi: "सफ़र",
    title: "The Journey",
    text: "Two paths became one journey, with our families and their blessings beside us.",
  },
  {
    hindi: "हाँ!",
    title: "The Yes",
    text: "And now, a new beginning — made brighter by celebrating it with you.",
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
              alt="Illustration of a couple under a marigold mandap, not a portrait of Hrishikesh and Nandita"
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
/* Events — 2 days, 9 functions from the supplied itinerary             */
/* ------------------------------------------------------------------ */

type WeddingEvent = {
  day: 1 | 2;
  name: string;
  hindi: string;
  time: string;
  description: string;
};

// Names and timings follow the family's supplied December 2026 itinerary.
const EVENTS: WeddingEvent[] = [
  { day: 1, name: "Vinayak", hindi: "श्री गणेश पूजन", time: "11:00 AM", description: "Blessings to begin our journey with love and positivity." },
  { day: 1, name: "Maayra", hindi: "मायरा", time: "2:00–5:00 PM", description: "A celebration of love, gifts and togetherness." },
  { day: 1, name: "Sangeet", hindi: "संगीत", time: "6:30–10:00 PM", description: "An evening of music, dance and unforgettable performances." },
  { day: 1, name: "After Party", hindi: "उत्सव", time: "10:00 PM onwards", description: "Let the music keep you alive!" },
  { day: 2, name: "Boho Carnival", hindi: "उत्सव", time: "9:00 AM–12:00 PM", description: "Fun games, boho vibes and a perfect start to the day!" },
  { day: 2, name: "Safa Bandhai", hindi: "साफ़ा बंधाई", time: "2:00–3:00 PM", description: "A royal touch to our celebrations." },
  { day: 2, name: "Baaraat", hindi: "बारात", time: "3:00–5:00 PM", description: "Let the celebration ride in with joy and energy!" },
  { day: 2, name: "Jaimala", hindi: "जयमाला", time: "5:50 PM", description: "Two hearts, one promise for a lifetime." },
  { day: 2, name: "Shaadi & Dinner", hindi: "विवाह एवं रात्रिभोज", time: "6:40–11:00 PM", description: "Promises, blessings and a celebration to remember forever." },
];

export function Events() {
  return (
    <section id="events" className="relative px-6 py-16 md:py-28">
      <div className="absolute inset-0 bg-secondary/30" />
      <div className="relative mx-auto max-w-6xl">
        <SectionHeading
          hindi="दो दिन, नौ उत्सव"
          english="Two Days of Celebration"
          sub="1 December · Day 1 — 2 December · Day 2"
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
                <p className="mt-5 font-display text-xl text-primary">{event.time}</p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{event.description}</p>
              </article>
            </Reveal>
          ))}
        </div>
        <p className="mt-8 text-center text-xs tracking-wide text-muted-foreground">
          All events at La Cabana Beach &amp; Spa, Goa. Dress codes and exact function spaces to follow.
        </p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Travel & stay — Hyderabad → Goa                                     */
/* ------------------------------------------------------------------ */

export function Travel() {
  return (
    <section id="travel" className="px-6 py-16 md:py-28">
      <SectionHeading
        hindi="हैदराबाद से गोवा"
        english="Travel & Stay"
        sub="We look forward to welcoming you to Ashvem Beach, Mandrem, North Goa."
      />
      <div className="mx-auto mt-10 grid max-w-6xl items-center gap-10 md:mt-14 md:grid-cols-2">
        <Reveal className="order-2 md:order-1">
          <div className="space-y-8 border-y border-border py-8">
            <div><p className="font-hindi text-primary">आगमन एवं प्रस्थान</p><h3 className="mt-1 font-display text-3xl">Your stay in Goa</h3></div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div><p className="text-xs uppercase text-primary">Check in</p><p className="mt-2 font-display text-2xl">1 December 2026</p><p className="text-muted-foreground">10:00 AM</p></div>
              <div><p className="text-xs uppercase text-primary">Check out</p><p className="mt-2 font-display text-2xl">3 December 2026</p><p className="text-muted-foreground">10:00 AM</p></div>
            </div>
            <div className="border-t border-border pt-6"><p className="text-xs uppercase text-primary">Airport transfers</p><p className="mt-2 leading-relaxed">Transportation is available only from Goa’s Manohar International Airport (GOX).</p><p className="mt-2 text-sm text-muted-foreground">Please share your arrival and departure details in your RSVP so the family can coordinate.</p></div>
          </div>
        </Reveal>
        <Reveal delay={0.2} className="order-1 md:order-2">
          <div className="overflow-hidden rounded-sm">
            <img
              src={resortGardens.url}
              alt="Palm-lined walkway and cottages at La Cabana Beach Resort"
              width={860}
              height={483}
              loading="lazy"
              className="aspect-[16/10] w-full object-cover"
            />
          </div>
          <img src={resortSeafront.url} alt="La Cabana Beach Resort's seaside pool at dusk" width={500} height={333} loading="lazy" className="mt-3 aspect-[16/10] w-full rounded-sm object-cover" />
        </Reveal>
      </div>
      <Reveal className="mx-auto mt-12 max-w-6xl md:mt-16">
        <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] md:items-center md:gap-10">
          <div>
            <p className="font-hindi text-primary">उत्सव स्थल</p>
            <h3 className="mt-1 font-display text-3xl md:text-4xl">La Cabana Beach Resort</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">Ashvem Beach, Mandrem · North Goa</p>
            <a href="https://maps.app.goo.gl/jRkJVZuf5HE1KmC69" target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex min-h-11 items-center border-b border-primary font-display text-lg text-primary hover:text-foreground">Open directions ↗</a>
          </div>
          <iframe
             title="La Cabana Beach Resort location in Goa"
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
         <span className="font-display text-3xl text-primary">H·N</span>
      </div>
      <p className="mt-6 text-sm text-muted-foreground">
        With love &amp; blessings · स्नेह सहित
      </p>
      <p className="font-hindi mt-1 text-lg">ऋषिकेश एवं नंदिता के परिवार</p>
       <p className="mt-5 font-display text-2xl italic text-primary">Hriday Se Nata · हृदय से नाता</p>
       <a className="mt-4 inline-block border-b border-primary pb-1 text-sm text-primary" href="https://www.instagram.com/hridaysenata_?stkn=OWh4azlvd3E2dXNr" target="_blank" rel="noopener noreferrer">Follow our moments on Instagram ↗</a>
       <p className="mt-8 text-sm text-muted-foreground">For travel and wedding queries</p>
       <div className="mt-3 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
         <a href="tel:+919030023501">Mahesh · 9030023501</a>
         <a href="tel:+918790063653">Aditya · 8790063653</a>
         <a href="tel:+919032377026">Anirudh · 9032377026</a>
       </div>
    </footer>
  );
}
