import HeroSection from "@/components/hero/HeroSection";
import AboutSection from "@/components/home/AboutSection";
import AudienceSection from "@/components/home/AudienceSection";
import BenefitsSection from "@/components/home/BenefitsSection";
import StatsSection from "@/components/home/StatsSection";
import EventsSection from "@/components/home/EventsSection";
import FeaturedMembersSection from "@/components/home/FeaturedMembersSection";
import OpportunitiesSection from "@/components/home/OpportunitiesSection";
import FinalCtaSection from "@/components/home/FinalCtaSection";

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <AboutSection />
      <AudienceSection />
      <BenefitsSection />
      <StatsSection />
      <EventsSection />
      <FeaturedMembersSection />
      <OpportunitiesSection />
      <FinalCtaSection />
    </main>
  );
}
