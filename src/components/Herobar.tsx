"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import RideBookingCard from "./RideBookingCard";
import { Shield, Sparkles, IndianRupee, Clock } from "lucide-react";

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
    <section id="ride" className="relative min-h-screen pt-20 pb-12 lg:pt-32 lg:pb-24 flex items-center justify-center overflow-hidden bg-white">
      
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
              <div className="text-[11px] font-mono font-bold tracking-[0.2em] text-zinc-400 uppercase">
                Your ride is already waiting
              </div>

              <h1 className="text-4xl md:text-5xl xl:text-[52px] font-black tracking-tight text-[#111111] leading-[1.08]">
                Where are we <br />
                headed today?
              </h1>

              <p className="text-zinc-500 text-sm md:text-[14.5px] leading-relaxed max-w-md font-semibold">
                A warm, comfortable ride is just seconds away. Settle in, relax, and let us handle the road.
              </p>
            </motion.div>

            {/* Ride Booking Card (Visual Hero of the section) */}
            <motion.div variants={itemVariants} className="w-full animate-fade-in relative">
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
                  <IndianRupee className="w-3.5 h-3.5 text-zinc-655" />
                  <span className="text-[10px] font-bold tracking-wider uppercase font-sans">Guaranteed Fares</span>
                </div>
                <p className="text-[11px] text-zinc-450 leading-normal font-semibold">
                  Know the exact price before you go.
                </p>
              </div>

              {/* Vetted drivers */}
              <div className="space-y-1">
                <div className="flex items-center space-x-1 text-zinc-500">
                  <Shield className="w-3.5 h-3.5 text-zinc-655" />
                  <span className="text-[10px] font-bold tracking-wider uppercase font-sans">Friendly Drivers</span>
                </div>
                <p className="text-[11px] text-zinc-450 leading-normal font-semibold">
                  Background-checked local drivers.
                </p>
              </div>

              {/* Quick dispatch */}
              <div className="space-y-1">
                <div className="flex items-center space-x-1 text-zinc-500">
                  <Clock className="w-3.5 h-3.5 text-zinc-655" />
                  <span className="text-[10px] font-bold tracking-wider uppercase font-sans">Cozy Cabins</span>
                </div>
                <p className="text-[11px] text-zinc-450 leading-normal font-semibold">
                  Adjust the climate to your sweet spot.
                </p>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Interactive Cinematic Journey Window */}
          <motion.div variants={itemVariants} className="hidden lg:flex lg:col-span-7 w-full flex flex-col justify-center">
            <div className="w-full bg-white border border-zinc-200 rounded-xl p-3 shadow-xs relative flex flex-col space-y-4 overflow-hidden">
              
              {/* Slideshow Image Showcase Container */}
              <div className="relative aspect-[4/3] w-full rounded-lg overflow-hidden border border-zinc-200 flex items-center justify-center bg-zinc-50 group">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeSlide}
                    initial={{ opacity: 0, scale: 1.01 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.99 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="absolute inset-0"
                  >
                    <img
                      src={slides[activeSlide].src}
                      alt={slides[activeSlide].title}
                      className="w-full h-full object-cover opacity-95 transition-transform duration-700 group-hover:scale-101"
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Left/Right manual click triggers */}
                <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length);
                    }}
                    className="p-2.5 rounded-full bg-white/90 hover:bg-white text-black border border-zinc-200 pointer-events-auto cursor-pointer active:scale-95 transition-all shadow-sm"
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
                    className="p-2.5 rounded-full bg-white/90 hover:bg-white text-black border border-zinc-200 pointer-events-auto cursor-pointer active:scale-95 transition-all shadow-sm"
                  >
                    <svg className="w-4 h-4 stroke-[3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Live tracker and text details below image */}
              <div className="flex flex-col space-y-2.5 p-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold tracking-widest text-zinc-450 uppercase">
                    {slides[activeSlide].tagline}
                  </span>
                  <span className="flex items-center gap-1.5 text-[9.5px] font-mono text-zinc-450 font-extrabold uppercase shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
                    Live Dispatch
                  </span>
                </div>
                <div className="space-y-1">
                  <h4 className="text-base font-bold tracking-tight text-zinc-950">
                    {slides[activeSlide].title}
                  </h4>
                  <p className="text-xs text-zinc-500 leading-relaxed">
                    {slides[activeSlide].copy}
                  </p>
                </div>
              </div>

              {/* Dot Indicators */}
              <div className="flex justify-between items-center px-2 pt-1 border-t border-zinc-100">
                <div className="flex space-x-1.5">
                  {slides.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveSlide(idx)}
                      className={`h-1.5 rounded-full transition-all duration-350 cursor-pointer ${
                        activeSlide === idx ? "w-6 bg-black" : "w-1.5 bg-zinc-200 hover:bg-zinc-300"
                      }`}
                    />
                  ))}
                </div>
              </div>

            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}