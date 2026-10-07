import { useEffect, useState } from "react";
import { CalendarPlus } from "lucide-react";
import { detectPlatform, GOOGLE_CALENDAR_URL, ICS_PATH, type CalendarPlatform } from "@/lib/calendar";

const primaryClass =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-sm px-6 font-display text-lg text-primary-foreground shadow-sm transition hover:brightness-105 active:scale-[0.98] bg-primary";
const secondaryClass =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-sm border border-primary/50 px-5 text-sm text-primary transition hover:bg-primary/10";

/**
 * One tap to save the wedding in the guest's own calendar: Apple Calendar on
 * iPhone/iPad/Mac, Google Calendar on Android, both choices everywhere else.
 */
export default function AddToCalendar({ onDone, compact = false }: { onDone?: () => void; compact?: boolean }) {
  // decided after mount so the server render (which can't know the device) stays neutral
  const [platform, setPlatform] = useState<CalendarPlatform>("other");
  useEffect(() => setPlatform(detectPlatform()), []);

  const apple = (cls: string, label: string) => (
    <a href={ICS_PATH} onClick={onDone} className={cls}>
      <CalendarPlus className="h-5 w-5" aria-hidden="true" /> {label}
    </a>
  );
  const google = (cls: string, label: string) => (
    <a href={GOOGLE_CALENDAR_URL} target="_blank" rel="noopener noreferrer" onClick={onDone} className={cls}>
      <CalendarPlus className="h-5 w-5" aria-hidden="true" /> {label}
    </a>
  );
  // desktop: the .ics downloads and opens in Outlook / Apple Calendar
  const ics = (cls: string, label: string) => (
    <a href={ICS_PATH} download="Hrishikesh-Nandita-Wedding.ics" onClick={onDone} className={cls}>
      <CalendarPlus className="h-5 w-5" aria-hidden="true" /> {label}
    </a>
  );

  if (compact) {
    const link = "inline-flex min-h-11 items-center gap-1.5 border-b border-primary pb-1 text-sm text-primary";
    if (platform === "apple") return apple(link, "Add to Calendar");
    if (platform === "android") return google(link, "Add to Google Calendar");
    return (
      <span className="inline-flex flex-wrap justify-center gap-x-5">
        {google(link, "Google Calendar")}
        {ics(link, "Apple / Outlook")}
      </span>
    );
  }

  if (platform === "apple") return <div className="flex flex-col items-center gap-2">{apple(primaryClass, "Add to Calendar")}</div>;
  if (platform === "android") return <div className="flex flex-col items-center gap-2">{google(primaryClass, "Add to Google Calendar")}</div>;
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      {google(primaryClass, "Google Calendar")}
      {ics(secondaryClass, "Apple / Outlook (.ics)")}
    </div>
  );
}
