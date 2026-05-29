"use client";

import { motion } from "framer-motion";
import { Coffee, CloudRain, Heart, Plane, Map, Clock, ArrowUpRight, Sparkles } from "lucide-react";

interface MomentCard {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  imageSrc: string;
  textColorClass: string;
  badgeClass: string;
  icon: any;
  badge?: string;
  shadowClass: string;
}

export default function Services() {
  const moments: MomentCard[] = [
    {
      id: "sunset",
      title: "Sunset Drive",
      subtitle: "Long day? We'll drive.",
      description: "Settle in, watch the city fade away, and enjoy the golden hours. We'll handle the traffic while you wind down.",
      imageSrc: "/images/sunset_drive.png",
      textColorClass: "text-amber-400",
      badgeClass: "bg-amber-500/10 text-amber-300 border-amber-500/20",
      icon: Coffee,
      badge: "Sunset Gold",
      shadowClass: "hover:shadow-amber-500/10",
    },
    {
      id: "airport",
      title: "Airport Pickup",
      subtitle: "Running late?",
      description: "Stress-free airport arrivals and terminal gate collections. Our flight synchronization ensures we are ready when you land.",
      imageSrc: "/images/airport_pickup.png",
      textColorClass: "text-blue-400",
      badgeClass: "bg-blue-500/10 text-blue-300 border-blue-500/20",
      icon: Plane,
      badge: "Flight Tracked",
      shadowClass: "hover:shadow-blue-500/15",
    },
    {
      id: "escape",
      title: "Weekend Escape",
      subtitle: "Let's disappear for a while.",
      description: "Skip the train schedules and busy highway queues. Load the trunk, settle in, and explore out of town at your own pace.",
      imageSrc: "/images/sunset_drive.png",
      textColorClass: "text-amber-500",
      badgeClass: "bg-amber-600/10 text-amber-400 border-amber-600/20",
      icon: Map,
      badge: "Road Trips",
      shadowClass: "hover:shadow-amber-600/10",
    },
    {
      id: "night",
      title: "Late Night Ride",
      subtitle: "Your ride is already waiting.",
      description: "Safe, vetted local drivers available 24/7. Head back from dinner or spontaneous late-night routes in a cozy quiet cabin.",
      imageSrc: "/images/late_night_ride.png",
      textColorClass: "text-purple-400",
      badgeClass: "bg-purple-500/10 text-purple-300 border-purple-500/20",
      icon: Heart,
      badge: "Midnight City",
      shadowClass: "hover:shadow-purple-500/15",
    },
    {
      id: "commute",
      title: "Daily Commute",
      subtitle: "Traffic is crazy. Good thing you're not driving.",
      description: "Wind down, clear your inbox, or rest in silence. Settle cashless and step back home with premium doorside arrivals.",
      imageSrc: "/images/daily_commute.png",
      textColorClass: "text-emerald-400",
      badgeClass: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
      icon: Clock,
      badge: "Urban Cruise",
      shadowClass: "hover:shadow-emerald-500/15",
    },
    {
      id: "date",
      title: "Date Night",
      subtitle: "Arrive in premium style.",
      description: "Step inside a clean, pre-cooled cabin with ambient warm lighting and absolute quiet options pre-configured for your evening.",
      imageSrc: "/images/date_night.png",
      textColorClass: "text-amber-400",
      badgeClass: "bg-amber-500/10 text-amber-300 border-amber-500/20",
      icon: Sparkles,
      badge: "Luxury Premium",
      shadowClass: "hover:shadow-amber-500/10",
    },
  ];

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.05,
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
    <section id="services" className="bg-[#111111] py-32 border-t border-zinc-900 relative overflow-hidden">
      
      {/* Background soft ambient grid */}
      <div className="absolute inset-0 premium-grid opacity-[0.03] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-6 relative z-10 space-y-16">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between space-y-4 md:space-y-0">
          <div className="space-y-3">
            <span className="text-[10px] font-mono tracking-widest text-amber-500 font-bold uppercase">
              Rydr Moments
            </span>
            <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-white leading-tight">
              Every section tells a travel story
            </h2>
          </div>
          <p className="text-zinc-400 text-sm max-w-sm leading-relaxed font-semibold">
            Spontaneous late-night runs, airport check-ins, rainy downpours, or weekend escapes. Select a moment and let us handle the road.
          </p>
        </div>

        {/* Cinematic themed cards Grid */}
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
              className={`group relative rounded-3xl overflow-hidden border border-zinc-800 shadow-2xl transition-all duration-300 flex flex-col justify-end min-h-[380px] ${moment.shadowClass} hover:border-zinc-700 cursor-pointer`}
            >
              {/* Full-bleed photography-inspired background */}
              <div className="absolute inset-0 z-0">
                <img
                  src={moment.imageSrc}
                  alt={moment.title}
                  className="w-full h-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-105"
                />
                {/* Dramatic cinematic overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-transparent" />
              </div>

              {/* Tag / Header details */}
              <div className="absolute top-5 inset-x-5 flex items-center justify-between z-10">
                <div className="p-2.5 bg-black/60 backdrop-blur-md border border-zinc-800 rounded-xl text-white shadow-md">
                  <moment.icon className="w-4 h-4" />
                </div>
                {moment.badge && (
                  <span className={`text-[9px] font-mono font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full border backdrop-blur-md ${moment.badgeClass}`}>
                    {moment.badge}
                  </span>
                )}
              </div>

              {/* Conversational Copy content */}
              <div className="p-6.5 relative z-10 space-y-2">
                {moment.subtitle && (
                  <span className={`text-[11px] font-mono font-black uppercase tracking-tight block ${moment.textColorClass}`}>
                    {moment.subtitle}
                  </span>
                )}
                <h3 className="text-lg font-black text-white tracking-tight flex items-center">
                  <span>{moment.title}</span>
                  <ArrowUpRight className="w-4 h-4 ml-1.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200 text-zinc-400 group-hover:text-white" />
                </h3>
                <p className="text-[12.5px] text-zinc-400 leading-relaxed font-semibold">
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
