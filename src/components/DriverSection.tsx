"use client";

import { ShieldCheck, TrendingUp, Calendar, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DriverSection() {
  const router = useRouter();

  const benefits = [
    {
      title: "Set your own schedule",
      desc: "Drive whenever it suits you. You have absolute freedom over your hours.",
      icon: Calendar,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      title: "Keep more of what you earn",
      desc: "Transparent commission structures. No hidden fees or surprise adjustments.",
      icon: TrendingUp,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Vetted and safe passengers",
      desc: "Mutual community ratings ensure you always drive polite and friendly travelers.",
      icon: ShieldCheck,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
  ];

  return (
    <section className="bg-white py-16 sm:py-24 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-5 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          
          {/* Left Column: Drive with RYDR Information and CTA */}
          <div className="lg:col-span-6 space-y-8">
            <div className="space-y-4">
              <span className="eyebrow">Drive with RYDR</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 leading-tight">
                Earn on your schedule.
              </h2>
              <p className="text-zinc-550 text-sm sm:text-base leading-relaxed">
                Connect directly with passengers in your city. RYDR provides driver-partners with the best tools, transparent payment schedules, and next-day payout transfers.
              </p>
            </div>

            {/* Benefits Checklist */}
            <div className="space-y-6">
              {benefits.map((bullet, idx) => {
                const Icon = bullet.icon;
                return (
                  <div key={idx} className="flex gap-4">
                    <div className={`h-10 w-10 rounded-xl ${bullet.bg} flex items-center justify-center shrink-0 shadow-sm border border-zinc-100`}>
                      <Icon className={`w-5 h-5 ${bullet.color}`} />
                    </div>
                    <div className="space-y-1 mt-0.5">
                      <h4 className="text-sm sm:text-base font-bold text-zinc-900">
                        {bullet.title}
                      </h4>
                      <p className="text-zinc-550 text-xs sm:text-sm leading-relaxed">
                        {bullet.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Start Driving CTA Button */}
            <button
              onClick={() => router.push("/driver")}
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white text-sm font-semibold py-3.5 px-6 rounded-xl transition-all shadow-md shadow-emerald-600/10 cursor-pointer"
            >
              <span>Start Driving</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Right Column: Premium Earnings Card Illustration */}
          <div className="lg:col-span-6 w-full flex items-center justify-center">
            <div className="w-full max-w-md bg-zinc-50 border border-zinc-150 rounded-3xl p-6 sm:p-7 shadow-sm space-y-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.015)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

              {/* Earnings Header */}
              <div className="flex justify-between items-center z-10 relative">
                <div>
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Today's Earnings</span>
                  <span className="text-3xl font-black text-zinc-900">₹3,450.00</span>
                </div>
                <span className="text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-100 px-3 py-1 rounded-full">
                  Online 🟢
                </span>
              </div>

              {/* Earnings Progress bar */}
              <div className="space-y-1.5 z-10 relative">
                <div className="flex justify-between text-xs text-zinc-400 font-semibold">
                  <span>Daily Goal Progress</span>
                  <span>86%</span>
                </div>
                <div className="h-2 w-full bg-zinc-200 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-600 rounded-full" style={{ width: "86%" }} />
                </div>
              </div>

              {/* Activity List */}
              <div className="space-y-3.5 z-10 relative pt-2">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Recent Trips</span>
                
                <div className="flex justify-between items-center bg-white border border-zinc-200 rounded-xl p-3 shadow-3xs">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-zinc-900">Ride from Delhi Airport</span>
                    <span className="text-[10px] text-zinc-400 font-semibold block">Completed at 15:42</span>
                  </div>
                  <span className="text-sm font-extrabold text-emerald-600">+₹850.00</span>
                </div>

                <div className="flex justify-between items-center bg-white border border-zinc-200 rounded-xl p-3 shadow-3xs">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-zinc-900">Ride to Connaught Place</span>
                    <span className="text-[10px] text-zinc-400 font-semibold block">Completed at 14:15</span>
                  </div>
                  <span className="text-sm font-extrabold text-emerald-600">+₹420.00</span>
                </div>
              </div>

              {/* Monospace driver stats footer */}
              <div className="flex justify-between items-center pt-4 border-t border-zinc-150 z-10 relative">
                <div className="text-center">
                  <span className="text-[9px] font-bold text-zinc-450 uppercase block">Rating</span>
                  <span className="text-sm font-extrabold text-zinc-800">4.98 ★</span>
                </div>
                <div className="text-center">
                  <span className="text-[9px] font-bold text-zinc-450 uppercase block">Trips</span>
                  <span className="text-sm font-extrabold text-zinc-800">1,240</span>
                </div>
                <div className="text-center">
                  <span className="text-[9px] font-bold text-zinc-450 uppercase block">Accept Rate</span>
                  <span className="text-sm font-extrabold text-zinc-800">98.5%</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
