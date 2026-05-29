"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navigation, Check, ShieldCheck, Heart, Sparkles, User, Award } from "lucide-react";

type ActiveDriver = "vikram" | "priya";

export default function DriverSection() {
  const [isOnline, setIsOnline] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<ActiveDriver>("vikram");

  const driversList = {
    vikram: {
      name: "Vikram Malhotra",
      rating: "4.99 ★",
      trips: "1,200+ rides",
      vehicle: "Tesla Model Y (Zero Emission)",
      story: "I love taking passengers out of town on spontaneous weekend escapes. I always pre-cool the AC to a crisp breeze and put on my highway roadway jazz playlist!",
      favoriteSpot: "Lonavala Scenic Highway Outing",
      initials: "VM",
      badge: "EV Cruiser",
      perk: "Crisp AC Cabin",
    },
    priya: {
      name: "Priya Sharma",
      rating: "4.98 ★",
      trips: "950+ rides",
      vehicle: "Honda City (Comfort)",
      story: "My specialty is rain mode rides! I always carry two large doorside umbrellas to walk you dry and make sure the cabin is warm, cozy, and pre-trip synchronized.",
      favoriteSpot: "Chai Point Café Spontaneous Stop",
      initials: "PS",
      badge: "Monsoon Helper",
      perk: "Cozy & Dry Cabin",
    },
  };

  const activeDriverInfo = driversList[selectedDriver];

  return (
    <section id="drive" className="bg-[#F8F8F8] py-32 border-t border-zinc-200 relative overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Interactive Driver Profile App Mockup */}
          <div className="lg:col-span-6 w-full flex flex-col justify-center">
            <div className="bg-white border border-zinc-200 rounded-3xl p-5 md:p-6.5 shadow-sm relative overflow-hidden flex flex-col space-y-6">
              
              {/* Header: Driver App status controls */}
              <div className="flex items-center justify-between pb-4 border-b border-zinc-150">
                <div className="flex items-center space-x-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-zinc-350" />
                  <span className="text-[10px] font-mono tracking-widest text-zinc-450 font-bold">RYDR DRIVER APP</span>
                </div>

                {/* Status Toggle Button */}
                <button
                  onClick={() => setIsOnline(!isOnline)}
                  className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-full border transition-all cursor-pointer shadow-3xs ${
                    isOnline 
                      ? "bg-emerald-50 border-emerald-350 text-emerald-700 font-extrabold"
                      : "bg-zinc-50 border-zinc-200 text-zinc-550 font-bold"
                  }`}
                >
                  <span className="text-[9.5px] font-mono tracking-wider">
                    {isOnline ? "ONLINE" : "OFFLINE"}
                  </span>
                  <div className="w-3.5 h-3.5 flex items-center justify-center">
                    {isOnline ? (
                      <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-zinc-400" />
                    )}
                  </div>
                </button>
              </div>

              {/* Segmented control to toggle between drivers */}
              <div className="flex space-x-2 bg-zinc-50 p-1 rounded-xl border border-zinc-200">
                {(["vikram", "priya"] as ActiveDriver[]).map((driverId) => (
                  <button
                    key={driverId}
                    onClick={() => setSelectedDriver(driverId)}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      selectedDriver === driverId
                        ? "bg-white text-black shadow-3xs"
                        : "text-zinc-500 hover:text-zinc-800"
                    }`}
                  >
                    {driverId === "vikram" ? "Vikram Malhotra" : "Priya Sharma"}
                  </button>
                ))}
              </div>

              {/* Dynamic Driver Information Polaroid Profile */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedDriver}
                  initial={{ opacity: 0, scale: 0.98, y: 5 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98, y: -5 }}
                  transition={{ duration: 0.2 }}
                  className="bg-zinc-50 border border-zinc-200 rounded-2xl p-5.5 space-y-4 shadow-3xs relative overflow-hidden"
                >
                  {/* Top Details */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3.5">
                      <div className="w-11 h-11 rounded-full bg-white border border-zinc-200 flex items-center justify-center shadow-3xs text-zinc-800 font-black text-sm">
                        {activeDriverInfo.initials}
                      </div>
                      <div>
                        <h4 className="text-[13px] font-black text-zinc-900 leading-tight">{activeDriverInfo.name}</h4>
                        <p className="text-[10px] text-zinc-450 mt-0.5 leading-none font-semibold">{activeDriverInfo.vehicle}</p>
                      </div>
                    </div>
                    <span className="text-[9.5px] font-mono font-extrabold bg-white border border-zinc-200 px-2 py-0.5 rounded shadow-3xs text-zinc-700">
                      {activeDriverInfo.badge}
                    </span>
                  </div>

                  <div className="h-[1px] bg-zinc-200/60" />

                  {/* Storytelling bio */}
                  <div className="space-y-1">
                    <span className="text-[8.5px] font-mono text-zinc-400 font-extrabold uppercase tracking-wider block">Why I love driving</span>
                    <p className="text-[12.5px] text-zinc-700 font-semibold leading-relaxed italic">
                      "{activeDriverInfo.story}"
                    </p>
                  </div>

                  {/* Driver metrics */}
                  <div className="grid grid-cols-3 gap-3 pt-2">
                    <div className="bg-white border border-zinc-200 rounded-xl p-3.5 text-center shadow-3xs">
                      <span className="text-[14px] font-black text-zinc-900 block leading-none">{activeDriverInfo.rating}</span>
                      <span className="text-[8px] font-mono text-zinc-400 block mt-1 uppercase font-bold">Feedback</span>
                    </div>
                    <div className="bg-white border border-zinc-200 rounded-xl p-3.5 text-center shadow-3xs">
                      <span className="text-[12px] font-black text-zinc-900 block leading-none">{activeDriverInfo.trips}</span>
                      <span className="text-[8px] font-mono text-zinc-400 block mt-1.5 uppercase font-bold">Trips Completed</span>
                    </div>
                    <div className="bg-white border border-zinc-200 rounded-xl p-3.5 text-center shadow-3xs flex flex-col items-center justify-center">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 stroke-[2.5]" />
                      <span className="text-[8px] font-mono text-zinc-400 block mt-1 uppercase font-bold">Vetted Shield</span>
                    </div>
                  </div>

                </motion.div>
              </AnimatePresence>

              {/* Pulsing Request Matching Overlay when Online */}
              <AnimatePresence>
                {isOnline ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.98, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98, y: 10 }}
                    className="absolute inset-x-5 bottom-5 bg-white border border-zinc-250 shadow-md p-4 rounded-xl flex items-center justify-between z-10"
                  >
                    <div className="flex items-center space-x-3.5">
                      <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600 animate-pulse">
                        <Navigation className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-1.5">
                          <span className="text-[9px] font-mono font-black tracking-wider text-emerald-750 uppercase">MATCHING REQUEST FOUND</span>
                        </div>
                        <div className="text-[13.5px] font-black text-zinc-900 tracking-tight mt-0.5">
                          Chai Run • 1.2 mi • 3m away
                        </div>
                      </div>
                    </div>
                    <button className="px-3.5 py-1.5 bg-black text-white hover:bg-zinc-800 active:scale-95 transition-all text-xs font-bold rounded-lg cursor-pointer flex items-center space-x-1 shadow-sm">
                      <Check className="w-3.5 h-3.5" />
                      <span>Accept</span>
                    </button>
                  </motion.div>
                ) : (
                  <div className="text-center py-2 text-[10.5px] font-extrabold text-zinc-400 select-none">
                    Tap OFFLINE to simulate matching Vikram/Priya with your next ride!
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right Column: Driver details */}
          <div className="lg:col-span-6 flex flex-col justify-center space-y-8">
            <div className="space-y-3.5">
              <span className="text-[10px] font-mono tracking-widest text-amber-600 font-bold uppercase">
                DRIVE WITH RYDR
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tighter text-zinc-900">
                Drive when you want, meet the neighborhood
              </h2>
              <p className="text-zinc-500 text-sm md:text-[14.5px] leading-relaxed font-semibold">
                Rydr connects professional, verified local drivers directly to friendly local travelers. We offer highly competitive, transparent splits, upfront destination details, next-day payout transfers, and absolute community respect.
              </p>
            </div>

            {/* Steps & Driver Commitments */}
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
                  <div className="text-zinc-500 bg-white border border-zinc-200 rounded-lg w-9 h-9 flex items-center justify-center shrink-0 shadow-2xs">
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
