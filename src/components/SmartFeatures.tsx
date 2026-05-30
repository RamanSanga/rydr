"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Thermometer, VolumeX, CreditCard, Shield, Clock, Gift, Sparkles, Music } from "lucide-react";

interface FeatureItem {
  icon: any;
  title: string;
  description: string;
  badge?: string;
}

type CabinMood = "monsoon" | "sunset" | "midnight";

export default function SmartFeatures() {
  const [selectedMood, setSelectedMood] = useState<CabinMood>("monsoon");

  const moodsInfo = {
    monsoon: {
      name: "Monsoon Cozy",
      temp: 22,
      tempLabel: "Warm & Cozy",
      quietLabel: "Friendly driver conversation",
      soundscape: "Soft monsoon rain & lo-fi playlist",
      perk: "Driver meets you doorside with a large umbrella",
      imageSrc: "/images/late_night_ride.png",
      glowClass: "ambient-glow-teal",
      textColor: "text-teal-400",
      badgeColor: "bg-teal-500/10 text-teal-300 border-teal-500/20",
    },
    sunset: {
      name: "Sunset Chill",
      temp: 20,
      tempLabel: "Crisp AC Breeze",
      quietLabel: "Driver will follow your lead",
      soundscape: "Sunroof open & soft roadway jazz",
      perk: "Pre-cooled cabin with fresh cold water bottles",
      imageSrc: "/images/sunset_drive.png",
      glowClass: "ambient-glow-amber",
      textColor: "text-amber-400",
      badgeColor: "bg-amber-500/10 text-amber-300 border-amber-500/20",
    },
    midnight: {
      name: "Midnight Rest",
      temp: 19,
      tempLabel: "Crisp Chill AC",
      quietLabel: "Absolute silence (driver conversation off)",
      soundscape: "Silent cabin & zero music",
      perk: "Device charging cables pre-plugged & dimmed indicators",
      imageSrc: "/images/date_night.png",
      glowClass: "ambient-glow-purple",
      textColor: "text-purple-400",
      badgeColor: "bg-purple-500/10 text-purple-300 border-purple-500/20",
    },
  };

  const features: FeatureItem[] = [
    {
      icon: Thermometer,
      title: "Climate Pre-cooling",
      description: "Set your preferred temperature in-app. Step inside a perfectly pre-cooled cabin on hot days.",
      badge: "Cozy Comfort",
    },
    {
      icon: VolumeX,
      title: "Quiet Mode Option",
      description: "Wind down in silence. Let your driver know you prefer a quiet, uninterrupted journey.",
    },
    {
      icon: CreditCard,
      title: "Cashless Checkout",
      description: "Payment is processed automatically upon arrival. Walk out and head to your destination stress-free.",
    },
    {
      icon: Shield,
      title: "Umbrella Service",
      description: "Monsoon rains outside? Vetted local drivers meet you doorside carrying large umbrellas.",
      badge: "Rain Mode Ready",
    },
    {
      icon: Clock,
      title: "Late Night Comfort",
      description: "Spacious, quiet zero-emission EV cabins designed for late-night rides and spontaneous outings.",
    },
    {
      icon: Gift,
      title: "Cabin Perks",
      description: "Cold mineral water bottles and high-speed device charging cables come standard on every ride.",
    },
  ];

  const currentMood = moodsInfo[selectedMood];

  return (
    <section id="safety" className="bg-[#111111] py-32 border-t border-zinc-900 relative overflow-hidden">
      
      {/* Dynamic Ambient Glow Backlight based on selected mood */}
      <div className={`absolute inset-0 ${currentMood.glowClass} opacity-[0.03] pointer-events-none transition-all duration-500`} />

      <div className="max-w-[1400px] mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Interactive Cabin Mood Explorer Console */}
          <div className="lg:col-span-6 flex flex-col justify-center order-last lg:order-first">
            <div className="relative bg-black/60 border border-zinc-900 rounded-3xl overflow-hidden shadow-2xl p-6 md:p-8 flex flex-col space-y-6">
              
              {/* Header with Segmented Cabin Mode Buttons */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-800/60 pb-5">
                <div>
                  <span className="text-[10px] font-mono font-bold tracking-widest text-zinc-500 uppercase">
                    Cabin Experience
                  </span>
                  <h3 className="text-base font-extrabold text-white tracking-tight">Ambient Cabin Moods</h3>
                </div>

                {/* Mood Segmented control */}
                <div className="flex space-x-1 bg-zinc-900 p-1 rounded-xl border border-zinc-800 self-start sm:self-auto">
                  {(["monsoon", "sunset", "midnight"] as CabinMood[]).map((m) => (
                    <button
                      key={m}
                      onClick={() => setSelectedMood(m)}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-mono uppercase tracking-wider transition-colors cursor-pointer ${
                        selectedMood === m 
                          ? "bg-white text-black font-extrabold shadow-3xs"
                          : "text-zinc-400 hover:text-zinc-200"
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic Cabin Ambient Preview Card (Photographic backdrop) */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedMood}
                  initial={{ opacity: 0, scale: 0.98, y: 5 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98, y: -5 }}
                  transition={{ duration: 0.25 }}
                  className="relative rounded-2xl overflow-hidden border border-zinc-800 shadow-xl min-h-[300px] flex flex-col justify-end p-6"
                >
                  {/* Full-bleed background photo overlay */}
                  <div className="absolute inset-0 z-0">
                    <img
                      src={currentMood.imageSrc}
                      alt={currentMood.name}
                      className="w-full h-full object-cover opacity-50"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                  </div>

                  {/* Top indicators */}
                  <div className="absolute top-5 inset-x-5 flex items-center justify-between z-10">
                    <span className={`text-[9px] font-mono font-extrabold tracking-wider uppercase px-2.5 py-0.5 rounded border ${currentMood.badgeColor}`}>
                      {currentMood.name} Mode Active
                    </span>
                    <div className="flex items-center space-x-1 text-[9px] font-mono text-zinc-300 font-bold bg-black/60 border border-zinc-800 px-2 py-0.5 rounded shadow-3xs">
                      <Sparkles className={`w-3 h-3 ${currentMood.textColor} animate-pulse`} />
                      <span>COZY CABIN</span>
                    </div>
                  </div>

                  {/* Status Overlay content */}
                  <div className="relative z-10 space-y-3.5 mt-20">
                    {/* Temperature */}
                    <div className="flex justify-between items-center border-b border-zinc-800/50 pb-2">
                      <div className="flex items-center space-x-2 text-zinc-350">
                        <Thermometer className="w-4 h-4 text-amber-500" />
                        <span className="text-[12.5px] font-bold">Climate Cabin</span>
                      </div>
                      <span className="text-[12.5px] font-black text-white font-mono bg-black/40 px-2 py-0.5 rounded border border-zinc-800">
                        {currentMood.temp}°C • {currentMood.tempLabel}
                      </span>
                    </div>

                    {/* Quiet Mode */}
                    <div className="flex justify-between items-center border-b border-zinc-800/50 pb-2">
                      <div className="flex items-center space-x-2 text-zinc-350">
                        <VolumeX className="w-4 h-4" />
                        <span className="text-[12.5px] font-bold">Driver Status</span>
                      </div>
                      <span className="text-[11.5px] font-bold text-white max-w-[180px] text-right truncate">
                        {currentMood.quietLabel}
                      </span>
                    </div>

                    {/* Soundscape */}
                    <div className="flex justify-between items-center border-b border-zinc-800/50 pb-2">
                      <div className="flex items-center space-x-2 text-zinc-350">
                        <Music className="w-4 h-4" />
                        <span className="text-[12.5px] font-bold">Audio Track</span>
                      </div>
                      <span className="text-[11.5px] font-bold text-white max-w-[180px] text-right truncate">
                        {currentMood.soundscape}
                      </span>
                    </div>

                    {/* Perks */}
                    <div className="pt-1 select-none">
                      <span className="text-[8px] font-mono text-zinc-450 font-extrabold uppercase tracking-wider block">Doorside Hospitality</span>
                      <p className="text-[12px] font-extrabold text-white mt-0.5 leading-normal">
                        {currentMood.perk}
                      </p>
                    </div>
                  </div>

                </motion.div>
              </AnimatePresence>

            </div>
          </div>

          {/* Right Column: Title & Feature Grid */}
          <div className="lg:col-span-6 flex flex-col justify-center space-y-8">
            <div className="space-y-3.5">
              <span className="text-[10px] font-mono tracking-widest text-amber-500 font-bold uppercase">
                Cozy Cabins
              </span>
              <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-white">
                Your cabin, your rules.
              </h2>
              <p className="text-zinc-400 text-sm md:text-[14.5px] leading-relaxed font-semibold">
                We believe rides should be cozy, personal, and stress-free. Settle in, explore ambient cabin moods, let doorside driver hospitality handle the monsoons, and walk out cashless.
              </p>
            </div>

            {/* Clean feature cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-3">
              {features.map((feature, idx) => (
                <div
                  key={idx}
                  className="bg-black/40 border border-zinc-900 p-5 rounded-2xl flex flex-col space-y-2 hover:border-zinc-800 transition-colors group shadow-3xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="p-2 bg-zinc-900 border border-zinc-800 text-zinc-550 group-hover:text-white transition-colors rounded-xl shadow-3xs">
                      <feature.icon className="w-4 h-4" />
                    </div>
                    {feature.badge && (
                      <span className="text-[9px] font-mono font-bold tracking-wider bg-zinc-900 text-zinc-450 border border-zinc-800 px-2.5 py-0.5 rounded shadow-3xs">
                        {feature.badge}
                      </span>
                    )}
                  </div>
                  
                  <div className="space-y-1 mt-1">
                    <h4 className="text-[13.5px] font-extrabold text-white tracking-tight">
                      {feature.title}
                    </h4>
                    <p className="text-[11.5px] text-zinc-450 leading-normal font-semibold">
                      {feature.description}
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
