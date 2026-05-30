"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { User, Phone, Mail, ShieldCheck, Check, MapPin, CreditCard, Plus } from "lucide-react";
import Footer from "@/components/Footer";

export default function ProfilePage() {
  const { user } = useUser();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("+91 98765 43210");
  const [email, setEmail] = useState("");
  const [isSavedAlert, setIsSavedAlert] = useState(false);

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setEmail(user.emailAddresses[0]?.emailAddress || "");
    }
  }, [user]);

  const triggerSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavedAlert(true);
    setTimeout(() => setIsSavedAlert(false), 2500);
  };

  const savedPlaces = [
    { label: "Home", address: "Sector 15, Part 2, Gurugram, Haryana" },
    { label: "Office", address: "Cyber Hub, DLF Cyber City, Gurugram" },
    { label: "College", address: "IIT Delhi, Hauz Khas, New Delhi" },
  ];

  const paymentMethods = [
    { type: "UPI", detail: "raman@upi", isDefault: true },
    { type: "Credit Card", detail: "Visa ending in 4242", isDefault: false },
    { type: "RYDR Wallet", detail: "Balance: ₹450.00", isDefault: false },
  ];

  const userInitials = (firstName && lastName) 
    ? `${firstName[0]}${lastName[0]}`.toUpperCase()
    : user?.firstName 
      ? user.firstName.slice(0, 2).toUpperCase()
      : "RY";

  return (
    <div className="min-h-screen bg-white text-zinc-900 flex flex-col pt-8 sm:pt-12">
      <main className="flex-1 max-w-2xl w-full mx-auto px-5 sm:px-6 space-y-10 pb-20">
        
        {/* Avatar + name section at top */}
        <div className="flex flex-col items-center text-center space-y-4 pt-4">
          <div className="w-20 h-20 rounded-full bg-zinc-900 border-2 border-zinc-200 flex items-center justify-center text-white font-extrabold text-2xl shadow-md">
            {userInitials}
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-extrabold text-zinc-900">
              {firstName} {lastName}
            </h1>
            <p className="text-zinc-500 text-xs sm:text-sm font-semibold uppercase tracking-wider">
              RYDR Rider Account
            </p>
          </div>
        </div>

        {/* Personal Details Form */}
        <div className="bg-white border border-zinc-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="space-y-1">
            <span className="eyebrow">Personal Details</span>
            <p className="text-zinc-500 text-xs font-semibold">Update your account information.</p>
          </div>

          <form onSubmit={triggerSave} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* First Name */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">First Name</label>
                <div className="bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 flex items-center gap-2.5 focus-within:bg-white focus-within:border-zinc-350 transition-all">
                  <User className="w-4 h-4 text-zinc-400 shrink-0" />
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    className="bg-transparent border-0 outline-0 p-0 text-sm text-zinc-800 font-semibold w-full focus:outline-none"
                  />
                </div>
              </div>

              {/* Last Name */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Last Name</label>
                <div className="bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 flex items-center gap-2.5 focus-within:bg-white focus-within:border-zinc-350 transition-all">
                  <User className="w-4 h-4 text-zinc-400 shrink-0" />
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    className="bg-transparent border-0 outline-0 p-0 text-sm text-zinc-800 font-semibold w-full focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Phone */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Phone Number</label>
                <div className="bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 flex items-center gap-2.5 focus-within:bg-white focus-within:border-zinc-350 transition-all">
                  <Phone className="w-4 h-4 text-zinc-400 shrink-0" />
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="bg-transparent border-0 outline-0 p-0 text-sm text-zinc-800 font-semibold w-full focus:outline-none"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Email Address</label>
                <div className="bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 flex items-center gap-2.5 focus-within:bg-white focus-within:border-zinc-350 transition-all">
                  <Mail className="w-4 h-4 text-zinc-400 shrink-0" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-transparent border-0 outline-0 p-0 text-sm text-zinc-800 font-semibold w-full focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="submit"
                className="px-5 py-3 bg-zinc-900 hover:bg-zinc-850 text-white font-semibold text-xs rounded-xl active:scale-[0.98] transition-all cursor-pointer flex items-center gap-2 shadow-sm"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Save Changes</span>
              </button>

              {isSavedAlert && (
                <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Profile updated</span>
                </span>
              )}
            </div>
          </form>
        </div>

        {/* Saved Places Section */}
        <div className="bg-white border border-zinc-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="eyebrow">Saved Places</span>
              <p className="text-zinc-500 text-xs font-semibold">Quick access in booking screens.</p>
            </div>
            <button className="h-8 w-8 rounded-lg bg-zinc-50 border border-zinc-200 flex items-center justify-center text-zinc-650 hover:bg-zinc-100 transition-colors shadow-3xs cursor-pointer">
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3">
            {savedPlaces.map((place, idx) => (
              <div 
                key={idx}
                className="bg-zinc-50 border border-zinc-200 p-4 rounded-xl flex items-center gap-3 shadow-3xs hover:border-zinc-300 transition-colors"
              >
                <div className="h-8 w-8 rounded-lg bg-white border border-zinc-200 flex items-center justify-center shrink-0 shadow-3xs text-zinc-500">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-zinc-900">{place.label}</span>
                  <p className="text-[11px] text-zinc-500 font-semibold block truncate leading-normal">{place.address}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Methods Section */}
        <div className="bg-white border border-zinc-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="eyebrow">Payment Methods</span>
              <p className="text-zinc-500 text-xs font-semibold">Manage your default cashless checkout details.</p>
            </div>
            <button className="h-8 w-8 rounded-lg bg-zinc-50 border border-zinc-200 flex items-center justify-center text-zinc-650 hover:bg-zinc-100 transition-colors shadow-3xs cursor-pointer">
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3">
            {paymentMethods.map((pay, idx) => (
              <div 
                key={idx}
                className="bg-zinc-50 border border-zinc-200 p-4 rounded-xl flex items-center justify-between shadow-3xs hover:border-zinc-300 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-white border border-zinc-200 flex items-center justify-center shrink-0 shadow-3xs text-zinc-500">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-zinc-900">{pay.type}</span>
                    <p className="text-[11px] text-zinc-500 font-semibold block leading-normal">{pay.detail}</p>
                  </div>
                </div>

                {pay.isDefault ? (
                  <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-3xs">
                    Primary
                  </span>
                ) : (
                  <button className="text-[9px] font-bold text-zinc-400 hover:text-zinc-600 bg-white border border-zinc-200 px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-3xs cursor-pointer">
                    Set Primary
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
