"use client";

import { Smartphone, ShieldCheck, Smile } from "lucide-react";

export default function HowRydrWorks() {
  const steps = [
    {
      step: "01",
      title: "Book",
      description: "Enter your destination, review fare options, and book with one click.",
      icon: Smartphone,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      step: "02",
      title: "Match",
      description: "We pair you instantly with a nearby background-checked driver.",
      icon: ShieldCheck,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      step: "03",
      title: "Ride",
      description: "Sink into a clean, air-conditioned cabin and enjoy a safe journey.",
      icon: Smile,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
  ];

  return (
    <section className="bg-white py-16 sm:py-24 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-5 sm:px-6 relative z-10 space-y-12 sm:space-y-16">
        
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto space-y-3">
          <span className="eyebrow">How It Works</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 leading-tight">
            Perfect rides in three steps
          </h2>
          <p className="text-zinc-500 text-sm sm:text-base leading-relaxed">
            Three simple steps designed to connect you safely with friendly, professional drivers in seconds.
          </p>
        </div>

        {/* Steps Horizontal Cards on Desktop / Vertical Stack on Mobile */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 relative">
          
          {/* Subtle connector line on desktop */}
          <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-zinc-200 -translate-y-1/2 hidden md:block z-0" />

          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx}
                className="bg-white border border-zinc-150 rounded-2xl p-6 sm:p-7 shadow-sm hover:shadow-md hover-lift transition-all relative z-10 flex flex-col items-center text-center space-y-4"
              >
                {/* Step badge and icon */}
                <div className="relative">
                  <div className={`h-14 w-14 rounded-full ${item.bg} flex items-center justify-center relative shadow-sm border border-zinc-100`}>
                    <Icon className={`w-6 h-6 ${item.color}`} />
                  </div>
                  <span className="absolute -top-1.5 -right-1.5 h-6 w-6 rounded-full bg-zinc-900 text-white text-[10px] font-bold flex items-center justify-center font-mono">
                    {item.step}
                  </span>
                </div>

                {/* Text Content */}
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-zinc-900">
                    {item.title}
                  </h3>
                  <p className="text-zinc-550 text-xs sm:text-sm leading-relaxed max-w-[240px]">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
