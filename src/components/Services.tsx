"use client";

import { motion } from "framer-motion";
import { Coffee, CloudRain, Heart, Plane, Map, Clock, ArrowUpRight } from "lucide-react";
import React from "react";

interface MomentCard {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  gradientClass: string;
  textColorClass: string;
  badgeClass: string;
  icon: any;
  badge?: string;
  ambientGlowClass: string;
  illustration: () => React.ReactNode;
}

export default function Services() {
  const moments: MomentCard[] = [
    {
      id: "chai",
      title: "Chai Runs",
      subtitle: "Chalo ghumne chalte hain.",
      description: "Late-night cravings or spontaneous tea plans with the crew? Load up, split fares cashless in-app, and head to your favorite tea stall.",
      gradientClass: "from-[#FFFBEB] via-[#FEF3C7] to-[#FDE68A]/35 border-amber-200/60 hover:shadow-amber-100/50",
      textColorClass: "text-[#B45309]",
      badgeClass: "bg-amber-100/60 text-[#B45309] border-amber-200/40",
      icon: Coffee,
      badge: "Spontaneous",
      ambientGlowClass: "group-hover:bg-[#FEF3C7]/20",
      illustration: () => (
        <svg viewBox="0 0 200 80" className="w-full h-full">
          <defs>
            <linearGradient id="chai-grad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#FFFDF5" />
              <stop offset="100%" stopColor="#FEF3C7" />
            </linearGradient>
          </defs>
          <rect width="200" height="80" rx="12" fill="url(#chai-grad)" />
          {/* Lamp post */}
          <path d="M 30 80 L 30 22 Q 30 16 36 16 L 46 16" stroke="#D97706" strokeWidth="1.5" fill="none" />
          <path d="M 43 13 L 49 20 L 39 20 Z" fill="#D97706" />
          <circle cx="44" cy="22" r="2.5" fill="#FBBF24" />
          {/* Steaming Chai Cup */}
          <g transform="translate(130, 18)">
            <path d="M 5 35 L 25 35 L 29 12 L 1 12 Z" fill="#D97706" opacity="0.85" stroke="#B45309" strokeWidth="1.5" />
            {/* Liquid */}
            <path d="M 6 31 L 24 31 L 27 18 L 3 18 Z" fill="#F59E0B" />
            {/* Handle */}
            <path d="M 23 16 Q 30 20 23 27" stroke="#B45309" strokeWidth="1.5" fill="none" />
            {/* Steam waves */}
            <motion.path
              d="M 8 7 Q 10 3 8 0"
              stroke="#FFFFFF"
              strokeWidth="1.5"
              strokeLinecap="round"
              opacity="0.8"
              animate={{ opacity: [0.2, 0.8, 0.2], y: [2, -2, 2] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.path
              d="M 16 7 Q 18 3 16 0"
              stroke="#FFFFFF"
              strokeWidth="1.5"
              strokeLinecap="round"
              opacity="0.6"
              animate={{ opacity: [0.1, 0.6, 0.1], y: [1, -3, 1] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            />
          </g>
        </svg>
      ),
    },
    {
      id: "rain",
      title: "Rain Mode",
      subtitle: "Rain outside?",
      description: "Cozy warm cabins for sudden monsoons and monsoonal weather. Drivers arrive doorside carrying large umbrellas to walk you dry.",
      gradientClass: "from-[#F0FDFA] via-[#E6FFFA] to-[#CCFBF1]/40 border-teal-200 hover:shadow-teal-50/50",
      textColorClass: "text-[#0F766E]",
      badgeClass: "bg-teal-50 text-[#0F766E] border-teal-200/50",
      icon: CloudRain,
      badge: "Cozy & Dry",
      ambientGlowClass: "group-hover:bg-[#E6FFFA]/25",
      illustration: () => (
        <svg viewBox="0 0 200 80" className="w-full h-full">
          <defs>
            <linearGradient id="rain-grad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#F5FFFD" />
              <stop offset="100%" stopColor="#E6FFFA" />
            </linearGradient>
          </defs>
          <rect width="200" height="80" rx="12" fill="url(#rain-grad)" />
          {/* Umbrella */}
          <g transform="translate(35, 16)">
            <path d="M 12 36 L 12 44 C 12 46 14 46 14 44" stroke="#0F766E" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            <path d="M 12 36 L 12 14" stroke="#0F766E" strokeWidth="1.5" />
            <path d="M -8 24 Q 12 4 32 24 C 27 24 22 19 12 24 C 2 19 -3 24 -8 24 Z" fill="#0D9488" stroke="#0F766E" strokeWidth="1.5" />
          </g>
          {/* Rain streaks */}
          <g stroke="#0D9488" strokeWidth="1.2" strokeLinecap="round" opacity="0.45">
            <line x1="110" y1="12" x2="104" y2="24" />
            <line x1="140" y1="20" x2="134" y2="32" />
            <line x1="125" y1="42" x2="119" y2="54" />
            <line x1="165" y1="14" x2="159" y2="26" />
            <line x1="150" y1="46" x2="144" y2="58" />
          </g>
        </svg>
      ),
    },
    {
      id: "date",
      title: "Date Nights",
      subtitle: "Date night plans?",
      description: "Arrive in premium style for that special evening. Pre-cooled climate cabins, soft ambient cabin glows, and silent route options.",
      gradientClass: "from-[#FAF5FF] via-[#F3E8FF] to-[#E9D5FF]/30 border-purple-200 hover:shadow-purple-50/50",
      textColorClass: "text-[#701A75]",
      badgeClass: "bg-purple-50 text-[#701A75] border-purple-200/50",
      icon: Heart,
      badge: "Premium Style",
      ambientGlowClass: "group-hover:bg-[#F3E8FF]/20",
      illustration: () => (
        <svg viewBox="0 0 200 80" className="w-full h-full">
          <defs>
            <linearGradient id="date-grad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#FCF9FF" />
              <stop offset="100%" stopColor="#F3E8FF" />
            </linearGradient>
          </defs>
          <rect width="200" height="80" rx="12" fill="url(#date-grad)" />
          {/* Glowing heart badge */}
          <g transform="translate(35, 24)">
            <motion.path
              d="M 12 5 C 10 1 5 1 5 6 C 5 11 12 16 12 18 C 12 18 19 11 19 6 C 19 1 14 1 12 5 Z"
              fill="#C084FC"
              opacity="0.85"
              animate={{ scale: [0.95, 1.05, 0.95] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
          </g>
          {/* Twinkling romantic stars */}
          <motion.circle cx="120" cy="18" r="1.5" fill="#701A75" animate={{ opacity: [0.2, 0.9, 0.2] }} transition={{ duration: 4, repeat: Infinity }} />
          <motion.circle cx="150" cy="32" r="1" fill="#701A75" animate={{ opacity: [0.8, 0.3, 0.8] }} transition={{ duration: 3, repeat: Infinity }} />
          <motion.circle cx="135" cy="46" r="2" fill="#701A75" opacity="0.3" />
          <motion.circle cx="165" cy="22" r="1.2" fill="#701A75" animate={{ opacity: [0.1, 0.8, 0.1] }} transition={{ duration: 3.5, repeat: Infinity }} />
        </svg>
      ),
    },
    {
      id: "airport",
      title: "Airport Journeys",
      subtitle: "Airport tomorrow?",
      description: "Stress-free airport departures and terminal dropoffs. Automatic flight-tracking synchronization ensures we are always early.",
      gradientClass: "from-[#EFF6FF] via-[#DBEAFE] to-[#BFDBFE]/30 border-blue-200 hover:shadow-blue-50/50",
      textColorClass: "text-[#1D4ED8]",
      badgeClass: "bg-blue-50 text-[#1D4ED8] border-blue-200/50",
      icon: Plane,
      badge: "Flight Tracked",
      ambientGlowClass: "group-hover:bg-[#DBEAFE]/20",
      illustration: () => (
        <svg viewBox="0 0 200 80" className="w-full h-full">
          <defs>
            <linearGradient id="air-grad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#F5FAFF" />
              <stop offset="100%" stopColor="#DBEAFE" />
            </linearGradient>
          </defs>
          <rect width="200" height="80" rx="12" fill="url(#air-grad)" />
          {/* Flight climb illustration */}
          <g transform="translate(50, 16)">
            <path d="M -10 32 Q 35 20 80 2" stroke="#FFFFFF" strokeWidth="2" strokeDasharray="3 5" opacity="0.8" strokeLinecap="round" />
            <motion.g
              animate={{ x: [-3, 3, -3], y: [1, -1, 1] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              transform="translate(32, 14) rotate(-14)"
            >
              <path d="M 0 4 L 8 0 L 11 0 L 7 4 L 15 4 L 17 2 L 18 2 L 17 5 L 7 5 L 0 4 Z" fill="#2563EB" />
            </motion.g>
          </g>
        </svg>
      ),
    },
    {
      id: "weekend",
      title: "Weekend Escapes",
      subtitle: "Long drive mood?",
      description: "Skip traffic queues and schedule worries. Load your bags, settle into a premium zero-emission EV sedan, and explore out of town.",
      gradientClass: "from-[#FFF7ED] via-[#FFEDD5] to-[#FED7AA]/35 border-orange-200 hover:shadow-orange-50/50",
      textColorClass: "text-[#C2410C]",
      badgeClass: "bg-orange-50 text-[#C2410C] border-orange-200/50",
      icon: Map,
      badge: "Road Trips",
      ambientGlowClass: "group-hover:bg-[#FFEDD5]/20",
      illustration: () => (
        <svg viewBox="0 0 200 80" className="w-full h-full">
          <defs>
            <linearGradient id="weekend-grad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#FFFDFB" />
              <stop offset="100%" stopColor="#FFEDD5" />
            </linearGradient>
          </defs>
          <rect width="200" height="80" rx="12" fill="url(#weekend-grad)" />
          {/* Mountain scenic hills */}
          <circle cx="50" cy="42" r="14" fill="#FB923C" opacity="0.6" />
          <path d="M 12 80 L 42 46 L 72 80 Z" fill="#EA580C" opacity="0.25" />
          <path d="M 32 80 L 66 52 L 100 80 Z" fill="#C2410C" opacity="0.35" />
          {/* Curve highway perspective */}
          <path d="M 130 80 L 152 46 L 156 46 L 140 80 Z" fill="#FFFFFF" opacity="0.7" />
        </svg>
      ),
    },
    {
      id: "commute",
      title: "Daily Commutes",
      subtitle: "Home already sounds good.",
      description: "Wind down inside a pre-cooled, quiet cabin after a busy day at the office. Settle into a peaceful ride back with local professionals.",
      gradientClass: "from-[#FAFAFA] via-[#F4F4F5] to-[#E4E4E7]/40 border-zinc-200 hover:shadow-zinc-50/50",
      textColorClass: "text-zinc-800",
      badgeClass: "bg-zinc-100 text-zinc-700 border-zinc-200/50",
      icon: Clock,
      badge: "Home Time",
      ambientGlowClass: "group-hover:bg-[#F4F4F5]/25",
      illustration: () => (
        <svg viewBox="0 0 200 80" className="w-full h-full">
          <defs>
            <linearGradient id="commute-grad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#FCFCFC" />
              <stop offset="100%" stopColor="#F4F4F5" />
            </linearGradient>
          </defs>
          <rect width="200" height="80" rx="12" fill="url(#commute-grad)" />
          {/* Cozy clock illustration */}
          <g transform="translate(36, 22)">
            <circle cx="15" cy="15" r="12" stroke="#71717A" strokeWidth="1.5" fill="#FFFFFF" />
            <motion.line
              x1="15"
              y1="15"
              x2="15"
              y2="9"
              stroke="#71717A"
              strokeWidth="1.5"
              strokeLinecap="round"
              animate={{ rotate: 360 }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              style={{ transformOrigin: "15px 15px" }}
            />
            <line x1="15" y1="15" x2="20" y2="15" stroke="#71717A" strokeWidth="1.5" strokeLinecap="round" />
          </g>
          {/* Relaxing wind down waves */}
          <g fill="none" stroke="#A1A1AA" strokeWidth="1.5" strokeLinecap="round" opacity="0.4">
            <path d="M 105 32 Q 115 22 125 32 T 145 32" />
            <path d="M 110 42 Q 120 32 130 42 T 150 42" opacity="0.6" />
          </g>
        </svg>
      ),
    },
  ];

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.06,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  } as const;

  return (
    <section id="services" className="bg-white py-32 border-t border-zinc-200 relative overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 relative z-10 space-y-16">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between space-y-4 md:space-y-0">
          <div className="space-y-3">
            <span className="text-[10px] font-mono tracking-widest text-amber-600 font-bold uppercase">
              Rydr Moments
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tighter text-zinc-900">
              Where do you want to go today?
            </h2>
          </div>
          <p className="text-zinc-500 text-sm max-w-sm leading-relaxed font-semibold">
            Whether it's spontaneous chai runs with friends, cozy rides on rainy days, airport check-ins, or weekend escapes, we have a moment themed for you.
          </p>
        </div>

        {/* Scenic Destination Journal Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {moments.map((moment) => (
            <motion.div
              key={moment.id}
              variants={cardVariants}
              className={`group bg-gradient-to-br ${moment.gradientClass} border rounded-2xl p-6.5 hover:border-zinc-350 hover:shadow-md transition-all duration-250 flex flex-col justify-between min-h-[360px] shadow-3xs relative overflow-hidden`}
            >
              {/* Animated Scenic Illustration Container */}
              <div className="w-full aspect-[2.4/1] rounded-xl overflow-hidden border border-zinc-200/60 shadow-3xs relative bg-white transition-all duration-200 group-hover:scale-[1.01] group-hover:border-zinc-300">
                {moment.illustration()}
              </div>

              {/* Badges / Header overlay */}
              <div className="flex items-center justify-between mt-4">
                <div className={`p-2.5 bg-white border border-zinc-200/80 rounded-lg ${moment.textColorClass} shadow-3xs`}>
                  <moment.icon className="w-4 h-4" />
                </div>
                {moment.badge && (
                  <span className={`text-[9px] font-mono font-bold tracking-wider uppercase px-2.5 py-0.5 rounded border ${moment.badgeClass}`}>
                    {moment.badge}
                  </span>
                )}
              </div>

              {/* Text Description Content */}
              <div className="space-y-2 mt-4 z-10">
                {moment.subtitle && (
                  <span className={`text-[10px] font-mono font-bold uppercase tracking-wider block ${moment.textColorClass} opacity-85`}>
                    {moment.subtitle}
                  </span>
                )}
                <h3 className="text-base font-extrabold text-zinc-900 tracking-tight flex items-center">
                  <span>{moment.title}</span>
                  <ArrowUpRight className="w-4 h-4 ml-1.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200 text-zinc-400 group-hover:text-black" />
                </h3>
                <p className="text-[12.5px] text-zinc-550 group-hover:text-zinc-650 leading-relaxed transition-colors font-medium">
                  {moment.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
