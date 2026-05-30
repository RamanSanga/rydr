import Navbar from "@/components/Navbar";
import Herobar from "@/components/Herobar";
import Services from "@/components/Services";
import HowRydrWorks from "@/components/HowRydrWorks";
import SmartFeatures from "@/components/SmartFeatures";
import DriverSection from "@/components/DriverSection";
import Testimonials from "@/components/Testimonials";
import AppExperience from "@/components/AppExperience";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-white text-[#111111] antialiased overflow-hidden select-none">
      {/* Global subtle radial glow for structural lighting (Blue Functional Accent) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1400px] h-[500px] bg-radial-gradient from-blue-500/[0.015] via-transparent to-transparent pointer-events-none z-0" />
      
      {/* Sticky semi-transparent blurred header */}
      <Navbar />

      <div className="relative z-10">
        {/* 1. Hero Block (Headline + Booking Card + Live Stats + GPS Visual Map) */}
        <Herobar />

        {/* 2. Mobility Suite (2 Featured + 4 Supporting Grid Hierarchy) */}
        <Services />

        {/* 3. Operational Model (Simple 3-step request-matching-tracking guide) */}
        <HowRydrWorks />

        {/* 4. Smart Bypass Radar (Bypass congestion simulations) */}
        <SmartFeatures />

        {/* 5. Supply Dashboard Portal (Uber Driver + Stripe Console) */}
        <DriverSection />

        {/* 7. Audited Reviews (Stars, executive positions from Linear/Apex) */}
        <Testimonials />

        {/* 8. Handheld Mockup (Consolidated digital wallet eco telemetries) */}
        <AppExperience />

        {/* 9. Premium Spacious Footer */}
        <Footer />
      </div>
    </main>
  );
}