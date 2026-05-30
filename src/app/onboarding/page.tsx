"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getOnboardingState, saveRiderOnboarding, saveDriverOnboarding } from "@/actions/onboarding";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, User, Phone, Mail, Calendar, Upload, MapPin, ShieldAlert, Award, FileText, Check, ChevronRight, VolumeX, Thermometer, Languages, ArrowRight, ShieldCheck, Car, Key } from "lucide-react";
import Navbar from "@/components/Navbar";

export default function OnboardingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<"rider" | "driver" | null>(null);
  
  // Current Step Tracking
  const [step, setStep] = useState(1);

  // ── RIDER ONBOARDING FORM STATE ──
  const [riderForm, setRiderForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    dob: "",
    emergencyName: "",
    emergencyRelation: "",
    emergencyPhone: "",
    quietRide: false,
    acPreference: "No Preference", // "AC" | "Non-AC" | "No Preference"
    language: "English",
  });
  const [aadhaarFile, setAadhaarFile] = useState<string | null>(null);
  const [selfieFile, setSelfieFile] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // ── DRIVER ONBOARDING FORM STATE ──
  const [driverForm, setDriverForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    licenseNumber: "",
    licenseExpiry: "",
    vehicleType: "economy", // "economy" | "premium" | "xl"
    vehicleModel: "",
    vehicleNumber: "",
  });
  const [driverAadhaar, setDriverAadhaar] = useState<string | null>(null);
  const [driverPan, setDriverPan] = useState<string | null>(null);
  const [driverSelfie, setDriverSelfie] = useState<string | null>(null);
  const [driverLicense, setDriverLicense] = useState<string | null>(null);
  const [driverRc, setDriverRc] = useState<string | null>(null);
  const [driverInsurance, setDriverInsurance] = useState<string | null>(null);
  const [driverPermit, setDriverPermit] = useState<string | null>(null);

  useEffect(() => {
    async function checkState() {
      try {
        const state = await getOnboardingState();
        if (!state.success || !state.roleSelected) {
          router.push("/select-role");
          return;
        }
        if (state.onboarded) {
          // If already onboarded, redirect to respective pages
          router.push(state.role === "rider" ? "/rider" : "/driver");
          return;
        }
        setRole(state.role as "rider" | "driver");
        
        // Prefill basics from Clerk if available
        if (state.role === "rider") {
          setRiderForm(prev => ({
            ...prev,
            fullName: state.riderProfile?.phone ? "" : "Aanya Sharma", // prefilled demo name
            email: "aanya.sharma@gmail.com",
            phone: "+91 98765 43210",
          }));
        } else {
          setDriverForm(prev => ({
            ...prev,
            fullName: "Rajesh Kumar",
            email: "rajesh.kumar@rydr.in",
            phone: "+91 99887 76655",
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

  // Simulating File Uploads with Elegant Loading Micro-states
  const simulateFileUpload = (fileType: string) => {
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      const fakeUrl = `/uploads/${fileType}_demo.pdf`;
      
      // Rider Sets
      if (fileType === "aadhaar") setAadhaarFile("Aadhaar_Card_Verified.pdf");
      if (fileType === "selfie") setSelfieFile("Driver_Selfie_Verification.png");
      
      // Driver Sets
      if (fileType === "dr_aadhaar") setDriverAadhaar("Aadhaar_Front_Back.pdf");
      if (fileType === "dr_pan") setDriverPan("PAN_Card_Verified.pdf");
      if (fileType === "dr_selfie") setDriverSelfie("Selfie_Live_Approved.png");
      if (fileType === "dr_license") setDriverLicense("Driving_License_Front.pdf");
      if (fileType === "dr_rc") setDriverRc("Vehicle_Registration_Certificate.pdf");
      if (fileType === "dr_insurance") setDriverInsurance("Comprehensive_Insurance_Policy.pdf");
      if (fileType === "dr_permit") setDriverPermit("Commercial_Permit_All_India.pdf");
    }, 1200);
  };

  // ── RIDER SUBMISSION ──
  const handleRiderSubmit = async () => {
    setLoading(true);
    try {
      await saveRiderOnboarding({
        phone: riderForm.phone,
        dob: riderForm.dob,
        emergencyName: riderForm.emergencyName,
        emergencyRelation: riderForm.emergencyRelation,
        emergencyPhone: riderForm.emergencyPhone,
        quietRide: riderForm.quietRide,
        acPreference: riderForm.acPreference,
        language: riderForm.language,
        aadhaarUrl: aadhaarFile || undefined,
        selfieUrl: selfieFile || undefined,
      });
      setStep(5); // Success Screen
    } catch (err) {
      alert("Error saving onboarding details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── DRIVER SUBMISSION ──
  const handleDriverSubmit = async () => {
    setLoading(true);
    try {
      await saveDriverOnboarding({
        phone: driverForm.phone,
        address: driverForm.address,
        aadhaarUrl: driverAadhaar || "Aadhaar_Verified.pdf",
        panUrl: driverPan || "PAN_Verified.pdf",
        selfieUrl: driverSelfie || "Selfie_Live.png",
        licenseUrl: driverLicense || "Driving_License.pdf",
        licenseNumber: driverForm.licenseNumber,
        licenseExpiry: driverForm.licenseExpiry,
        vehicleType: driverForm.vehicleType,
        vehicleModel: driverForm.vehicleModel,
        vehicleNumber: driverForm.vehicleNumber,
        rcUrl: driverRc || "RC_Verified.pdf",
        insuranceUrl: driverInsurance || "Insurance_Verified.pdf",
        permitUrl: driverPermit || "Permit_Verified.pdf",
      });
      setStep(6); // Success Verification Submitted Screen
    } catch (err) {
      alert("Error saving driver onboarding details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 text-zinc-950 animate-spin" />
        <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase">Synchronizing RYDR Gateways...</span>
      </div>
    );
  }

  const riderStepsCount = 5;
  const driverStepsCount = 6;

  return (
    <main className="relative min-h-screen bg-zinc-50 text-zinc-900 antialiased pb-20 pt-28 flex flex-col justify-between">
      <Navbar />

      <div className="max-w-[700px] w-full mx-auto px-6 flex-grow flex flex-col justify-center">
        
        {/* Onboarding Heading Block */}
        {step < 5 && (
          <div className="mb-8 text-center space-y-2">
            <span className="text-[10px] font-mono tracking-[0.25em] text-zinc-400 font-bold uppercase block">
              Profile Provisioning
            </span>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tighter text-zinc-950">
              {role === "rider" ? "Let's complete your Rider profile" : "Let's set up your Driver account"}
            </h1>
            
            {/* Elegant Slim Progress Bar */}
            <div className="pt-4 flex items-center justify-center space-x-1.5 max-w-[240px] mx-auto">
              {Array.from({ length: role === "rider" ? riderStepsCount - 1 : driverStepsCount - 2 }).map((_, i) => {
                const currentStepIndex = i + 1;
                const isActive = step >= currentStepIndex;
                return (
                  <div
                    key={i}
                    className={`h-[3px] flex-grow rounded-full transition-all duration-300 ${
                      isActive ? "bg-zinc-950" : "bg-zinc-200"
                    }`}
                  />
                );
              })}
            </div>
            <p className="text-[11.5px] font-mono font-bold text-zinc-400 uppercase pt-2">Step {step} of {role === "rider" ? riderStepsCount : driverStepsCount}</p>
          </div>
        )}

        <div className="bg-white rounded-3xl border border-zinc-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.02)] p-6 sm:p-8">
          <AnimatePresence mode="wait">
            
            {/* ============================================================ */}
            {/* ── RIDER ONBOARDING STEPS ── */}
            {/* ============================================================ */}
            {role === "rider" && (
              <>
                {/* Step 1: Personal Details */}
                {step === 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6"
                  >
                    <div className="space-y-1 pb-3 border-b border-zinc-100">
                      <h3 className="text-base font-black text-zinc-950">Personal Details</h3>
                      <p className="text-[12px] text-zinc-550 font-semibold leading-normal">Tell us a bit about yourself to secure your commutes.</p>
                    </div>

                    <div className="space-y-4">
                      {/* Name */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Full Name</label>
                        <div className="bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 flex items-center space-x-2.5 focus-within:bg-white focus-within:border-zinc-450 transition-colors">
                          <User className="w-4 h-4 text-zinc-400" />
                          <input
                            type="text"
                            value={riderForm.fullName}
                            onChange={(e) => setRiderForm({ ...riderForm, fullName: e.target.value })}
                            placeholder="e.g. Aanya Sharma"
                            className="bg-transparent border-0 outline-0 p-0 text-sm text-zinc-800 focus:ring-0 font-bold w-full"
                          />
                        </div>
                      </div>

                      {/* Phone */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Phone Number</label>
                        <div className="bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 flex items-center space-x-2.5 focus-within:bg-white focus-within:border-zinc-450 transition-colors">
                          <Phone className="w-4 h-4 text-zinc-400" />
                          <input
                            type="text"
                            value={riderForm.phone}
                            onChange={(e) => setRiderForm({ ...riderForm, phone: e.target.value })}
                            placeholder="e.g. +91 98765 43210"
                            className="bg-transparent border-0 outline-0 p-0 text-sm text-zinc-800 focus:ring-0 font-bold w-full"
                          />
                        </div>
                      </div>

                      {/* DOB */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Date of Birth</label>
                        <div className="bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 flex items-center space-x-2.5 focus-within:bg-white focus-within:border-zinc-450 transition-colors">
                          <Calendar className="w-4 h-4 text-zinc-400" />
                          <input
                            type="text"
                            value={riderForm.dob}
                            onChange={(e) => setRiderForm({ ...riderForm, dob: e.target.value })}
                            placeholder="DD / MM / YYYY"
                            className="bg-transparent border-0 outline-0 p-0 text-sm text-zinc-800 focus:ring-0 font-bold w-full"
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      disabled={!riderForm.fullName || !riderForm.phone || !riderForm.dob}
                      onClick={() => setStep(2)}
                      className="w-full py-3 bg-zinc-950 hover:bg-zinc-850 disabled:opacity-50 disabled:pointer-events-none active:scale-98 text-white font-bold text-xs rounded-full transition-all flex items-center justify-center space-x-1.5 shadow-md shadow-zinc-950/15"
                    >
                      <span>Continue</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </motion.div>
                )}

                {/* Step 2: Identity Verification */}
                {step === 2 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6"
                  >
                    <div className="space-y-1 pb-3 border-b border-zinc-100">
                      <h3 className="text-base font-black text-zinc-950">Identity Verification</h3>
                      <p className="text-[12px] text-zinc-550 font-semibold leading-normal">Required for passenger and driver safety protocols.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Aadhaar Upload Card */}
                      <div
                        onClick={() => !aadhaarFile && simulateFileUpload("aadhaar")}
                        className={`border-2 border-dashed rounded-2xl p-5 flex flex-col items-center justify-center text-center cursor-pointer min-h-[140px] transition-all relative ${
                          aadhaarFile
                            ? "border-emerald-500/30 bg-emerald-500/[0.02]"
                            : "border-zinc-200 hover:border-zinc-400 bg-zinc-50"
                        }`}
                      >
                        {isUploading ? (
                          <Loader2 className="w-6 h-6 text-zinc-500 animate-spin" />
                        ) : aadhaarFile ? (
                          <>
                            <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center mb-2 shadow-sm">
                              <Check className="w-4 h-4 stroke-[3]" />
                            </div>
                            <span className="text-[12.5px] font-bold text-emerald-700">Aadhaar Uploaded</span>
                            <span className="text-[10px] text-zinc-400 font-semibold mt-1">{aadhaarFile}</span>
                          </>
                        ) : (
                          <>
                            <Upload className="w-6 h-6 text-zinc-400 mb-2" />
                            <span className="text-[12.5px] font-bold text-zinc-800">Aadhaar Card PDF</span>
                            <span className="text-[10px] text-zinc-450 mt-1">Click to upload document</span>
                          </>
                        )}
                      </div>

                      {/* Selfie Verification */}
                      <div
                        onClick={() => !selfieFile && simulateFileUpload("selfie")}
                        className={`border-2 border-dashed rounded-2xl p-5 flex flex-col items-center justify-center text-center cursor-pointer min-h-[140px] transition-all relative ${
                          selfieFile
                            ? "border-emerald-500/30 bg-emerald-500/[0.02]"
                            : "border-zinc-200 hover:border-zinc-400 bg-zinc-50"
                        }`}
                      >
                        {isUploading ? (
                          <Loader2 className="w-6 h-6 text-zinc-500 animate-spin" />
                        ) : selfieFile ? (
                          <>
                            <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center mb-2 shadow-sm">
                              <Check className="w-4 h-4 stroke-[3]" />
                            </div>
                            <span className="text-[12.5px] font-bold text-emerald-700">Selfie Matched</span>
                            <span className="text-[10px] text-zinc-400 font-semibold mt-1">Live identity verified</span>
                          </>
                        ) : (
                          <>
                            <User className="w-6 h-6 text-zinc-400 mb-2" />
                            <span className="text-[12.5px] font-bold text-zinc-800">Identity Match</span>
                            <span className="text-[10px] text-zinc-450 mt-1">Perform selfie scan</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => setStep(1)}
                        className="py-3 px-6 border border-zinc-250 hover:border-zinc-400 font-bold text-xs rounded-full transition-all active:scale-97 cursor-pointer text-zinc-700"
                      >
                        Back
                      </button>
                      <button
                        disabled={!aadhaarFile || !selfieFile}
                        onClick={() => setStep(3)}
                        className="flex-1 py-3 bg-zinc-950 hover:bg-zinc-850 disabled:opacity-50 disabled:pointer-events-none active:scale-98 text-white font-bold text-xs rounded-full transition-all flex items-center justify-center space-x-1.5 shadow-md shadow-zinc-950/15"
                      >
                        <span>Continue</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Emergency Contact */}
                {step === 3 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6"
                  >
                    <div className="space-y-1 pb-3 border-b border-zinc-100">
                      <h3 className="text-base font-black text-zinc-950">Emergency Contact</h3>
                      <p className="text-[12px] text-zinc-550 font-semibold leading-normal">Your rides will be shared automatically in emergencies.</p>
                    </div>

                    <div className="space-y-4">
                      {/* Name */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Contact Name</label>
                        <div className="bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 flex items-center space-x-2.5 focus-within:bg-white focus-within:border-zinc-450 transition-colors">
                          <User className="w-4 h-4 text-zinc-400" />
                          <input
                            type="text"
                            value={riderForm.emergencyName}
                            onChange={(e) => setRiderForm({ ...riderForm, emergencyName: e.target.value })}
                            placeholder="e.g. Papa / Ramesh Sharma"
                            className="bg-transparent border-0 outline-0 p-0 text-sm text-zinc-800 focus:ring-0 font-bold w-full"
                          />
                        </div>
                      </div>

                      {/* Relationship */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Relationship</label>
                        <div className="bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 flex items-center space-x-2.5 focus-within:bg-white focus-within:border-zinc-450 transition-colors">
                          <Award className="w-4 h-4 text-zinc-400" />
                          <input
                            type="text"
                            value={riderForm.emergencyRelation}
                            onChange={(e) => setRiderForm({ ...riderForm, emergencyRelation: e.target.value })}
                            placeholder="e.g. Father / Friend / Sister"
                            className="bg-transparent border-0 outline-0 p-0 text-sm text-zinc-800 focus:ring-0 font-bold w-full"
                          />
                        </div>
                      </div>

                      {/* Phone */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Emergency Phone</label>
                        <div className="bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 flex items-center space-x-2.5 focus-within:bg-white focus-within:border-zinc-450 transition-colors">
                          <Phone className="w-4 h-4 text-zinc-400" />
                          <input
                            type="text"
                            value={riderForm.emergencyPhone}
                            onChange={(e) => setRiderForm({ ...riderForm, emergencyPhone: e.target.value })}
                            placeholder="e.g. +91 99887 76655"
                            className="bg-transparent border-0 outline-0 p-0 text-sm text-zinc-800 focus:ring-0 font-bold w-full"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => setStep(2)}
                        className="py-3 px-6 border border-zinc-250 hover:border-zinc-400 font-bold text-xs rounded-full transition-all active:scale-97 cursor-pointer text-zinc-700"
                      >
                        Back
                      </button>
                      <button
                        disabled={!riderForm.emergencyName || !riderForm.emergencyRelation || !riderForm.emergencyPhone}
                        onClick={() => setStep(4)}
                        className="flex-1 py-3 bg-zinc-950 hover:bg-zinc-850 disabled:opacity-50 disabled:pointer-events-none active:scale-98 text-white font-bold text-xs rounded-full transition-all flex items-center justify-center space-x-1.5 shadow-md shadow-zinc-950/15"
                      >
                        <span>Continue</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Step 4: Preferences */}
                {step === 4 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6"
                  >
                    <div className="space-y-1 pb-3 border-b border-zinc-100">
                      <h3 className="text-base font-black text-zinc-950">Pre-Trip Preferences</h3>
                      <p className="text-[12px] text-zinc-550 font-semibold leading-normal">Tell us how you like to travel for custom matchings.</p>
                    </div>

                    <div className="space-y-4">
                      {/* Quiet ride toggle */}
                      <div className="border border-zinc-200 rounded-2xl p-4.5 flex items-center justify-between shadow-3xs bg-zinc-50/50">
                        <div className="flex items-center space-x-3">
                          <VolumeX className="w-4.5 h-4.5 text-zinc-500" />
                          <div>
                            <h4 className="text-[13px] font-bold text-zinc-900 leading-none">Quiet Mode Cabin</h4>
                            <p className="text-[11px] text-zinc-400 font-semibold mt-1">Drivers will avoid chat unless asked</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setRiderForm({ ...riderForm, quietRide: !riderForm.quietRide })}
                          className={`w-11 h-6 rounded-full p-0.5 transition-colors duration-200 cursor-pointer ${
                            riderForm.quietRide ? "bg-black" : "bg-zinc-250"
                          }`}
                        >
                          <div className={`w-5 h-5 rounded-full bg-white shadow transform transition-transform duration-200 ${
                            riderForm.quietRide ? "translate-x-5" : "translate-x-0"
                          }`} />
                        </button>
                      </div>

                      {/* AC preference */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Air Conditioning</label>
                        <div className="grid grid-cols-3 gap-2">
                          {["AC", "Non-AC", "No Preference"].map((pref) => (
                            <button
                              key={pref}
                              onClick={() => setRiderForm({ ...riderForm, acPreference: pref })}
                              className={`py-2 px-3 border rounded-xl text-xs font-bold transition-all text-center cursor-pointer ${
                                riderForm.acPreference === pref
                                  ? "border-zinc-950 bg-zinc-950 text-white shadow-sm"
                                  : "border-zinc-200 bg-white text-zinc-650 hover:border-zinc-400"
                              }`}
                            >
                              {pref}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Language selection */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Language Preference</label>
                        <div className="grid grid-cols-3 gap-2">
                          {["English", "Hindi", "Kannada"].map((lang) => (
                            <button
                              key={lang}
                              onClick={() => setRiderForm({ ...riderForm, language: lang })}
                              className={`py-2 px-3 border rounded-xl text-xs font-bold transition-all text-center cursor-pointer ${
                                riderForm.language === lang
                                  ? "border-zinc-950 bg-zinc-950 text-white shadow-sm"
                                  : "border-zinc-200 bg-white text-zinc-650 hover:border-zinc-400"
                              }`}
                            >
                              {lang}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => setStep(3)}
                        className="py-3 px-6 border border-zinc-250 hover:border-zinc-400 font-bold text-xs rounded-full transition-all active:scale-97 cursor-pointer text-zinc-700"
                      >
                        Back
                      </button>
                      <button
                        onClick={handleRiderSubmit}
                        className="flex-1 py-3 bg-zinc-950 hover:bg-zinc-850 active:scale-98 text-white font-bold text-xs rounded-full transition-all flex items-center justify-center space-x-1.5 shadow-md shadow-zinc-950/15"
                      >
                        <span>Finalize Setup</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Step 5: Success Screen */}
                {step === 5 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center space-y-6 py-6"
                  >
                    <div className="relative flex justify-center">
                      <div className="absolute inset-0 w-20 h-20 bg-emerald-500/10 rounded-full blur-xl mx-auto" />
                      <div className="w-16 h-16 rounded-full bg-zinc-950 border border-emerald-500/20 text-white flex items-center justify-center shadow-lg animate-float-slow mx-auto">
                        <Check className="w-7 h-7 stroke-[3] text-emerald-500" />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-[10px] font-mono tracking-widest text-emerald-600 font-extrabold uppercase">Setup Completed</span>
                      <h2 className="text-xl sm:text-2xl font-black text-zinc-950">You're ready to ride 🚖</h2>
                      <p className="text-xs text-zinc-500 max-w-[280px] mx-auto font-semibold leading-normal">
                        Your account is secure and emergency relays are successfully deployed.
                      </p>
                    </div>

                    <button
                      onClick={() => router.push("/rider")}
                      className="w-full max-w-[220px] mx-auto py-3 bg-zinc-950 hover:bg-zinc-850 active:scale-97 text-white font-bold text-xs rounded-full transition-all shadow-md"
                    >
                      Book First Ride
                    </button>
                  </motion.div>
                )}
              </>
            )}

            {/* ============================================================ */}
            {/* ── DRIVER ONBOARDING STEPS ── */}
            {/* ============================================================ */}
            {role === "driver" && (
              <>
                {/* Step 1: Personal Details */}
                {step === 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6"
                  >
                    <div className="space-y-1 pb-3 border-b border-zinc-100">
                      <h3 className="text-base font-black text-zinc-950">Driver Details</h3>
                      <p className="text-[12px] text-zinc-550 font-semibold leading-normal">Secure your operator profile and payout bank account details.</p>
                    </div>

                    <div className="space-y-4">
                      {/* Name */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Full Name</label>
                        <div className="bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 flex items-center space-x-2.5 focus-within:bg-white focus-within:border-zinc-450 transition-colors">
                          <User className="w-4 h-4 text-zinc-400" />
                          <input
                            type="text"
                            value={driverForm.fullName}
                            onChange={(e) => setDriverForm({ ...driverForm, fullName: e.target.value })}
                            placeholder="e.g. Rajesh Kumar"
                            className="bg-transparent border-0 outline-0 p-0 text-sm text-zinc-800 focus:ring-0 font-bold w-full"
                          />
                        </div>
                      </div>

                      {/* Phone */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Phone Number</label>
                        <div className="bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 flex items-center space-x-2.5 focus-within:bg-white focus-within:border-zinc-450 transition-colors">
                          <Phone className="w-4 h-4 text-zinc-400" />
                          <input
                            type="text"
                            value={driverForm.phone}
                            onChange={(e) => setDriverForm({ ...driverForm, phone: e.target.value })}
                            placeholder="e.g. +91 99887 76655"
                            className="bg-transparent border-0 outline-0 p-0 text-sm text-zinc-800 focus:ring-0 font-bold w-full"
                          />
                        </div>
                      </div>

                      {/* Address */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Home Address</label>
                        <div className="bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 flex items-center space-x-2.5 focus-within:bg-white focus-within:border-zinc-450 transition-colors">
                          <MapPin className="w-4 h-4 text-zinc-400" />
                          <input
                            type="text"
                            value={driverForm.address}
                            onChange={(e) => setDriverForm({ ...driverForm, address: e.target.value })}
                            placeholder="Operator registered address in Delhi NCR"
                            className="bg-transparent border-0 outline-0 p-0 text-sm text-zinc-800 focus:ring-0 font-bold w-full"
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      disabled={!driverForm.fullName || !driverForm.phone || !driverForm.address}
                      onClick={() => setStep(2)}
                      className="w-full py-3 bg-zinc-950 hover:bg-zinc-850 disabled:opacity-50 disabled:pointer-events-none active:scale-98 text-white font-bold text-xs rounded-full transition-all flex items-center justify-center space-x-1.5 shadow-md shadow-zinc-950/15"
                    >
                      <span>Continue</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </motion.div>
                )}

                {/* Step 2: Identity Documents Verification */}
                {step === 2 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6"
                  >
                    <div className="space-y-1 pb-3 border-b border-zinc-100">
                      <h3 className="text-base font-black text-zinc-950">Identity Verification</h3>
                      <p className="text-[12px] text-zinc-550 font-semibold leading-normal">Upload KYC documents. Submissions are Aadhaar linked.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {/* Aadhaar */}
                      <div
                        onClick={() => !driverAadhaar && simulateFileUpload("dr_aadhaar")}
                        className={`border border-dashed rounded-2xl p-4 flex flex-col items-center justify-center text-center cursor-pointer min-h-[110px] transition-all ${
                          driverAadhaar
                            ? "border-emerald-500 bg-emerald-500/[0.02] text-emerald-600"
                            : "border-zinc-200 hover:border-zinc-400 bg-zinc-50"
                        }`}
                      >
                        {driverAadhaar ? (
                          <>
                            <Check className="w-5 h-5 mb-1 stroke-[3]" />
                            <span className="text-[11px] font-bold">Aadhaar Linked</span>
                          </>
                        ) : (
                          <>
                            <Upload className="w-5 h-5 text-zinc-400 mb-1" />
                            <span className="text-[11.5px] font-bold text-zinc-800">Aadhaar PDF</span>
                          </>
                        )}
                      </div>

                      {/* PAN */}
                      <div
                        onClick={() => !driverPan && simulateFileUpload("dr_pan")}
                        className={`border border-dashed rounded-2xl p-4 flex flex-col items-center justify-center text-center cursor-pointer min-h-[110px] transition-all ${
                          driverPan
                            ? "border-emerald-500 bg-emerald-500/[0.02] text-emerald-600"
                            : "border-zinc-200 hover:border-zinc-400 bg-zinc-50"
                        }`}
                      >
                        {driverPan ? (
                          <>
                            <Check className="w-5 h-5 mb-1 stroke-[3]" />
                            <span className="text-[11px] font-bold">PAN Linked</span>
                          </>
                        ) : (
                          <>
                            <Upload className="w-5 h-5 text-zinc-400 mb-1" />
                            <span className="text-[11.5px] font-bold text-zinc-800">PAN Card</span>
                          </>
                        )}
                      </div>

                      {/* Selfie */}
                      <div
                        onClick={() => !driverSelfie && simulateFileUpload("dr_selfie")}
                        className={`border border-dashed rounded-2xl p-4 flex flex-col items-center justify-center text-center cursor-pointer min-h-[110px] transition-all ${
                          driverSelfie
                            ? "border-emerald-500 bg-emerald-500/[0.02] text-emerald-600"
                            : "border-zinc-200 hover:border-zinc-400 bg-zinc-50"
                        }`}
                      >
                        {driverSelfie ? (
                          <>
                            <Check className="w-5 h-5 mb-1 stroke-[3]" />
                            <span className="text-[11px] font-bold">Selfie Captured</span>
                          </>
                        ) : (
                          <>
                            <User className="w-5 h-5 text-zinc-400 mb-1" />
                            <span className="text-[11.5px] font-bold text-zinc-800">Live Selfie</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => setStep(1)}
                        className="py-3 px-6 border border-zinc-250 hover:border-zinc-400 font-bold text-xs rounded-full transition-all active:scale-97 cursor-pointer text-zinc-700"
                      >
                        Back
                      </button>
                      <button
                        disabled={!driverAadhaar || !driverPan || !driverSelfie}
                        onClick={() => setStep(3)}
                        className="flex-1 py-3 bg-zinc-950 hover:bg-zinc-850 disabled:opacity-50 disabled:pointer-events-none active:scale-98 text-white font-bold text-xs rounded-full transition-all flex items-center justify-center space-x-1.5 shadow-md shadow-zinc-950/15"
                      >
                        <span>Continue</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Driving Verification */}
                {step === 3 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6"
                  >
                    <div className="space-y-1 pb-3 border-b border-zinc-100">
                      <h3 className="text-base font-black text-zinc-950">Driving License</h3>
                      <p className="text-[12px] text-zinc-550 font-semibold leading-normal">Verification of commercial/private motor vehicle license.</p>
                    </div>

                    <div className="space-y-4">
                      {/* Upload license */}
                      <div
                        onClick={() => !driverLicense && simulateFileUpload("dr_license")}
                        className={`border-2 border-dashed rounded-2xl p-5 flex flex-col items-center justify-center text-center cursor-pointer min-h-[120px] transition-all relative ${
                          driverLicense
                            ? "border-emerald-500/30 bg-emerald-500/[0.02]"
                            : "border-zinc-200 hover:border-zinc-400 bg-zinc-50"
                        }`}
                      >
                        {driverLicense ? (
                          <>
                            <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center mb-1.5 shadow-sm">
                              <Check className="w-4 h-4 stroke-[3]" />
                            </div>
                            <span className="text-[12px] font-bold text-emerald-700">License Photo Uploaded</span>
                            <span className="text-[10px] text-zinc-400 mt-0.5">{driverLicense}</span>
                          </>
                        ) : (
                          <>
                            <Upload className="w-6 h-6 text-zinc-400 mb-2" />
                            <span className="text-[12.5px] font-bold text-zinc-800">License Document (Front / Back)</span>
                          </>
                        )}
                      </div>

                      {/* License Details Inputs */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">License Number</label>
                          <div className="bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 flex items-center focus-within:bg-white focus-within:border-zinc-450 transition-colors">
                            <input
                              type="text"
                              value={driverForm.licenseNumber}
                              onChange={(e) => setDriverForm({ ...driverForm, licenseNumber: e.target.value })}
                              placeholder="DL-XXXXXXXXXXXXX"
                              className="bg-transparent border-0 outline-0 p-0 text-sm text-zinc-800 focus:ring-0 font-mono font-bold w-full"
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Expiry Date</label>
                          <div className="bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 flex items-center focus-within:bg-white focus-within:border-zinc-450 transition-colors">
                            <input
                              type="text"
                              value={driverForm.licenseExpiry}
                              onChange={(e) => setDriverForm({ ...driverForm, licenseExpiry: e.target.value })}
                              placeholder="DD / MM / YYYY"
                              className="bg-transparent border-0 outline-0 p-0 text-sm text-zinc-800 focus:ring-0 font-bold w-full"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => setStep(2)}
                        className="py-3 px-6 border border-zinc-250 hover:border-zinc-400 font-bold text-xs rounded-full transition-all active:scale-97 cursor-pointer text-zinc-700"
                      >
                        Back
                      </button>
                      <button
                        disabled={!driverLicense || !driverForm.licenseNumber || !driverForm.licenseExpiry}
                        onClick={() => setStep(4)}
                        className="flex-1 py-3 bg-zinc-950 hover:bg-zinc-850 disabled:opacity-50 disabled:pointer-events-none active:scale-98 text-white font-bold text-xs rounded-full transition-all flex items-center justify-center space-x-1.5 shadow-md shadow-zinc-950/15"
                      >
                        <span>Continue</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Step 4: Vehicle Details */}
                {step === 4 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6"
                  >
                    <div className="space-y-1 pb-3 border-b border-zinc-100">
                      <h3 className="text-base font-black text-zinc-950">Vehicle Information</h3>
                      <p className="text-[12px] text-zinc-550 font-semibold leading-normal">Register your vehicle details and permit documents.</p>
                    </div>

                    <div className="space-y-4">
                      {/* Vehicle Tier Select */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Vehicle Category</label>
                        <div className="grid grid-cols-3 gap-2">
                          {[
                            { id: "economy", label: "EV Eco" },
                            { id: "premium", label: "Daily" },
                            { id: "xl", label: "Luxe" },
                          ].map((t) => (
                            <button
                              key={t.id}
                              onClick={() => setDriverForm({ ...driverForm, vehicleType: t.id })}
                              className={`py-2 px-3 border rounded-xl text-xs font-bold transition-all text-center cursor-pointer ${
                                driverForm.vehicleType === t.id
                                  ? "border-zinc-950 bg-zinc-950 text-white shadow-sm"
                                  : "border-zinc-200 bg-white text-zinc-650 hover:border-zinc-400"
                              }`}
                            >
                              {t.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Text inputs */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Vehicle Model</label>
                          <div className="bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 flex items-center focus-within:bg-white focus-within:border-zinc-450 transition-colors">
                            <input
                              type="text"
                              value={driverForm.vehicleModel}
                              onChange={(e) => setDriverForm({ ...driverForm, vehicleModel: e.target.value })}
                              placeholder="e.g. Tata Nexon EV (White)"
                              className="bg-transparent border-0 outline-0 p-0 text-sm text-zinc-800 focus:ring-0 font-bold w-full"
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Vehicle Number</label>
                          <div className="bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 flex items-center focus-within:bg-white focus-within:border-zinc-450 transition-colors">
                            <input
                              type="text"
                              value={driverForm.vehicleNumber}
                              onChange={(e) => setDriverForm({ ...driverForm, vehicleNumber: e.target.value })}
                              placeholder="e.g. DL-1CA-XXXX"
                              className="bg-transparent border-0 outline-0 p-0 text-sm text-zinc-800 focus:ring-0 font-mono font-bold w-full"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Upload documents */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div
                          onClick={() => !driverRc && simulateFileUpload("dr_rc")}
                          className={`border border-dashed rounded-xl p-3 flex flex-col items-center justify-center text-center cursor-pointer min-h-[90px] transition-all ${
                            driverRc ? "border-emerald-500 bg-emerald-500/[0.02] text-emerald-600" : "border-zinc-200 hover:border-zinc-400 bg-zinc-50"
                          }`}
                        >
                          {driverRc ? <Check className="w-5 h-5 stroke-[3]" /> : <Upload className="w-4 h-4 text-zinc-400 mb-1" />}
                          <span className="text-[10.5px] font-bold">RC Certificate</span>
                        </div>

                        <div
                          onClick={() => !driverInsurance && simulateFileUpload("dr_insurance")}
                          className={`border border-dashed rounded-xl p-3 flex flex-col items-center justify-center text-center cursor-pointer min-h-[90px] transition-all ${
                            driverInsurance ? "border-emerald-500 bg-emerald-500/[0.02] text-emerald-600" : "border-zinc-200 hover:border-zinc-400 bg-zinc-50"
                          }`}
                        >
                          {driverInsurance ? <Check className="w-5 h-5 stroke-[3]" /> : <Upload className="w-4 h-4 text-zinc-400 mb-1" />}
                          <span className="text-[10.5px] font-bold">Insurance</span>
                        </div>

                        <div
                          onClick={() => !driverPermit && simulateFileUpload("dr_permit")}
                          className={`border border-dashed rounded-xl p-3 flex flex-col items-center justify-center text-center cursor-pointer min-h-[90px] transition-all ${
                            driverPermit ? "border-emerald-500 bg-emerald-500/[0.02] text-emerald-600" : "border-zinc-200 hover:border-zinc-400 bg-zinc-50"
                          }`}
                        >
                          {driverPermit ? <Check className="w-5 h-5 stroke-[3]" /> : <Upload className="w-4 h-4 text-zinc-400 mb-1" />}
                          <span className="text-[10.5px] font-bold">Commercial Permit</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => setStep(3)}
                        className="py-3 px-6 border border-zinc-250 hover:border-zinc-400 font-bold text-xs rounded-full transition-all active:scale-97 cursor-pointer text-zinc-700"
                      >
                        Back
                      </button>
                      <button
                        disabled={!driverForm.vehicleModel || !driverForm.vehicleNumber || !driverRc || !driverInsurance || !driverPermit}
                        onClick={() => setStep(5)}
                        className="flex-1 py-3 bg-zinc-950 hover:bg-zinc-850 disabled:opacity-50 disabled:pointer-events-none active:scale-98 text-white font-bold text-xs rounded-full transition-all flex items-center justify-center space-x-1.5 shadow-md shadow-zinc-950/15"
                      >
                        <span>Submit Profile</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Step 5: Verification Pending Status screen */}
                {step === 5 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6 text-center"
                  >
                    <div className="relative flex justify-center">
                      <div className="absolute inset-0 w-20 h-20 bg-amber-500/10 rounded-full blur-xl mx-auto" />
                      <div className="w-16 h-16 rounded-full bg-zinc-950 border border-amber-500/20 text-white flex items-center justify-center shadow-lg animate-float-slow mx-auto">
                        <Loader2 className="w-7 h-7 text-amber-500 animate-spin" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <span className="text-[10px] font-mono tracking-widest text-amber-600 font-extrabold uppercase">Step 5 of 6</span>
                      <h3 className="text-xl font-black text-zinc-950 leading-tight">Verification Pending</h3>
                      <p className="text-xs text-zinc-500 font-semibold leading-relaxed max-w-sm mx-auto">
                        Your registered vehicle, license, and KYC credentials will be reviewed by our compliance administrators within 24 hours.
                      </p>
                    </div>

                    <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-4.5 text-left max-w-md mx-auto space-y-2 font-mono text-[11px] text-zinc-650">
                      <div className="flex justify-between pb-2 border-b border-zinc-200/60 font-bold text-zinc-900 uppercase">
                        <span>Checklist</span>
                        <span>Status</span>
                      </div>
                      <div className="flex justify-between items-center pt-1.5">
                        <span>Aadhaar & PAN Match</span>
                        <span className="text-emerald-600 font-bold uppercase text-[9.5px]">✓ Submitted</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>License Credentials</span>
                        <span className="text-emerald-600 font-bold uppercase text-[9.5px]">✓ Submitted</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Vehicle RC & Insurance</span>
                        <span className="text-emerald-600 font-bold uppercase text-[9.5px]">✓ Submitted</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Compliance Review</span>
                        <span className="text-amber-600 font-bold uppercase text-[9.5px] animate-pulse">● Pending Review</span>
                      </div>
                    </div>

                    <button
                      onClick={handleDriverSubmit}
                      className="w-full max-w-[220px] py-3 bg-zinc-950 hover:bg-zinc-850 active:scale-97 text-white font-bold text-xs rounded-full transition-all flex items-center justify-center space-x-1.5"
                    >
                      <span>Finalize Submissions</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </motion.div>
                )}

                {/* Step 6: Success Verification Submitted */}
                {step === 6 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center space-y-6 py-6"
                  >
                    <div className="relative flex justify-center">
                      <div className="absolute inset-0 w-20 h-20 bg-emerald-500/10 rounded-full blur-xl mx-auto" />
                      <div className="w-16 h-16 rounded-full bg-zinc-950 border border-emerald-500/20 text-white flex items-center justify-center shadow-lg animate-float-slow mx-auto">
                        <Check className="w-7 h-7 stroke-[3] text-emerald-500" />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-[10px] font-mono tracking-widest text-emerald-600 font-extrabold uppercase">Setup Complete</span>
                      <h2 className="text-xl sm:text-2xl font-black text-zinc-950">Verification submitted.</h2>
                      <p className="text-xs text-zinc-500 max-w-[290px] mx-auto font-semibold leading-normal">
                        We'll notify you after approval. In the meantime, you can explore the console shift layout.
                      </p>
                    </div>

                    <button
                      onClick={() => router.push("/driver")}
                      className="w-full max-w-[220px] mx-auto py-3 bg-zinc-950 hover:bg-zinc-850 active:scale-97 text-white font-bold text-xs rounded-full transition-all shadow-md"
                    >
                      Enter Driver Console
                    </button>
                  </motion.div>
                )}
              </>
            )}

          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}
