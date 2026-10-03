import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { GoldDivider, Reveal, SectionHeading } from "./decor";
import { Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, type Mood } from "./Avatars";
import { Bubble, type GuideLine } from "./Guide";
import Petals from "./Petals";
import { hasVoice, playVoice } from "@/lib/audio";

const MODES = ["Flight", "Train", "Road", "Other"] as const;

const inputClass =
  "w-full min-h-12 rounded-sm border border-input bg-card px-4 py-3 text-base text-foreground placeholder:text-muted-foreground/60 focus:border-primary/70 focus:outline-none focus:ring-1 focus:ring-ring";
const labelClass = "mb-2 block text-sm tracking-wide text-muted-foreground";
const errorClass = "mt-1.5 text-xs text-destructive";
const fileClass =
  "block w-full text-sm text-muted-foreground file:mr-3 file:min-h-11 file:rounded-sm file:border file:border-primary/50 file:bg-background file:px-4 file:text-foreground";

function Field({ label, htmlFor, error, children }: { label: string; htmlFor?: string; error?: string | undefined; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={htmlFor} className={labelClass}>{label}</label>
      {children}
      {error ? <p className={errorClass}>{error}</p> : null}
    </div>
  );
}

function Choice({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <Button
      type="button"
      variant="outline"
      aria-pressed={active}
      onClick={onClick}
      className={`h-auto min-h-11 whitespace-normal rounded-sm px-4 py-2 text-sm transition active:scale-95 ${
        active ? "border-primary bg-primary/20 text-primary" : "border-border text-foreground hover:border-primary/50"
      }`}
    >
      {children}
    </Button>
  );
}

type Guest = { name: string; phone: string; type: "adult" | "child" };
type GuestErr = { name?: string; phone?: string };
const MAX_GUESTS = 15;

type ErrKey = "name" | "email" | "phone" | "attending" | "arrivalDate" | "departureDate" | "idFiles" | "arrivalFiles" | "departureFiles";
type Errs = Partial<Record<ErrKey, string>>;

function checkFiles(list: FileList | null): string | undefined {
  if (!list) return undefined;
  if (list.length > 5) return "Up to 5 files, please";
  for (const f of Array.from(list)) {
    if (f.size > 10 * 1024 * 1024) return `${f.name} is over 10 MB`;
  }
  return undefined;
}

