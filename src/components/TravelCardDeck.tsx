"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Compass, Plane, Star, ArrowRight, Sun, Moon } from "lucide-react";

interface TravelCard {
  id: string;
  title: string;
  subtitle: string;
  icon: any;
  colorClass: string;
  textColorClass: string;
  description: string;
  illustration: () => React.ReactNode;
}

export default function TravelCardDeck() {
  const [activeCard, setActiveCard] = useState("getaway");

  const cards: TravelCard[] = [
    {
      id: "getaway",
      title: "Sunset Getaway",
      subtitle: "Weekend escapes, door-to-door",
      icon: Sun,
      colorClass: "from-[#FEF3C7] via-[#FDE68A] to-[#F59E0B]/30 border-amber-200",
      textColorClass: "text-[#B45309]",
      description: "Skip the train schedules. Load the trunk, sink into a comfortable zero-emission cabin, and head out of the city at your own pace.",
      illustration: () => (
        <svg className="w-full h-full text-amber-700/80" viewBox="0 0 300 200" fill="none">
          <defs>
            <linearGradient id="sunset-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FEF3C7" />
              <stop offset="40%" stopColor="#FDE68A" />
              <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.4" />
            </linearGradient>
          </defs>
          {/* Sunset Sky */}
          <rect width="300" height="200" rx="16" fill="url(#sunset-grad)" />
          {/* Sun with pulsing halo */}
          <motion.circle
            cx="150"
            cy="110"
            r="32"
            fill="#F59E0B"
            opacity="0.8"
            animate={{ scale: [0.97, 1.03, 0.97] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
          
          {/* Stylized Mountain Hills */}
          <path d="M -10 200 L 100 130 L 220 180 L 310 120 L 310 200 Z" fill="#D97706" opacity="0.3" />
          <path d="M 50 200 L 170 140 L 310 200 Z" fill="#B45309" opacity="0.4" />
          
          {/* Coastal Highway Line */}
          <path d="M -10 185 Q 120 150 310 175" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" />
          <path d="M -10 185 Q 120 150 310 175" stroke="#FDE68A" strokeWidth="4" strokeLinecap="round" strokeDasharray="6 14" />
          
          {/* Stylized cruising sedan moving along the highway */}
          <motion.g
            animate={{ x: [-15, 30, -15] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            transform="translate(130, 155)"
          >
            {/* Car body */}
            <path d="M 5 10 Q 15 5 25 5 L 45 5 Q 55 5 60 10 L 68 15 Q 72 17 72 20 L 72 28 L 0 28 L 0 20 Q 0 17 5 10 Z" fill="#111111" />
            <circle cx="15" cy="28" r="5" fill="#FFFFFF" stroke="#111111" strokeWidth="2.5" />
            <circle cx="55" cy="28" r="5" fill="#FFFFFF" stroke="#111111" strokeWidth="2.5" />
          </motion.g>
        </svg>
      ),
    },
    {
      id: "airport",
      title: "Airport Curbside",
      subtitle: "Curbside pickup, flight-tracked",
      icon: Plane,
      colorClass: "from-[#EFF6FF] via-[#DBEAFE] to-[#2563EB]/20 border-blue-200",
      textColorClass: "text-[#1D4ED8]",
      description: "Flight tracking and terminal drops synchronized in real-time. Walk out of the arrival gate directly into a clean, cool sedan waiting for you.",
      illustration: () => (
        <svg className="w-full h-full text-blue-700/80" viewBox="0 0 300 200" fill="none">
          <defs>
            <linearGradient id="sky-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#EFF6FF" />
              <stop offset="60%" stopColor="#DBEAFE" />
              <stop offset="100%" stopColor="#2563EB" stopOpacity="0.3" />
            </linearGradient>
          </defs>
          <rect width="300" height="200" rx="16" fill="url(#sky-grad)" />
          
          {/* Stylized Clouds / Jet streams */}
          <path d="M 30 70 C 80 50 140 90 200 60 C 240 40 270 70 320 50" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
          <path d="M -10 110 C 60 90 120 130 220 100" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />

          {/* Ascending Flight Path */}
          <path d="M 40 160 Q 150 120 260 50" stroke="#FFFFFF" strokeWidth="3" strokeDasharray="4 8" strokeLinecap="round" opacity="0.8" />
          
          {/* Flight Silhouette slowly floating */}
          <motion.g
            animate={{ x: [-8, 8, -8], y: [4, -4, 4] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            transform="translate(245, 42) rotate(-22)"
          >
            <path d="M 0 6 L 12 0 L 16 0 L 10 6 L 22 6 L 25 3 L 27 3 L 26 8 L 10 8 L 0 6 Z" fill="#2563EB" />
          </motion.g>

          {/* Terminal Terminal Gate Line */}
          <path d="M -10 180 L 310 180" stroke="#FFFFFF" strokeWidth="4" />
          
          <motion.g
            animate={{ x: [-5, 5, -5] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
            transform="translate(110, 150)"
          >
            <path d="M 5 10 Q 15 5 25 5 L 45 5 Q 55 5 60 10 L 68 15 Q 72 17 72 20 L 72 28 L 0 28 L 0 20 Q 0 17 5 10 Z" fill="#1D4ED8" />
            <circle cx="15" cy="28" r="5" fill="#FFFFFF" stroke="#1D4ED8" strokeWidth="2" />
            <circle cx="55" cy="28" r="5" fill="#FFFFFF" stroke="#1D4ED8" strokeWidth="2" />
          </motion.g>
        </svg>
      ),
    },
    {
      id: "dinner",
      title: "Dinner & Late Night",
      subtitle: "Dinner plans, safely sorted",
      icon: Moon,
      colorClass: "from-[#F3F4F6] via-[#E5E7EB] to-[#111111]/15 border-zinc-300",
      textColorClass: "text-zinc-800",
      description: "Enjoy the evening to the fullest. Safe, vetted local drivers are available on-demand to pick you up outside the restaurant curbside.",
      illustration: () => (
        <svg className="w-full h-full text-zinc-700" viewBox="0 0 300 200" fill="none">
          <defs>
            <linearGradient id="night-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F3F4F6" />
              <stop offset="60%" stopColor="#E5E7EB" />
              <stop offset="100%" stopColor="#111111" stopOpacity="0.15" />
            </linearGradient>
          </defs>
          <rect width="300" height="200" rx="16" fill="url(#night-grad)" />
          
          {/* Glowing City Silhouette */}
          <rect x="30" y="100" width="20" height="100" fill="#D1D5DB" opacity="0.6" />
          <rect x="60" y="70" width="30" height="130" fill="#E5E7EB" opacity="0.8" />
          <rect x="100" y="90" width="25" height="110" fill="#D1D5DB" opacity="0.6" />
          <rect x="140" y="60" width="35" height="140" fill="#E5E7EB" opacity="0.8" />
          <rect x="190" y="80" width="20" height="120" fill="#D1D5DB" opacity="0.6" />
          <rect x="220" y="110" width="40" height="90" fill="#E5E7EB" opacity="0.8" />

          {/* Twinkling Stars */}
          <motion.circle cx="50" cy="40" r="1.5" fill="#F59E0B" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} />
          <motion.circle cx="120" cy="30" r="1" fill="#F59E0B" animate={{ opacity: [0.8, 0.2, 0.8] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} />
          <motion.circle cx="210" cy="45" r="2" fill="#F59E0B" animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} />
          <motion.circle cx="270" cy="25" r="1.5" fill="#F59E0B" animate={{ opacity: [0.6, 0.1, 0.6] }} transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }} />

          {/* Road */}
          <path d="M -10 185 L 310 185" stroke="#FFFFFF" strokeWidth="4" />
          
          <motion.g
            animate={{ x: [-10, 10, -10] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            transform="translate(70, 155)"
          >
            <path d="M 5 10 Q 15 5 25 5 L 45 5 Q 55 5 60 10 L 68 15 Q 72 17 72 20 L 72 28 L 0 28 L 0 20 Q 0 17 5 10 Z" fill="#111111" />
            <circle cx="15" cy="28" r="5" fill="#FFFFFF" stroke="#111111" strokeWidth="2" />
            <circle cx="55" cy="28" r="5" fill="#FFFFFF" stroke="#111111" strokeWidth="2" />
          </motion.g>
        </svg>
      ),
    },
  ];

  const currentCard = cards.find((c) => c.id === activeCard) || cards[0];

  return (
    <div className="w-full bg-white border border-zinc-200 rounded-2xl shadow-sm p-6 flex flex-col space-y-6">
      
      {/* Scenario Segmented controls */}
      <div className="flex space-x-2 bg-zinc-50 p-1.5 rounded-xl border border-zinc-200">
        {cards.map((card) => (
          <button
            key={card.id}
            onClick={() => setActiveCard(card.id)}
            className={`flex-1 flex items-center justify-center space-x-1.5 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeCard === card.id
                ? "bg-white text-black shadow-2xs"
                : "text-zinc-500 hover:text-zinc-800"
            }`}
          >
            <card.icon className="w-4 h-4 text-zinc-550" />
            <span className="hidden sm:inline">{card.title}</span>
          </button>
        ))}
      </div>

      {/* Main Showcase visual */}
      <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden border border-zinc-200 shadow-3xs flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentCard.id}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.25 }}
            className="w-full h-full relative"
          >
            {currentCard.illustration()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Visual description content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentCard.id}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.2 }}
          className="space-y-2.5"
        >
          <div className="flex items-center justify-between">
            <span className={`text-[10px] font-mono font-black uppercase tracking-wider ${currentCard.textColorClass}`}>
              {currentCard.subtitle}
            </span>
            <div className="flex items-center space-x-1 text-xs font-semibold text-zinc-500">
              <span>Upfront fixed prices</span>
              <ArrowRight className="w-3 h-3 text-zinc-400" />
            </div>
          </div>
          <h4 className="text-base font-extrabold text-zinc-900 tracking-tight leading-none">
            {currentCard.title}
          </h4>
          <p className="text-[13px] text-zinc-500 leading-relaxed font-semibold">
            {currentCard.description}
          </p>
        </motion.div>
      </AnimatePresence>
      
    </div>
  );
}
