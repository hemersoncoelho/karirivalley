import HeroSection from "@/components/hero/HeroSection";
import AboutSection from "@/components/home/AboutSection";
import AudienceSection from "@/components/home/AudienceSection";
import BenefitsSection from "@/components/home/BenefitsSection";
import StatsSection from "@/components/home/StatsSection";
import EventsSection from "@/components/home/EventsSection";
import OpportunitiesSection from "@/components/home/OpportunitiesSection";
import FinalCtaSection from "@/components/home/FinalCtaSection";
import { fetchPublicUpcomingEvents } from "@/lib/members/events";

export default async function HomePage() {
  const events = await fetchPublicUpcomingEvents(3);

  return (
    <main>
      <HeroSection />
      <AboutSection />
      <AudienceSection />
      <BenefitsSection />
      <StatsSection />
      <EventsSection events={events} />
      <OpportunitiesSection />
      <FinalCtaSection />
    </main>
  );
}
