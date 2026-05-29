"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Thermometer, VolumeX, CreditCard, Shield, Clock, Gift, Check, Sparkles, Music } from "lucide-react";

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
      temp: 72,
      tempLabel: "Warm & Cozy",
      quiet: false,
      quietLabel: "Friendly local greetings",
      soundscape: "Soft monsoon rain & lo-fi playlist",
      perk: "Driver meets you doorside with a large umbrella",
      bgClass: "from-[#F0FDFA] via-white to-[#CCFBF1]/25 border-teal-200",
      glowClass: "ambient-glow-teal",
      textColor: "text-[#0F766E]",
      badgeColor: "bg-teal-100/60 text-[#0F766E] border-teal-200/50",
    },
    sunset: {
      name: "Sunset Chill",
      temp: 68,
      tempLabel: "Crisp AC Breeze",
      quiet: false,
      quietLabel: "Driver will follow your lead",
      soundscape: "Sunroof open & soft roadway jazz",
      perk: "Pre-cooled cabin with fresh cold water bottles",
      bgClass: "from-[#FFFBEB] via-white to-[#FDE68A]/20 border-amber-250/60",
      glowClass: "ambient-glow-amber",
      textColor: "text-[#B45309]",
      badgeColor: "bg-amber-100/60 text-[#B45309] border-amber-200/40",
    },
    midnight: {
      name: "Midnight Rest",
      temp: 66,
      tempLabel: "Crisp Chill AC",
      quiet: true,
      quietLabel: "Absolute silence (driver conversation off)",
      soundscape: "Silent cabin & zero music",
      perk: "Device charging cables pre-plugged & dimmed indicators",
      bgClass: "from-[#FAF5FF] via-white to-[#E9D5FF]/20 border-purple-250/60",
      glowClass: "ambient-glow-purple",
      textColor: "text-[#701A75]",
      badgeColor: "bg-purple-100/60 text-[#701A75] border-purple-200/50",
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
    <section id="safety" className="bg-white py-32 border-t border-zinc-200 relative overflow-hidden">
      
      {/* Dynamic Ambient Glow Backlight based on selected mood */}
      <div className={`absolute inset-0 ${currentMood.glowClass} opacity-[0.25] pointer-events-none transition-all duration-500`} />

      <div className="max-w-[1400px] mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Interactive Cabin Mood Explorer Console */}
          <div className="lg:col-span-6 flex flex-col justify-center order-last lg:order-first">
            <div className="relative bg-zinc-50 border border-zinc-200 rounded-3xl overflow-hidden shadow-2xs p-6 md:p-8 flex flex-col space-y-6">
              
              {/* Header with Segmented Cabin Mode Buttons */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-200/60 pb-5">
                <div>
                  <span className="text-[10px] font-mono font-bold tracking-widest text-zinc-400 uppercase">
                    Cabin Experience
                  </span>
                  <h3 className="text-base font-extrabold text-zinc-900 tracking-tight">Ambient Cabin Moods</h3>
                </div>

                {/* Mood Segmented control */}
                <div className="flex space-x-1 bg-zinc-150 p-1 rounded-xl border border-zinc-200">
                  {(["monsoon", "sunset", "midnight"] as CabinMood[]).map((m) => (
                    <button
                      key={m}
                      onClick={() => setSelectedMood(m)}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-mono uppercase tracking-wider transition-colors cursor-pointer ${
                        selectedMood === m 
                          ? "bg-white text-black font-extrabold shadow-3xs"
                          : "text-zinc-550 hover:text-zinc-800"
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic Cabin Ambient Preview Card */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedMood}
                  initial={{ opacity: 0, scale: 0.98, y: 5 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98, y: -5 }}
                  transition={{ duration: 0.25 }}
                  className={`bg-gradient-to-br ${currentMood.bgClass} border rounded-2xl p-6.5 shadow-3xs space-y-5 flex flex-col`}
                >
                  
                  {/* Title & Active indicator */}
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-mono font-extrabold tracking-wider uppercase px-2.5 py-0.5 rounded border ${currentMood.badgeColor}`}>
                      {currentMood.name} Mode Active
                    </span>
                    <div className="flex items-center space-x-1 text-[9px] font-mono text-zinc-550 font-bold bg-white border border-zinc-200 px-2 py-0.5 rounded shadow-3xs">
                      <Sparkles className={`w-3 h-3 ${currentMood.textColor} animate-pulse`} />
                      <span>COZY CABIN</span>
                    </div>
                  </div>

                  {/* Visual Temperature status */}
                  <div className="flex justify-between items-center border-b border-zinc-200/50 pb-3">
                    <div className="flex items-center space-x-2.5">
                      <Thermometer className={`w-4.5 h-4.5 ${currentMood.textColor}`} />
                      <span className="text-[13px] font-bold text-zinc-700">Pre-cooled Climate</span>
                    </div>
                    <span className="text-[13.5px] font-black text-zinc-900 font-mono bg-white px-2.5 py-0.5 rounded-md border border-zinc-200 shadow-3xs">
                      {currentMood.temp}°F • {currentMood.tempLabel}
                    </span>
                  </div>

                  {/* Visual Conversation status */}
                  <div className="flex justify-between items-center border-b border-zinc-200/50 pb-3">
                    <div className="flex items-center space-x-2.5">
                      <VolumeX className={`w-4.5 h-4.5 ${currentMood.textColor}`} />
                      <span className="text-[13px] font-bold text-zinc-700">Driver Conversation</span>
                    </div>
                    <span className="text-[12px] font-extrabold text-zinc-800">
                      {currentMood.quietLabel}
                    </span>
                  </div>

                  {/* Soundscape status */}
                  <div className="flex justify-between items-center border-b border-zinc-200/50 pb-3">
                    <div className="flex items-center space-x-2.5">
                      <Music className={`w-4.5 h-4.5 ${currentMood.textColor}`} />
                      <span className="text-[13px] font-bold text-zinc-700">Audio Soundscape</span>
                    </div>
                    <span className="text-[12px] font-extrabold text-zinc-800">
                      {currentMood.soundscape}
                    </span>
                  </div>

                  {/* Special Driver Perks */}
                  <div className="pt-1.5">
                    <span className="text-[9px] font-mono text-zinc-400 font-bold block uppercase tracking-wider">Doorside driver hospitality</span>
                    <p className="text-[12.5px] font-bold text-zinc-800 mt-1 leading-normal">
                      {currentMood.perk}
                    </p>
                  </div>

                </motion.div>
              </AnimatePresence>

            </div>
          </div>

          {/* Right Column: Title & Feature Grid */}
          <div className="lg:col-span-6 flex flex-col justify-center space-y-8">
            <div className="space-y-3.5">
              <span className="text-[10px] font-mono tracking-widest text-amber-600 font-bold uppercase">
                Cozy Cabins
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tighter text-zinc-900">
                Your cabin, your rules.
              </h2>
              <p className="text-zinc-550 text-sm md:text-[14.5px] leading-relaxed font-semibold">
                We believe rides should be cozy, personal, and stress-free. Settle in, explore ambient cabin moods, let doorside driver hospitality handle the monsoons, and walk out cashless.
              </p>
            </div>

            {/* Clean feature cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-3">
              {features.map((feature, idx) => (
                <div
                  key={idx}
                  className="bg-zinc-50 border border-zinc-200 p-5 rounded-xl flex flex-col space-y-2 hover:border-zinc-300 transition-colors group shadow-3xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="p-2 bg-white border border-zinc-200 text-zinc-500 group-hover:text-black transition-colors rounded-lg shadow-3xs">
                      <feature.icon className="w-4 h-4" />
                    </div>
                    {feature.badge && (
                      <span className="text-[9px] font-mono font-bold tracking-wider bg-white text-zinc-650 border border-zinc-200 px-2.5 py-0.5 rounded shadow-3xs">
                        {feature.badge}
                      </span>
                    )}
                  </div>
                  
                  <div className="space-y-1 mt-1">
                    <h4 className="text-[13.5px] font-bold text-zinc-900 tracking-tight">
                      {feature.title}
                    </h4>
                    <p className="text-[11.5px] text-zinc-500 leading-normal font-semibold">
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
