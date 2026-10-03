import { createFileRoute } from "@tanstack/react-router";
import { Footer, Travel } from "@/components/wedding/Sections";
import Journey from "@/components/wedding/Journey";
import RsvpSection from "@/components/wedding/RsvpSection";
import MusicToggle from "@/components/wedding/MusicToggle";
import Intro from "@/components/wedding/Intro";
import ScrollWalker from "@/components/wedding/ScrollWalker";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
         title: "Hrishikesh & Nandita — Wedding Invitation at La Cabana, Goa",
      },
      {
        name: "description",
        content:
           "शुभ विवाह — the families of Hrishikesh & Nandita invite you to celebrations on 1–2 December 2026 at La Cabana Beach & Spa, Goa. RSVP here.",
      },
      {
        property: "og:title",
        content: "Hrishikesh & Nandita — A Royal Wedding in Goa",
      },
      {
        property: "og:description",
        content:
          "Two days, nine celebrations, one royal Goan wedding. RSVP for your family here.",
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
      <Intro />
      <ScrollWalker />
      <Journey />
      <Travel />
      <RsvpSection />
      <Footer />
      <MusicToggle />
    </main>
  );
}
