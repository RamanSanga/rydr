"use client";

import { ShieldCheck, IndianRupee, MapPin, LifeBuoy } from "lucide-react";

export default function SmartFeatures() {
  const benefits = [
    {
      title: "Fair Pricing",
      description: "No hidden charges or surprise surge pricing. You see the exact fare upfront before you book.",
      icon: IndianRupee,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      title: "Trusted Drivers",
      description: "Every driver-partner undergoes professional screening, background checks, and regular performance audits.",
      icon: ShieldCheck,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Real-time Tracking",
      description: "Share your live trip status with loved ones. Keep track of driver location and ETA in real time.",
      icon: MapPin,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      title: "24/7 Dedicated Support",
      description: "Our customer success team is available around the clock to answer your queries and assist with emergencies.",
      icon: LifeBuoy,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
  ];

  return (
    <section className="bg-zinc-50/50 py-16 sm:py-24 border-y border-zinc-200/50 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-5 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Heading and info */}
          <div className="lg:col-span-5 space-y-5">
            <span className="eyebrow">Why Choose RYDR</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 leading-tight">
              Safety, transparency, and comfort standard
            </h2>
            <p className="text-zinc-550 text-sm sm:text-base leading-relaxed">
              We've re-imagined the city commute from scratch. By putting passengers and driver safety first, RYDR offers a seamless and reliable ride experience that you can count on every single day.
            </p>
            <div className="pt-4 hidden lg:block">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-zinc-200 text-xs font-semibold text-zinc-500 shadow-sm">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                Over 1,000,000+ happy trips completed
              </div>
            </div>
          </div>

          {/* Right Column: 2x2 Benefit Grid */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {benefits.map((benefit, idx) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={idx}
                  className="bg-white border border-zinc-200 p-6 rounded-2xl flex flex-col space-y-4 hover:shadow-md hover:border-zinc-350 hover-lift transition-all group shadow-sm"
                >
                  <div className={`h-11 w-11 rounded-xl ${benefit.bg} flex items-center justify-center shadow-sm`}>
                    <Icon className={`w-5 h-5 ${benefit.color}`} />
                  </div>
                  
                  <div className="space-y-1.5">
                    <h3 className="text-base font-bold text-zinc-900 group-hover:text-emerald-700 transition-colors">
                      {benefit.title}
                    </h3>
                    <p className="text-zinc-500 text-xs sm:text-sm leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}
