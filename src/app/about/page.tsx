"use client";

import { ShieldCheck, MapPin, Users, Heart, Award, ArrowRight } from "lucide-react";
import Link from "next/link";
import Footer from "@/components/Footer";

export default function AboutPage() {
  const stats = [
    { value: "1.2M+", label: "Rides Completed" },
    { value: "12,000+", label: "Verified Drivers" },
    { value: "11", label: "Cities Covered" },
    { value: "4.98 ★", label: "Average Rating" },
  ];

  const cities = [
    "Delhi NCR",
    "Gurugram",
    "Noida",
    "Ghaziabad",
    "Faridabad",
    "Bengaluru",
    "Hyderabad",
    "Jaipur",
    "Chandigarh",
    "Karnal",
    "Jind",
  ];

  const values = [
    {
      icon: ShieldCheck,
      title: "Safety First",
      description: "Every journey is covered by real-time GPS tracking, biometric selfie matching, and instant emergency support.",
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      icon: Heart,
      title: "Mutual Respect",
      description: "We are building a friendly neighborhood community centered on polite conduct, comfort, and respect.",
      color: "text-rose-600",
      bg: "bg-rose-50",
    },
    {
      icon: Award,
      title: "Upfront Clarity",
      description: "Review your exact locked fare before booking. No surprise surge spikes or hidden billing extras.",
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      icon: Users,
      title: "Community Growth",
      description: "We provide driver-partners with highly competitive splits, next-day payout transfers, and stable incomes.",
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-zinc-900 flex flex-col pt-8 sm:pt-12">
      <main className="flex-1 max-w-4xl w-full mx-auto px-5 sm:px-6 space-y-16 pb-20">
        
        {/* Clean Hero */}
        <div className="text-center max-w-xl mx-auto space-y-4">
          <span className="eyebrow block">OUR STORY</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 leading-tight">
            We are building the future of mobility in India
          </h1>
          <p className="text-zinc-500 text-sm sm:text-base leading-relaxed">
            RYDR was born in Gurugram to solve a simple problem: making daily urban commutes pleasant, transparent, and completely stress-free.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center border-y border-zinc-200/50 py-8">
          {stats.map((s, idx) => (
            <div key={idx} className="space-y-1">
              <span className="text-2xl font-black text-zinc-900 font-sans">{s.value}</span>
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Our Story section */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-zinc-50 border border-zinc-200 p-6 sm:p-8 rounded-3xl">
          <div className="md:col-span-7 space-y-4">
            <span className="eyebrow">A BRIEF BACKDROP</span>
            <h3 className="text-lg sm:text-xl font-bold text-zinc-900 leading-tight">
              From one bad cab ride to a platform 1.2M+ trust
            </h3>
            <div className="text-xs sm:text-sm text-zinc-500 leading-relaxed space-y-3 font-semibold">
              <p>
                In 2022, our founder missed an important flight because a local cab driver took a major route detour and ignored directions. That frustrating moment turned into a mission to establish a better standard.
              </p>
              <p>
                We started by recruiting our first 50 driver-partners face-to-face in Gurugram, building a tight-knit crew dedicated to passenger comfort and respect. Today, RYDR serves 11 cities while maintaining that exact personal standard.
              </p>
            </div>
          </div>
          <div className="md:col-span-5 aspect-[4/3] rounded-2xl bg-zinc-200 border border-zinc-200 overflow-hidden flex items-center justify-center relative shadow-3xs">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.08),transparent_70%)]" />
            <span className="text-5xl select-none filter drop-shadow-md">🤝</span>
          </div>
        </div>

        {/* Mission + Vision side-by-side cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-white border border-zinc-200 p-6 rounded-2xl space-y-3 shadow-sm hover-lift">
            <span className="eyebrow">OUR MISSION</span>
            <h4 className="text-base font-bold text-zinc-900">Make journeys safe and simple</h4>
            <p className="text-zinc-500 text-xs sm:text-sm leading-relaxed">
              To establish a respectful, upfront, and safe transportation environment where passengers travel without anxiety and drivers work with dignity.
            </p>
          </div>
          <div className="bg-white border border-zinc-200 p-6 rounded-2xl space-y-3 shadow-sm hover-lift">
            <span className="eyebrow">OUR VISION</span>
            <h4 className="text-base font-bold text-zinc-900">Friendly neighborhood transit</h4>
            <p className="text-zinc-500 text-xs sm:text-sm leading-relaxed">
              We envision cities where getting a ride is always reliable, pricing is always clear, and every trip feels welcoming and comfortable.
            </p>
          </div>
        </div>

        {/* Values: 4 clean cards */}
        <div className="space-y-6">
          <span className="eyebrow block text-center">OUR VALUES</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {values.map((v, idx) => {
              const Icon = v.icon;
              return (
                <div key={idx} className="bg-white border border-zinc-200 p-6 rounded-2xl flex gap-4 shadow-sm hover-lift hover:border-zinc-350">
                  <div className={`h-10 w-10 rounded-xl ${v.bg} flex items-center justify-center shrink-0 border border-zinc-100 shadow-3xs`}>
                    <Icon className={`w-5 h-5 ${v.color}`} />
                  </div>
                  <div className="space-y-1 mt-0.5">
                    <h4 className="text-sm sm:text-base font-bold text-zinc-900">{v.title}</h4>
                    <p className="text-zinc-500 text-xs sm:text-sm leading-relaxed">{v.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Coverage: list of cities */}
        <div className="space-y-5 bg-zinc-50 border border-zinc-200 rounded-3xl p-6 sm:p-8 text-center">
          <span className="eyebrow block">CITIES COVERED</span>
          <h4 className="text-base sm:text-lg font-bold text-zinc-900">Active across 11 major regions</h4>
          <div className="flex flex-wrap justify-center gap-2.5 pt-2">
            {cities.map((city, idx) => (
              <span 
                key={idx}
                className="flex items-center gap-1 bg-white border border-zinc-200 px-3.5 py-1.5 rounded-full text-xs font-semibold text-zinc-650 shadow-3xs"
              >
                <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                {city}
              </span>
            ))}
          </div>
        </div>

        {/* Support Call to Action */}
        <div className="text-center space-y-5">
          <h2 className="text-lg sm:text-xl font-bold text-zinc-900">Ready to ride with us?</h2>
          <div className="flex gap-4 justify-center">
            <Link
              href="/rider"
              className="px-5 py-3 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold rounded-xl transition-all shadow-sm flex items-center gap-2"
            >
              <span>Book Your First Ride</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/driver"
              className="px-5 py-3 bg-white hover:bg-zinc-50 border border-zinc-250 text-zinc-900 text-xs font-semibold rounded-xl transition-all shadow-3xs"
            >
              <span>Drive with RYDR</span>
            </Link>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
