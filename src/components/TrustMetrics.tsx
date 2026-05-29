"use client";

import { motion } from "framer-motion";
import { ShieldAlert, Globe, Compass, Cpu, CheckCircle } from "lucide-react";

interface MetricItem {
  number: string;
  label: string;
  description: string;
  icon: any;
}

export default function TrustMetrics() {
  const metrics: MetricItem[] = [
    {
      number: "1M+",
      label: "Rides Completed",
      description: "Delivering secure, premium transit with zero disruption.",
      icon: CheckCircle,
    },
    {
      number: "99.9%",
      label: "Safety Score",
      description: "Continuously audited via active hardware sensors and biometrics.",
      icon: ShieldAlert,
    },
    {
      number: "50+",
      label: "Global Cities",
      description: "Serving key metropolitan hubs and commercial financial zones.",
      icon: Globe,
    },
    {
      number: "<100ms",
      label: "AI Latency",
      description: "Sub-second machine learning matching bounds and dispatch vectors.",
      icon: Cpu,
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

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  } as const;

  return (
    <section id="trust" className="bg-[#030303] border-y border-zinc-900 py-16 relative overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {metrics.map((metric, idx) => (
            <motion.div
              key={idx}
              variants={cardVariants}
              className="bg-zinc-950/40 border border-zinc-900 p-6 rounded-xl hover:border-zinc-800 transition-colors flex flex-col justify-between space-y-4"
            >
              <div className="flex items-center justify-between">
                <metric.icon className="w-5 h-5 text-zinc-500" />
                <span className="text-[10px] font-mono tracking-wider text-zinc-600 uppercase">
                  METRIC 0{idx + 1}
                </span>
              </div>
              
              <div className="space-y-1">
                <div className="text-3xl font-black text-white tracking-tighter">
                  {metric.number}
                </div>
                <div className="text-sm font-bold text-zinc-300">
                  {metric.label}
                </div>
                <p className="text-xs text-zinc-500 leading-normal pt-1">
                  {metric.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
