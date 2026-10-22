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
         title: "Hrishikesh & Nandita - Wedding Invitation",
      },
      {
        name: "description",
        content: "Hrishikesh & Nandita - Wedding Invitation",
      },
      {
        property: "og:title",
        content: "Hrishikesh & Nandita - Wedding Invitation",
      },
      {
        property: "og:description",
        content: "Hrishikesh & Nandita - Wedding Invitation",
      },
      { property: "og:type", content: "website" },
      // Link previews (WhatsApp etc.) need an absolute URL; the file lives in public/.
      { property: "og:image", content: "https://hridaysenata-invitation.lovable.app/og-image.jpg" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "https://hridaysenata-invitation.lovable.app/og-image.jpg" },
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
