"use client";

import { Star, ShieldCheck } from "lucide-react";

export default function Testimonials() {
  const testimonials = [
    {
      name: "Rohan Mehta",
      role: "Daily Commuter",
      content: "RYDR is a complete lifesaver for my daily commute in Delhi. Upfront fares and super polite driver-partners mean I can focus on checking my emails in absolute peace.",
      rating: 5,
      tag: "Verified Rider",
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      border: "border-emerald-100",
    },
    {
      name: "Priya Nair",
      role: "Late Night Traveler",
      content: "As a woman traveling late, safety is everything. The real-time tracking feature and background-verified drivers give me total peace of mind every single time.",
      rating: 5,
      tag: "Frequent Rider",
      color: "text-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-100",
    },
    {
      name: "Arjun Verma",
      role: "Weekend Explorer",
      content: "Sinking into a pre-cooled sedan after a long flight at the airport is pure comfort. The OSRM live routing is incredibly precise and the cashless payouts are effortless.",
      rating: 5,
      tag: "Business Traveler",
      color: "text-amber-600",
      bg: "bg-amber-50",
      border: "border-amber-100",
    },
  ];

  return (
    <section className="bg-white py-16 sm:py-24 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-5 sm:px-6 relative z-10 space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto space-y-3">
          <span className="eyebrow">Rider Testimonials</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 leading-tight">
            Hear from our community
          </h2>
          <p className="text-zinc-500 text-sm sm:text-base leading-relaxed">
            Discover why thousands of daily riders and drivers choose RYDR for safe, pleasant, and premium journeys.
          </p>
        </div>

        {/* Testimonials Horizontal Scroll on Mobile / 3 Columns Grid on Desktop */}
        <div className="flex overflow-x-auto pb-4 gap-6 scrollbar-hide md:grid md:grid-cols-3 md:overflow-x-visible md:pb-0 snap-x snap-mandatory">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="min-w-[280px] sm:min-w-[320px] md:min-w-0 snap-align-start bg-white border border-zinc-200 p-6 sm:p-7 rounded-2xl flex flex-col justify-between space-y-6 hover:shadow-md hover:border-zinc-300 transition-all duration-300 shadow-sm"
            >
              <div className="space-y-4">
                {/* Star Rating */}
                <div className="flex items-center gap-0.5">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500 stroke-0" />
                  ))}
                </div>
                
                {/* Quote Content */}
                <p className="text-zinc-650 text-xs sm:text-sm leading-relaxed italic">
                  "{t.content}"
                </p>
              </div>

              {/* User details */}
              <div className="flex items-center justify-between pt-4 border-t border-zinc-100">
                <div>
                  <h4 className="text-sm font-bold text-zinc-900">{t.name}</h4>
                  <span className="text-[10px] text-zinc-400 font-semibold block mt-0.5">{t.role}</span>
                </div>
                
                <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase ${t.bg} ${t.color} border ${t.border} shadow-3xs`}>
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{t.tag}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
