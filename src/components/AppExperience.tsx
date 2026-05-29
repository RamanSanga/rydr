"use client";

import { motion } from "framer-motion";
import { Wallet, ArrowUpRight, Camera, Sparkles, Heart } from "lucide-react";

export default function AppExperience() {
  return (
    <section className="bg-[#111111] py-32 border-t border-zinc-900 relative overflow-hidden">
      
      {/* Premium Backlighting Glow (Dramatic Deep Glow) */}
      <div className="absolute inset-0 bg-radial-gradient from-blue-500/[0.02] via-transparent to-transparent pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Dual Phone CSS Mockups (Travel Journal Theme) */}
          <div className="lg:col-span-6 flex items-center justify-center space-x-6 md:space-x-8">
            
            {/* Phone Mockup 1: Live Ride GPS Tracking */}
            <div className="w-[230px] md:w-[260px] h-[480px] md:h-[530px] bg-[#1a1a1a] border-[7px] border-zinc-800 rounded-[38px] shadow-2xl overflow-hidden relative flex flex-col justify-between p-4.5 select-none hover:scale-101 transition-transform duration-250">
              {/* Speaker Notch */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-4 bg-zinc-900 rounded-full z-20 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-700 ml-6" />
              </div>

              {/* Simulated Map Canvas Background */}
              <div className="absolute inset-0 premium-grid-fine opacity-[0.06]" />
              
              {/* HUD / Header */}
              <div className="flex items-center justify-between z-10 mt-2">
                <span className="text-[9px] font-mono font-bold text-zinc-550">RYDR CLIENT APP</span>
                <span className="text-[9px] font-mono font-bold text-emerald-500 animate-pulse">GPS ACTIVE</span>
              </div>

              {/* Center Map Graphics */}
              <div className="absolute inset-x-4 top-1/4 bottom-1/3 flex items-center justify-center">
                <svg className="w-full h-full text-zinc-800" viewBox="0 0 200 200" fill="none">
                  {/* Glowing Route line */}
                  <path d="M 30 160 Q 100 120 120 70 T 170 30" stroke="#2563EB" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.8" />
                  <path d="M 30 160 Q 100 120 120 70 T 170 30" stroke="#FFFFFF" strokeWidth="3" fill="none" strokeLinecap="round" strokeDasharray="8 60" />
                  
                  {/* Pins */}
                  <circle cx="30" cy="160" r="4.5" fill="#16A34A" />
                  <circle cx="170" cy="30" r="4.5" fill="#2563EB" />
                  
                  {/* Moving Car */}
                  <circle cx="115" cy="82" r="6" fill="#FFFFFF" stroke="#111111" strokeWidth="2.5" />
                </svg>
              </div>

              {/* Passenger matched greeting card overlay at bottom */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-3 flex flex-col space-y-2.5 z-10 shadow-lg text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="text-[11px] font-bold text-white leading-tight">Chai Run Commute</h5>
                    <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-wider font-bold">Vikram • Tesla Model Y</span>
                  </div>
                  <span className="text-[9.5px] font-mono font-bold text-emerald-500">ETA 2m</span>
                </div>
                <div className="h-[1px] bg-zinc-800" />
                <div className="flex items-center justify-between">
                  <span className="text-[9px] text-zinc-400 font-semibold">Upfront price locked</span>
                  <span className="text-[11.5px] font-black text-amber-500">$13.50</span>
                </div>
              </div>
            </div>

            {/* Phone Mockup 2: Polaroid Outing Diary feed */}
            <div className="w-[230px] md:w-[260px] h-[480px] md:h-[530px] bg-[#1a1a1a] border-[7px] border-zinc-800 rounded-[38px] shadow-2xl overflow-hidden relative flex flex-col justify-between p-4.5 translate-y-8 hidden sm:flex select-none hover:scale-101 transition-transform duration-250">
              {/* Speaker Notch */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-4 bg-zinc-900 rounded-full z-20" />
              
              {/* Journal Header */}
              <div className="flex items-center justify-between z-10 mt-2">
                <span className="text-[9px] font-mono font-extrabold text-zinc-500">OUTING DIARY</span>
                <Camera className="w-3.5 h-3.5 text-zinc-500" />
              </div>

              {/* Journal Outing details */}
              <div className="space-y-4.5 z-10 mt-5 flex-1 flex flex-col text-white">
                <div className="space-y-0.5">
                  <span className="text-[8px] font-mono text-zinc-400 uppercase tracking-widest font-bold block">Friday Night Out</span>
                  <div className="text-xl font-black text-white tracking-tight leading-tight">Chai Point Outing</div>
                </div>
                
                {/* Polaroid Outing memories outline card */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 space-y-2.5 shadow-md flex-1 flex flex-col justify-between">
                  {/* Mock snapshot area */}
                  <div className="w-full flex-1 bg-black border border-zinc-850 rounded-lg flex flex-col items-center justify-center p-2 relative">
                    <div className="w-full h-full bg-amber-500/[0.03] rounded flex items-center justify-center border border-dashed border-zinc-800">
                      <Heart className="w-6 h-6 text-amber-500 opacity-40 animate-pulse" />
                    </div>
                    <span className="text-[8px] font-mono text-zinc-500 font-bold mt-2">Sarah, David, Aria 📸</span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[9.5px] font-black text-emerald-500 block leading-none">Splits Settled Cashless</span>
                    <p className="text-[9.5px] text-zinc-400 leading-normal font-semibold">
                      Equal splits ($4.50 each) settled automatically. No calculators!
                    </p>
                  </div>
                </div>
              </div>

              {/* Ambient preferences bottom log */}
              <div className="space-y-2 z-10 mt-3 text-white">
                <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest font-bold block">Cabin Mood Settings</span>
                <div className="space-y-1.5">
                  {["Monsoon Cozy active", "Climate pre-cooled: 72°F"].map((sh, idx) => (
                    <div key={idx} className="bg-zinc-900 border border-zinc-800 p-2.5 rounded-xl flex items-center justify-between text-[10px] shadow-md">
                      <span className="font-extrabold text-zinc-200 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-amber-500" />
                        <span>{sh}</span>
                      </span>
                      <ArrowUpRight className="w-3 h-3 text-zinc-500" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Copywriting */}
          <div className="lg:col-span-6 flex flex-col justify-center space-y-8">
            <div className="space-y-3.5">
              <span className="text-[10px] font-mono tracking-widest text-amber-500 font-bold uppercase">
                THE RYDR APP
              </span>
              <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-white">
                Rydr fits in your pocket
              </h2>
              <p className="text-zinc-400 text-sm md:text-[14.5px] leading-relaxed font-semibold">
                Request a cozy ride in seconds, split fares live with your crew, and configure your absolute perfect cabin setup—right from our beautiful iOS and Android apps.
              </p>
            </div>

            {/* Feature details grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  title: "Real-time ride tracking",
                  desc: "Watch your driver approach live on the map. See exactly when they'll arrive doorside.",
                },
                {
                  title: "Instant group splits",
                  desc: "Add stops and split fares seamlessly with your friends during late-night outings.",
                },
                {
                  title: "Monsoon ready",
                  desc: "Request doorside umbrella pickups and pre-cool the AC before stepping inside.",
                },
                {
                  title: "Spontaneous shortcuts",
                  desc: "Sync your favorite spots and request group rides with a single tap in the app.",
                },
              ].map((bullet, idx) => (
                <div key={idx} className="space-y-1">
                  <h4 className="text-xs font-bold text-white tracking-tight flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    {bullet.title}
                  </h4>
                  <p className="text-[12px] text-zinc-400 leading-normal pl-3 font-semibold">
                    {bullet.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
