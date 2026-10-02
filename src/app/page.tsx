import HeroSection from "@/components/hero/HeroSection";
import AboutSection from "@/components/home/AboutSection";
import AudienceSection from "@/components/home/AudienceSection";
import BenefitsSection from "@/components/home/BenefitsSection";
import EventsSection from "@/components/home/EventsSection";
import OpportunitiesSection from "@/components/home/OpportunitiesSection";
import GallerySection from "@/components/home/GallerySection";
import FeaturedMembersSection from "@/components/home/FeaturedMembersSection";
import CompaniesShowcaseSection from "@/components/home/CompaniesShowcaseSection";
import StatsSection from "@/components/home/StatsSection";
import InterstitialBand from "@/components/home/InterstitialBand";
import FinalCtaSection from "@/components/home/FinalCtaSection";
import CommunityTicker from "@/components/home/CommunityTicker";
import { fetchPublicUpcomingEvents, type EventRecord } from "@/lib/members/events";
import { fetchPublicOpportunities, type OpportunityRecord } from "@/lib/members/opportunities";

import { loadPublicContent } from "@/lib/public-content";

export const revalidate = 300;

export default async function HomePage() {
  const [eventsResult, opportunitiesResult] = await Promise.all([
    loadPublicContent<EventRecord>(() => fetchPublicUpcomingEvents(3)),
    loadPublicContent<OpportunityRecord>(() => fetchPublicOpportunities(6)),
  ]);

  return (
    <main id="conteudo" className="kv-home" tabIndex={-1}>
      <HeroSection />
      <AboutSection />
      <AudienceSection />
      <BenefitsSection />
      <InterstitialBand lema="Ideias encontram pessoas. Pessoas transformam o território." />
      <EventsSection events={eventsResult.data} unavailable={eventsResult.unavailable} />
      <OpportunitiesSection opportunities={opportunitiesResult.data} unavailable={opportunitiesResult.unavailable} />
      <FeaturedMembersSection />
      <CompaniesShowcaseSection />
      <StatsSection />
      <GallerySection />
      <CommunityTicker />
      <FinalCtaSection />
    </main>
  );
}
