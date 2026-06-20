"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getOnboardingState, updateRiderProfile, updateDriverProfile } from "@/actions/onboarding";
import { fetchUserRatingStats } from "@/actions/review";
import { getOrCreateWalletAction, addMoneyAction } from "@/actions/wallet";
import { fetchUserReferralStatsAction, applyReferralCodeAction } from "@/actions/referral";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import { User, Phone, Mail, ShieldCheck, Sparkles, Thermometer, VolumeX, CreditCard, Check, ChevronRight, Loader2, FileText, AlertTriangle, Briefcase, Plane, Activity, MapPin, Star, Copy, Plus, Gift, Share2, History } from "lucide-react";

type ProfileTab = "details" | "documents" | "wallet" | "referrals" | "emergency" | "preferences";

function ProfileSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start w-full animate-pulse">
      {/* Left Column Skeleton */}
      <div className="lg:col-span-4 space-y-6">
        <div className="bg-white border border-zinc-200/60 rounded-3xl p-6 text-center flex flex-col items-center space-y-5">
          <div className="w-18 h-18 rounded-full bg-zinc-200" />
          <div className="space-y-2 w-full flex flex-col items-center">
            <div className="h-4 bg-zinc-200 rounded w-1/2" />
            <div className="h-3 bg-zinc-200 rounded w-1/3" />
          </div>
          <div className="h-8 bg-zinc-200 rounded-full w-full" />
        </div>
        <div className="bg-white border border-zinc-200/60 rounded-3xl p-6 space-y-4">
          <div className="h-4 bg-zinc-200 rounded w-1/3" />
          <div className="space-y-3">
            <div className="h-3 bg-zinc-200 rounded w-full" />
            <div className="h-3 bg-zinc-200 rounded w-5/6" />
          </div>
        </div>
      </div>
      {/* Right Column Skeleton */}
      <div className="lg:col-span-8 bg-white border border-zinc-200/60 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="h-6 bg-zinc-200 rounded w-1/4" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-3 bg-zinc-200 rounded w-1/6" />
              <div className="h-10 bg-zinc-200 rounded-2xl w-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

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
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // ── Extended Feature States (Phases 1, 7, 9) ──
  const [ratingStats, setRatingStats] = useState<{ averageRating: number; totalRatings: number; recentReviews: any[] }>({
    averageRating: 5.0,
    totalRatings: 0,
    recentReviews: [],
  });
  
  const [wallet, setWallet] = useState<any>(null);
  const [topupAmount, setTopupAmount] = useState("500");
  const [topupLoading, setTopupLoading] = useState(false);
  
  const [referralStats, setReferralStats] = useState({
    referralCode: "",
    totalReferrals: 0,
    totalRewards: 0,
  });
  const [referralInput, setReferralInput] = useState("");
  const [referralLoading, setReferralLoading] = useState(false);
  const [referralMessage, setReferralMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

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
          setFullName(state.userName || "Passenger");
          setPhone(profile.phone || "");
          setEmail(state.userEmail || "rider@rydr.in");
          setDob(profile.dob || "");
          setEmergencyName(profile.emergencyName || "");
          setEmergencyRelation(profile.emergencyRelation || "");
          setEmergencyPhone(profile.emergencyPhone || "");
          setQuietRide(profile.quietRide);
          setAcPreference(profile.acPreference || "No Preference");
          setLanguage(profile.language || "English");
        } else if (state.role === "driver" && state.driverProfile) {
          const profile = state.driverProfile;
          setFullName(state.userName || "Driver Partner");
          setPhone(profile.phone || "");
          setEmail(state.userEmail || "driver@rydr.in");
          setAddress(profile.address || "");
          setVehicleModel(profile.vehicleModel || "");
          setVehicleNumber(profile.vehicleNumber || "");
          setLicenseNumber(profile.licenseNumber || "");
        }

        setVerificationStatus(state.driverProfile?.verificationStatus || "Pending");
        
        // Parallel data fetch for rating and wallet details
        const [ratings, walletData, refStats] = await Promise.all([
          fetchUserRatingStats(state.role as "rider" | "driver"),
          getOrCreateWalletAction(),
          fetchUserReferralStatsAction(),
        ]);

        setRatingStats(ratings);
        setWallet(walletData);
        setReferralStats(refStats);
      } catch (err) {
        console.error("Failed to load profile details:", err);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [router]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveError(null);
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
      } else {
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
      setTimeout(() => setIsSavedAlert(false), 3000);
    } catch (err) {
      console.error("Error saving profile details:", err);
      setSaveError("Failed to save. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleTopup = async (e: React.FormEvent) => {
    e.preventDefault();
    const amountVal = parseFloat(topupAmount);
    if (isNaN(amountVal) || amountVal <= 0) return;

    setTopupLoading(true);
    try {
      const res = await addMoneyAction(amountVal);
      if (res.success) {
        setWallet(res.wallet);
        setTopupAmount("500");
      }
    } catch (err) {
      console.error("Failed to add money:", err);
    } finally {
      setTopupLoading(false);
    }
  };

  const handleClaimReferral = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!referralInput.trim()) return;

    setReferralLoading(true);
    setReferralMessage(null);
    try {
      const res = await applyReferralCodeAction(referralInput.trim());
      if (res.success) {
        setReferralMessage({
          type: "success",
          text: `🎉 Referral code applied! ₹${res.reward} has been credited to your wallet.`,
        });
        setReferralInput("");
        // Reload wallet & referral stats
        const [walletData, refStats] = await Promise.all([
          getOrCreateWalletAction(),
          fetchUserReferralStatsAction(),
        ]);
        setWallet(walletData);
        setReferralStats(refStats);
      }
    } catch (err: any) {
      setReferralMessage({
        type: "error",
        text: err.message || "Failed to apply referral code.",
      });
    } finally {
      setReferralLoading(false);
    }
  };

  const handleCopyCode = () => {
    if (!referralStats.referralCode) return;
    navigator.clipboard.writeText(referralStats.referralCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const tabs: { id: ProfileTab; label: string }[] = [
    { id: "details", label: "Profile Details" },
    { id: "documents", label: "Verification & Docs" },
    { id: "wallet", label: "Wallet" },
    { id: "referrals", label: "Refer & Earn" },
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

        {/* Tab Controls Bar - horizontally scrollable on mobile */}
        <div className="overflow-x-auto -mx-2 px-2">
          <div className="flex items-center gap-1.5 bg-zinc-900/5 p-1 rounded-3xl w-max min-w-full sm:min-w-0">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-1.5 rounded-full text-[12px] font-bold transition-all duration-200 cursor-pointer whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-white text-zinc-950 shadow-xs"
                    : "text-zinc-550 hover:text-zinc-950"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <ProfileSkeleton />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Profile Card Overview */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white border border-zinc-200/60 rounded-3xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.01)] text-center flex flex-col items-center space-y-5">
              <div className="w-18 h-18 rounded-full bg-zinc-950 border border-zinc-200 flex items-center justify-center text-white font-black text-xl shadow-md uppercase relative">
                {fullName.substring(0, 2)}
                <div className="absolute -bottom-1 -right-1 bg-zinc-950 border border-white text-amber-500 p-1.5 rounded-full shadow-md flex items-center justify-center">
                  <Star className="w-3.5 h-3.5 fill-current" />
                </div>
              </div>
              
              <div className="space-y-1">
                <h2 className="text-[15.5px] font-black text-zinc-950 tracking-tight">{fullName}</h2>
                <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block font-bold">
                  {role === "rider" ? "Premium Commuter" : "Verified Driver"}
                </span>

                {/* rolling rating aggregates */}
                <div className="flex items-center justify-center space-x-1.5 pt-1.5">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500 shrink-0" />
                  <span className="text-xs font-black text-zinc-850">
                    {ratingStats.averageRating.toFixed(2)} ★
                  </span>
                  <span className="text-[10.5px] text-zinc-400 font-bold uppercase">
                    ({ratingStats.totalRatings} Reviews)
                  </span>
                </div>
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
                  <span className="text-zinc-400">Wallet Balance</span>
                  <span className="text-zinc-900 font-extrabold font-mono text-xs">
                    ₹{wallet?.balance?.toFixed(2) || "0.00"}
                  </span>
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
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4.5 text-xs text-amber-900 shadow-3xs">
                <p className="font-bold mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-600 animate-pulse shrink-0" />
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

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-4 border-t border-zinc-100">
                      <button
                        type="submit"
                        disabled={isSaving}
                        className="px-6 py-2.5 bg-zinc-950 hover:bg-zinc-850 active:scale-97 disabled:opacity-60 text-white font-bold text-xs rounded-full transition-all flex items-center space-x-1.5 shadow-sm cursor-pointer"
                      >
                        {isSaving ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Saving...</span>
                          </>
                        ) : (
                          <>
                            <ShieldCheck className="w-4 h-4" />
                            <span>Save Profile Details</span>
                          </>
                        )}
                      </button>

                      {isSavedAlert && (
                        <span className="text-[11px] font-mono text-emerald-600 font-bold uppercase flex items-center space-x-1">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                          <span>Saved successfully</span>
                        </span>
                      )}
                      {saveError && (
                        <span className="text-[11px] font-mono text-red-600 font-bold flex items-center space-x-1">
                          <span>{saveError}</span>
                        </span>
                      )}
                    </div>
                  </form>
                </motion.div>
              )}

              {/* TAB 2: Verification & Docs & Recent Reviews */}
              {activeTab === "documents" && (
                <motion.div
                  key="documents"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="space-y-8"
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

                  {/* Phase 1: Recent Reviews Section */}
                  <div className="pt-4">
                    <div className="pb-3 border-b border-zinc-100 mb-4">
                      <h3 className="text-base font-black text-zinc-950 flex items-center space-x-2">
                        <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                        <span>Recent Trip Feedback</span>
                      </h3>
                      <p className="text-[12px] text-zinc-450 font-semibold mt-0.5">Vetted ride ratings and commentary from your recent bookings.</p>
                    </div>

                    {ratingStats.recentReviews.length > 0 ? (
                      <div className="space-y-3.5">
                        {ratingStats.recentReviews.map((item) => (
                          <div key={item.id} className="border border-zinc-150 rounded-2xl p-4 bg-zinc-50/30 flex flex-col space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-1 text-amber-500">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-3.5 h-3.5 ${
                                      i < item.rating ? "fill-current" : "opacity-25"
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-[10px] font-mono font-bold text-zinc-400">
                                {new Date(item.createdAt).toLocaleDateString("en-IN", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                })}
                              </span>
                            </div>
                            <p className="text-[12.5px] text-zinc-700 italic">"{item.comment}"</p>
                            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                              📍 Route: {item.route}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 bg-zinc-50/50 rounded-2xl border border-zinc-200/50">
                        <Star className="w-8 h-8 text-zinc-300 mx-auto mb-2" />
                        <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">No ratings recorded yet</p>
                        <p className="text-[11px] text-zinc-400 font-semibold mt-1">Complete your first trip to unlock rolling reviews!</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* TAB 3: Interactive Wallet (Phase 7) */}
              {activeTab === "wallet" && (
                <motion.div
                  key="wallet"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="space-y-6"
                >
                  <div className="pb-3 border-b border-zinc-100 flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-black text-zinc-950">My Digital Wallet</h3>
                      <p className="text-[12px] text-zinc-450 font-semibold mt-0.5">Top up balances, claim referral bonuses, and track fare transactions.</p>
                    </div>
                    <CreditCard className="w-5 h-5 text-zinc-400" />
                  </div>

                  {/* Wallet Balance Board */}
                  <div className="bg-zinc-950 text-white rounded-3xl p-6.5 relative overflow-hidden shadow-md">
                    <div className="absolute top-0 right-0 w-36 h-36 bg-radial-gradient from-white/[0.08] to-transparent pointer-events-none rounded-full" />
                    
                    <span className="text-[10px] font-mono tracking-widest text-zinc-450 font-extrabold uppercase">Available Balance</span>
                    <h2 className="text-3xl sm:text-4xl font-black text-emerald-400 tracking-tight font-mono mt-1.5 mb-1">
                      ₹{wallet?.balance?.toFixed(2) || "0.00"}
                    </h2>
                    <p className="text-[10.5px] text-zinc-400 font-bold uppercase tracking-wider">INR Ledgers • Cashless Dispatches Enabled</p>
                  </div>

                  {/* Top-up Form */}
                  <form onSubmit={handleTopup} className="space-y-3.5 bg-zinc-50 border border-zinc-200/80 rounded-2xl p-5 shadow-3xs">
                    <h4 className="text-[13px] font-black text-zinc-900 flex items-center gap-1.5">
                      <Plus className="w-4 h-4 text-zinc-950" />
                      <span>Add Money to Wallet</span>
                    </h4>

                    <div className="flex gap-2">
                      <div className="bg-white border border-zinc-200 rounded-xl px-4 py-3 flex-1 flex items-center focus-within:border-zinc-400 transition-colors">
                        <span className="text-sm font-bold text-zinc-500 mr-1.5">₹</span>
                        <input
                          type="number"
                          placeholder="Enter load amount"
                          value={topupAmount}
                          onChange={(e) => setTopupAmount(e.target.value)}
                          className="bg-transparent border-0 outline-0 p-0 text-sm text-zinc-900 placeholder-zinc-400 focus:ring-0 font-bold w-full font-mono"
                        />
                      </div>
                      
                      <button
                        type="submit"
                        disabled={topupLoading}
                        className="px-6 py-3 bg-zinc-950 hover:bg-zinc-850 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-sm hover:shadow active:scale-97 transition-all flex items-center space-x-1.5 shrink-0 cursor-pointer"
                      >
                        {topupLoading ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <span>Load Funds</span>
                        )}
                      </button>
                    </div>

                    {/* Pre-fill Preset Buttons */}
                    <div className="flex gap-2">
                      {["100", "500", "1000"].map((preset) => (
                        <button
                          type="button"
                          key={preset}
                          onClick={() => setTopupAmount(preset)}
                          className={`py-1.5 px-3.5 border rounded-lg text-[11px] font-black tracking-wide font-mono cursor-pointer transition-all ${
                            topupAmount === preset
                              ? "bg-zinc-900 border-zinc-900 text-white"
                              : "bg-white border-zinc-200 text-zinc-650 hover:border-zinc-400"
                          }`}
                        >
                          +₹{preset}
                        </button>
                      ))}
                    </div>
                  </form>

                  {/* Transaction Ledger Table */}
                  <div className="space-y-3 pt-2">
                    <h4 className="text-[13px] font-black text-zinc-900 flex items-center gap-1.5 mb-2">
                      <History className="w-4 h-4 text-zinc-950" />
                      <span>Ledger Transactions</span>
                    </h4>

                    {wallet?.transactions && wallet.transactions.length > 0 ? (
                      <div className="border border-zinc-200 rounded-2xl overflow-hidden shadow-3xs max-h-[300px] overflow-y-auto">
                        <table className="w-full text-left text-xs divide-y divide-zinc-200">
                          <thead className="bg-zinc-50 text-zinc-400 font-bold uppercase tracking-wider text-[10px] sticky top-0">
                            <tr>
                              <th className="px-4 py-3">Type</th>
                              <th className="px-4 py-3">Date</th>
                              <th className="px-4 py-3">Details</th>
                              <th className="px-4 py-3 text-right">Amount</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-zinc-200 bg-white font-semibold">
                            {wallet.transactions.map((tx: any) => {
                              const isCredited = tx.amount > 0;
                              return (
                                <tr key={tx.id} className="hover:bg-zinc-50/40">
                                  <td className="px-4 py-3.5">
                                    <span className={`px-2 py-0.5 rounded text-[9.5px] font-bold tracking-wide uppercase ${
                                      tx.type === "TOPUP" 
                                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200/50"
                                        : tx.type === "REFERRAL_REWARD"
                                        ? "bg-purple-50 text-purple-700 border border-purple-200/50"
                                        : "bg-red-50 text-red-700 border border-red-200/50"
                                    }`}>
                                      {tx.type}
                                    </span>
                                  </td>
                                  <td className="px-4 py-3.5 text-zinc-450 font-mono text-[10.5px]">
                                    {new Date(tx.createdAt).toLocaleDateString("en-IN", {
                                      day: "numeric",
                                      month: "short",
                                    })}
                                  </td>
                                  <td className="px-4 py-3.5 text-zinc-700 truncate max-w-[150px]">{tx.description}</td>
                                  <td className={`px-4 py-3.5 text-right font-bold font-mono text-[12px] ${
                                    isCredited ? "text-emerald-600" : "text-red-600"
                                  }`}>
                                    {isCredited ? "+" : ""}₹{Math.abs(tx.amount).toFixed(2)}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="text-center py-6 border border-dashed border-zinc-200 rounded-2xl bg-zinc-50/20">
                        <History className="w-6 h-6 text-zinc-300 mx-auto mb-1.5" />
                        <p className="text-[11px] font-bold text-zinc-450 uppercase tracking-widest">No transactions log found</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* TAB 4: Referrals and Rewards (Phase 9) */}
              {activeTab === "referrals" && (
                <motion.div
                  key="referrals"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="space-y-6"
                >
                  <div className="pb-3 border-b border-zinc-100 flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-black text-zinc-950">Refer & Earn Rewards</h3>
                      <p className="text-[12px] text-zinc-450 font-semibold mt-0.5">Invite friends to RYDR. Both users receive wallet rewards on sign-up.</p>
                    </div>
                    <Gift className="w-5 h-5 text-zinc-400" />
                  </div>

                  {/* Referral Code Board */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Share Invitation Code Card */}
                    <div className="bg-zinc-50 border border-zinc-200 rounded-3xl p-5 flex flex-col justify-between shadow-3xs">
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">My Invitation Code</span>
                        <h3 className="text-lg font-black font-mono tracking-tight text-zinc-900 uppercase">
                          {referralStats.referralCode || "Generating invite..."}
                        </h3>
                        <p className="text-[10.5px] text-zinc-500 font-semibold leading-relaxed">
                          Share this invite code with friends. Once they enter it, you both receive ₹100 instantly!
                        </p>
                      </div>
                      
                      <button
                        type="button"
                        onClick={handleCopyCode}
                        className="mt-4 py-2.5 w-full bg-zinc-950 hover:bg-zinc-850 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center space-x-1.5 shadow-2xs hover:shadow cursor-pointer"
                      >
                        {copiedCode ? (
                          <>
                            <Check className="w-4 h-4 stroke-[3]" />
                            <span>Copied to Clipboard!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            <span>Copy Invitation Code</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Referral Metrics Stats */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-4 flex flex-col justify-center text-center shadow-3xs">
                        <span className="text-[9.5px] font-bold text-zinc-400 uppercase tracking-wider">Friends Joined</span>
                        <h2 className="text-2xl font-black text-zinc-900 mt-1">{referralStats.totalReferrals}</h2>
                        <span className="text-[9px] text-zinc-450 font-bold block mt-0.5">COMMUNITIES</span>
                      </div>
                      <div className="bg-emerald-50/50 border border-emerald-200 rounded-2xl p-4 flex flex-col justify-center text-center shadow-3xs">
                        <span className="text-[9.5px] font-bold text-emerald-700 uppercase tracking-wider">Earnings Earned</span>
                        <h2 className="text-2xl font-black text-emerald-600 font-mono mt-1">₹{referralStats.totalRewards}</h2>
                        <span className="text-[9px] text-emerald-500 font-bold block mt-0.5">CREDITED BALANCE</span>
                      </div>
                    </div>
                  </div>

                  {/* Claim Invitation Code Box */}
                  <form onSubmit={handleClaimReferral} className="bg-zinc-50 border border-zinc-200/80 rounded-2xl p-5 shadow-3xs space-y-3">
                    <div>
                      <h4 className="text-[13px] font-black text-zinc-900">Have an Invitation Code?</h4>
                      <p className="text-[11px] text-zinc-450 font-semibold mt-0.5">Claim ₹100 welcome reward immediately inside your wallet.</p>
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="e.g. RYDR-RAMAN-123"
                        value={referralInput}
                        onChange={(e) => setReferralInput(e.target.value)}
                        className="bg-white border border-zinc-200 rounded-xl px-4 py-3 text-sm text-zinc-800 placeholder-zinc-400 focus:ring-0 font-bold w-full uppercase font-mono"
                      />
                      
                      <button
                        type="submit"
                        disabled={referralLoading || !referralInput.trim()}
                        className="px-6 py-3 bg-zinc-950 hover:bg-zinc-850 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-sm active:scale-97 transition-all flex items-center space-x-1.5 shrink-0 cursor-pointer"
                      >
                        {referralLoading ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <span>Claim Reward</span>
                        )}
                      </button>
                    </div>

                    {/* Alert Message for claim feedbacks */}
                    {referralMessage && (
                      <div className={`p-3 rounded-xl border text-[11.5px] font-bold leading-normal flex items-start space-x-2 animate-fade-in ${
                        referralMessage.type === "success" 
                          ? "bg-emerald-50/50 border-emerald-200 text-emerald-800" 
                          : "bg-red-50/50 border-red-200 text-red-800"
                      }`}>
                        <div className={`w-1.5 h-1.5 rounded-full shrink-0 mt-1.5 ${
                          referralMessage.type === "success" ? "bg-emerald-500" : "bg-red-500"
                        }`} />
                        <span>{referralMessage.text}</span>
                      </div>
                    )}
                  </form>
                </motion.div>
              )}

              {/* TAB 5: Emergency (Rider) / Vehicle specs (Driver) */}
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
                        className="px-6 py-2.5 bg-zinc-950 hover:bg-zinc-850 active:scale-97 text-white font-bold text-xs rounded-full transition-all shadow-sm cursor-pointer"
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
                        className="px-6 py-2.5 bg-zinc-950 hover:bg-zinc-850 active:scale-97 text-white font-bold text-xs rounded-full transition-all shadow-sm cursor-pointer"
                      >
                        Save Vehicle Specifications
                      </button>
                    </form>
                  )}
                </motion.div>
              )}

              {/* TAB 6: Comfort Presets (Rider) / Settings (Driver) */}
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
                              <p className="text-[11px] text-zinc-450 font-semibold mt-0.5">Avoid friendly chat unless requested</p>
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
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
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
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
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
                        className="px-6 py-2.5 bg-zinc-950 hover:bg-zinc-850 active:scale-97 text-white font-bold text-xs rounded-full transition-all shadow-sm cursor-pointer"
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
      )}
      </div>
    </main>
  );
}
