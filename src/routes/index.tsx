import { createFileRoute } from "@tanstack/react-router";
import Hero from "@/components/wedding/Hero";
import {
  CoupleStory,
  Events,
  Footer,
  Invite,
  Travel,
} from "@/components/wedding/Sections";
import RsvpSection from "@/components/wedding/RsvpSection";
import MusicToggle from "@/components/wedding/MusicToggle";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title: "Aarav & Diya — A Royal Wedding in Goa · 12–13 December 2026",
      },
      {
        name: "description",
        content:
          "शुभ विवाह — the Sharma & Gupta families invite you to two days of royal celebrations in Goa: Haldi, Mehndi, Sangeet, Wedding & Reception. RSVP here.",
      },
      {
        property: "og:title",
        content: "Aarav & Diya — A Royal Wedding in Goa",
      },
      {
        property: "og:description",
        content:
          "Two days, six celebrations, one royal Goan wedding. RSVP for your family here.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="overflow-x-clip bg-background font-body text-foreground">
      <Hero />
      <Invite />
      <CoupleStory />
      <Events />
      <Travel />
      <RsvpSection />
      <Footer />
      <MusicToggle />
    </main>
  );
}
