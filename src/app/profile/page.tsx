"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import RiderNavbar from "@/components/RiderNavbar";
import { riderProfile } from "@/lib/data";
import { User, Phone, Mail, ShieldCheck, Sparkles, Thermometer, VolumeX, CreditCard, Check, ChevronRight } from "lucide-react";

export default function ProfilePage() {
  // Local UI States prefilled with our data
  const [firstName, setFirstName] = useState("Aanya");
  const [lastName, setLastName] = useState("Sharma");
  const [phone, setPhone] = useState(riderProfile.phone);
  const [email, setEmail] = useState(riderProfile.email);
  const [defaultTemp, setDefaultTemp] = useState(22);
  const [defaultQuiet, setDefaultQuiet] = useState(true);
  const [paymentSelected, setPaymentSelected] = useState("applepay");
  const [isSavedAlert, setIsSavedAlert] = useState(false);

  const triggerSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavedAlert(true);
    setTimeout(() => setIsSavedAlert(false), 2500);
  };

  return (
    <main className="relative min-h-screen bg-[#F8F8F8] text-[#111111] antialiased pb-24 md:pb-12 pt-28">
      {/* Rider Navbar */}
      <RiderNavbar />

      <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column (4/12): User Profile Card Details */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-zinc-200 rounded-3xl p-6.5 shadow-3xs text-center flex flex-col items-center space-y-5">
            {/* Avatar circle */}
            <div className="w-20 h-20 rounded-full bg-zinc-900 border-2 border-zinc-200 flex items-center justify-center text-white font-black text-2xl shadow-md">
              AC
            </div>
            
            {/* Name, email, rating */}
            <div className="space-y-1">
              <h2 className="text-xl font-black text-zinc-900 tracking-tight">{firstName} {lastName}</h2>
              <span className="text-[10px] font-mono text-zinc-450 uppercase tracking-widest block font-bold">Rider Account</span>
            </div>

            {/* Rating badge */}
            <div className="inline-flex items-center space-x-2 bg-zinc-50 border border-zinc-200 px-3.5 py-1.5 rounded-xl shadow-3xs">
              <StarIcon className="w-4 h-4 text-amber-500 fill-amber-500 stroke-0" />
              <span className="text-sm font-black text-zinc-900">{riderProfile.rating} Rating</span>
            </div>

            <div className="h-[1px] bg-zinc-150 w-full" />

            {/* Detailed metadata */}
            <div className="w-full text-left space-y-3.5 text-xs font-semibold text-zinc-650">
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">Member Since</span>
                <span className="text-zinc-800 font-extrabold">{riderProfile.memberSince}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">Total Trips</span>
                <span className="text-zinc-800 font-extrabold">{riderProfile.totalRides} completed</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">Eco Commutes</span>
                <span className="text-emerald-600 font-extrabold">{riderProfile.ecoRides} EV runs</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (8/12): Personal Details, Cabin Preferences, Billing */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Main Account Settings Form */}
          <div className="bg-white border border-zinc-200 rounded-3xl p-6.5 md:p-8 shadow-3xs space-y-6">
            <div>
              <span className="text-[8px] font-mono font-bold text-zinc-450 uppercase tracking-widest block">Account Settings</span>
              <h3 className="text-lg font-black text-zinc-900 tracking-tight mt-0.5">Personal Details</h3>
            </div>

            <form onSubmit={triggerSave} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* First Name */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">First Name</label>
                  <div className="bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 flex items-center space-x-2.5 focus-within:bg-white focus-within:border-zinc-400 transition-colors">
                    <User className="w-4 h-4 text-zinc-450" />
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                      className="bg-transparent border-0 outline-0 p-0 text-sm text-zinc-800 focus:ring-0 font-extrabold w-full"
                    />
                  </div>
                </div>

                {/* Last Name */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Last Name</label>
                  <div className="bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 flex items-center space-x-2.5 focus-within:bg-white focus-within:border-zinc-400 transition-colors">
                    <User className="w-4 h-4 text-zinc-450" />
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                      className="bg-transparent border-0 outline-0 p-0 text-sm text-zinc-800 focus:ring-0 font-extrabold w-full"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Phone */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Phone Number</label>
                  <div className="bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 flex items-center space-x-2.5 focus-within:bg-white focus-within:border-zinc-400 transition-colors">
                    <Phone className="w-4 h-4 text-zinc-450" />
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      className="bg-transparent border-0 outline-0 p-0 text-sm text-zinc-800 focus:ring-0 font-extrabold w-full"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Email Address</label>
                  <div className="bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 flex items-center space-x-2.5 focus-within:bg-white focus-within:border-zinc-400 transition-colors">
                    <Mail className="w-4 h-4 text-zinc-455" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="bg-transparent border-0 outline-0 p-0 text-sm text-zinc-850 focus:ring-0 font-extrabold w-full"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="submit"
                  className="px-5 py-3 bg-black text-white hover:bg-zinc-800 font-bold text-xs rounded-xl cursor-pointer active:scale-97 transition-all shadow-3xs flex items-center space-x-1.5"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Save Profile Details</span>
                </button>

                <AnimatePresence>
                  {isSavedAlert && (
                    <motion.span
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-xs font-mono text-emerald-600 font-black uppercase flex items-center space-x-1"
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      <span>Changes Saved Successfully</span>
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </form>
          </div>

          {/* Cabin Preferences Settings */}
          <div className="bg-white border border-zinc-200 rounded-3xl p-6.5 md:p-8 shadow-3xs space-y-6">
            <div>
              <span className="text-[8px] font-mono font-bold text-zinc-450 uppercase tracking-widest block">Cabin Settings</span>
              <h3 className="text-lg font-black text-zinc-900 tracking-tight mt-0.5">Pre-Trip Preferences</h3>
            </div>

            <div className="space-y-6">
              {/* Climate pre-cooling slider */}
              <div className="border border-zinc-200 rounded-2xl p-5 shadow-3xs space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2.5">
                    <Thermometer className="w-4.5 h-4.5 text-amber-500" />
                    <span className="text-[13.5px] font-extrabold text-zinc-800">Pre-Trip Climate</span>
                  </div>
                  <span className="text-xs font-mono font-black text-zinc-900 bg-zinc-50 border border-zinc-250 px-2.5 py-0.5 rounded shadow-3xs">
                    {defaultTemp}°C Standard
                  </span>
                </div>
                
                <div className="space-y-2">
                  <input
                    type="range"
                    min="16"
                    max="26"
                    value={defaultTemp}
                    onChange={(e) => setDefaultTemp(Number(e.target.value))}
                    className="w-full h-1 bg-zinc-100 rounded-lg appearance-none cursor-pointer accent-black focus:outline-none"
                  />
                  <div className="flex justify-between text-[10px] font-mono font-bold text-zinc-400">
                    <span>16°C (Cool)</span>
                    <span className="text-zinc-500 font-sans">
                      {defaultTemp < 19 ? "Crisp AC Cabin" : defaultTemp > 23 ? "Warm & Cozy" : "Optimal Comfort"}
                    </span>
                    <span>26°C (Warm)</span>
                  </div>
                </div>
              </div>

              {/* Quiet Mode Default */}
              <div className="border border-zinc-200 rounded-2xl p-5 shadow-3xs flex items-center justify-between">
                <div className="flex items-center space-x-3.5">
                  <div className={`p-2.5 rounded-xl border transition-colors ${
                    defaultQuiet 
                      ? "bg-zinc-900 text-white border-zinc-900" 
                      : "bg-zinc-50 text-zinc-550 border-zinc-200"
                  }`}>
                    <VolumeX className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h4 className="text-[13px] font-extrabold text-zinc-900 leading-tight">Default Quiet Mode</h4>
                    <p className="text-[11px] text-zinc-500 mt-0.5 leading-normal max-w-sm font-semibold">
                      {defaultQuiet ? "Driver will avoid small talk unless spoken to first." : "Standard friendly greeting conversation."}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setDefaultQuiet(!defaultQuiet)}
                  className={`w-11 h-6 rounded-full p-0.5 transition-colors duration-200 ease-in-out focus:outline-none cursor-pointer ${
                    defaultQuiet ? "bg-black" : "bg-zinc-200"
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-200 ease-in-out ${
                    defaultQuiet ? "translate-x-5" : "translate-x-0"
                  }`} />
                </button>
              </div>
            </div>
          </div>

          {/* Cashless Wallets and Payments */}
          <div className="bg-white border border-zinc-200 rounded-3xl p-6.5 md:p-8 shadow-3xs space-y-6">
            <div>
              <span className="text-[8px] font-mono font-bold text-zinc-450 uppercase tracking-widest block">Wallet Manager</span>
              <h3 className="text-lg font-black text-zinc-900 tracking-tight mt-0.5">Payment Methods</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Apple Pay Card */}
              <div
                onClick={() => setPaymentSelected("applepay")}
                className={`p-4 border rounded-2xl cursor-pointer flex flex-col justify-between min-h-[110px] relative overflow-hidden transition-all shadow-3xs ${
                  paymentSelected === "applepay"
                    ? "border-black bg-zinc-50 shadow-2xs"
                    : "border-zinc-200 bg-white hover:border-zinc-350"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-7 h-7 rounded-lg bg-zinc-150 border border-zinc-250 flex items-center justify-center font-bold text-[9.5px]">
                      AP
                    </div>
                    <span className="text-[12.5px] font-extrabold text-zinc-800">Apple Pay</span>
                  </div>
                  {paymentSelected === "applepay" && (
                    <div className="w-4 h-4 rounded-full bg-black flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 text-white stroke-[3.5px]" />
                    </div>
                  )}
                </div>
                <div className="text-[10px] font-mono text-zinc-500 font-bold mt-auto leading-none">•••• 9840 • DEFAULT</div>
              </div>

              {/* Rydr Metal Dark card */}
              <div
                onClick={() => setPaymentSelected("metal")}
                className={`p-4 border rounded-2xl cursor-pointer flex flex-col justify-between min-h-[110px] relative overflow-hidden transition-all shadow-3xs ${
                  paymentSelected === "metal"
                    ? "border-black bg-zinc-950 text-white shadow-2xs"
                    : "border-zinc-200 bg-white hover:border-zinc-350 text-zinc-800"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-7 h-7 rounded-lg bg-zinc-900 border border-zinc-850 flex items-center justify-center font-black text-[9px] text-amber-500 shadow-3xs">
                      RM
                    </div>
                    <span className={`text-[12.5px] font-extrabold ${paymentSelected === "metal" ? "text-zinc-100" : "text-zinc-800"}`}>Rydr Metal</span>
                  </div>
                  {paymentSelected === "metal" && (
                    <div className="w-4 h-4 rounded-full bg-white flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 text-black stroke-[3.5px]" />
                    </div>
                  )}
                </div>
                <div className={`text-[10px] font-mono mt-auto leading-none ${paymentSelected === "metal" ? "text-zinc-400" : "text-zinc-500"} font-bold`}>
                  •••• 3205 • titanium card
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </main>
  );
}

// Minimal inline Star icon to bypass heavy imports
function StarIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={props.className}
      {...props}
    >
      <path
        fillRule="evenodd"
        d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
        clipRule="evenodd"
      />
    </svg>
  );
}
