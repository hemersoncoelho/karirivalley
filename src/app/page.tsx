import HeroSection from "@/components/hero/HeroSection";
import AboutSection from "@/components/home/AboutSection";
import AudienceSection from "@/components/home/AudienceSection";
import BenefitsSection from "@/components/home/BenefitsSection";
import FeaturedMembersSection from "@/components/home/FeaturedMembersSection";
import StatsSection from "@/components/home/StatsSection";
import EventsSection from "@/components/home/EventsSection";
import OpportunitiesSection from "@/components/home/OpportunitiesSection";
import CompaniesShowcaseSection from "@/components/home/CompaniesShowcaseSection";
import InterstitialBand from "@/components/home/InterstitialBand";
import FinalCtaSection from "@/components/home/FinalCtaSection";
import { fetchPublicUpcomingEvents, type EventRecord } from "@/lib/members/events";
import { fetchPublicOpportunities, type OpportunityRecord } from "@/lib/members/opportunities";

/**
 * A LP deve renderizar mesmo sem Supabase configurado (ou com o banco
 * inacessível) — conteúdo dinâmico vira lista vazia, nunca um 500.
 * Regenerada a cada 5 minutos para manter agenda/oportunidades frescas.
 */
export const revalidate = 300;

async function safe<T>(fetcher: () => Promise<T[]>): Promise<T[]> {
  try {
    return await fetcher();
  } catch (error) {
    console.error("[home] falha ao carregar conteúdo dinâmico:", error);
    return [];
  }
}

export default async function HomePage() {
  const [events, opportunities] = await Promise.all([
    safe<EventRecord>(() => fetchPublicUpcomingEvents(3)),
    safe<OpportunityRecord>(() => fetchPublicOpportunities(6)),
  ]);

  return (
    <main>
      <HeroSection />
      <AboutSection />
      <AudienceSection />
      <BenefitsSection />
      <EventsSection events={events} />
      <OpportunitiesSection opportunities={opportunities} />
      <FeaturedMembersSection />
      <CompaniesShowcaseSection />
      <StatsSection />
      <InterstitialBand lema="Conectar quem faz — Cariri, Ceará" />
      <FinalCtaSection />
    </main>
  );
}
