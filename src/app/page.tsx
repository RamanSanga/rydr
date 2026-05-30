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
    <main className="relative min-h-screen bg-white text-zinc-900 antialiased overflow-x-hidden">
      {/* Background decoration - subtle top radial glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1400px] h-[600px] bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.03),transparent_60%)] pointer-events-none z-0" />
      
      <div className="relative z-10 flex flex-col gap-20 sm:gap-28 pb-16">
        {/* 1. Hero Block with Booking Widget */}
        <Herobar />

        {/* 2. Services / Ride Options */}
        <Services />

        {/* 3. Operational Model */}
        <HowRydrWorks />

        {/* 4. Why Choose RYDR */}
        <SmartFeatures />

        {/* 5. Driver CTA Section */}
        <DriverSection />

        {/* 6. Testimonials */}
        <Testimonials />

        {/* 7. App Experience (Get the App) */}
        <AppExperience />

        {/* 8. Premium Spacious Footer */}
        <Footer />
      </div>
    </main>
  );
}