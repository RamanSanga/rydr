"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Heart, Award, Star, Compass } from "lucide-react";
import { useState } from "react";

type ActiveDriver = "vikram" | "priya";

export default function DriverSection() {
  const [selectedDriver, setSelectedDriver] = useState<ActiveDriver>("vikram");

  const driversList = {
    vikram: {
      name: "Vikram Malhotra",
      rating: "4.99 ★",
      trips: "1,200+ trips",
      vehicle: "Tesla Model Y (EV zero-emission)",
      story: "I love taking passengers out of town on spontaneous weekend escapes. I always pre-cool the AC to a crisp breeze and put on my road trip roadway jazz playlist!",
      favoriteSpot: "Sunset Coastal highway escape",
      initials: "VM",
      badge: "EV Cruiser",
    },
    priya: {
      name: "Priya Sharma",
      rating: "4.98 ★",
      trips: "950+ trips",
      vehicle: "Honda City (Cozy Comfort)",
      story: "My specialty is rain mode commutes! I always carry two large doorside umbrellas to walk you dry and make sure the cabin is warm, quiet, and pre-trip synchronized.",
      favoriteSpot: "Late-night Chai Café stop",
      initials: "PS",
      badge: "Monsoon Helper",
    },
  };

  const activeDriverInfo = driversList[selectedDriver];

  return (
    <section id="drive" className="bg-[#F8F8F8] py-32 border-t border-zinc-200 relative overflow-hidden">
      
      {/* Soft background grid */}
      <div className="absolute inset-0 premium-grid-fine opacity-[0.06] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Breathtaking Photographic Driver Preview */}
          <div className="lg:col-span-7 w-full flex flex-col justify-center">
            <div className="relative rounded-3xl overflow-hidden border border-zinc-200 shadow-2xl aspect-[1.4/1] flex flex-col justify-end group cursor-pointer bg-black">
              
              {/* Full-bleed photography backdrop */}
              <div className="absolute inset-0 z-0">
                <img
                  src="/images/daily_commute.png"
                  alt="Rydr Driver Cruise"
                  className="w-full h-full object-cover opacity-75 transition-transform duration-700 group-hover:scale-103"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/35 to-transparent" />
              </div>

              {/* Driver selector badges inside the photo */}
              <div className="absolute top-5 left-5 z-10 flex space-x-2 bg-black/60 backdrop-blur-md p-1 rounded-xl border border-zinc-800 shadow-md">
                {(["vikram", "priya"] as ActiveDriver[]).map((dId) => (
                  <button
                    key={dId}
                    onClick={() => setSelectedDriver(dId)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-mono uppercase tracking-wider font-extrabold transition-colors cursor-pointer ${
                      selectedDriver === dId 
                        ? "bg-white text-black shadow-3xs"
                        : "text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    {dId === "vikram" ? "Vikram Malhotra" : "Priya Sharma"}
                  </button>
                ))}
              </div>

              {/* Driver Story Profile Overlay */}
              <div className="p-6 md:p-8 relative z-10 space-y-4 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3.5">
                    <div className="w-11 h-11 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-amber-500 font-black text-sm shadow-md">
                      {activeDriverInfo.initials}
                    </div>
                    <div>
                      <h4 className="text-[14px] font-black text-white leading-tight">{activeDriverInfo.name}</h4>
                      <p className="text-[10px] text-zinc-400 mt-0.5 leading-none font-semibold">{activeDriverInfo.vehicle}</p>
                    </div>
                  </div>
                  <span className="text-[9px] font-mono font-extrabold bg-amber-500/10 border border-amber-500/20 text-amber-400 px-2.5 py-0.5 rounded-full backdrop-blur-md">
                    {activeDriverInfo.badge}
                  </span>
                </div>

                <div className="h-[1px] bg-zinc-800/80 my-2" />

                <div className="space-y-1">
                  <span className="text-[8.5px] font-mono text-zinc-400 font-extrabold block uppercase tracking-widest">Stories from the Road</span>
                  <p className="text-[12.5px] text-zinc-300 leading-relaxed font-semibold italic">
                    "{activeDriverInfo.story}"
                  </p>
                </div>

                {/* Ratings */}
                <div className="flex items-center space-x-6 pt-1 text-xs">
                  <span className="font-extrabold text-zinc-200 flex items-center gap-1.5">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500 stroke-0" />
                    <span>{activeDriverInfo.rating} Rating</span>
                  </span>
                  <span className="font-extrabold text-zinc-200 flex items-center gap-1.5">
                    <Compass className="w-4 h-4 text-blue-400" />
                    <span>{activeDriverInfo.trips} completed</span>
                  </span>
                </div>
              </div>

            </div>
          </div>

          {/* Right Column: Driver onboarding information */}
          <div className="lg:col-span-5 flex flex-col justify-center space-y-8">
            <div className="space-y-3.5">
              <span className="text-[10px] font-mono tracking-widest text-amber-600 font-bold uppercase">
                DRIVE WITH RYDR
              </span>
              <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-zinc-900 leading-tight">
                Drive when you want, meet the neighborhood
              </h2>
              <p className="text-zinc-500 text-sm md:text-[14.5px] leading-relaxed font-semibold">
                Rydr connects professional, verified local drivers directly to friendly local travelers. We offer highly competitive, transparent splits, upfront destination details, next-day payout transfers, and absolute community respect.
              </p>
            </div>

            {/* Commitments list */}
            <div className="space-y-6">
              {[
                {
                  icon: Award,
                  title: "Transparent earnings clarity",
                  desc: "Review every single travel request with upfront payout and exact routes before accepting.",
                },
                {
                  icon: Heart,
                  title: "Friendly neighborhood travelers",
                  desc: "Rydr is a welcoming consumer community built around mutual safety and polite conversations.",
                },
                {
                  icon: ShieldCheck,
                  title: "Vetted background screening",
                  desc: "Every driver undergoes a standard multi-point safety background check in minutes.",
                },
              ].map((bullet, idx) => (
                <div key={idx} className="flex space-x-4">
                  <div className="text-zinc-500 bg-white border border-zinc-200 rounded-xl w-9 h-9 flex items-center justify-center shrink-0 shadow-2xs">
                    <bullet.icon className="w-4.5 h-4.5" />
                  </div>
                  <div className="space-y-0.5 mt-0.5">
                    <h4 className="text-[13.5px] font-extrabold text-zinc-900 tracking-tight">
                      {bullet.title}
                    </h4>
                    <p className="text-[12.5px] text-zinc-500 leading-normal font-semibold">
                      {bullet.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
