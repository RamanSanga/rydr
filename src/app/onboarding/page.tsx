"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getOnboardingState, saveDriverOnboarding } from "@/actions/onboarding";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, User, Phone, MapPin, ChevronRight, Check, Car } from "lucide-react";
import Navbar from "@/components/Navbar";

export default function OnboardingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [role, setRole] = useState<"rider" | "driver" | null>(null);
  const [step, setStep] = useState(1);

  const [driverForm, setDriverForm] = useState({
    fullName: "",
    phone: "",
    address: "",
    vehicleType: "economy",
    vehicleModel: "",
    vehicleNumber: "",
  });

  useEffect(() => {
    async function checkState() {
      try {
        const state = await getOnboardingState();
        if (!state.success || !state.roleSelected) {
          router.push("/select-role");
          return;
        }
        if ((state as any).driverOnboarded) {
          router.push("/driver");
          return;
        }
        setRole(state.role as "rider" | "driver");

        if (state.role === "driver") {
          setDriverForm((prev) => ({
            ...prev,
            fullName: (state as any).userName || "",
            phone: "",
          }));
        }
      } catch (err) {
        console.error("Failed to load onboarding status", err);
      } finally {
        setLoading(false);
      }
    }
    checkState();
  }, []);

  const handleDriverSubmit = async () => {
    setSubmitting(true);
    try {
      await saveDriverOnboarding({
        phone: driverForm.phone,
        address: driverForm.address || "Delhi NCR",
        aadhaarUrl: "verified",
        panUrl: "verified",
        selfieUrl: "verified",
        licenseUrl: "verified",
        licenseNumber: "DL-AUTO",
        licenseExpiry: "2030-01-01",
        vehicleType: driverForm.vehicleType,
        vehicleModel: driverForm.vehicleModel,
        vehicleNumber: driverForm.vehicleNumber,
        rcUrl: "verified",
        insuranceUrl: "verified",
        permitUrl: "verified",
      });
      setStep(3); // success screen
    } catch (err) {
      setSubmitError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="relative min-h-screen bg-zinc-50 text-zinc-900 antialiased pb-20 pt-28 flex flex-col justify-between">
      <Navbar />

      <div className="max-w-[540px] w-full mx-auto px-6 flex-grow flex flex-col justify-center">

        {/* Header */}
        {step < 3 && (
          <div className="mb-8 text-center space-y-3">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-950">
              Set up your driver account
            </h1>
            <p className="text-sm text-zinc-500 font-medium">
              {step === 1 ? "Tell us a bit about yourself" : "Add your vehicle details"}
            </p>
            {/* Progress dots */}
            <div className="flex items-center justify-center space-x-2 pt-2">
              {[1, 2].map((s) => (
                <div
                  key={s}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    step >= s ? "w-8 bg-zinc-950" : "w-4 bg-zinc-200"
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        <div className="bg-white rounded-3xl border border-zinc-200/60 shadow-sm p-6 sm:p-8">
          <AnimatePresence mode="wait">
            {loading && (
              <div className="space-y-5 animate-pulse">
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="space-y-2">
                      <div className="h-3.5 bg-zinc-200 rounded w-16" />
                      <div className="h-12 bg-zinc-100 rounded-xl w-full" />
                    </div>
                  ))}
                </div>
                <div className="h-12 bg-zinc-200 rounded-2xl w-full mt-4" />
              </div>
            )}

            {/* Step 1: Personal Details */}
            {!loading && role === "driver" && step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                className="space-y-5"
              >
                <div className="space-y-4">
                  {/* Name */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
                      Full Name
                    </label>
                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 flex items-center space-x-2.5 focus-within:bg-white focus-within:border-zinc-400 transition-colors">
                      <User className="w-4 h-4 text-zinc-400 shrink-0" />
                      <input
                        type="text"
                        value={driverForm.fullName}
                        onChange={(e) => setDriverForm({ ...driverForm, fullName: e.target.value })}
                        placeholder="Your full name"
                        className="bg-transparent border-0 outline-0 p-0 text-sm text-zinc-800 font-semibold w-full"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
                      Phone Number
                    </label>
                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 flex items-center space-x-2.5 focus-within:bg-white focus-within:border-zinc-400 transition-colors">
                      <Phone className="w-4 h-4 text-zinc-400 shrink-0" />
                      <input
                        type="tel"
                        value={driverForm.phone}
                        onChange={(e) => setDriverForm({ ...driverForm, phone: e.target.value })}
                        placeholder="+91 XXXXX XXXXX"
                        className="bg-transparent border-0 outline-0 p-0 text-sm text-zinc-800 font-semibold w-full"
                      />
                    </div>
                  </div>

                  {/* City */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
                      City
                    </label>
                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 flex items-center space-x-2.5 focus-within:bg-white focus-within:border-zinc-400 transition-colors">
                      <MapPin className="w-4 h-4 text-zinc-400 shrink-0" />
                      <input
                        type="text"
                        value={driverForm.address}
                        onChange={(e) => setDriverForm({ ...driverForm, address: e.target.value })}
                        placeholder="e.g. Delhi, Mumbai, Bangalore"
                        className="bg-transparent border-0 outline-0 p-0 text-sm text-zinc-800 font-semibold w-full"
                      />
                    </div>
                  </div>
                </div>

                <button
                  disabled={!driverForm.fullName || !driverForm.phone}
                  onClick={() => setStep(2)}
                  className="w-full py-3.5 bg-zinc-950 hover:bg-zinc-800 disabled:opacity-40 disabled:pointer-events-none text-white font-bold text-sm rounded-2xl transition-all flex items-center justify-center space-x-2"
                >
                  <span>Continue</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </motion.div>
            )}

            {/* Step 2: Vehicle Details */}
            {role === "driver" && step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                className="space-y-5"
              >
                <div className="space-y-4">
                  {/* Vehicle category */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
                      Vehicle Type
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {[
                        { id: "economy", label: "Economy", desc: "Hatchback / Sedan" },
                        { id: "premium", label: "Premium", desc: "SUV / MUV" },
                        { id: "xl", label: "XL", desc: "Innova / Tempo" },
                      ].map((t) => (
                        <button
                          key={t.id}
                          onClick={() => setDriverForm({ ...driverForm, vehicleType: t.id })}
                          className={`py-3 px-2 border rounded-xl text-center cursor-pointer transition-all ${
                            driverForm.vehicleType === t.id
                              ? "border-zinc-950 bg-zinc-950 text-white"
                              : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-400"
                          }`}
                        >
                          <div className="font-bold text-xs">{t.label}</div>
                          <div className={`text-[10px] mt-0.5 ${driverForm.vehicleType === t.id ? "text-zinc-400" : "text-zinc-400"}`}>
                            {t.desc}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Vehicle model */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
                      Vehicle Model
                    </label>
                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 flex items-center space-x-2.5 focus-within:bg-white focus-within:border-zinc-400 transition-colors">
                      <Car className="w-4 h-4 text-zinc-400 shrink-0" />
                      <input
                        type="text"
                        value={driverForm.vehicleModel}
                        onChange={(e) => setDriverForm({ ...driverForm, vehicleModel: e.target.value })}
                        placeholder="e.g. Maruti Swift, Tata Nexon"
                        className="bg-transparent border-0 outline-0 p-0 text-sm text-zinc-800 font-semibold w-full"
                      />
                    </div>
                  </div>

                  {/* Vehicle number */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
                      Registration Number
                    </label>
                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 flex items-center space-x-2.5 focus-within:bg-white focus-within:border-zinc-400 transition-colors">
                      <input
                        type="text"
                        value={driverForm.vehicleNumber}
                        onChange={(e) => setDriverForm({ ...driverForm, vehicleNumber: e.target.value })}
                        placeholder="e.g. DL 01 CA 1234"
                        className="bg-transparent border-0 outline-0 p-0 text-sm text-zinc-800 font-mono font-bold w-full"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setStep(1)}
                    className="py-3.5 px-6 border border-zinc-200 hover:border-zinc-400 font-semibold text-sm rounded-2xl transition-all text-zinc-700 cursor-pointer"
                  >
                    Back
                  </button>
                  <div className="flex-1 space-y-2">
                    <button
                      disabled={!driverForm.vehicleModel || !driverForm.vehicleNumber || submitting}
                      onClick={handleDriverSubmit}
                      className="w-full py-3.5 bg-zinc-950 hover:bg-zinc-800 disabled:opacity-40 disabled:pointer-events-none text-white font-bold text-sm rounded-2xl transition-all flex items-center justify-center space-x-2"
                    >
                      {submitting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <span>Start Driving</span>
                          <ChevronRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                    {submitError && (
                      <p className="text-xs text-red-600 font-semibold text-center">{submitError}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Success */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-6 py-4"
              >
                {/* Icon */}
                <div className="relative flex justify-center">
                  <div className="absolute inset-0 w-20 h-20 bg-emerald-500/10 rounded-full blur-xl mx-auto" />
                  <div className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg mx-auto">
                    <Check className="w-7 h-7 stroke-[3]" />
                  </div>
                </div>

                <div className="space-y-2">
                  <h2 className="text-2xl font-black text-zinc-950">You're all set!</h2>
                  <p className="text-sm text-zinc-500 font-medium max-w-[260px] mx-auto leading-relaxed">
                    Your account is ready. Go online to start receiving rides.
                  </p>
                </div>

                <button
                  onClick={() => router.push("/driver")}
                  className="w-full max-w-[240px] mx-auto py-4 bg-emerald-500 hover:bg-emerald-600 active:scale-97 text-white font-black text-base rounded-2xl transition-all shadow-lg shadow-emerald-500/25"
                >
                  Go to Driver Console
                </button>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}
