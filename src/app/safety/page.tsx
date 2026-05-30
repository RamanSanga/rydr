"use client";

import { useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  ShieldCheck,
  PhoneCall,
  MapPin,
  Eye,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  ChevronDown,
  Clock,
  FileText,
  Lock,
  Fingerprint,
} from "lucide-react";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" as const } },
};

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

export default function SafetyPage() {
  const pillars = [
    {
      icon: Fingerprint,
      title: "Driver Verification",
      description:
        "Every driver passes Aadhaar identity verification, a criminal background check, and a vehicle safety inspection before they can accept a single ride. No exceptions.",
      accent: "text-blue-600",
      bg: "bg-blue-50/70 border-blue-100",
      iconBg: "bg-white border-blue-100",
    },
    {
      icon: MapPin,
      title: "Live Trip Tracking",
      description:
        "Your trip is tracked in real time from pickup to drop-off. Share your live location with family or friends directly from the app with one tap.",
      accent: "text-emerald-600",
      bg: "bg-emerald-50/70 border-emerald-100",
      iconBg: "bg-white border-emerald-100",
    },
    {
      icon: PhoneCall,
      title: "Emergency Assistance",
      description:
        "One tap on the SOS button connects you to our safety team immediately. We'll contact emergency services and alert your saved emergency contact simultaneously.",
      accent: "text-rose-600",
      bg: "bg-rose-50/70 border-rose-100",
      iconBg: "bg-white border-rose-100",
    },
    {
      icon: Eye,
      title: "Ride Monitoring",
      description:
        "Our system monitors every trip for unusual patterns — unplanned stops, route deviations, or extended delays. Any anomaly triggers an automatic safety check.",
      accent: "text-purple-600",
      bg: "bg-purple-50/70 border-purple-100",
      iconBg: "bg-white border-purple-100",
    },
    {
      icon: Lock,
      title: "Anonymous Calling",
      description:
        "When you call your driver through the app, your personal phone number is never shared. All calls go through our secure, anonymized relay system.",
      accent: "text-amber-600",
      bg: "bg-amber-50/70 border-amber-100",
      iconBg: "bg-white border-amber-100",
    },
    {
      icon: FileText,
      title: "Post-Trip Reports",
      description:
        "Every ride generates a complete trip record — route taken, time, driver details, fare. Stored securely. Available to you and to law enforcement if ever needed.",
      accent: "text-zinc-700",
      bg: "bg-zinc-50/70 border-zinc-200",
      iconBg: "bg-white border-zinc-200",
    },
  ];

  const driverStandards = [
    {
      step: "01",
      title: "Aadhaar + PAN Verification",
      detail: "Identity confirmed and linked to a verified government ID before account approval.",
    },
    {
      step: "02",
      title: "Criminal Background Check",
      detail: "National-level police verification conducted via a certified third-party agency.",
    },
    {
      step: "03",
      title: "Vehicle Inspection",
      detail: "Car must pass a 25-point safety checklist — tyres, lights, AC, seatbelts, and more.",
    },
    {
      step: "04",
      title: "Driver Orientation",
      detail: "2-hour in-person training covering route safety, respectful conduct, and emergency protocols.",
    },
    {
      step: "05",
      title: "Live Photo Match",
      detail: "Before every shift, drivers complete a real-time selfie verification to confirm they're the registered driver.",
    },
    {
      step: "06",
      title: "Ongoing Rating Review",
      detail: "Ratings below 4.5 trigger a mandatory review. Sustained poor behaviour leads to permanent deactivation.",
    },
  ];

  const nightSafety = [
    "Female passengers can opt for verified female drivers",
    "Emergency SOS button visible on every ride screen",
    "Automatic location share to saved emergency contact after 11 PM",
    "All late-night rides have a built-in check-in after 30 minutes",
    "Our safety team monitors active trips 24/7",
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-white pt-28 pb-20 md:pt-36 md:pb-28">
        <div className="absolute inset-0 premium-grid-fine pointer-events-none opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-5 sm:px-6 text-center space-y-6">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block text-[10px] font-mono font-bold tracking-widest text-blue-600 uppercase"
          >
            Your Safety
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter text-zinc-900 leading-[1.05]"
          >
            Every ride is designed
            <br className="hidden sm:block" /> to keep you{" "}
            <span className="text-blue-600">safe.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg text-zinc-500 font-semibold max-w-2xl mx-auto leading-relaxed"
          >
            Safety isn't a feature we added later. It's the reason Rydr was built.
            From driver screening to real-time monitoring, everything we do is to
            make sure you get home safe — every single time.
          </motion.p>
        </div>
      </section>

      {/* ── Safety Photo ── */}
      <section className="w-full overflow-hidden">
        <div className="relative">
          <img
            src="/images/safety_passenger.png"
            alt="Passenger tracking ride on Rydr app at night"
            className="w-full h-[320px] sm:h-[420px] md:h-[500px] object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          <div className="absolute bottom-6 left-0 right-0 flex justify-center">
            <div className="flex items-center gap-2 bg-white/95 backdrop-blur-md border border-zinc-200 rounded-2xl px-5 py-3 shadow-xl">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-black text-zinc-900">Live Trip Tracking Active</span>
              <ShieldCheck className="w-4 h-4 text-emerald-600 ml-1" />
            </div>
          </div>
        </div>
      </section>

      {/* ── Safety Pillars ── */}
      <section className="bg-[#F8F8F8] border-t border-zinc-200 py-20 md:py-28">
        <div className="max-w-5xl mx-auto px-5 sm:px-6 space-y-12">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center space-y-4"
          >
            <motion.span
              variants={fadeUp}
              className="text-[10px] font-mono font-bold tracking-widest text-blue-600 uppercase"
            >
              Built-In Safety
            </motion.span>
            <motion.h2
              variants={fadeUp}
              className="text-3xl sm:text-4xl font-black tracking-tighter text-zinc-900 leading-tight"
            >
              Six layers of protection on every trip.
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="text-zinc-500 text-sm font-semibold max-w-xl mx-auto leading-relaxed"
            >
              We don't rely on a single safeguard. Safety at Rydr is layered — each
              feature backs up the others.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={stagger}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {pillars.map((p, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className={`border rounded-2xl p-6 space-y-4 hover:shadow-md transition-shadow ${p.bg}`}
              >
                <div
                  className={`w-10 h-10 rounded-xl border flex items-center justify-center shadow-sm ${p.iconBg} ${p.accent}`}
                >
                  <p.icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-black text-zinc-900 tracking-tight">
                  {p.title}
                </h3>
                <p className="text-sm text-zinc-600 leading-relaxed font-semibold">
                  {p.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Driver Verification Process ── */}
      <section className="bg-white py-20 md:py-28">
        <div className="max-w-5xl mx-auto px-5 sm:px-6 space-y-12">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="space-y-4"
          >
            <motion.span
              variants={fadeUp}
              className="text-[10px] font-mono font-bold tracking-widest text-blue-600 uppercase"
            >
              Driver Standards
            </motion.span>
            <motion.h2
              variants={fadeUp}
              className="text-3xl sm:text-4xl font-black tracking-tighter text-zinc-900 leading-tight max-w-xl"
            >
              What every Rydr driver must pass before their first trip.
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="text-zinc-500 text-sm font-semibold leading-relaxed max-w-2xl"
            >
              Our onboarding process is intentionally rigorous. Not every applicant
              makes it through — and that's exactly the point.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={stagger}
            className="space-y-4"
          >
            {driverStandards.map((s, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="flex gap-5 items-start bg-[#F8F8F8] border border-zinc-200 rounded-xl p-5 hover:border-zinc-300 transition-colors"
              >
                <span className="text-2xl font-black text-zinc-300 font-mono shrink-0 leading-none mt-0.5">
                  {s.step}
                </span>
                <div className="space-y-1">
                  <h4 className="text-sm font-black text-zinc-900">{s.title}</h4>
                  <p className="text-sm text-zinc-500 font-semibold leading-relaxed">{s.detail}</p>
                </div>
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 ml-auto mt-0.5" />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Night Safety ── */}
      <section className="bg-[#111111] py-20 md:py-28">
        <div className="max-w-5xl mx-auto px-5 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
              className="space-y-6"
            >
              <motion.span
                variants={fadeUp}
                className="text-[10px] font-mono font-bold tracking-widest text-blue-400 uppercase"
              >
                After Dark
              </motion.span>
              <motion.h2
                variants={fadeUp}
                className="text-3xl sm:text-4xl font-black tracking-tighter text-white leading-tight"
              >
                Late nights deserve extra care.
              </motion.h2>
              <motion.p
                variants={fadeUp}
                className="text-zinc-400 text-sm font-semibold leading-relaxed"
              >
                We know that trust matters most when the streets are quiet and the city
                is dark. These are the extra protections we have in place specifically
                for late-night trips.
              </motion.p>

              <motion.div variants={stagger} className="space-y-3">
                {nightSafety.map((item, i) => (
                  <motion.div
                    key={i}
                    variants={fadeUp}
                    className="flex items-start gap-3"
                  >
                    <ShieldCheck className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                    <span className="text-sm text-zinc-300 font-semibold">{item}</span>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* SOS Visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex justify-center lg:justify-end"
            >
              <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 sm:p-10 w-full max-w-sm space-y-6">
                <div className="text-center space-y-2">
                  <div className="text-xs font-mono text-zinc-500 uppercase tracking-widest">
                    Emergency SOS
                  </div>
                  <div className="text-zinc-300 text-sm font-semibold">
                    Tap and hold for 3 seconds
                  </div>
                </div>

                {/* SOS Button */}
                <div className="flex justify-center">
                  <div className="relative w-32 h-32">
                    <div className="absolute inset-0 rounded-full bg-rose-600/20 animate-ping" />
                    <div className="absolute inset-2 rounded-full bg-rose-600/30 animate-pulse" />
                    <button
                      className="relative w-32 h-32 rounded-full bg-rose-600 hover:bg-rose-500 transition-colors flex items-center justify-center shadow-2xl border-4 border-rose-400/30 cursor-pointer"
                      aria-label="Emergency SOS Button"
                    >
                      <span className="text-white text-2xl font-black tracking-tighter">SOS</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 bg-zinc-800/60 rounded-xl p-3">
                    <PhoneCall className="w-4 h-4 text-blue-400 shrink-0" />
                    <span className="text-xs text-zinc-300 font-semibold">
                      Connects to Rydr Safety Team
                    </span>
                  </div>
                  <div className="flex items-center gap-3 bg-zinc-800/60 rounded-xl p-3">
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                    <span className="text-xs text-zinc-300 font-semibold">
                      Alerts your emergency contact
                    </span>
                  </div>
                  <div className="flex items-center gap-3 bg-zinc-800/60 rounded-xl p-3">
                    <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="text-xs text-zinc-300 font-semibold">
                      Shares live location with police
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Safety Standards ── */}
      <section className="bg-white border-t border-zinc-200 py-20 md:py-28">
        <div className="max-w-5xl mx-auto px-5 sm:px-6 space-y-12">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center space-y-4"
          >
            <motion.span
              variants={fadeUp}
              className="text-[10px] font-mono font-bold tracking-widest text-blue-600 uppercase"
            >
              Our Standards
            </motion.span>
            <motion.h2
              variants={fadeUp}
              className="text-3xl sm:text-4xl font-black tracking-tighter text-zinc-900 leading-tight"
            >
              Safety numbers that speak for themselves.
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-2 md:grid-cols-4 gap-5"
          >
            {[
              { number: "100%", label: "Drivers Aadhaar verified", icon: Fingerprint, color: "text-blue-600" },
              { number: "<4 min", label: "Average SOS response time", icon: Clock, color: "text-rose-600" },
              { number: "1.2M+", label: "Safe trips completed", icon: ShieldCheck, color: "text-emerald-600" },
              { number: "24/7", label: "Safety team on standby", icon: Eye, color: "text-purple-600" },
            ].map((m, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="bg-[#F8F8F8] border border-zinc-200 rounded-2xl p-5 text-center space-y-3 hover:shadow-md transition-shadow"
              >
                <m.icon className={`w-5 h-5 mx-auto ${m.color}`} />
                <div className="text-2xl sm:text-3xl font-black text-zinc-900 tracking-tighter">
                  {m.number}
                </div>
                <div className="text-xs text-zinc-500 font-semibold leading-tight">{m.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-[#F8F8F8] border-t border-zinc-200 py-16 md:py-20">
        <div className="max-w-3xl mx-auto px-5 sm:px-6 text-center space-y-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl sm:text-3xl font-black tracking-tighter text-zinc-900 leading-tight"
          >
            Have a safety concern? We're here.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-zinc-500 text-sm font-semibold"
          >
            Report an incident, share feedback, or contact our safety team directly.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-3 justify-center"
          >
            <Link
              href="/help"
              className="px-6 py-3 bg-black text-white text-sm font-bold rounded-xl hover:bg-zinc-800 transition-colors inline-flex items-center justify-center gap-2"
            >
              Contact Safety Team <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/rider"
              className="px-6 py-3 border border-zinc-300 text-zinc-900 text-sm font-bold rounded-xl hover:border-zinc-900 transition-colors inline-flex items-center justify-center gap-2"
            >
              Book a Safe Ride
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
