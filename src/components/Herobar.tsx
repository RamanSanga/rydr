"use client";

import { useRouter } from "next/navigation";
import { Shield, Sparkles, MapPin, Search } from "lucide-react";

export default function Herobar() {
  const router = useRouter();

  const handleInputClick = () => {
    router.push("/rider");
  };

  return (
    <section className="relative pt-28 pb-16 sm:pb-24 flex items-center justify-center overflow-hidden bg-white">
      {/* Soft light glows */}
      <div className="absolute top-1/4 left-1/10 w-72 h-72 bg-emerald-500/[0.03] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/10 w-96 h-96 bg-zinc-100 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl w-full mx-auto px-5 sm:px-6 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          {/* Left Column: Heading, Description, Booking Widget */}
          <div className="lg:col-span-6 flex flex-col space-y-6">
            <div className="space-y-4">
              <div className="inline-flex items-center space-x-2 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full text-emerald-700 text-xs font-semibold shadow-sm w-fit">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                <span>Your premium ride booking partner</span>
              </div>

              <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-zinc-900 leading-[1.1]">
                Where are we <br />
                heading today?
              </h1>

              <p className="text-zinc-500 text-sm sm:text-base leading-relaxed max-w-md">
                Book a ride in seconds. Safe, affordable, and always nearby. Settle in, relax, and let us handle the road.
              </p>
            </div>

            {/* Simulated Booking Widget */}
            <div className="w-full bg-white border border-zinc-200 rounded-2xl p-5 shadow-lg space-y-4 max-w-md">
              <div className="space-y-3">
                {/* Pickup Input */}
                <div 
                  onClick={handleInputClick}
                  className="flex items-center gap-3 p-3.5 bg-zinc-50 border border-zinc-200 rounded-xl cursor-pointer hover:border-zinc-300 hover:bg-zinc-100/50 transition-all group"
                >
                  <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="text-sm text-zinc-400 font-medium group-hover:text-zinc-500 transition-colors">
                    Enter pickup location...
                  </span>
                </div>

                {/* Destination Input */}
                <div 
                  onClick={handleInputClick}
                  className="flex items-center gap-3 p-3.5 bg-zinc-50 border border-zinc-200 rounded-xl cursor-pointer hover:border-zinc-300 hover:bg-zinc-100/50 transition-all group"
                >
                  <Search className="w-4 h-4 text-zinc-400 shrink-0" />
                  <span className="text-sm text-zinc-400 font-medium group-hover:text-zinc-500 transition-colors">
                    Where to?
                  </span>
                </div>
              </div>

              {/* Find Rides Button */}
              <button 
                onClick={handleInputClick}
                className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white text-sm font-semibold py-3.5 px-4 rounded-xl transition-all shadow-md shadow-emerald-600/10 cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Find Rides</span>
              </button>
            </div>

            {/* Below Hero trust badges */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-zinc-100 max-w-md">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-zinc-400 tracking-wider uppercase">Verified Drivers</span>
                <p className="text-xs text-zinc-500 font-medium">Background checked & highly rated.</p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-zinc-400 tracking-wider uppercase">Fair Prices</span>
                <p className="text-xs text-zinc-500 font-medium">Transparent, upfront fares with no surprises.</p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-zinc-400 tracking-wider uppercase">24/7 Support</span>
                <p className="text-xs text-zinc-500 font-medium">Always here to help you stay safe.</p>
              </div>
            </div>
          </div>

          {/* Right Column: Clean Premium Illustration Area */}
          <div className="lg:col-span-6 w-full flex items-center justify-center">
            <div className="w-full aspect-[4/3] rounded-3xl bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.08),transparent_70%)] border border-zinc-150 p-6 flex flex-col justify-between overflow-hidden relative shadow-md">
              {/* Decorative grid pattern in background */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none opacity-40" />
              
              {/* Small accent shield */}
              <div className="flex justify-between items-center z-10">
                <div className="h-10 w-10 rounded-xl bg-white shadow-sm border border-zinc-100 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-emerald-600" />
                </div>
                <span className="text-xs font-mono font-bold bg-white text-zinc-500 border border-zinc-100 px-3 py-1 rounded-full shadow-sm">
                  RYDR Premium
                </span>
              </div>

              {/* Center car illustration or subtle design */}
              <div className="flex flex-col items-center justify-center py-8 z-10 relative">
                <span className="text-8xl select-none filter drop-shadow-lg animate-bounce duration-[2500ms]">
                  🚗
                </span>
                <div className="h-4 w-32 bg-zinc-250/20 blur-md rounded-full mt-4" />
              </div>

              {/* Bottom tag */}
              <div className="flex justify-between items-center z-10 pt-4 border-t border-zinc-100">
                <span className="text-[10px] font-mono text-zinc-400 font-semibold uppercase">Delhi NCR • Active</span>
                <span className="text-[10px] font-mono text-emerald-600 font-bold flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
                  Live match nearby
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}