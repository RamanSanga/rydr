"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Car, Key, Loader2, ArrowRight } from "lucide-react";
import { selectUserRole } from "@/actions/role";

type RydrRole = "rider" | "driver";

interface RoleOption {
  id: RydrRole;
  title: string;
  subtitle: string;
  description: string;
  icon: typeof Car;
  color: string;
  bg: string;
  border: string;
}

export default function RoleSelectionPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<RydrRole | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);

  const roleOptions: RoleOption[] = [
    {
      id: "rider",
      title: "Rider",
      subtitle: "I need a ride",
      description: "Book premium commutes, pre-cool cabins, lock upfront price guarantees, and save locations for instant journeys.",
      icon: Car,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      border: "border-emerald-100",
    },
    {
      id: "driver",
      title: "Driver",
      subtitle: "I want to drive",
      description: "Go online in seconds, accept incoming dispatches, track completed trips, and manage real-time cash payouts.",
      icon: Key,
      color: "text-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-100",
    },
  ];

  const stepsText = [
    "Authenticating with secure vaults...",
    "Provisioning your RYDR credentials...",
    "Setting up your custom cloud workspace...",
    "Preparing your brand new dashboard...",
  ];

  const handleSelectRole = async (role: RydrRole) => {
    setSelectedRole(role);
    setIsSubmitting(true);
    setLoadingStep(0);

    const interval = setInterval(() => {
      setLoadingStep((prev) => {
        if (prev >= stepsText.length - 1) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 700);

    try {
      await selectUserRole(role);
      setTimeout(() => {
        router.push("/dashboard");
      }, 2900);
    } catch (e) {
      clearInterval(interval);
      setIsSubmitting(false);
      alert("Something went wrong saving your role. Please try again.");
    }
  };

  return (
    <main className="relative min-h-screen bg-white text-zinc-900 antialiased flex items-center justify-center py-12 px-6">
      {/* Decorative gradient background blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl h-80 bg-emerald-500/[0.02] rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-2xl w-full mx-auto space-y-10 relative z-10">
        
        {/* Header */}
        <div className="text-center space-y-3 max-w-xl mx-auto">
          <span className="eyebrow block">WELCOME TO RYDR</span>
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 leading-tight">
            How would you like to use RYDR?
          </h1>
          <p className="text-zinc-500 text-sm sm:text-base leading-relaxed">
            Select your profile below to configure your custom dashboard workspace.
          </p>
        </div>

        {/* 2 Role cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-stretch">
          {roleOptions.map((option) => {
            const Icon = option.icon;
            return (
              <div
                key={option.id}
                onClick={() => !isSubmitting && handleSelectRole(option.id)}
                className={`bg-white border border-zinc-200 rounded-3xl p-6 sm:p-7 flex flex-col justify-between cursor-pointer transition-all duration-300 shadow-sm hover:shadow-md hover:border-zinc-350 hover-lift group ${
                  isSubmitting ? "pointer-events-none opacity-60" : ""
                }`}
              >
                <div className="space-y-6">
                  {/* Icon Card header */}
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-2xl ${option.bg} border ${option.border} flex items-center justify-center shadow-3xs`}>
                      <Icon className={`w-5 h-5 ${option.color}`} />
                    </div>
                    <span className="text-[10px] font-bold text-zinc-450 bg-zinc-50 border border-zinc-200 px-3 py-1 rounded-full shadow-3xs">
                      {option.title}
                    </span>
                  </div>

                  {/* Body Content */}
                  <div className="space-y-1.5">
                    <h3 className="text-lg font-bold text-zinc-900 tracking-tight leading-none group-hover:text-emerald-700 transition-colors">
                      {option.subtitle}
                    </h3>
                    <p className="text-xs sm:text-sm text-zinc-500 leading-relaxed font-semibold">
                      {option.description}
                    </p>
                  </div>
                </div>

                {/* Bottom CTA Arrow */}
                <div className="mt-8 pt-4 border-t border-zinc-100 flex items-center justify-between text-xs font-bold text-zinc-400 group-hover:text-zinc-900 transition-colors">
                  <span>Enter Profile</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Submission Loader Screen */}
      <AnimatePresence>
        {isSubmitting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-white/95 backdrop-blur-md flex flex-col items-center justify-center text-center space-y-6"
          >
            <div className="relative flex items-center justify-center">
              <Loader2 className="w-12 h-12 text-zinc-800 animate-spin stroke-[1.5]" />
              <div className="absolute text-[10px] font-bold text-zinc-500 font-mono">
                {loadingStep + 1}
              </div>
            </div>
            
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold tracking-widest text-emerald-600 uppercase block">
                PROVISIONING WORKSPACE
              </span>
              <h4 className="text-base font-extrabold text-zinc-950">
                Setting up your {selectedRole === "rider" ? "Rider Dashboard" : "Driver Portal"}...
              </h4>
              <p className="text-xs text-zinc-400 font-mono h-4">
                {stepsText[loadingStep]}
              </p>
            </div>

            <div className="w-full max-w-[200px] bg-zinc-100 h-1.5 rounded-full overflow-hidden">
              <motion.div
                className="bg-zinc-900 h-full"
                initial={{ width: "0%" }}
                animate={{ width: `${(loadingStep + 1) * 25}%` }}
                transition={{ duration: 0.7, ease: "easeInOut" }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