export default function RsvpSection() {
  const [attending, setAttending] = useState<"yes" | "no" | null>(null);
  const [arrivalMode, setArrivalMode] = useState("");
  const [departureMode, setDepartureMode] = useState("");
  const [errors, setErrors] = useState<Errs>({});
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [serverError, setServerError] = useState("");
  const [guestName, setGuestName] = useState("");
  const [guestCount, setGuestCount] = useState(1);
  const [guestRows, setGuestRows] = useState<Guest[]>([]);
  const [guestErrors, setGuestErrors] = useState<Record<number, GuestErr>>({});

  // Guest 1 is the person filling the form; rows cover guests 2…N and keep what was typed.
  function changeGuestCount(n: number) {
    setGuestCount(n);
    setGuestRows((prev) => Array.from({ length: n - 1 }, (_, i) => prev[i] ?? { name: "", phone: "", type: "adult" }));
  }
  function updateGuest(i: number, patch: Partial<Guest>) {
    setGuestRows((prev) => prev.map((g, idx) => (idx === i ? { ...g, ...patch } : g)));
  }

  const [thanksNeedsTap, setThanksNeedsTap] = useState(false);
  useEffect(() => {
    if (status !== "done" || !hasVoice("thanks")) return;
    // Autoplay can be refused after the async submit; fall back to a visible button.
    void playVoice("thanks").then((ok) => setThanksNeedsTap(!ok));
  }, [status]);

  let guideMood: Mood = "wave";
  let guideLine: GuideLine = { text: "Batao batao, kaun-kaun aa raha hai?", hint: "Tell us who's coming." };
  if (status === "sending") {
    guideMood = "idle";
    guideLine = { text: "Ek minute, bhej rahe hain…", hint: "Sending your RSVP." };
  } else if (attending === "yes") {
    guideMood = "cheer";
    guideLine =
      guestCount > 1
        ? { text: `${guestCount} log! Sabke naam likh do.`, hint: "Add everyone's name below." }
        : { text: "Wah! Party pakki!", hint: "Yay, see you in Goa!" };
  } else if (attending === "no") {
    guideMood = "sad";
    guideLine = { text: "Arre… hum aapko bahut miss karenge.", hint: "We'll miss you." };
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const get = (k: string) => String(fd.get(k) ?? "").trim();
    const errs: Errs = {};
    if (get("name").length < 2) errs.name = "Please add your name";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(get("email"))) errs.email = "Please add a valid email";
    if (get("phone").replace(/\D/g, "").length < 7) errs.phone = "Please add a valid phone number";
    if (!attending) errs.attending = "Please let us know if you can join";
    if (attending === "yes") {
      if (!get("arrivalDate")) errs.arrivalDate = "Please add your arrival date";
      if (!get("departureDate")) errs.departureDate = "Please add your departure date";
    }
    const gErrs: Record<number, GuestErr> = {};
    if (attending === "yes") {
      guestRows.forEach((g, i) => {
        const ge: GuestErr = {};
        if (g.name.trim().length < 2) ge.name = `Please add Guest ${i + 2}'s name`;
        if (g.phone.trim() && g.phone.replace(/\D/g, "").length < 7) ge.phone = "Check this number";
        if (ge.name || ge.phone) gErrs[i] = ge;
      });
    }
    setGuestErrors(gErrs);
    for (const k of ["idFiles", "arrivalFiles", "departureFiles"] as const) {
      const input = form.elements.namedItem(k) as HTMLInputElement | null;
      const msg = checkFiles(input?.files ?? null);
      if (msg) errs[k] = msg;
    }
    setErrors(errs);
    if (Object.keys(errs).length || Object.keys(gErrs).length) return;

    fd.set("attending", attending!);
    fd.set("arrivalMode", attending === "yes" ? arrivalMode : "");
    fd.set("departureMode", attending === "yes" ? departureMode : "");
    const yes = attending === "yes";
    fd.set("guests", String(yes ? guestCount : 1));
    fd.set("guestList", JSON.stringify(yes ? guestRows.map((g) => ({ ...g, name: g.name.trim(), phone: g.phone.trim() })) : []));

    setStatus("sending");
    setServerError("");
    try {
      const res = await fetch("/api/public/rsvp", { method: "POST", body: fd });
      const data = (await res.json()) as { ok: boolean; error?: string };
      if (!data.ok) throw new Error(data.error);
      setGuestName(get("name"));
      setStatus("done");
    } catch (err) {
      setServerError(err instanceof Error && err.message ? err.message : "Something went wrong — please try again.");
      setStatus("idle");
    }
  }

  return (
    <section id="rsvp" className="relative px-6 py-16 md:py-28">
      <div className="absolute inset-0 bg-secondary/30" />
      <div className="relative mx-auto max-w-3xl">
        <SectionHeading
          hindi="आपका उत्तर दें"
          english="RSVP"
          sub="Kindly respond for your whole family — this helps us arrange your airport pickup and stay."
        />

        {status !== "done" ? (
          <div className="mx-auto mt-8 flex items-end justify-center gap-3" aria-live="polite">
            <div className="flex shrink-0 items-end">
              <Avatar who="groom" mood={guideMood} className="-mx-2 h-24 w-20 sm:h-28 sm:w-24" />
              <Avatar who="bride" mood={guideMood} className="-mx-2 h-24 w-20 sm:h-28 sm:w-24" />
            </div>
            <Bubble line={guideLine} className="mb-6" />
          </div>
        ) : null}

        {status === "done" ? (
          <Reveal className="relative mt-10 text-center">
            <Petals count={8} />
            <div className="flex items-end justify-center">
              <Avatar who="groom" mood="cheer" className="-mx-1 h-28 w-24" />
              <Avatar who="bride" mood="cheer" className="-mx-1 h-28 w-24" />
            </div>
            <GoldDivider />
            <p className="gold-text mt-10 font-hindi text-4xl">धन्यवाद!</p>
            <h3 className="mt-3 font-display text-4xl">Thank you, {guestName}!</h3>
            <p className="mx-auto mt-5 max-w-md leading-relaxed text-muted-foreground">
              Your RSVP has reached the family. We'll be in touch soon about pickup and stay.
            </p>
            <p className="mt-4 font-display text-xl italic text-primary">“Dhanyavaad! Goa mein milte hain.”</p>
            {thanksNeedsTap ? (
              <Button type="button" variant="outline" onClick={() => void playVoice("thanks").then((ok) => setThanksNeedsTap(!ok))} className="mt-4 min-h-11 rounded-sm border-primary/60 text-primary">
                ▶ Hear a message from us
              </Button>
            ) : null}
          </Reveal>
        ) : (
          <Reveal delay={0.1} className="mt-10 md:mt-12">
            <form onSubmit={handleSubmit} noValidate className="gold-frame space-y-7 rounded-sm bg-card p-5 sm:p-8 md:p-12">
              <Field label="Your name · आपका नाम" htmlFor="r-name" error={errors.name}>
                <input id="r-name" name="name" className={inputClass} maxLength={200} autoComplete="name" />
              </Field>

              <div className="grid gap-6 md:grid-cols-2">
                <Field label="Your mobile (WhatsApp) · फ़ोन" htmlFor="r-phone" error={errors.phone}>
                  <input id="r-phone" name="phone" type="tel" inputMode="tel" placeholder="+91 ..." className={inputClass} maxLength={20} autoComplete="tel" />
                </Field>
                <Field label="Email · ईमेल" htmlFor="r-email" error={errors.email}>
                  <input id="r-email" name="email" type="email" inputMode="email" placeholder="you@example.com" className={inputClass} maxLength={255} autoComplete="email" />
                </Field>
              </div>

              <div>
                <span className={labelClass}>Will you join us? · क्या आप आ रहे हैं?</span>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Choice active={attending === "yes"} onClick={() => setAttending("yes")}>Yes, with blessings · जी हाँ</Choice>
                  <Choice active={attending === "no"} onClick={() => setAttending("no")}>We'll miss it · नहीं आ सकेंगे</Choice>
                </div>
                {errors.attending ? <p className={errorClass}>{errors.attending}</p> : null}
              </div>

              {attending === "yes" ? (
                <>
                  <div className="space-y-5">
                    <Field label="How many of you are coming? · कुल व्यक्ति" htmlFor="r-guests">
                      <select id="r-guests" value={guestCount} onChange={(e) => changeGuestCount(Number(e.target.value))} className={inputClass}>
                        {Array.from({ length: MAX_GUESTS }, (_, i) => i + 1).map((n) => (
                          <option key={n} value={n}>{n} {n === 1 ? "guest (just me)" : "guests"}</option>
                        ))}
                      </select>
                    </Field>
                    <AnimatePresence initial={false}>
                      {guestRows.map((g, i) => (
                        <motion.div
                          key={i}
                          layout
                          initial={{ opacity: 0, height: 0, y: -8 }}
                          animate={{ opacity: 1, height: "auto", y: 0 }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                          className="overflow-hidden"
                        >
                          <div className="rounded-sm border border-border bg-background/60 p-4">
                            <div className="mb-3 flex items-center justify-between gap-3">
                              <p className="font-display text-lg text-primary">Guest {i + 2}</p>
                              <div className="flex gap-2" role="group" aria-label={`Guest ${i + 2} is an adult or a child`}>
                                <Choice active={g.type === "adult"} onClick={() => updateGuest(i, { type: "adult" })}>Adult</Choice>
                                <Choice active={g.type === "child"} onClick={() => updateGuest(i, { type: "child" })}>Child</Choice>
                              </div>
                            </div>
                            <div className="grid gap-4 md:grid-cols-2">
                              <Field label="Name" htmlFor={`r-g${i}-name`} error={guestErrors[i]?.name}>
                                <input id={`r-g${i}-name`} value={g.name} onChange={(e) => updateGuest(i, { name: e.target.value })} className={inputClass} maxLength={200} autoComplete="off" />
                              </Field>
                              <Field label="Mobile (optional)" htmlFor={`r-g${i}-phone`} error={guestErrors[i]?.phone}>
                                <input id={`r-g${i}-phone`} value={g.phone} onChange={(e) => updateGuest(i, { phone: e.target.value })} type="tel" inputMode="tel" placeholder="+91 ..." className={inputClass} maxLength={20} autoComplete="off" />
                              </Field>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>

                  <Field label="Aadhaar card of all guests (photo or PDF, up to 5)" htmlFor="r-id" error={errors.idFiles}>
                    <input id="r-id" name="idFiles" type="file" multiple accept="image/*,application/pdf" className={fileClass} />
                  </Field>

                  {(["arrival", "departure"] as const).map((kind) => {
                    const isA = kind === "arrival";
                    const modeVal = isA ? arrivalMode : departureMode;
                    const setMode = isA ? setArrivalMode : setDepartureMode;
                    return (
                      <fieldset key={kind} className="space-y-5 border-t border-border pt-6">
                        <legend className="font-display text-2xl">{isA ? "Arrival · आगमन" : "Departure · प्रस्थान"}</legend>
                        <div className="grid grid-cols-2 gap-4">
                          <Field label="Date" htmlFor={`r-${kind}-date`} error={errors[`${kind}Date`]}>
                            <input id={`r-${kind}-date`} name={`${kind}Date`} type="date" className={inputClass} />
                          </Field>
                          <Field label="Time" htmlFor={`r-${kind}-time`}>
                            <input id={`r-${kind}-time`} name={`${kind}Time`} type="time" className={inputClass} />
                          </Field>
                        </div>
                        <div>
                          <span className={labelClass}>Mode of {kind}</span>
                          <div className="flex flex-wrap gap-2.5">
                            {MODES.map((m) => (
                              <Choice key={m} active={modeVal === m} onClick={() => setMode(m)}>{m}</Choice>
                            ))}
                          </div>
                        </div>
                        <Field label={`${isA ? "Arrival" : "Departure"} ticket (up to 5 files)`} htmlFor={`r-${kind}-files`} error={errors[`${kind}Files`]}>
                          <input id={`r-${kind}-files`} name={`${kind}Files`} type="file" multiple accept="image/*,application/pdf" className={fileClass} />
                        </Field>
                      </fieldset>
                    );
                  })}
                  <p className="text-xs text-muted-foreground">
                    Pickup is arranged only from GOA Manohar International Airport. Your files go to the family's private Drive.
                  </p>
                </>
              ) : null}

              <Field label="A note for the couple (optional) · शुभकामनाएँ" htmlFor="r-msg">
                <textarea id="r-msg" name="message" className={`${inputClass} min-h-24`} maxLength={500} />
              </Field>

              {serverError ? <p className={errorClass}>{serverError}</p> : null}

              <Button type="submit" disabled={status === "sending"} className="h-auto min-h-14 w-full flex-wrap rounded-sm bg-primary px-4 py-3 font-display text-xl text-primary-foreground hover:bg-primary/90">
                {status === "sending" ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                {status === "sending" ? "Sending…" : "Send RSVP"}
              </Button>
            </form>
          </Reveal>
        )}
      </div>
    </section>
  );
}
