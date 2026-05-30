"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Car, Key, Building2, Loader2, ArrowRight, Check } from "lucide-react";
import { selectUserRole } from "@/actions/role";

type RydrRole = "rider" | "driver" | "business";

interface RoleOption {
  id: RydrRole;
  eyebrow: string;
  title: string;
  description: string;
  icon: typeof Car;
  color: string;
  badge: string;
}

export default function RoleSelectionPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<RydrRole | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);

  const roleOptions: RoleOption[] = [
    {
      id: "rider",
      eyebrow: "PASSENGER PROFILE",
      title: "Rider Account",
      description: "Book premium commutes, pre-cool cabins, lock upfront price guarantees, and save locations for instant journeys.",
      icon: Car,
      color: "hover:border-blue-500 hover:shadow-blue-50/50",
      badge: "Passenger Hub",
    },
    {
      id: "driver",
      eyebrow: "OPERATOR CONSOLE",
      title: "Driver Portal",
      description: "Go online in seconds, accept incoming dispatches, track completed trips, and manage real-time cash payouts.",
      icon: Key,
      color: "hover:border-amber-500 hover:shadow-amber-50/50",
      badge: "Driver Console",
    },
    {
      id: "business",
      eyebrow: "ENTERPRISE PORTAL",
      title: "Business Account",
      description: "Manage employee travel limits, invite personnel, top up corporate wallets, and review department spend statements.",
      icon: Building2,
      color: "hover:border-emerald-500 hover:shadow-emerald-50/50",
      badge: "Enterprise Console",
    },
  ];

  const stepsText = [
    "Authenticating with Clerk secure vaults...",
    "Provisioning your Rydr publicMetadata claim...",
    "Setting up your custom cloud workspace...",
    "Preparing your brand new dashboard...",
  ];

  const handleSelectRole = async (role: RydrRole) => {
    setSelectedRole(role);
    setIsSubmitting(true);
    setLoadingStep(0);

    // Simulate onboarding preparation step animations
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
      // Trigger Clerk metadata write action
      await selectUserRole(role);
      
      // Perform redirect
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
    <main className="relative min-h-screen bg-[#F8F8F8] text-[#111111] antialiased flex flex-col justify-center py-12 px-6">
      <div className="absolute inset-0 premium-grid-fine opacity-[0.06] pointer-events-none" />

      <div className="max-w-[1200px] w-full mx-auto space-y-10 relative z-10">
        
        {/* Typographic Header */}
        <div className="text-center space-y-3.5 max-w-xl mx-auto">
          <span className="text-[10px] font-mono tracking-[0.35em] text-amber-600 font-extrabold uppercase leading-none">
            WORKSPACE PROVISIONER
          </span>
          <h1 className="text-3xl md:text-4.5xl font-black tracking-tighter text-zinc-900 leading-tight">
            Choose your Rydr Profile.
          </h1>
          <p className="text-zinc-500 text-sm font-semibold leading-relaxed">
            Select your account type to configure your workspace. You can invite team members or book trips instantly upon selection.
          </p>
        </div>

        {/* Option cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {roleOptions.map((option) => {
            const Icon = option.icon;
            return (
              <motion.div
                key={option.id}
                whileHover={{ scale: 1.015, y: -2 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => !isSubmitting && handleSelectRole(option.id)}
                className={`bg-white border border-zinc-200 rounded-3xl p-6 md:p-8 flex flex-col justify-between cursor-pointer transition-all duration-200 shadow-3xs group ${option.color} ${
                  isSubmitting ? "pointer-events-none opacity-60" : ""
                }`}
              >
                <div className="space-y-6">
                  {/* Icon Card header */}
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-zinc-50 border border-zinc-200 flex items-center justify-center text-zinc-950 shadow-3xs group-hover:bg-black group-hover:text-white transition-colors duration-250">
                      <Icon className="w-5 h-5 stroke-[1.75]" />
                    </div>
                    <span className="text-[9px] font-mono font-bold bg-zinc-50 text-zinc-650 border border-zinc-200 px-2.5 py-0.5 rounded-full shadow-3xs">
                      {option.badge}
                    </span>
                  </div>

                  {/* Body Content */}
                  <div className="space-y-2">
                    <span className="text-[8.5px] font-mono font-extrabold text-zinc-400 tracking-widest block uppercase">
                      {option.eyebrow}
                    </span>
                    <h3 className="text-lg font-black text-zinc-900 tracking-tight leading-none">
                      {option.title}
                    </h3>
                    <p className="text-xs font-semibold text-zinc-500 leading-normal pt-1.5">
                      {option.description}
                    </p>
                  </div>
                </div>

                {/* Bottom CTA Arrow */}
                <div className="mt-8 pt-4 border-t border-zinc-100 flex items-center justify-between text-xs font-bold text-zinc-400 group-hover:text-black transition-colors">
                  <span>Enter Workspace</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>

      {/* Modern Fullscreen Submission Backdrop Loader */}
      <AnimatePresence>
        {isSubmitting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-white/95 backdrop-blur-md flex flex-col items-center justify-center text-center space-y-6"
          >
            <div className="relative flex items-center justify-center">
              <Loader2 className="w-14 h-14 text-zinc-800 animate-spin stroke-[1.5]" />
              <div className="absolute text-[11px] font-bold text-zinc-600 font-mono">
                {loadingStep + 1}
              </div>
            </div>
            
            <div className="space-y-1.5">
              <span className="text-[8.5px] font-mono tracking-widest text-amber-600 font-extrabold uppercase">
                PROVISIONING WORKSPACE
              </span>
              <h4 className="text-base font-extrabold text-zinc-950">
                Setting up your {selectedRole === "rider" ? "Rider Profile" : selectedRole === "driver" ? "Driver Portal" : "Enterprise Console"}...
              </h4>
              <p className="text-xs text-zinc-500 font-mono h-4">
                {stepsText[loadingStep]}
              </p>
            </div>

            <div className="w-full max-w-[220px] bg-zinc-100 h-[3px] rounded-full overflow-hidden">
              <motion.div
                className="bg-black h-full"
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
