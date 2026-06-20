import Navbar from "@/components/Navbar";
import Herobar from "@/components/Herobar";
import Services from "@/components/Services";
import HowRydrWorks from "@/components/HowRydrWorks";
import SmartFeatures from "@/components/SmartFeatures";
import DriverSection from "@/components/DriverSection";
import Testimonials from "@/components/Testimonials";
import AppExperience from "@/components/AppExperience";
import Footer from "@/components/Footer";
import { fetchActivePromosAction } from "@/actions/promo";
import PromoBanners from "@/components/PromoBanners";

export default async function Home() {
  const activePromos = await fetchActivePromosAction();

  return (
    <main className="relative min-h-screen bg-white text-[#111111] antialiased overflow-hidden select-none">
      {/* Global subtle radial glow for structural lighting (Blue Functional Accent) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1400px] h-[500px] bg-radial-gradient from-blue-500/[0.015] via-transparent to-transparent pointer-events-none z-0" />
      
      {/* Sticky semi-transparent blurred header */}
      <Navbar />

      <div className="relative z-10">
        {/* 1. Hero Block (Headline + Booking Card + Live Stats + GPS Visual Map) */}
        <Herobar />

        {/* Phase 8: Promo Discovery Strip */}
        <PromoBanners promos={activePromos} />

        {/* 2. Mobility Suite - Hidden on mobile for simple presentation */}
        <div className="hidden lg:block">
          <Services />
        </div>

        {/* 3. Operational Model (Simple 3-step request-matching-tracking guide) */}
        <HowRydrWorks />

        {/* 4. Smart Bypass Radar - Hidden on mobile */}
        <div className="hidden lg:block">
          <SmartFeatures />
        </div>

        {/* 5. Supply Dashboard Portal - Hidden on mobile */}
        <div className="hidden lg:block">
          <DriverSection />
        </div>

        {/* 7. Audited Reviews - Hidden on mobile */}
        <div className="hidden lg:block">
          <Testimonials />
        </div>

        {/* 8. Handheld Mockup - Hidden on mobile */}
        <div className="hidden lg:block">
          <AppExperience />
        </div>

        {/* 9. Premium Spacious Footer */}
        <Footer />
      </div>
    </main>
  );
}