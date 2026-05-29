"use client";

import { motion } from "framer-motion";
import { Star, ShieldCheck } from "lucide-react";

interface TestimonialItem {
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
}

export default function Testimonials() {
  const testimonials: TestimonialItem[] = [
    {
      name: "Sarah Jenkins",
      role: "Rainy Day Commuter",
      company: "Daily Traveler",
      content: "Rydr is a complete lifesaver on rainy days. Sinking into a warm, cozy cabin when it's pouring outside, with a friendly driver waiting with a massivedoorside umbrella, is absolute comfort.",
      rating: 5,
    },
    {
      name: "David Miller",
      role: "Chai Run Regular",
      company: "Late Night Crew",
      content: "We depend on Rydr for spontaneous late-night chai runs. Setting up multi-stops to pick up the crew, splitting the fare cashless in-app, and listening to our playlist is the best way to travel together.",
      rating: 5,
    },
    {
      name: "Aria Chen",
      role: "Weekend Explorer",
      company: "Road Tripper",
      content: "Long drive mood? Rydr is easily my favorite way to escape the city on weekends. Sinking into a quiet, zero-emission cabin for out-of-town drives gives me absolute peace of mind.",
      rating: 5,
    },
  ];

  return (
    <section id="about" className="bg-[#F8F8F8] py-32 border-t border-zinc-200 relative overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto space-y-4 mb-16">
          <span className="text-[10px] font-mono tracking-widest text-amber-600 font-bold uppercase">
            Traveler Moments
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tighter text-zinc-900">
            Where Rydr takes you
          </h2>
          <p className="text-zinc-500 text-sm leading-normal font-semibold">
            Hear how real people rely on Rydr for late-night chai runs, rainy commutes, date nights, and weekend escapes.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="bg-white border border-zinc-200 p-6 rounded-2xl flex flex-col justify-between space-y-6 hover:border-zinc-300 transition-colors shadow-2xs"
            >
              <div className="space-y-4">
                {/* Minimal Star Rating */}
                <div className="flex items-center space-x-1">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-[#111111] text-[#111111] stroke-0" />
                  ))}
                </div>
                
                {/* Quote Content */}
                <p className="text-[13px] text-zinc-650 leading-relaxed font-semibold italic">
                  "{t.content}"
                </p>
              </div>

              {/* User profile details */}
              <div className="flex items-center justify-between pt-4 border-t border-zinc-150">
                <div>
                  <div className="text-xs font-bold text-zinc-900 tracking-tight">{t.name}</div>
                  <div className="text-[10px] text-zinc-500 font-semibold leading-none mt-1">{t.role}</div>
                </div>
                
                <div className="flex items-center space-x-1 bg-zinc-50 border border-zinc-200 px-2 py-1 rounded-md text-[9px] font-mono text-zinc-500 font-bold uppercase shadow-3xs">
                  <ShieldCheck className="w-3 h-3 text-[#111111]" />
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
