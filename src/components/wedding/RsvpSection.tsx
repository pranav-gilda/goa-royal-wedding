import { useState, type FormEvent } from "react";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { submitRsvp } from "@/lib/rsvp.functions";
import { GoldDivider, Reveal, SectionHeading } from "./decor";
import { Loader2, Send } from "lucide-react";

const EVENT_OPTIONS = [
  "Haldi · हल्दी",
  "Mehndi · मेहंदी",
  "Sangeet · संगीत",
  "Baraat & Pheras · विवाह",
  "Reception · स्वागत समारोह",
  "Farewell Dinner · विदाई",
];

const inputClass =
  "w-full rounded-sm border border-input bg-background/60 px-4 py-3 text-foreground placeholder:text-muted-foreground/60 focus:border-primary/70 focus:outline-none focus:ring-1 focus:ring-ring";

const labelClass = "mb-2 block text-sm tracking-wide text-muted-foreground";
const errorClass = "mt-1.5 text-xs text-destructive";

type SubmitPayload = {
  name: string;
  guests: number;
  email: string;
  phone: string;
  attending: "yes" | "no";
  events: string[];
  message: string;
};

type FormErrors = Partial<Record<"name" | "email" | "phone" | "attending", string>>;

export default function RsvpSection() {
  const submitFn = useServerFn(submitRsvp);

  const [name, setName] = useState("");
  const [guests, setGuests] = useState(1);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [attending, setAttending] = useState<"yes" | "no" | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});

  const mutation = useMutation({
    mutationFn: (payload: SubmitPayload) => submitFn({ data: payload }),
  });

  const toggleEvent = (event: string) => {
    setSelected((prev) =>
      prev.includes(event)
        ? prev.filter((e) => e !== event)
        : [...prev, event],
    );
  };

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const errs: FormErrors = {};
    if (name.trim().length < 2) errs.name = "Please add your name(s)";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      errs.email = "Please add a valid email";
    if (phone.replace(/\D/g, "").length < 7)
      errs.phone = "Please add a valid phone number";
    if (!attending) errs.attending = "Please let us know if you can join";
    setErrors(errs);
    if (!attending || Object.keys(errs).length > 0) return;

    mutation.mutate({
      name: name.trim(),
      guests,
      email: email.trim(),
      phone: phone.trim(),
      attending,
      events: attending === "yes" ? selected : [],
      message: message.trim(),
    });
  }

  return (
    <section id="rsvp" className="relative px-6 py-24 md:py-32">
      <div className="absolute inset-0 bg-secondary/30" />
      <div className="relative mx-auto max-w-3xl">
        <SectionHeading
          hindi="आपका उत्तर दें"
          english="RSVP"
          sub="Kindly respond for your whole family — we'll coordinate travel and stay with you from here."
        />

        {mutation.isSuccess && mutation.data?.ok ? (
          <Reveal className="mt-14 text-center">
            <GoldDivider />
            <p className="gold-text mt-10 font-hindi text-4xl">धन्यवाद!</p>
            <h3 className="mt-3 font-display text-4xl">
              Thank you, {name.trim()}!
            </h3>
            <p className="mx-auto mt-5 max-w-md leading-relaxed text-muted-foreground">
              Your RSVP has reached the family. We'll be in touch soon with
              travel, pickup and stay details.
            </p>
            <p className="mt-4 font-hindi text-muted-foreground">
              हम जल्द ही आपसे संपर्क करेंगे
            </p>
          </Reveal>
        ) : (
          <Reveal delay={0.1} className="mt-12">
            <form
              onSubmit={handleSubmit}
              className="gold-frame space-y-8 rounded-sm bg-card/80 p-8 md:p-12"
              noValidate
            >
              <div>
                <label htmlFor="rsvp-name" className={labelClass}>
                  Your name(s) · आपका नाम
                </label>
                <input
                  id="rsvp-name"
                  className={inputClass}
                  placeholder="You and your family's names"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={200}
                />
                {errors.name ? <p className={errorClass}>{errors.name}</p> : null}
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label htmlFor="rsvp-guests" className={labelClass}>
                    Number of guests · कितने व्यक्ति
                  </label>
                  <select
                    id="rsvp-guests"
                    className={inputClass}
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                  >
                    {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                      <option key={n} value={n} className="bg-card">
                        {n} {n === 1 ? "guest" : "guests"}
                      </option>
                    ))}
                    <option value={11} className="bg-card">
                      More than 10
                    </option>
                  </select>
                </div>
                <div>
                  <label htmlFor="rsvp-phone" className={labelClass}>
                    Phone (WhatsApp) · फ़ोन
                  </label>
                  <input
                    id="rsvp-phone"
                    type="tel"
                    className={inputClass}
                    placeholder="+91 ..."
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    maxLength={20}
                  />
                  {errors.phone ? (
                    <p className={errorClass}>{errors.phone}</p>
                  ) : null}
                </div>
              </div>

              <div>
                <label htmlFor="rsvp-email" className={labelClass}>
                  Email · ईमेल
                </label>
                <input
                  id="rsvp-email"
                  type="email"
                  className={inputClass}
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  maxLength={255}
                />
                {errors.email ? (
                  <p className={errorClass}>{errors.email}</p>
                ) : null}
              </div>

              <div>
                <span className={labelClass}>
                  Will you join us? · क्या आप आ रहे हैं?
                </span>
                <div className="grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => setAttending("yes")}
                    className={`rounded-sm border px-4 py-3 transition ${
                      attending === "yes"
                        ? "border-primary bg-primary/20 text-primary"
                        : "border-border text-foreground hover:border-primary/50"
                    }`}
                  >
                    Yes, with blessings
                    <span className="block font-hindi text-sm opacity-80">
                      जी हाँ, आ रहे हैं
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setAttending("no")}
                    className={`rounded-sm border px-4 py-3 transition ${
                      attending === "no"
                        ? "border-primary bg-primary/20 text-primary"
                        : "border-border text-foreground hover:border-primary/50"
                    }`}
                  >
                    We'll miss it
                    <span className="block font-hindi text-sm opacity-80">
                      नहीं आ सकेंगे
                    </span>
                  </button>
                </div>
                {errors.attending ? (
                  <p className={errorClass}>{errors.attending}</p>
                ) : null}
              </div>

              {attending === "yes" ? (
                <div>
                  <span className={labelClass}>
                    Which celebrations will you attend? · कौन से उत्सव?
                  </span>
                  <div className="flex flex-wrap gap-2.5">
                    {EVENT_OPTIONS.map((event) => {
                      const active = selected.includes(event);
                      return (
                        <button
                          key={event}
                          type="button"
                          onClick={() => toggleEvent(event)}
                          aria-pressed={active}
                          className={`rounded-full border px-4 py-2 text-sm transition ${
                            active
                              ? "border-primary bg-primary/20 text-primary"
                              : "border-border text-foreground hover:border-primary/50"
                          }`}
                        >
                          {event}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : null}

              <div>
                <label htmlFor="rsvp-message" className={labelClass}>
                  A note for the couple (optional) · शुभकामनाएँ
                </label>
                <textarea
                  id="rsvp-message"
                  className={`${inputClass} min-h-24`}
                  placeholder="Your blessings and wishes..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  maxLength={500}
                />
              </div>

              {mutation.isError ? (
                <p className={errorClass}>
                  Something went wrong — please try again in a moment.
                </p>
              ) : null}
              {mutation.data && !mutation.data.ok ? (
                <p className={errorClass}>{mutation.data.error}</p>
              ) : null}

              <button
                type="submit"
                disabled={mutation.isPending}
                className="flex w-full items-center justify-center gap-2 rounded-sm border border-primary/60 bg-primary/15 px-8 py-4 font-display text-xl tracking-widest text-primary transition hover:bg-primary/30 disabled:opacity-60"
              >
                {mutation.isPending ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
                Send RSVP
                <span className="font-hindi text-base">· भेजें</span>
              </button>
            </form>
          </Reveal>
        )}
      </div>
    </section>
  );
}
