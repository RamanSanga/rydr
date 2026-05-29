"use client";

import { motion } from "framer-motion";
import { Smartphone, ShieldCheck, Smile } from "lucide-react";

export default function HowRydrWorks() {
  const steps = [
    {
      number: "01",
      title: "Tell us where to.",
      description: "Enter your destination and choose the vehicle that fits your plan. You'll see your exact upfront fare locked in immediately.",
      icon: Smartphone,
      gradient: "from-blue-50/50 to-white",
      iconColor: "text-blue-600",
      borderColor: "group-hover:border-blue-200",
    },
    {
      number: "02",
      title: "Meet your driver.",
      description: "We pair you instantly with a friendly, background-checked local driver. You can track their arrival live on the map.",
      icon: ShieldCheck,
      gradient: "from-amber-50/50 to-white",
      iconColor: "text-amber-600",
      borderColor: "group-hover:border-amber-200",
    },
    {
      number: "03",
      title: "Enjoy the drive.",
      description: "Sink into a comfortable, air-conditioned cabin and enjoy a peaceful ride. Settle cashless and walk out automatically.",
      icon: Smile,
      gradient: "from-emerald-50/50 to-white",
      iconColor: "text-emerald-600",
      borderColor: "group-hover:border-emerald-200",
    },
  ];

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const stepVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  } as const;

  return (
    <section id="how-it-works" className="bg-[#F8F8F8] py-32 border-t border-zinc-200 relative overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 relative z-10 space-y-16">
        
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto space-y-4">
          <span className="text-[10px] font-mono tracking-widest text-amber-600 font-bold uppercase">
            Simple Rides
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tighter text-zinc-900">
            Roadmap of a perfect ride
          </h2>
          <p className="text-zinc-500 text-sm leading-normal font-semibold">
            Three simple steps connecting you with safe, professional, and friendly local drivers.
          </p>
        </div>

        {/* Steps Grid Container */}
        <div className="relative">
          
          {/* Continuous Winding Dotted Street Path (Desktop only) */}
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-20 pointer-events-none hidden md:block z-0 px-24">
            <svg className="w-full h-full text-zinc-200" fill="none" viewBox="0 0 1000 80">
              {/* Road Casing */}
              <path
                d="M 50 40 C 200 40, 250 10, 450 10 C 650 10, 700 70, 950 70"
                stroke="#E4E4E7"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray="8 8"
              />
              {/* Pulsing Active Route Path */}
              <motion.path
                d="M 50 40 C 200 40, 250 10, 450 10 C 650 10, 700 70, 950 70"
                stroke="#B45309"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray="8 8"
                animate={{ strokeDashoffset: [-48, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                opacity="0.35"
              />
            </svg>
          </div>

          {/* Steps Cards */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 lg:gap-12 relative z-10"
          >
            {steps.map((step, idx) => (
              <motion.div
                key={idx}
                variants={stepVariants}
                className="space-y-6 flex flex-col items-start relative group bg-white border border-zinc-200 p-6.5 rounded-2xl shadow-3xs hover:border-zinc-300 transition-all duration-200 hover:shadow-2xs"
              >
                {/* Step number and icon wrapper */}
                <div className="flex items-center justify-between w-full">
                  <span className="text-3xl font-black text-zinc-200 group-hover:text-zinc-350 transition-colors font-mono tracking-tight leading-none select-none">
                    {step.number}
                  </span>
                  <div className={`p-3 bg-white border border-zinc-200 rounded-xl ${step.iconColor} shadow-3xs group-hover:scale-105 transition-all duration-200`}>
                    <step.icon className="w-5 h-5" />
                  </div>
                </div>

                {/* Step description */}
                <div className="space-y-2">
                  <h4 className="text-base font-extrabold text-zinc-900 tracking-tight">
                    {step.title}
                  </h4>
                  <p className="text-[13.5px] text-zinc-550 leading-relaxed font-medium">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </div>
    </section>
  );
}
