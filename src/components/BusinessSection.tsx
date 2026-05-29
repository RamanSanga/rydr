"use client";

import { motion } from "framer-motion";
import { Check, Camera, Compass, Users } from "lucide-react";

export default function BusinessSection() {
  const stops = [
    { label: "7:00 PM • Sarah's House", desc: "First pickup doorside with AC pre-cooled" },
    { label: "7:15 PM • David's Flat", desc: "Monsoon playlist activated on arrival" },
    { label: "7:30 PM • Chai Cafe Spot", desc: "Final destination, split cashless automatically" }
  ];

  return (
    <section id="business" className="bg-white py-32 border-t border-zinc-200 relative overflow-hidden">
      
      {/* Soft background grid */}
      <div className="absolute inset-0 premium-grid-fine opacity-[0.06] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Heading and feature listing */}
          <div className="lg:col-span-5 flex flex-col justify-center space-y-8">
            <div className="space-y-3.5">
              <span className="text-[10px] font-mono tracking-widest text-amber-600 font-bold uppercase">
                RYDR WITH FRIENDS
              </span>
              <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-zinc-900 leading-tight">
                Chalo, let's share the ride.
              </h2>
              <p className="text-zinc-500 text-sm md:text-[14.5px] leading-relaxed font-semibold">
                Spontaneous late-night runs, concert drops, or a double date out of town. Rydr makes shared travel simple. Add multi-stops, track arrivals together, and split fares cashless in-app.
              </p>
            </div>

            {/* Travel milestones */}
            <div className="space-y-4 pt-1">
              {[
                "Split fares automatically in a single tap",
                "Add up to 5 multi-stops on your route",
                "Real-time location sharing with friends",
                "Monsoon-ready spacious cabins for the crew",
              ].map((bullet, idx) => (
                <div key={idx} className="flex items-center space-x-3">
                  <div className="w-5 h-5 rounded-full bg-amber-50 border border-amber-250/60 flex items-center justify-center text-amber-700 shrink-0 shadow-2xs">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  <span className="text-[13.5px] text-zinc-700 font-bold">
                    {bullet}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Breathtaking Polaroid Cinematic Photo Showcase */}
          <div className="lg:col-span-7 w-full flex flex-col justify-center">
            <div className="relative rounded-3xl overflow-hidden border border-zinc-200 shadow-2xl aspect-[1.4/1] flex flex-col justify-end group cursor-pointer bg-black">
              
              {/* Full-bleed background photo */}
              <div className="absolute inset-0 z-0">
                <img
                  src="/images/date_night.png"
                  alt="Date Night Outing"
                  className="w-full h-full object-cover opacity-80 transition-transform duration-700 group-hover:scale-103"
                />
                {/* Dramatic lighting bottom overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/35 to-transparent" />
              </div>

              {/* Floating photo details badge */}
              <div className="absolute top-5 left-5 z-10 flex items-center space-x-2.5 bg-black/60 backdrop-blur-md px-3.5 py-2 rounded-xl border border-zinc-800 shadow-md text-white">
                <Camera className="w-4 h-4 text-amber-500" />
                <span className="text-[10px] font-mono tracking-wider font-extrabold uppercase uppercase">
                  Friday Night Chai Outing
                </span>
              </div>

              {/* Seamless travel journey card overlay at bottom */}
              <div className="p-6 md:p-8 relative z-10 space-y-4 text-white">
                
                {/* Timeline display */}
                <div className="space-y-3 border-l border-dashed border-zinc-800 pl-4 py-1.5 ml-1">
                  {stops.map((stop, idx) => (
                    <div key={idx} className="relative space-y-0.5">
                      <div className="absolute -left-[21.5px] top-1 w-2.5 h-2.5 rounded-full bg-amber-500 border-2 border-black" />
                      <h5 className="text-[11.5px] font-extrabold text-white leading-none">{stop.label}</h5>
                      <p className="text-[10px] text-zinc-400 font-semibold">{stop.desc}</p>
                    </div>
                  ))}
                </div>

                <div className="h-[1px] bg-zinc-800/80 my-2" />

                {/* Splits Summary */}
                <div className="flex justify-between items-center text-xs">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-amber-500" />
                    <span className="font-extrabold text-zinc-300">Aria, Sarah & David equal split</span>
                  </div>
                  <span className="text-[11px] font-mono font-black text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-full">
                    $4.50 settled cashless
                  </span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
