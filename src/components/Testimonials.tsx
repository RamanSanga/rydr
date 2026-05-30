"use client";

import { motion } from "framer-motion";
import { Star, ShieldCheck } from "lucide-react";

interface TestimonialItem {
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  cardClass: string;
  badgeClass: string;
  starColor: string;
}

export default function Testimonials() {
  const testimonials: TestimonialItem[] = [
    {
      name: "Sarah Jenkins",
      role: "Airport Commuter",
      company: "Daily Traveler",
      content: "Rydr is a complete lifesaver on rainy evening arrivals. Sinking into a warm, cozy cabin when it's pouring outside, with a friendly driver waiting with a massive doorside umbrella, is absolute comfort.",
      rating: 5,
      cardClass: "bg-blue-50/40 border-blue-100 hover:border-blue-200 hover:shadow-blue-50/30",
      badgeClass: "bg-blue-100/60 text-blue-800 border-blue-200/50",
      starColor: "fill-blue-600 text-blue-600",
    },
    {
      name: "David Miller",
      role: "Chai Run Regular",
      company: "Late Night Crew",
      content: "We depend on Rydr for spontaneous late-night chai runs. Setting up multi-stops to pick up the crew, splitting the fare cashless in-app, and listening to our playlist is the best way to travel together.",
      rating: 5,
      cardClass: "bg-amber-50/40 border-amber-100 hover:border-amber-200 hover:shadow-amber-50/30",
      badgeClass: "bg-amber-100/60 text-amber-800 border-amber-250/50",
      starColor: "fill-amber-600 text-amber-600",
    },
    {
      name: "Aria Chen",
      role: "Weekend Explorer",
      company: "Road Tripper",
      content: "Long drive mood? Rydr is easily my favorite way to escape the city on weekends. Sinking into a quiet, zero-emission cabin for out-of-town drives gives me absolute peace of mind.",
      rating: 5,
      cardClass: "bg-green-50/40 border-green-100 hover:border-green-200 hover:shadow-green-50/30",
      badgeClass: "bg-green-100/60 text-green-800 border-green-200/50",
      starColor: "fill-green-600 text-green-600",
    },
  ];

  return (
    <section id="about" className="bg-[#F8F8F8] py-32 border-t border-zinc-200 relative overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto space-y-4 mb-16">
          <span className="text-[10px] font-mono tracking-widest text-amber-600 font-bold uppercase">
            Traveler Stories
          </span>
          <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-zinc-900 leading-tight">
            Where Rydr takes you
          </h2>
          <p className="text-zinc-500 text-sm leading-normal font-semibold">
            Hear how real people rely on Rydr for late-night chai runs, rainy commutes, date nights, and weekend escapes.
          </p>
        </div>

        {/* Testimonials Grid (Visual Accent Card backgrounds) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className={`border p-6.5 rounded-2xl flex flex-col justify-between space-y-6 hover:shadow-md transition-all duration-200 ${t.cardClass}`}
            >
              <div className="space-y-4">
                {/* Minimal Star Rating */}
                <div className="flex items-center space-x-1">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className={`w-3.5 h-3.5 stroke-0 ${t.starColor}`} />
                  ))}
                </div>
                
                {/* Quote Content */}
                <p className="text-[13px] text-zinc-700 leading-relaxed font-semibold italic">
                  "{t.content}"
                </p>
              </div>

              {/* User details */}
              <div className="flex items-center justify-between pt-4 border-t border-zinc-200/60">
                <div>
                  <div className="text-xs font-black text-zinc-900 tracking-tight">{t.name}</div>
                  <div className="text-[10px] text-zinc-500 font-semibold leading-none mt-1">{t.role}</div>
                </div>
                
                <div className={`flex items-center space-x-1 px-2.5 py-1 rounded-md text-[9px] font-mono font-bold uppercase shadow-3xs border ${t.badgeClass}`}>
                  <ShieldCheck className="w-3 h-3 stroke-[2.5]" />
                  <span>{t.company}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
