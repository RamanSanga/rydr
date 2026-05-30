"use client";

import { Car, Sparkles, Users, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Services() {
  const router = useRouter();

  const rideTypes = [
    {
      id: "economy",
      name: "RYDR Economy",
      description: "Affordable, daily rides in comfortable hatchbacks and sedans.",
      price: "₹9/km",
      icon: Car,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      border: "border-emerald-100",
    },
    {
      id: "premium",
      name: "RYDR Premium",
      description: "Premium sedans and top-tier comfort. Ideal for business and arrivals.",
      price: "₹18/km",
      icon: Sparkles,
      color: "text-amber-600",
      bg: "bg-amber-50",
      border: "border-amber-100",
    },
    {
      id: "xl",
      name: "RYDR XL",
      description: "Spacious SUVs for up to 6 people or extra luggage requirements.",
      price: "₹24/km",
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-100",
    },
  ];

  return (
    <section id="services" className="bg-zinc-50/50 py-16 sm:py-24 border-y border-zinc-200/50 relative overflow-hidden">
      {/* Decorative gradient blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl h-80 bg-emerald-500/[0.015] rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-5 sm:px-6 relative z-10 space-y-12 sm:space-y-14">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="eyebrow">Choose Your Ride</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 leading-tight">
            Designed for every journey and budget
          </h2>
          <p className="text-zinc-500 text-sm sm:text-base leading-relaxed">
            Spontaneous late-night runs, important client check-ins, or road trips with the family. Select the perfect tier for you.
          </p>
        </div>

        {/* 3 Premium Services Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {rideTypes.map((tier) => {
            const Icon = tier.icon;
            return (
              <div
                key={tier.id}
                onClick={() => router.push("/rider")}
                className="group bg-white border border-zinc-200 rounded-3xl p-6 sm:p-7 shadow-sm hover:shadow-lg hover:border-zinc-350 hover-lift cursor-pointer flex flex-col justify-between min-h-[250px] relative overflow-hidden transition-all duration-300"
              >
                <div className="space-y-5">
                  {/* Icon Header */}
                  <div className={`h-12 w-12 rounded-2xl ${tier.bg} border ${tier.border} flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${tier.color}`} />
                  </div>

                  {/* Title and details */}
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-zinc-900 flex items-center gap-1.5 group-hover:text-emerald-700 transition-colors">
                      {tier.name}
                    </h3>
                    <p className="text-zinc-500 text-xs sm:text-sm leading-relaxed">
                      {tier.description}
                    </p>
                  </div>
                </div>

                {/* Pricing / Footer */}
                <div className="flex items-center justify-between pt-6 border-t border-zinc-100 mt-6">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Starting at</span>
                    <p className="text-lg font-extrabold text-zinc-900">{tier.price}</p>
                  </div>
                  <div className="h-8 w-8 rounded-full bg-zinc-50 group-hover:bg-emerald-600 group-hover:text-white flex items-center justify-center transition-all">
                    <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:text-white transition-colors" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
