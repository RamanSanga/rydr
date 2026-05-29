"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import RideBookingCard from "./RideBookingCard";
import { Shield, Sparkles, DollarSign, Clock } from "lucide-react";

export default function Herobar() {
  const [activeSlide, setActiveSlide] = useState(0);

  const slides = [
    {
      src: "/images/sunset_drive.png",
      title: "Sunset Highway Escape",
      tagline: "Weekend plans • Let's disappear for a while",
      copy: "Skip the queues and traffic stress.Settle into a zero-emission luxury cabin and cruise into the warm golden hours."
    },
    {
      src: "/images/airport_pickup.png",
      title: "Airport Curbside Arrivals",
      tagline: "Curbside match • Running late?",
      copy: "Vetted professional local drivers synchronized with your flight. Walk directly from arrivals into a cool, calm premium cabin."
    },
    {
      src: "/images/late_night_ride.png",
      title: "Rainy Evening City Comfort",
      tagline: "Late night ride • Wet neon glows",
      copy: "Watch rainy city street reflections and wet asphalt pavement from a warm, dry passenger cabin carrying doorside umbrellas."
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [slides.length]);

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
                <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                <span>Your ride is already waiting.</span>
              </div>

              <h1 className="text-4xl md:text-5xl xl:text-[52px] font-black tracking-tight text-[#111111] leading-[1.08]">
                Where are we <br />
                headed today?
              </h1>

              <p className="text-zinc-500 text-sm md:text-[14.5px] leading-relaxed max-w-md font-semibold">
                A warm, comfortable ride is just seconds away. Settle in, relax, and let us handle the road.
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

          {/* Right Column: Interactive Cinematic Journey Window */}
          <motion.div variants={itemVariants} className="lg:col-span-7 w-full flex flex-col justify-center">
            <div className="w-full bg-[#111111] border border-zinc-900 rounded-3xl p-5 md:p-7 shadow-2xl relative flex flex-col space-y-6 overflow-hidden">
              
              {/* Slideshow Image Showcase Container */}
              <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden border border-zinc-800 shadow-xl flex items-center justify-center bg-black group">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeSlide}
                    initial={{ opacity: 0, scale: 1.01 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.99 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                    className="absolute inset-0"
                  >
                    <img
                      src={slides[activeSlide].src}
                      alt={slides[activeSlide].title}
                      className="w-full h-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-103"
                    />
                    {/* Cinematic bottom overlay lighting gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />
                    
                    {/* Live overlay text directly inside the image */}
                    <div className="absolute bottom-5 inset-x-5 flex flex-col space-y-1.5 text-left text-white drop-shadow-md">
                      <span className="text-[10px] font-mono font-black tracking-widest text-amber-500 uppercase">
                        {slides[activeSlide].tagline}
                      </span>
                      <h4 className="text-lg font-black tracking-tight leading-none">
                        {slides[activeSlide].title}
                      </h4>
                      <p className="text-[12.5px] text-zinc-300 leading-normal max-w-md font-medium">
                        {slides[activeSlide].copy}
                      </p>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Left/Right manual click triggers */}
                <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length);
                    }}
                    className="p-2.5 rounded-full bg-black/60 hover:bg-black text-white border border-zinc-800 pointer-events-auto cursor-pointer active:scale-95 transition-all shadow-md"
                  >
                    <svg className="w-4 h-4 stroke-[3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveSlide((prev) => (prev + 1) % slides.length);
                    }}
                    className="p-2.5 rounded-full bg-black/60 hover:bg-black text-white border border-zinc-800 pointer-events-auto cursor-pointer active:scale-95 transition-all shadow-md"
                  >
                    <svg className="w-4 h-4 stroke-[3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Dot Indicators */}
              <div className="flex justify-between items-center px-2">
                <div className="flex space-x-2">
                  {slides.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveSlide(idx)}
                      className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                        activeSlide === idx ? "w-6 bg-amber-500" : "w-1.5 bg-zinc-700 hover:bg-zinc-500"
                      }`}
                    />
                  ))}
                </div>
                
                {/* Monospace live tracker */}
                <span className="flex items-center gap-1.5 text-[9.5px] font-mono text-zinc-500 font-extrabold uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-ping" />
                  Live curbside arrival match
                </span>
              </div>

            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}