"use client";

import { motion } from "framer-motion";
import RideBookingCard from "./RideBookingCard";
import TravelCardDeck from "./TravelCardDeck";
import { Shield, Sparkles, DollarSign, Clock } from "lucide-react";

export default function Herobar() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  } as const;

  return (
    <section id="ride" className="relative min-h-screen pt-32 pb-24 flex items-center justify-center overflow-hidden bg-white">
      
      {/* Calm, soft light shadows */}
      <div className="absolute top-1/4 left-1/10 w-96 h-96 bg-blue-500/[0.01] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/10 w-96 h-96 bg-zinc-100/40 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1400px] w-full mx-auto px-6 z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center"
        >
          {/* Left Column: Heading, Description, Booking Card, Stats */}
          <div className="lg:col-span-5 flex flex-col space-y-7">
            <motion.div variants={itemVariants} className="space-y-4">
              {/* Warm tag line */}
              <div className="inline-flex items-center space-x-2 bg-zinc-50 border border-zinc-200 px-3 py-1 rounded-full text-zinc-650 text-xs font-bold tracking-wider shadow-3xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Chalo ghumne chalte hain.</span>
              </div>

              <h1 className="text-4xl md:text-5xl xl:text-[52px] font-extrabold tracking-tight text-[#111111] leading-[1.08]">
                Let's go <br />
                somewhere.
              </h1>

              <p className="text-zinc-500 text-sm md:text-[14.5px] leading-relaxed max-w-md font-semibold">
                A warm, comfortable ride is just seconds away. Date nights, airport runs, or rainy days—we've got you covered.
              </p>
            </motion.div>

            {/* Ride Booking Card (Visual Hero of the section) with Floating Stories */}
            <motion.div variants={itemVariants} className="w-full animate-fade-in relative">
              {/* Floating stickers representing travel moments */}
              <div className="absolute -top-4 -left-3 md:-top-6 md:-left-6 z-20 animate-float-slow select-none pointer-events-auto hover:scale-105 transition-transform duration-200">
                <span className="inline-flex items-center space-x-1 bg-[#EFF6FF] border border-blue-200/80 px-2.5 py-1.5 rounded-full text-[#1D4ED8] text-[10px] md:text-xs font-extrabold tracking-tight shadow-3xs cursor-pointer">
                  <span>Airport tomorrow? ✈️</span>
                </span>
              </div>

              <div className="absolute -bottom-5 -right-2 md:-bottom-7 md:-right-4 z-20 animate-float-delayed select-none pointer-events-auto hover:scale-105 transition-transform duration-200">
                <span className="inline-flex items-center space-x-1 bg-[#FFFBEB] border border-amber-250/80 px-2.5 py-1.5 rounded-full text-[#B45309] text-[10px] md:text-xs font-extrabold tracking-tight shadow-3xs cursor-pointer">
                  <span>Late night chai? ☕</span>
                </span>
              </div>

              <div className="absolute top-1/2 -right-4 md:-right-10 z-20 animate-float-slow select-none pointer-events-auto hover:scale-105 transition-transform duration-200 hidden sm:block">
                <span className="inline-flex items-center space-x-1 bg-[#F0FDFA] border border-teal-200/80 px-2.5 py-1.5 rounded-full text-[#0F766E] text-[10px] md:text-xs font-extrabold tracking-tight shadow-3xs cursor-pointer">
                  <span>Rain outside? ☔</span>
                </span>
              </div>

              <RideBookingCard />
            </motion.div>

            {/* Consumer Trust Badges (Replacing radar metrics) */}
            <motion.div 
              variants={itemVariants} 
              className="grid grid-cols-3 gap-4 pt-4 border-t border-zinc-200"
            >
              {/* Upfront pricing */}
              <div className="space-y-1">
                <div className="flex items-center space-x-1 text-zinc-500">
                  <DollarSign className="w-3.5 h-3.5 text-zinc-600" />
                  <span className="text-[10px] font-bold tracking-wider uppercase font-sans">Guaranteed Fares</span>
                </div>
                <p className="text-[11px] text-zinc-450 leading-normal font-semibold">
                  Know the exact price before you go.
                </p>
              </div>

              {/* Vetted drivers */}
              <div className="space-y-1">
                <div className="flex items-center space-x-1 text-zinc-500">
                  <Shield className="w-3.5 h-3.5 text-zinc-600" />
                  <span className="text-[10px] font-bold tracking-wider uppercase font-sans">Friendly Drivers</span>
                </div>
                <p className="text-[11px] text-zinc-450 leading-normal font-semibold">
                  Background-checked local drivers.
                </p>
              </div>

              {/* Quick dispatch */}
              <div className="space-y-1">
                <div className="flex items-center space-x-1 text-zinc-500">
                  <Clock className="w-3.5 h-3.5 text-zinc-600" />
                  <span className="text-[10px] font-bold tracking-wider uppercase font-sans">Cozy Cabins</span>
                </div>
                <p className="text-[11px] text-zinc-450 leading-normal font-semibold">
                  Adjust the climate to your sweet spot.
                </p>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Interactive Scenario Deck */}
          <motion.div variants={itemVariants} className="lg:col-span-7 w-full flex flex-col justify-center">
            <TravelCardDeck />
            
            {/* Simple monospace tag helper */}
            <div className="mt-4 flex items-center justify-between px-3 text-[10px] font-mono text-zinc-400">
              <span className="flex items-center gap-1.5 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block" />
                Chai run? Long drive? We're ready when you are.
              </span>
              <span className="flex items-center gap-1.5 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-ping" />
                Live and local
              </span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}