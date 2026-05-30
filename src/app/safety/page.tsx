"use client";

import { Shield, ShieldCheck, MapPin, PhoneCall, HelpCircle, ArrowRight, UserCheck } from "lucide-react";
import Link from "next/link";
import Footer from "@/components/Footer";

function SectionHeading({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <div className="space-y-1.5">
      <span className="eyebrow">{eyebrow}</span>
      <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-zinc-900">{title}</h2>
      <p className="text-xs sm:text-sm text-zinc-500 font-medium">{description}</p>
    </div>
  );
}

export default function SafetyPage() {
  const pillars = [
    {
      icon: UserCheck,
      title: "Verified Drivers",
      description: "Every driver-partner undergoes professional screening, Aadhaar background check, and taxi orientation before onboarding.",
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      icon: MapPin,
      title: "Live Trip Sharing",
      description: "Share your live location and ETA with family or friends directly from the app. They can track your trip in real time.",
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      icon: PhoneCall,
      title: "SOS Emergency Button",
      description: "Our in-app SOS button links you instantly to the RYDR safety desk and emergency response services.",
      color: "text-rose-600",
      bg: "bg-rose-50",
    },
    {
      icon: ShieldCheck,
      title: "24/7 Dedicated Support",
      description: "Our incident response team is active 24/7 to solve route issues and assist with security queries.",
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
  ];

  const standards = [
    {
      step: "01",
      title: "Aadhaar Identity Link",
      detail: "Verification against government registry checks to lock the driver's biometric identity.",
    },
    {
      step: "02",
      title: "Background Screening",
      detail: "Criminal records check completed by professional third-party safety agencies.",
    },
    {
      step: "03",
      title: "Vehicle Fitness Audit",
      detail: "Strict 25-point visual and mechanical check to ensure optimal safety.",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-zinc-900 flex flex-col pt-8 sm:pt-12">
      <main className="flex-1 max-w-4xl w-full mx-auto px-5 sm:px-6 space-y-16 pb-20">
        
        {/* Clean Hero Area */}
        <div className="text-center max-w-xl mx-auto space-y-4">
          <div className="h-12 w-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto shadow-sm">
            <Shield className="w-6 h-6 text-emerald-600 animate-pulse" />
          </div>
          <span className="eyebrow block">RYDR SAFETY</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 leading-tight">
            Your safety is our priority
          </h1>
          <p className="text-zinc-500 text-sm sm:text-base leading-relaxed">
            Safety isn't a feature we added later. It is built directly into every single journey, screening step, and support desk response.
          </p>
        </div>

        {/* 4 Safety Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {pillars.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div 
                key={idx}
                className="bg-white border border-zinc-200 p-6 rounded-2xl flex gap-4 hover:shadow-md transition-all shadow-sm hover-lift"
              >
                <div className={`h-11 w-11 rounded-xl ${p.bg} flex items-center justify-center shrink-0 shadow-3xs`}>
                  <Icon className={`w-5 h-5 ${p.color}`} />
                </div>
                <div className="space-y-1 mt-0.5">
                  <h3 className="text-sm sm:text-base font-bold text-zinc-900">{p.title}</h3>
                  <p className="text-zinc-500 text-xs sm:text-sm leading-relaxed">{p.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Simplified Timeline standards */}
        <div className="space-y-8 bg-zinc-50 border border-zinc-200 rounded-3xl p-6 sm:p-8">
          <SectionHeading eyebrow="STANDARDS" title="Rigorous Driver Screening" description="Every driver-partner must complete our multi-point background check before going online." />
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
            {standards.map((s, idx) => (
              <div key={idx} className="bg-white border border-zinc-200 p-5 rounded-xl space-y-3 shadow-3xs">
                <span className="text-xs font-mono font-bold bg-zinc-50 text-zinc-500 px-2 py-0.5 rounded border border-zinc-150">
                  Step {s.step}
                </span>
                <h4 className="text-xs sm:text-sm font-bold text-zinc-900">{s.title}</h4>
                <p className="text-[11px] sm:text-xs text-zinc-500 leading-relaxed font-medium">{s.detail}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Night Safety Section as a gorgeous minimal card */}
        <div className="bg-zinc-900 text-white rounded-3xl p-6 sm:p-8 space-y-6 relative overflow-hidden shadow-lg">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.06),transparent_70%)] pointer-events-none" />
          
          <div className="space-y-2 relative z-10">
            <span className="text-[10px] font-mono tracking-widest text-emerald-400 font-bold uppercase">After Dark protection</span>
            <h3 className="text-lg sm:text-xl font-bold">Late-night trip care</h3>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed max-w-xl">
              We add extra monitoring features after 11 PM. Our systems run automatic delay checks, late-night trip route verification, and allow instant sharing of trip history logs.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold text-zinc-300 relative z-10 pt-2">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              24/7 dedicated watch desk
            </div>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Automatic location sharing at night
            </div>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              In-app SOS button on every route
            </div>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Strict driver selfie selfie matching
            </div>
          </div>
        </div>

        {/* Clean Stats bar */}
        <div className="grid grid-cols-3 gap-4 text-center border-y border-zinc-200/50 py-8">
          <div className="space-y-1">
            <span className="text-2xl font-black text-zinc-900 font-sans">100%</span>
            <p className="text-[9px] sm:text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Aadhaar Verified</p>
          </div>
          <div className="space-y-1">
            <span className="text-2xl font-black text-zinc-900 font-sans">&lt;4 min</span>
            <p className="text-[9px] sm:text-[10px] font-bold text-zinc-400 uppercase tracking-wider">SOS Response</p>
          </div>
          <div className="space-y-1">
            <span className="text-2xl font-black text-zinc-900 font-sans">1.2M+</span>
            <p className="text-[9px] sm:text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Safe Commutes</p>
          </div>
        </div>

        {/* Support CTA */}
        <div className="text-center space-y-5">
          <h2 className="text-lg sm:text-xl font-bold text-zinc-900">Have a safety question?</h2>
          <p className="text-zinc-500 text-xs sm:text-sm leading-relaxed max-w-md mx-auto">
            Our safety operations team is always active. Report issues, submit ticket queries, or get direct safety advice.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/help"
              className="px-5 py-3 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold rounded-xl transition-all shadow-sm flex items-center gap-2"
            >
              <span>Contact Safety Desk</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/rider"
              className="px-5 py-3 bg-white hover:bg-zinc-50 border border-zinc-250 text-zinc-900 text-xs font-semibold rounded-xl transition-all shadow-3xs"
            >
              <span>Book a Safe Ride</span>
            </Link>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
