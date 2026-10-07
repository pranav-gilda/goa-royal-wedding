/**
 * "Add to calendar" for the wedding. Apple devices open the .ics file in public/
 * (Safari shows the native "Add to Calendar" sheet); Android opens Google Calendar.
 * Times are IST: 1 Dec 11:00 (Vinayak) to 2 Dec 23:00 (Shaadi & Dinner ends).
 */

export const ICS_PATH = "/hrishikesh-nandita-wedding.ics";

const TITLE = "Hrishikesh & Nandita's Wedding";
const LOCATION = "La Cabana Beach Resort, Ashvem, North Goa";
const START_UTC = "20261201T053000Z";
const END_UTC = "20261202T173000Z";
const DETAILS = [
  "Two days, nine celebrations at La Cabana Beach Resort, Ashvem, North Goa.",
  "",
  "Day 1 · Tue 1 Dec: Vinayak 11 AM · Maayra 2 PM · Sangeet 6:30 PM · After Party 10 PM",
  "Day 2 · Wed 2 Dec: Boho Carnival 9 AM · Safa Bandhai 2 PM · Baaraat 3 PM · Jaimala 5:50 PM · Shaadi & Dinner 6:40 PM",
  "",
  "Invitation & RSVP: https://hridaysenata-invitation.lovable.app/",
  "Map: https://maps.app.goo.gl/jRkJVZuf5HE1KmC69",
].join("\n");

export const GOOGLE_CALENDAR_URL =
  "https://calendar.google.com/calendar/render?" +
  new URLSearchParams({ action: "TEMPLATE", text: TITLE, dates: `${START_UTC}/${END_UTC}`, details: DETAILS, location: LOCATION }).toString();

export type CalendarPlatform = "apple" | "android" | "other";

export function detectPlatform(): CalendarPlatform {
  if (typeof navigator === "undefined") return "other";
  const ua = navigator.userAgent;
  if (/android/i.test(ua)) return "android";
  // iPadOS reports itself as a Mac, so also check for touch
  if (/iphone|ipad|ipod/i.test(ua) || (/macintosh/i.test(ua) && navigator.maxTouchPoints > 1)) return "apple";
  return "other";
}
