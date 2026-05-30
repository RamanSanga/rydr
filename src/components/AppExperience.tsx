"use client";

import { Smartphone, Download, ShieldCheck } from "lucide-react";

export default function AppExperience() {
  return (
    <section className="bg-zinc-50 py-16 sm:py-24 border-y border-zinc-200/50 relative overflow-hidden">
      {/* Soft gradient blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-72 bg-emerald-500/[0.02] rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-5 sm:px-6 relative z-10">
        <div className="bg-white border border-zinc-200 rounded-3xl p-8 sm:p-12 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Heading and info */}
          <div className="lg:col-span-7 space-y-6">
            <span className="eyebrow">Download the App</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 leading-tight">
              Get the RYDR app
            </h2>
            <p className="text-zinc-500 text-sm sm:text-base leading-relaxed max-w-xl">
              Download our mobile application to request cozy rides in seconds, split fares live with your friends, set your ambient cabin preferences, and get live notifications on driver location and ETA.
            </p>

            {/* Micro-features list */}
            <div className="flex flex-wrap gap-4 text-xs font-semibold text-zinc-500">
              <span className="flex items-center gap-1.5 bg-zinc-50 border border-zinc-150 px-3 py-1.5 rounded-full">
                <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
                iOS & Android
              </span>
              <span className="flex items-center gap-1.5 bg-zinc-50 border border-zinc-150 px-3 py-1.5 rounded-full">
                <Download className="w-3.5 h-3.5 text-blue-600" />
                Lightweight (18MB)
              </span>
              <span className="flex items-center gap-1.5 bg-zinc-50 border border-zinc-150 px-3 py-1.5 rounded-full">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                100% Secure Payments
              </span>
            </div>

            {/* App Store Buttons */}
            <div className="flex flex-wrap gap-4 pt-4">
              {/* App Store */}
              <a 
                href="#app-store"
                className="inline-flex items-center gap-3 bg-zinc-900 hover:bg-zinc-800 active:scale-[0.98] text-white px-5 py-3 rounded-xl shadow-md transition-all cursor-pointer border border-zinc-800"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.22.67-2.94 1.5-.63.73-1.18 1.87-1.03 2.98.12.02 2.32-.61 2.98-1.42"/>
                </svg>
                <div className="text-left leading-tight">
                  <span className="text-[9px] font-bold text-zinc-400 block uppercase">Download on the</span>
                  <span className="text-sm font-extrabold font-sans">App Store</span>
                </div>
              </a>

              {/* Google Play */}
              <a 
                href="#google-play"
                className="inline-flex items-center gap-3 bg-zinc-900 hover:bg-zinc-800 active:scale-[0.98] text-white px-5 py-3 rounded-xl shadow-md transition-all cursor-pointer border border-zinc-800"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M5 3.004c-.39 0-.75.08-1.06.22l11.41 11.41 3.25-3.25L5.22 3.25c-.07-.03-.15-.05-.22-.05v.004zM3.47 4.13c-.15.31-.22.67-.22 1.06v13.62c0 .39.08.75.22 1.06L14.34 12 3.47 4.13zm15.13 8.94l3.16-1.81c.5-.28.5-.75 0-1.03l-3.16-1.81-3.69 3.69 3.69 3.69v-.03zM5 20.996c.07 0 .15-.02.22-.05l13.38-7.64-3.25-3.25L3.94 20.47c.31.39.67.53 1.06.53v-.004z"/>
                </svg>
                <div className="text-left leading-tight">
                  <span className="text-[9px] font-bold text-zinc-400 block uppercase">Get it on</span>
                  <span className="text-sm font-extrabold font-sans">Google Play</span>
                </div>
              </a>
            </div>
          </div>

          {/* Right Column: Premium App Screen Preview or Icon Visual */}
          <div className="lg:col-span-5 flex items-center justify-center">
            <div className="relative h-64 w-64 bg-zinc-50 border border-zinc-200 rounded-3xl flex items-center justify-center shadow-inner overflow-hidden">
              {/* Subtle background decoration */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.06),transparent_70%)] pointer-events-none" />
              <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.01)_1px,transparent_1px)] bg-[size:12px_12px] pointer-events-none" />
              
              <div className="flex flex-col items-center gap-3 z-10">
                <div className="h-16 w-16 bg-white rounded-2xl border border-zinc-150 shadow-sm flex items-center justify-center text-4xl select-none">
                  📲
                </div>
                <div className="text-center">
                  <span className="text-sm font-extrabold text-zinc-900 block">Scan to Download</span>
                  <span className="text-[10px] text-zinc-400 font-bold block mt-0.5">Delhi NCR active QR Code</span>
                </div>
                <div className="h-24 w-24 bg-white border border-zinc-200 rounded-xl p-2 flex items-center justify-center shadow-3xs mt-1">
                  {/* Simulated QR Code using dots */}
                  <div className="grid grid-cols-5 gap-1.5 w-full h-full opacity-60">
                    {[...Array(25)].map((_, i) => (
                      <div 
                        key={i} 
                        className={`rounded-sm ${(i % 3 === 0 || i % 7 === 0) ? "bg-zinc-800" : "bg-zinc-200"}`} 
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
