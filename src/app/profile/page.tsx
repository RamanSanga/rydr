"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getOnboardingState, updateRiderProfile, updateDriverProfile } from "@/actions/onboarding";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import { User, Phone, Mail, ShieldCheck, Sparkles, Thermometer, VolumeX, CreditCard, Check, ChevronRight, Loader2, FileText, AlertTriangle, Briefcase, Plane, Activity, MapPin } from "lucide-react";

type ProfileTab = "details" | "documents" | "emergency" | "preferences";

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<ProfileTab>("details");
  const [role, setRole] = useState<"rider" | "driver" | null>(null);
  const [verificationStatus, setVerificationStatus] = useState<string>("Pending");

  // ── Profile data inputs ──
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState("");
  const [address, setAddress] = useState("");
  
  // Rider specific
  const [emergencyName, setEmergencyName] = useState("");
  const [emergencyRelation, setEmergencyRelation] = useState("");
  const [emergencyPhone, setEmergencyPhone] = useState("");
  const [quietRide, setQuietRide] = useState(false);
  const [acPreference, setAcPreference] = useState("No Preference");
  const [language, setLanguage] = useState("English");

  // Driver specific
  const [vehicleModel, setVehicleModel] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");

  const [isSavedAlert, setIsSavedAlert] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      try {
        const state = await getOnboardingState();
        if (!state.success || !state.roleSelected) {
          router.push("/select-role");
          return;
        }
        if (!state.onboarded) {
          router.push("/onboarding");
          return;
        }

        setRole(state.role as "rider" | "driver");
        
        if (state.role === "rider" && state.riderProfile) {
          const profile = state.riderProfile;
          setFullName("Aanya Sharma"); // Prefilled mock matching Clerk
          setPhone(profile.phone || "");
          setEmail("aanya.sharma@gmail.com");
          setDob(profile.dob || "");
          setEmergencyName(profile.emergencyName || "");
          setEmergencyRelation(profile.emergencyRelation || "");
          setEmergencyPhone(profile.emergencyPhone || "");
          setQuietRide(profile.quietRide);
          setAcPreference(profile.acPreference || "No Preference");
          setLanguage(profile.language || "English");
        } else if (state.role === "driver" && state.driverProfile) {
          const profile = state.driverProfile;
          setFullName("Rajesh Kumar");
          setPhone(profile.phone || "");
          setEmail("rajesh.kumar@rydr.in");
          setAddress(profile.address || "");
          setVehicleModel(profile.vehicleModel || "");
          setVehicleNumber(profile.vehicleNumber || "");
          setLicenseNumber(profile.licenseNumber || "");
          setVerificationStatus(profile.verificationStatus || "Pending");
        }
      } catch (err) {
        console.error("Failed to load profile details", err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (role === "rider") {
        await updateRiderProfile({
          name: fullName,
          phone,
          dob,
          emergencyName,
          emergencyRelation,
          emergencyPhone,
          quietRide,
          acPreference,
          language,
        });
      } else if (role === "driver") {
        await updateDriverProfile({
          name: fullName,
          phone,
          address,
          vehicleModel,
          vehicleNumber,
          licenseNumber,
        });
      }
      setIsSavedAlert(true);
      setTimeout(() => setIsSavedAlert(false), 2500);
    } catch (err) {
      alert("Error saving profile details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 text-zinc-950 animate-spin" />
        <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase">Syncing profile parameters...</span>
      </div>
    );
  }

  const tabs: { id: ProfileTab; label: string }[] = [
    { id: "details", label: "Profile Details" },
    { id: "documents", label: "Verification & Docs" },
    { id: "emergency", label: role === "rider" ? "Emergency Relays" : "Vehicle Specs" },
    { id: "preferences", label: role === "rider" ? "Comfort Presets" : "Account Settings" },
  ];

  return (
    <main className="relative min-h-screen bg-zinc-50 text-zinc-900 antialiased pb-24 pt-28">
      {/* Subtle background visual grid */}
      <div className="absolute inset-0 premium-grid-fine opacity-[0.04] pointer-events-none" />
      <Navbar />

      <div className="max-w-[1200px] mx-auto px-6 sm:px-8 relative z-10 space-y-8">
        
        {/* Typographic Header */}
        <div className="space-y-1.5 pb-6 border-b border-zinc-200/60">
          <p className="text-[11px] font-mono font-bold tracking-[0.25em] text-zinc-400 uppercase leading-none">
            User Workspace
          </p>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tighter text-zinc-950 leading-tight">
            Account Profile
          </h1>
        </div>

        {/* Tab Controls Bar */}
        <div className="flex space-x-1.5 bg-zinc-900/5 p-1 rounded-full max-w-max">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-1.5 rounded-full text-[12px] font-bold transition-all duration-200 cursor-pointer ${
                activeTab === tab.id
                  ? "bg-white text-zinc-950 shadow-xs"
                  : "text-zinc-550 hover:text-zinc-950"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Profile Card Overview */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white border border-zinc-200/60 rounded-3xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.01)] text-center flex flex-col items-center space-y-5">
              <div className="w-18 h-18 rounded-full bg-zinc-900 border border-zinc-200 flex items-center justify-center text-white font-black text-xl shadow-md uppercase">
                {fullName.substring(0, 2)}
              </div>
              
              <div className="space-y-1">
                <h2 className="text-[15.5px] font-black text-zinc-950 tracking-tight">{fullName}</h2>
                <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block font-bold">
                  {role === "rider" ? "Premium Commuter" : "Verified Driver"}
                </span>
              </div>

              {/* Dynamic Status Pill */}
              <div className={`inline-flex items-center space-x-1.5 border px-3 py-1.5 rounded-full text-[11px] font-bold shadow-3xs ${
                role === "rider"
                  ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-600"
                  : verificationStatus === "Approved"
                  ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-600"
                  : verificationStatus === "Rejected"
                  ? "border-red-500/20 bg-red-500/10 text-red-600"
                  : "border-amber-500/20 bg-amber-500/10 text-amber-600"
              }`}>
                {role === "rider" || verificationStatus === "Approved" ? (
                  <>
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Compliance Verified</span>
                  </>
                ) : (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Verification: {verificationStatus}</span>
                  </>
                )}
              </div>

              <div className="h-[1px] bg-zinc-100 w-full" />

              {/* Account Quick Specs */}
              <div className="w-full text-left space-y-3 text-[11.5px] font-bold text-zinc-550">
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400">Default Payout</span>
                  <span className="text-zinc-900 font-extrabold font-mono">UPI / Instant</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400">Eco Commutes</span>
                  <span className="text-emerald-600 font-extrabold">Electric Green Badge</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400">Joined Shift</span>
                  <span className="text-zinc-900 font-extrabold">2026 Shift</span>
                </div>
              </div>
            </div>

            {/* Quick Demo approve trigger capsule for testing */}
            {role === "driver" && verificationStatus !== "Approved" && (
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4.5 text-xs text-amber-900">
                <p className="font-bold mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>Onboarding Compliance Demo</span>
                </p>
                <p className="text-[11px] leading-relaxed">
                  You can quickly approve this driver profile by opening the compliance portal.{" "}
                  <Link href="/admin" className="font-black text-amber-950 underline">Open Admin Panel ➔</Link>
                </p>
              </div>
            )}
          </div>

          {/* Right Column: Tab View Panels */}
          <div className="lg:col-span-8 bg-white border border-zinc-200/60 rounded-3xl p-6.5 sm:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.01)]">
            <AnimatePresence mode="wait">
              
              {/* TAB 1: Profile Details */}
              {activeTab === "details" && (
                <motion.div
                  key="details"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                >
                  <form onSubmit={handleSaveProfile} className="space-y-6">
                    <div className="space-y-4">
                      {/* Name */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Full Name</label>
                        <div className="bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 flex items-center space-x-2.5 focus-within:bg-white focus-within:border-zinc-450 transition-colors">
                          <User className="w-4 h-4 text-zinc-400" />
                          <input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="bg-transparent border-0 outline-0 p-0 text-sm text-zinc-800 focus:ring-0 font-bold w-full"
                          />
                        </div>
                      </div>

                      {/* Email */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Email Address</label>
                        <div className="bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 flex items-center space-x-2.5 focus-within:bg-white focus-within:border-zinc-450 transition-colors">
                          <Mail className="w-4 h-4 text-zinc-400" />
                          <input
                            type="email"
                            value={email}
                            disabled
                            className="bg-transparent border-0 outline-0 p-0 text-sm text-zinc-500 focus:ring-0 font-bold w-full cursor-not-allowed"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Phone */}
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Phone Number</label>
                          <div className="bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 flex items-center space-x-2.5 focus-within:bg-white focus-within:border-zinc-450 transition-colors">
                            <Phone className="w-4 h-4 text-zinc-400" />
                            <input
                              type="text"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              className="bg-transparent border-0 outline-0 p-0 text-sm text-zinc-800 focus:ring-0 font-bold w-full"
                            />
                          </div>
                        </div>

                        {/* Dob / Address */}
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                            {role === "rider" ? "Date of Birth" : "Operational Address"}
                          </label>
                          <div className="bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 flex items-center space-x-2.5 focus-within:bg-white focus-within:border-zinc-450 transition-colors">
                            {role === "rider" ? (
                              <input
                                type="text"
                                value={dob}
                                onChange={(e) => setDob(e.target.value)}
                                className="bg-transparent border-0 outline-0 p-0 text-sm text-zinc-800 focus:ring-0 font-bold w-full"
                              />
                            ) : (
                              <input
                                type="text"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                className="bg-transparent border-0 outline-0 p-0 text-sm text-zinc-800 focus:ring-0 font-bold w-full"
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-zinc-100">
                      <button
                        type="submit"
                        className="px-6 py-2.5 bg-zinc-950 hover:bg-zinc-850 active:scale-97 text-white font-bold text-xs rounded-full transition-all flex items-center space-x-1.5 shadow-sm"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        <span>Save Profile Details</span>
                      </button>

                      {isSavedAlert && (
                        <span className="text-[11px] font-mono text-emerald-600 font-bold uppercase flex items-center space-x-1">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                          <span>Saved successfully</span>
                        </span>
                      )}
                    </div>
                  </form>
                </motion.div>
              )}

              {/* TAB 2: Verification & Docs */}
              {activeTab === "documents" && (
                <motion.div
                  key="documents"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="space-y-6"
                >
                  <div className="pb-3 border-b border-zinc-100">
                    <h3 className="text-base font-black text-zinc-950">Compliance Documents</h3>
                    <p className="text-[12px] text-zinc-450 font-semibold mt-0.5">Badges representing verified identity and vehicle permits.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Aadhaar Badge */}
                    <div className="bg-zinc-50 border border-zinc-200/80 rounded-2xl p-4.5 flex items-center justify-between shadow-3xs">
                      <div className="flex items-center space-x-3.5">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 flex items-center justify-center">
                          <Check className="w-5 h-5 stroke-[2.5]" />
                        </div>
                        <div>
                          <h4 className="text-[12.5px] font-bold text-zinc-950 leading-none">Aadhaar Card</h4>
                          <span className="text-[9.5px] font-mono text-zinc-400 font-bold uppercase block mt-1">Verified via KYC</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-500/15 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                        ACTIVE
                      </span>
                    </div>

                    {/* Selfie Badge */}
                    <div className="bg-zinc-50 border border-zinc-200/80 rounded-2xl p-4.5 flex items-center justify-between shadow-3xs">
                      <div className="flex items-center space-x-3.5">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 flex items-center justify-center">
                          <Check className="w-5 h-5 stroke-[2.5]" />
                        </div>
                        <div>
                          <h4 className="text-[12.5px] font-bold text-zinc-950 leading-none">Live Selfie Scan</h4>
                          <span className="text-[9.5px] font-mono text-zinc-400 font-bold uppercase block mt-1">Photo Match Verified</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-500/15 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                        ACTIVE
                      </span>
                    </div>

                    {/* Driver specific badges */}
                    {role === "driver" && (
                      <>
                        <div className="bg-zinc-50 border border-zinc-200/80 rounded-2xl p-4.5 flex items-center justify-between shadow-3xs">
                          <div className="flex items-center space-x-3.5">
                            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 flex items-center justify-center">
                              <Check className="w-5 h-5 stroke-[2.5]" />
                            </div>
                            <div>
                              <h4 className="text-[12.5px] font-bold text-zinc-950 leading-none">Driving License</h4>
                              <span className="text-[9.5px] font-mono text-zinc-400 font-bold uppercase block mt-1">Class: LMV/Commercial</span>
                            </div>
                          </div>
                          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-500/15 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                            ACTIVE
                          </span>
                        </div>

                        <div className="bg-zinc-50 border border-zinc-200/80 rounded-2xl p-4.5 flex items-center justify-between shadow-3xs">
                          <div className="flex items-center space-x-3.5">
                            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 flex items-center justify-center">
                              <Check className="w-5 h-5 stroke-[2.5]" />
                            </div>
                            <div>
                              <h4 className="text-[12.5px] font-bold text-zinc-950 leading-none">RC Certificate</h4>
                              <span className="text-[9.5px] font-mono text-zinc-400 font-bold uppercase block mt-1">Vehicle Registration</span>
                            </div>
                          </div>
                          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-500/15 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                            ACTIVE
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </motion.div>
              )}

              {/* TAB 3: Emergency (Rider) / Vehicle specs (Driver) */}
              {activeTab === "emergency" && (
                <motion.div
                  key="emergency"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                >
                  {role === "rider" ? (
                    <form onSubmit={handleSaveProfile} className="space-y-6">
                      <div className="pb-2 border-b border-zinc-100">
                        <h3 className="text-base font-black text-zinc-950">Emergency Contact</h3>
                        <p className="text-[12px] text-zinc-450 font-semibold mt-0.5">Trips are shared automatically in critical situations.</p>
                      </div>

                      <div className="space-y-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Contact Name</label>
                          <div className="bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 flex items-center space-x-2.5 focus-within:bg-white focus-within:border-zinc-450 transition-colors">
                            <User className="w-4 h-4 text-zinc-400" />
                            <input
                              type="text"
                              value={emergencyName}
                              onChange={(e) => setEmergencyName(e.target.value)}
                              className="bg-transparent border-0 outline-0 p-0 text-sm text-zinc-800 focus:ring-0 font-bold w-full"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Relationship</label>
                            <div className="bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 flex items-center space-x-2.5 focus-within:bg-white focus-within:border-zinc-450 transition-colors">
                              <input
                                type="text"
                                value={emergencyRelation}
                                onChange={(e) => setEmergencyRelation(e.target.value)}
                                className="bg-transparent border-0 outline-0 p-0 text-sm text-zinc-800 focus:ring-0 font-bold w-full"
                              />
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Emergency Phone</label>
                            <div className="bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 flex items-center space-x-2.5 focus-within:bg-white focus-within:border-zinc-450 transition-colors">
                              <Phone className="w-4 h-4 text-zinc-400" />
                              <input
                                type="text"
                                value={emergencyPhone}
                                onChange={(e) => setEmergencyPhone(e.target.value)}
                                className="bg-transparent border-0 outline-0 p-0 text-sm text-zinc-800 focus:ring-0 font-bold w-full"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="px-6 py-2.5 bg-zinc-950 hover:bg-zinc-850 active:scale-97 text-white font-bold text-xs rounded-full transition-all shadow-sm"
                      >
                        Save Emergency Contact
                      </button>
                    </form>
                  ) : (
                    <form onSubmit={handleSaveProfile} className="space-y-6">
                      <div className="pb-2 border-b border-zinc-100">
                        <h3 className="text-base font-black text-zinc-950">Vehicle Information</h3>
                        <p className="text-[12px] text-zinc-450 font-semibold mt-0.5">Manage your registered commercial fleet vehicle details.</p>
                      </div>

                      <div className="space-y-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Vehicle Model</label>
                          <div className="bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 flex items-center focus-within:bg-white focus-within:border-zinc-450 transition-colors">
                            <input
                              type="text"
                              value={vehicleModel}
                              onChange={(e) => setVehicleModel(e.target.value)}
                              className="bg-transparent border-0 outline-0 p-0 text-sm text-zinc-800 focus:ring-0 font-bold w-full"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Vehicle Registration Number</label>
                            <div className="bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 flex items-center focus-within:bg-white focus-within:border-zinc-450 transition-colors">
                              <input
                                type="text"
                                value={vehicleNumber}
                                onChange={(e) => setVehicleNumber(e.target.value)}
                                className="bg-transparent border-0 outline-0 p-0 text-sm text-zinc-800 focus:ring-0 font-mono font-bold w-full"
                              />
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">License Number</label>
                            <div className="bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 flex items-center focus-within:bg-white focus-within:border-zinc-450 transition-colors">
                              <input
                                type="text"
                                value={licenseNumber}
                                onChange={(e) => setLicenseNumber(e.target.value)}
                                className="bg-transparent border-0 outline-0 p-0 text-sm text-zinc-800 focus:ring-0 font-mono font-bold w-full"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="px-6 py-2.5 bg-zinc-950 hover:bg-zinc-850 active:scale-97 text-white font-bold text-xs rounded-full transition-all shadow-sm"
                      >
                        Save Vehicle Specifications
                      </button>
                    </form>
                  )}
                </motion.div>
              )}

              {/* TAB 4: Comfort Presets (Rider) / Settings (Driver) */}
              {activeTab === "preferences" && (
                <motion.div
                  key="preferences"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                >
                  {role === "rider" ? (
                    <form onSubmit={handleSaveProfile} className="space-y-6">
                      <div className="pb-2 border-b border-zinc-100">
                        <h3 className="text-base font-black text-zinc-950">Comfort Preferences</h3>
                        <p className="text-[12px] text-zinc-450 font-semibold mt-0.5">Pre-trip parameters dispatched automatically to matched drivers.</p>
                      </div>

                      <div className="space-y-5">
                        {/* Quiet ride */}
                        <div className="border border-zinc-200 rounded-2xl p-4.5 flex items-center justify-between shadow-3xs bg-zinc-50/50">
                          <div className="flex items-center space-x-3.5">
                            <VolumeX className="w-4.5 h-4.5 text-zinc-550" />
                            <div>
                              <h4 className="text-[13px] font-extrabold text-zinc-900 leading-tight">Default Quiet Mode</h4>
                              <p className="text-[11px] text-zinc-400 font-semibold mt-0.5">Avoid friendly chat unless requested</p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setQuietRide(!quietRide)}
                            className={`w-11 h-6 rounded-full p-0.5 transition-colors duration-200 cursor-pointer ${
                              quietRide ? "bg-black" : "bg-zinc-250"
                            }`}
                          >
                            <div className={`w-5 h-5 rounded-full bg-white shadow transform transition-transform duration-200 ${
                              quietRide ? "translate-x-5" : "translate-x-0"
                            }`} />
                          </button>
                        </div>

                        {/* Climate */}
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">AC Preference</label>
                          <div className="grid grid-cols-3 gap-2">
                            {["AC", "Non-AC", "No Preference"].map((pref) => (
                              <button
                                type="button"
                                key={pref}
                                onClick={() => setAcPreference(pref)}
                                className={`py-2 px-3 border rounded-xl text-xs font-bold transition-all text-center cursor-pointer ${
                                  acPreference === pref
                                    ? "border-zinc-950 bg-zinc-950 text-white shadow-sm"
                                    : "border-zinc-200 bg-white text-zinc-650 hover:border-zinc-400"
                                }`}
                              >
                                {pref}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Language */}
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Language Preference</label>
                          <div className="grid grid-cols-3 gap-2">
                            {["English", "Hindi", "Kannada"].map((lang) => (
                              <button
                                type="button"
                                key={lang}
                                onClick={() => setLanguage(lang)}
                                className={`py-2 px-3 border rounded-xl text-xs font-bold transition-all text-center cursor-pointer ${
                                  language === lang
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

                      <button
                        type="submit"
                        className="px-6 py-2.5 bg-zinc-950 hover:bg-zinc-850 active:scale-97 text-white font-bold text-xs rounded-full transition-all shadow-sm"
                      >
                        Save Comfort Preferences
                      </button>
                    </form>
                  ) : (
                    <div className="space-y-6">
                      <div className="pb-2 border-b border-zinc-100">
                        <h3 className="text-base font-black text-zinc-950">Shift Settings</h3>
                        <p className="text-[12px] text-zinc-450 font-semibold mt-0.5">Configure compliance parameters and operational notifications.</p>
                      </div>

                      <div className="space-y-4">
                        <div className="border border-zinc-200 rounded-2xl p-4.5 flex items-center justify-between shadow-3xs bg-zinc-50/50">
                          <div className="space-y-0.5">
                            <h4 className="text-[13px] font-extrabold text-zinc-900">Shift Surge Dispatches</h4>
                            <p className="text-[11px] text-zinc-450 font-semibold leading-normal">
                              Prioritize high-surge passenger requests automatically.
                            </p>
                          </div>
                          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                            ACTIVE
                          </span>
                        </div>

                        <div className="border border-zinc-200 rounded-2xl p-4.5 flex items-center justify-between shadow-3xs bg-zinc-50/50">
                          <div className="space-y-0.5">
                            <h4 className="text-[13px] font-extrabold text-zinc-900">Aadhaar Shift Match</h4>
                            <p className="text-[11px] text-zinc-450 font-semibold leading-normal">
                              Require real-time live selfie verify prior to launching shift online.
                            </p>
                          </div>
                          <span className="text-[10px] font-bold text-zinc-500 bg-zinc-100 border border-zinc-250 px-2.5 py-1 rounded-full">
                            ENABLED
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

            </AnimatePresence>
          </div>

        </div>
      </div>
    </main>
  );
}
