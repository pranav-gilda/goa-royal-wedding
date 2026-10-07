import { Reveal, GoldDivider } from "./decor";
import resortGardens from "@/assets/resort-gardens.webp.asset.json";
import resortSeafront from "@/assets/resort-seafront.webp.asset.json";
import monogram from "@/assets/monogram.jpg";
import { Avatar } from "./Avatars";
import AddToCalendar from "./AddToCalendar";

/* ------------------------------------------------------------------ */
/* Travel & stay: one panel over the resort photo                      */
/* ------------------------------------------------------------------ */

export const MAPS_URL = "https://maps.app.goo.gl/jRkJVZuf5HE1KmC69";
const MAP_EMBED =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3842.040107578203!2d73.71780637539793!3d15.642852550710758!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bbfeec8c9230e3f%3A0x9f2ddb1c1db5d407!2sLa%20Cabana%20Beach%20%26%20Spa!5e0!3m2!1sen!2sus!4v1790556698789!5m2!1sen!2sus";

export function VenueLink({ className = "" }: { className?: string }) {
  return (
    <a
      href={MAPS_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`underline decoration-primary/40 underline-offset-4 transition hover:decoration-primary ${className}`}
    >
      La Cabana Beach Resort · Ashvem, North Goa ↗
    </a>
  );
}

function Detail({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.22em] text-primary">{label}</p>
      <p className="mt-1.5 font-display text-2xl leading-tight">{value}</p>
      <p className="text-muted-foreground">{note}</p>
    </div>
  );
}

export function Travel() {
  return (
    <section id="travel" className="relative overflow-hidden px-4 py-20 md:py-28">
      {/* the resort as the backdrop; a maroon wash keeps everything on top readable */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${resortSeafront.url}), url(${resortGardens.url})`, backgroundColor: "#3a1520" }}
      />
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-b from-[#1d090e]/80 via-[#2a0f14]/60 to-[#1d090e]/85" />

      <div className="relative mx-auto max-w-5xl">
        <Reveal className="text-center text-[#f3dc8f]">
          <p className="font-hindi text-xl">हैदराबाद से गोवा</p>
          <h2 className="mt-1 font-display text-5xl leading-tight">Travel &amp; Stay</h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-[#f3dc8f]/80">
            We look forward to welcoming you to Ashvem Beach, Mandrem, North Goa.
          </p>
        </Reveal>

        <Reveal delay={0.15} className="mt-10">
          <div className="gold-frame grid overflow-hidden rounded-sm bg-card/95 shadow-2xl backdrop-blur-sm md:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
            <div className="space-y-6 p-6 sm:p-8">
              <div>
                <p className="font-hindi text-primary">उत्सव स्थल</p>
                <h3 className="mt-1 font-display text-3xl leading-tight">
                  <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className="underline decoration-primary/40 underline-offset-[6px] transition hover:decoration-primary">
                    La Cabana Beach <span className="whitespace-nowrap">Resort ↗</span>
                  </a>
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">Ashvem Beach, Mandrem · North Goa</p>
              </div>
              <div className="grid grid-cols-2 gap-5 border-t border-border pt-6">
                <Detail label="Check in" value="1 Dec 2026" note="10:00 AM" />
                <Detail label="Check out" value="3 Dec 2026" note="10:00 AM" />
              </div>
              <div className="border-t border-border pt-6">
                <p className="text-xs uppercase tracking-[0.22em] text-primary">Airport pickup</p>
                <p className="mt-1.5 font-display text-2xl leading-tight">Manohar International Airport (GOX)</p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  Transfers run only from GOX. Share your arrival and departure in the RSVP so the family can arrange your pickup.
                </p>
              </div>
            </div>
            <iframe
              title="Map: La Cabana Beach Resort, Ashvem, North Goa"
              src={MAP_EMBED}
              className="h-72 w-full border-0 md:h-full md:min-h-[26rem]"
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
        </Reveal>
      </div>
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
      {/* the white of the watercolour monogram melts into the page via multiply */}
      <img src={monogram} alt="N H monogram" loading="lazy" className="mx-auto mt-8 w-56 mix-blend-multiply sm:w-64" />
      <div className="mt-2 flex items-end justify-center gap-2" aria-hidden="true">
        <Avatar who="groom" mood="namaste" className="h-32 w-auto" />
        <Avatar who="bride" mood="wave" className="h-32 w-auto" />
      </div>
      <p className="mt-6 font-hindi text-2xl text-primary">🌺 घणी-घणी मनुहार सा 🌺</p>
      <p className="mt-3 font-hindi text-base text-muted-foreground">आदर एवं स्नेह सहित</p>
      <p className="font-hindi mt-1 text-lg">ऋषिकेश एवं नंदिता के परिवार</p>
      <p className="mt-1 font-display text-sm italic text-muted-foreground">With aadar &amp; sneh, from the families of Hrishikesh &amp; Nandita</p>
       <p className="mt-5 font-display text-2xl italic text-primary">Hriday Se Nata · हृदय से नाता</p>
       <p className="mt-4 text-sm">
         <VenueLink className="text-foreground" />
       </p>
       <p className="text-xs text-muted-foreground">1 &amp; 2 December 2026</p>
       <div className="mt-3">
         <AddToCalendar compact />
       </div>
       <button type="button" onClick={() => window.dispatchEvent(new Event("hn-replay-intro"))} className="mt-4 mr-5 inline-block min-h-11 border-b border-primary pb-1 text-sm text-primary">Replay the invitation ✉</button>
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
