"use client";

import { motion, type Variants } from "framer-motion";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  MapPin,
  Users,
  ShieldCheck,
  Zap,
  Heart,
  ArrowRight,
  CheckCircle2,
  Star,
} from "lucide-react";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" as const } },
};

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

export default function AboutPage() {
  const stats = [
    { value: "1.2M+", label: "Rides Completed" },
    { value: "12,000+", label: "Verified Drivers" },
    { value: "11", label: "Cities Covered" },
    { value: "4.9 ★", label: "Average Rating" },
  ];

  const cities = [
    "Delhi NCR",
    "Gurugram",
    "Noida",
    "Ghaziabad",
    "Faridabad",
    "Bengaluru",
    "Hyderabad",
    "Jaipur",
    "Chandigarh",
    "Jind",
    "Karnal",
  ];

  const values = [
    {
      icon: ShieldCheck,
      title: "Safety first, always.",
      description:
        "Every driver on Rydr goes through a three-step verification process — criminal background check, vehicle inspection, and a live identity match before their first ride.",
      accent: "text-blue-600",
      bg: "bg-blue-50/60 border-blue-100",
    },
    {
      icon: Heart,
      title: "Respect on the road.",
      description:
        "We train every driver on respectful behavior, zero tolerance for harassment, and courteous communication. Your ride, your comfort — no compromises.",
      accent: "text-rose-600",
      bg: "bg-rose-50/60 border-rose-100",
    },
    {
      icon: Zap,
      title: "Upfront pricing. No surprises.",
      description:
        "The fare you see when you book is the fare you pay. No surge ambushes, no hidden fees. We believe honesty builds trust — and trust brings you back.",
      accent: "text-amber-600",
      bg: "bg-amber-50/60 border-amber-100",
    },
    {
      icon: Users,
      title: "Built for real India.",
      description:
        "From Connaught Place to Cyber City, Noida Sector 18 to Bengaluru's Koramangala — Rydr was designed for the pace and energy of Indian urban life.",
      accent: "text-emerald-600",
      bg: "bg-emerald-50/60 border-emerald-100",
    },
  ];

  const promises = [
    "Arrive in under 7 minutes on average",
    "Drivers verified with Aadhaar and PAN",
    "Trip shared automatically with your emergency contact",
    "24/7 in-app support in Hindi and English",
    "Air-conditioned, clean vehicles only",
    "Zero cash required — pay via UPI, card, or wallet",
  ];

  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Daily commuter, Gurugram",
      quote:
        "I take Rydr every morning from Sector 56 to Cyber City. The drivers are always professional and the cars are clean. It's become part of my routine.",
      rating: 5,
    },
    {
      name: "Arjun Mehta",
      role: "IT Professional, Noida",
      quote:
        "I was nervous about late-night rides after 11 PM, but Rydr's safety features gave me peace of mind. My family can see exactly where I am.",
      rating: 5,
    },
    {
      name: "Sneha Reddy",
      role: "Student, Bengaluru",
      quote:
        "Booking is so fast. I enter my destination, choose Economy, and the driver is usually there in 5 minutes. The fare is always what I expect.",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-white pt-28 pb-20 md:pt-36 md:pb-28">
        {/* subtle background grid */}
        <div className="absolute inset-0 premium-grid-fine pointer-events-none opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-5 sm:px-6 text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="space-y-6"
          >
            <motion.span
              variants={fadeUp}
              className="inline-block text-[10px] font-mono font-bold tracking-widest text-amber-600 uppercase"
            >
              Our Story
            </motion.span>

            <motion.h1
              variants={fadeUp}
              className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter text-zinc-900 leading-[1.05]"
            >
              We started because getting
              <br className="hidden sm:block" /> a ride should be{" "}
              <span className="relative inline-block">
                simple.
                <span className="absolute -bottom-1 left-0 w-full h-[3px] bg-amber-400 rounded-full" />
              </span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="text-base sm:text-lg text-zinc-500 font-semibold max-w-2xl mx-auto leading-relaxed"
            >
              Rydr was built in India, for India. We know what it's like to wait 20
              minutes in the summer heat, or to feel uncertain in a cab late at night.
              We built something better.
            </motion.p>

            <motion.div variants={fadeUp}>
              <Link
                href="/rider"
                className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white text-sm font-bold rounded-xl hover:bg-zinc-800 transition-colors"
              >
                Book a Ride <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── City Aerial Photo ── */}
      <section className="w-full overflow-hidden max-h-[420px] sm:max-h-[520px]">
        <img
          src="/images/india_cityscape.png"
          alt="Gurugram skyline at golden hour"
          className="w-full h-[320px] sm:h-[420px] md:h-[520px] object-cover object-center"
        />
      </section>

      {/* ── Stats Bar ── */}
      <section className="bg-[#111111] border-y border-zinc-900 py-12">
        <div className="max-w-5xl mx-auto px-5 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((s, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="text-center space-y-1"
              >
                <div className="text-3xl sm:text-4xl font-black text-white tracking-tighter">
                  {s.value}
                </div>
                <div className="text-xs text-zinc-400 font-semibold uppercase tracking-wide">
                  {s.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Our Story ── */}
      <section className="bg-white py-20 md:py-28">
        <div className="max-w-5xl mx-auto px-5 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={stagger}
              className="space-y-6 order-2 lg:order-1"
            >
              <motion.span
                variants={fadeUp}
                className="text-[10px] font-mono font-bold tracking-widest text-amber-600 uppercase"
              >
                How It Started
              </motion.span>
              <motion.h2
                variants={fadeUp}
                className="text-3xl sm:text-4xl font-black tracking-tighter text-zinc-900 leading-tight"
              >
                From one bad cab ride to a platform 1.2 million people trust.
              </motion.h2>
              <motion.div variants={fadeUp} className="space-y-4 text-zinc-600 text-sm leading-relaxed font-semibold">
                <p>
                  In 2022, our founder Vikram Malhotra missed a flight from IGI
                  Airport because his cab driver took a wrong route and ignored the
                  correction. A ₹4,500 flight. Gone. That moment turned into a
                  mission.
                </p>
                <p>
                  We built Rydr from Gurugram — a city where the gap between a
                  premium address and a reliable ride felt absurd. Our first 50
                  drivers were recruited personally. Every one of them went through a
                  face-to-face interview, a background check, and a test drive.
                </p>
                <p>
                  Today we serve 11 cities, over 1.2 million completed rides, and
                  thousands of drivers earning a stable, dignified income. We're still
                  personally invested in every single ride.
                </p>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative order-1 lg:order-2"
            >
              <div className="rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="/images/about_team.png"
                  alt="Rydr team working in Gurugram office"
                  className="w-full h-72 sm:h-96 object-cover"
                />
              </div>
              {/* floating badge */}
              <div className="absolute -bottom-5 -left-5 bg-white border border-zinc-200 rounded-2xl px-4 py-3 shadow-xl flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-amber-700" />
                </div>
                <div>
                  <div className="text-xs font-black text-zinc-900">Gurugram HQ</div>
                  <div className="text-[10px] text-zinc-400 font-semibold">
                    Sector 44, Haryana
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Mission ── */}
      <section className="bg-[#F8F8F8] border-t border-zinc-200 py-20 md:py-28">
        <div className="max-w-5xl mx-auto px-5 sm:px-6 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="space-y-5 max-w-3xl mx-auto"
          >
            <motion.span
              variants={fadeUp}
              className="text-[10px] font-mono font-bold tracking-widest text-amber-600 uppercase"
            >
              Our Mission
            </motion.span>
            <motion.h2
              variants={fadeUp}
              className="text-3xl sm:text-4xl font-black tracking-tighter text-zinc-900 leading-tight"
            >
              Make every journey feel safe, comfortable, and completely worth it.
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="text-zinc-500 text-sm sm:text-base font-semibold leading-relaxed"
            >
              We don't just connect riders with drivers. We set a standard for how
              urban mobility should feel — human, reliable, and respectful. Whether
              it's a 3-minute ride to the metro or a 2-hour airport run at midnight,
              the experience should never feel uncertain.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ── Values ── */}
      <section className="bg-white py-20 md:py-28">
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
              className="text-[10px] font-mono font-bold tracking-widest text-amber-600 uppercase"
            >
              What We Stand For
            </motion.span>
            <motion.h2
              variants={fadeUp}
              className="text-3xl sm:text-4xl font-black tracking-tighter text-zinc-900 leading-tight"
            >
              The principles that guide every ride.
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={stagger}
            className="grid grid-cols-1 sm:grid-cols-2 gap-5"
          >
            {values.map((v, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className={`border rounded-2xl p-6 sm:p-7 space-y-3 hover:shadow-md transition-shadow ${v.bg}`}
              >
                <div
                  className={`w-10 h-10 rounded-xl bg-white border border-zinc-200 flex items-center justify-center shadow-sm ${v.accent}`}
                >
                  <v.icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-black text-zinc-900 tracking-tight">
                  {v.title}
                </h3>
                <p className="text-sm text-zinc-600 leading-relaxed font-semibold">
                  {v.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Coverage ── */}
      <section className="bg-[#111111] py-20 md:py-28">
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
              className="text-[10px] font-mono font-bold tracking-widest text-amber-500 uppercase"
            >
              Where We Operate
            </motion.span>
            <motion.h2
              variants={fadeUp}
              className="text-3xl sm:text-4xl font-black tracking-tighter text-white leading-tight"
            >
              11 cities. Hundreds of neighbourhoods. One standard.
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="text-zinc-400 font-semibold text-sm max-w-xl mx-auto leading-relaxed"
            >
              Rydr is live across the Delhi NCR belt, Haryana, and Bengaluru — with
              more cities rolling out through 2025.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="flex flex-wrap justify-center gap-3"
          >
            {cities.map((city, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="flex items-center gap-1.5 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-full hover:border-zinc-700 transition-colors"
              >
                <MapPin className="w-3 h-3 text-amber-500 shrink-0" />
                <span className="text-[13px] text-zinc-200 font-semibold">{city}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Our Drivers ── */}
      <section className="bg-white py-20 md:py-28">
        <div className="max-w-5xl mx-auto px-5 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="/images/driver_profile.png"
                  alt="Professional Rydr driver at Cyber Hub, Gurugram"
                  className="w-full h-72 sm:h-[400px] object-cover"
                />
              </div>
              <div className="absolute -bottom-5 -right-5 bg-white border border-zinc-200 rounded-2xl px-4 py-3 shadow-xl">
                <div className="flex items-center gap-2.5">
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map(s => (
                      <Star key={s} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <div className="text-xs font-black text-zinc-900">4.98 avg rating</div>
                </div>
                <div className="text-[10px] text-zinc-400 font-semibold mt-0.5">
                  Across 12,000+ drivers
                </div>
              </div>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={stagger}
              className="space-y-6"
            >
              <motion.span
                variants={fadeUp}
                className="text-[10px] font-mono font-bold tracking-widest text-amber-600 uppercase"
              >
                Our Drivers
              </motion.span>
              <motion.h2
                variants={fadeUp}
                className="text-3xl sm:text-4xl font-black tracking-tighter text-zinc-900 leading-tight"
              >
                The people who make it happen.
              </motion.h2>
              <motion.p
                variants={fadeUp}
                className="text-zinc-500 text-sm leading-relaxed font-semibold"
              >
                Our drivers aren't just names on a screen. They're professionals who've
                met our standards, completed our training, and committed to delivering a
                ride you can trust.
              </motion.p>

              <motion.div variants={stagger} className="space-y-3">
                {[
                  "Aadhaar-verified identity before first trip",
                  "Vehicle inspected for safety and cleanliness",
                  "Completion of our 2-hour driver orientation",
                  "Continuous rating monitoring — below 4.5 triggers review",
                  "Access to earnings, trip history, and support 24/7",
                ].map((point, i) => (
                  <motion.div
                    key={i}
                    variants={fadeUp}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <span className="text-sm text-zinc-700 font-semibold">{point}</span>
                  </motion.div>
                ))}
              </motion.div>

              <motion.div variants={fadeUp}>
                <Link
                  href="/driver"
                  className="inline-flex items-center gap-2 px-5 py-2.5 border border-zinc-900 text-zinc-900 text-sm font-bold rounded-xl hover:bg-zinc-900 hover:text-white transition-all"
                >
                  Become a Rydr Driver <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Service Promise ── */}
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
              className="text-[10px] font-mono font-bold tracking-widest text-amber-600 uppercase"
            >
              Service Promise
            </motion.span>
            <motion.h2
              variants={fadeUp}
              className="text-3xl sm:text-4xl font-black tracking-tighter text-zinc-900 leading-tight"
            >
              What you can count on, every single time.
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {promises.map((promise, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="flex items-start gap-3 bg-white border border-zinc-200 rounded-xl p-4 hover:border-zinc-300 transition-colors"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                <span className="text-sm text-zinc-800 font-semibold leading-snug">{promise}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Testimonials ── */}
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
              className="text-[10px] font-mono font-bold tracking-widest text-amber-600 uppercase"
            >
              Real Riders
            </motion.span>
            <motion.h2
              variants={fadeUp}
              className="text-3xl sm:text-4xl font-black tracking-tighter text-zinc-900 leading-tight"
            >
              What people say about Rydr.
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-3 gap-5"
          >
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="bg-[#F8F8F8] border border-zinc-200 rounded-2xl p-6 space-y-4 hover:shadow-md transition-shadow"
              >
                <div className="flex gap-0.5">
                  {[...Array(t.rating)].map((_, s) => (
                    <Star key={s} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-zinc-700 leading-relaxed font-semibold italic">
                  "{t.quote}"
                </p>
                <div className="border-t border-zinc-200 pt-3">
                  <div className="text-xs font-black text-zinc-900">{t.name}</div>
                  <div className="text-[10px] text-zinc-400 font-semibold mt-0.5">
                    {t.role}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-[#111111] py-20 md:py-28">
        <div className="max-w-3xl mx-auto px-5 sm:px-6 text-center space-y-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-black tracking-tighter text-white leading-tight"
          >
            Ready to ride with us?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-zinc-400 text-sm font-semibold leading-relaxed"
          >
            Join over a million riders who've already discovered what a good ride
            feels like.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-3 justify-center"
          >
            <Link
              href="/rider"
              className="px-7 py-3 bg-white text-black text-sm font-bold rounded-xl hover:bg-zinc-100 transition-colors"
            >
              Book Your First Ride
            </Link>
            <Link
              href="/driver"
              className="px-7 py-3 border border-zinc-700 text-white text-sm font-bold rounded-xl hover:border-zinc-500 transition-colors"
            >
              Drive with Rydr
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
