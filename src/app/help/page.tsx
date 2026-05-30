"use client";

import { useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  ChevronDown,
  MessageCircle,
  PhoneCall,
  Mail,
  Wallet,
  RotateCcw,
  Package,
  Car,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Clock,
  HelpCircle,
} from "lucide-react";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" as const } },
};

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09 } },
};

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQCategory {
  id: string;
  label: string;
  icon: React.ElementType;
  accent: string;
  questions: FAQItem[];
}

function FAQAccordion({ items }: { items: FAQItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div
          key={i}
          className={`border rounded-xl overflow-hidden transition-all duration-200 ${
            openIndex === i
              ? "border-zinc-300 shadow-sm"
              : "border-zinc-200 hover:border-zinc-300"
          }`}
        >
          <button
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className="w-full text-left px-5 py-4 flex items-start justify-between gap-4 bg-white cursor-pointer"
            aria-expanded={openIndex === i}
          >
            <span className="text-sm font-bold text-zinc-900 leading-snug">
              {item.question}
            </span>
            <ChevronDown
              className={`w-4 h-4 text-zinc-400 shrink-0 mt-0.5 transition-transform duration-200 ${
                openIndex === i ? "rotate-180" : ""
              }`}
            />
          </button>
          <AnimatePresence initial={false}>
            {openIndex === i && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
              >
                <div className="px-5 pb-5 text-sm text-zinc-600 leading-relaxed font-semibold border-t border-zinc-100 pt-4 bg-white">
                  {item.answer}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}

export default function HelpPage() {
  const [activeCategory, setActiveCategory] = useState("rides");

  const categories: FAQCategory[] = [
    {
      id: "rides",
      label: "Ride Issues",
      icon: Car,
      accent: "text-amber-600",
      questions: [
        {
          question: "My driver cancelled after I waited for 10 minutes. What happens now?",
          answer:
            "If a driver cancels after you've been waiting, you won't be charged any cancellation fee. The app will automatically find you another driver right away. If this happens repeatedly, please report it via the Help section so we can flag the driver.",
        },
        {
          question: "The driver took a different route and my fare increased. Can I dispute it?",
          answer:
            "With Rydr, your fare is fixed at the time of booking. Route changes do not affect your final price — you always pay what was quoted. If you were overcharged, contact us with your ride ID and we'll investigate and refund the difference within 24 hours.",
        },
        {
          question: "I booked a ride but the driver isn't moving. What should I do?",
          answer:
            "Tap 'Contact Driver' in the app to call or message them. If there's no response within 2 minutes, tap 'Cancel Ride' — you won't be charged. Alternatively, use the SOS button if you feel unsafe, and our team will take it from there.",
        },
        {
          question: "Can I book a ride for someone else?",
          answer:
            "Yes. During booking, tap 'Book for someone else' and enter their name and phone number. The driver will see the pickup name and you'll receive all trip updates. Great for booking rides for parents or guests.",
        },
        {
          question: "My ride was marked as 'Completed' but I never got in the car. What do I do?",
          answer:
            "This is a serious issue and we treat it with urgency. Contact our support team immediately with your ride ID. We'll pull the GPS data and trip logs, reverse any charges, and investigate the driver account.",
        },
      ],
    },
    {
      id: "payments",
      label: "Payments",
      icon: Wallet,
      accent: "text-blue-600",
      questions: [
        {
          question: "What payment methods does Rydr accept?",
          answer:
            "Rydr accepts UPI (PhonePe, Google Pay, Paytm), all major debit and credit cards (Visa, Mastercard, RuPay), net banking, and Rydr Wallet balance. We do not accept cash. All payments are fully cashless and automatic.",
        },
        {
          question: "Why was I charged twice for one ride?",
          answer:
            "This is almost always a temporary authorization hold, not a double charge. Banks sometimes show a pending hold before releasing it. Check again after 24 hours. If both charges settle, contact us with your ride ID and bank statement — we'll investigate and refund immediately.",
        },
        {
          question: "Can I split the fare with a friend?",
          answer:
            "Yes. After booking, tap 'Split Fare' and enter your friend's Rydr-registered mobile number. They'll receive a request and the amount splits automatically. Each person pays their own share via their preferred payment method.",
        },
        {
          question: "How does Rydr Wallet work?",
          answer:
            "Rydr Wallet is a prepaid balance you can top up anytime. Rides are deducted automatically from your wallet at checkout. It's the fastest payment method since there's no OTP or bank redirect. You can also use referral credits here.",
        },
        {
          question: "I paid but didn't receive a receipt. Where is it?",
          answer:
            "All receipts are sent to your registered email immediately after the ride. You can also find them under Rides > Trip History in the app. If your email didn't receive it, check your spam folder or update your email in profile settings.",
        },
      ],
    },
    {
      id: "refunds",
      label: "Refunds",
      icon: RotateCcw,
      accent: "text-emerald-600",
      questions: [
        {
          question: "How do I request a refund?",
          answer:
            "Go to Rides > select the trip > tap 'Report an Issue' > choose 'Refund Request'. Describe what happened and submit. Our team reviews all refund requests within 12 hours and processes valid refunds within 3-5 business days.",
        },
        {
          question: "I was charged a cancellation fee. Is it refundable?",
          answer:
            "Cancellation fees cover the driver's time and fuel after they've started moving toward you. If the driver was significantly late (more than 5 minutes past the estimated time), the cancellation fee is waived automatically. If you believe the fee was charged incorrectly, submit a dispute and we'll review it.",
        },
        {
          question: "How long does a refund take?",
          answer:
            "Refunds to UPI are instant once approved. Card refunds take 3-5 business days depending on your bank. Rydr Wallet refunds happen within 2 hours. You'll receive an email confirmation when the refund is processed.",
        },
        {
          question: "I cancelled my ride. Will I get a full refund?",
          answer:
            "If you cancel within 2 minutes of booking, you'll get a full refund with no cancellation fee. After 2 minutes, a fee may apply depending on how far the driver has travelled. The exact fee is shown before you confirm cancellation.",
        },
      ],
    },
    {
      id: "lost",
      label: "Lost Items",
      icon: Package,
      accent: "text-purple-600",
      questions: [
        {
          question: "I left something in the car. How do I get it back?",
          answer:
            "Go to your Rides > select the trip > tap 'Lost Item'. We'll attempt to contact your driver on your behalf. If the driver confirms they have the item, you can arrange a pickup directly. Rydr also coordinates returns for high-value items — gold, electronics, documents.",
        },
        {
          question: "My driver isn't responding about my lost item. What can I do?",
          answer:
            "Contact our support team directly with your ride ID and a description of the item. We'll escalate to the driver through our internal team. Most items are recovered within 48 hours.",
        },
        {
          question: "Do I have to pay a fee to get my item back?",
          answer:
            "Rydr doesn't charge a fee to return lost items. If you'd like the driver to deliver the item to your location, a small trip charge may apply — but that's at your discretion. You can also choose to pick it up directly.",
        },
        {
          question: "What happens if my item can't be found?",
          answer:
            "If we're unable to locate the item after our investigation, we'll document the case and provide a written confirmation. For items lost due to driver negligence, we'll escalate the case through our grievance process.",
        },
      ],
    },
    {
      id: "driver",
      label: "Driver Support",
      icon: Car,
      accent: "text-zinc-700",
      questions: [
        {
          question: "How do I report a driver for unprofessional behaviour?",
          answer:
            "After your ride ends, you'll be prompted to rate your trip. Tap 'Report an Issue' and select the type of behaviour. All reports go directly to our Driver Relations team. We investigate every complaint and take action within 24 hours.",
        },
        {
          question: "My driver was rude / made me uncomfortable. Who do I tell?",
          answer:
            "Please report this immediately — your safety and comfort are non-negotiable. Tap Report after your ride or contact support directly. Harassment reports are treated as priority and the driver account is placed on hold during investigation.",
        },
        {
          question: "Can I request a specific driver again?",
          answer:
            "Currently, you can't request a specific driver. However, you can mark a driver as 'Favourite' after a great ride — and our system will try to match you when they're available nearby.",
        },
      ],
    },
  ];

  const currentCategory = categories.find((c) => c.id === activeCategory)!;

  const contactOptions = [
    {
      icon: MessageCircle,
      title: "In-App Chat",
      desc: "Get help directly from the Rides screen in the app.",
      action: "Open App",
      primary: true,
      color: "bg-black text-white hover:bg-zinc-800",
    },
    {
      icon: PhoneCall,
      title: "Call Support",
      desc: "Available Mon–Sat, 8 AM to 10 PM IST.",
      action: "1800-RYDR-01",
      primary: false,
      color: "bg-white border border-zinc-200 text-zinc-900 hover:border-zinc-400",
    },
    {
      icon: Mail,
      title: "Email Us",
      desc: "We respond to all emails within 6 hours.",
      action: "support@rydr.in",
      primary: false,
      color: "bg-white border border-zinc-200 text-zinc-900 hover:border-zinc-400",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-white pt-28 pb-16 md:pt-36 md:pb-24">
        <div className="absolute inset-0 premium-grid-fine pointer-events-none opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-5 sm:px-6 text-center space-y-6">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block text-[10px] font-mono font-bold tracking-widest text-amber-600 uppercase"
          >
            Help Centre
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter text-zinc-900 leading-[1.05]"
          >
            How can we help you?
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg text-zinc-500 font-semibold max-w-xl mx-auto leading-relaxed"
          >
            Find quick answers below. If you don't see what you're looking for, our
            support team is available 7 days a week.
          </motion.p>

          {/* Quick action chips */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-2 justify-center"
          >
            {[
              { label: "Track My Ride", icon: Car },
              { label: "Request Refund", icon: RotateCcw },
              { label: "Lost Item", icon: Package },
              { label: "Payment Issue", icon: Wallet },
              { label: "Report Driver", icon: AlertCircle },
            ].map((chip, i) => (
              <div
                key={i}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-[#F8F8F8] border border-zinc-200 rounded-full text-[12px] font-bold text-zinc-700 hover:border-zinc-400 hover:bg-white transition-colors cursor-pointer"
              >
                <chip.icon className="w-3.5 h-3.5 text-zinc-400" />
                {chip.label}
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── FAQ Section ── */}
      <section className="bg-[#F8F8F8] border-t border-zinc-200 py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-5 sm:px-6 space-y-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center space-y-3"
          >
            <motion.span
              variants={fadeUp}
              className="text-[10px] font-mono font-bold tracking-widest text-amber-600 uppercase"
            >
              Frequently Asked
            </motion.span>
            <motion.h2
              variants={fadeUp}
              className="text-3xl sm:text-4xl font-black tracking-tighter text-zinc-900 leading-tight"
            >
              Common questions, answered clearly.
            </motion.h2>
          </motion.div>

          {/* Category Tabs — horizontal scroll on mobile */}
          <div className="overflow-x-auto pb-1 -mx-5 sm:mx-0 px-5 sm:px-0">
            <div className="flex gap-2 min-w-max sm:flex-wrap sm:min-w-0">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-bold whitespace-nowrap transition-all cursor-pointer ${
                    activeCategory === cat.id
                      ? "bg-black text-white shadow-sm"
                      : "bg-white border border-zinc-200 text-zinc-600 hover:border-zinc-400"
                  }`}
                  aria-pressed={activeCategory === cat.id}
                >
                  <cat.icon className="w-3.5 h-3.5" />
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* FAQ Accordion */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <FAQAccordion items={currentCategory.questions} />
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ── Tips / Common Fixes ── */}
      <section className="bg-white border-t border-zinc-200 py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-5 sm:px-6 space-y-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="space-y-3"
          >
            <motion.span
              variants={fadeUp}
              className="text-[10px] font-mono font-bold tracking-widest text-amber-600 uppercase"
            >
              Quick Fixes
            </motion.span>
            <motion.h2
              variants={fadeUp}
              className="text-2xl sm:text-3xl font-black tracking-tighter text-zinc-900 leading-tight"
            >
              Try these first — they solve 80% of issues.
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {[
              {
                title: "App not loading?",
                steps: ["Force close the app", "Check your mobile data or Wi-Fi", "Reopen — should be back in seconds"],
              },
              {
                title: "Driver not showing on map?",
                steps: ["Wait 30 seconds — maps can lag", "Call the driver from the ride screen", "If no answer after 2 mins, cancel and rebook"],
              },
              {
                title: "Payment failed?",
                steps: ["Check your UPI or card limit", "Try a different payment method", "Contact your bank if the issue persists"],
              },
              {
                title: "Ride booked but no driver found?",
                steps: ["This means no drivers are nearby", "Try again in 3–5 minutes", "Consider switching to Economy for faster matching"],
              },
            ].map((tip, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="bg-[#F8F8F8] border border-zinc-200 rounded-xl p-5 space-y-3"
              >
                <h4 className="text-sm font-black text-zinc-900">{tip.title}</h4>
                <ol className="space-y-2">
                  {tip.steps.map((step, j) => (
                    <li key={j} className="flex items-start gap-2.5">
                      <span className="text-[10px] font-mono font-bold text-zinc-400 bg-zinc-200 rounded-full w-4 h-4 flex items-center justify-center shrink-0 mt-0.5">
                        {j + 1}
                      </span>
                      <span className="text-sm text-zinc-600 font-semibold">{step}</span>
                    </li>
                  ))}
                </ol>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Contact Section ── */}
      <section className="bg-[#111111] py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-5 sm:px-6 space-y-10">
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
              Still Need Help?
            </motion.span>
            <motion.h2
              variants={fadeUp}
              className="text-3xl sm:text-4xl font-black tracking-tighter text-white leading-tight"
            >
              Our team is here for you.
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="text-zinc-400 text-sm font-semibold max-w-lg mx-auto"
            >
              We aim to respond to every message within 2 hours. For urgent safety
              issues, use the in-app SOS button for an immediate response.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4"
          >
            {contactOptions.map((opt, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4 hover:border-zinc-700 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                  <opt.icon className="w-5 h-5 text-zinc-300" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-black text-white">{opt.title}</h4>
                  <p className="text-xs text-zinc-400 font-semibold leading-relaxed">{opt.desc}</p>
                </div>
                <div className="pt-1">
                  <div
                    className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer ${opt.color}`}
                  >
                    {opt.action} {opt.primary && <ArrowRight className="w-3.5 h-3.5" />}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Response time bar */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4"
          >
            {[
              { icon: Clock, label: "Chat response", time: "< 5 minutes" },
              { icon: PhoneCall, label: "Phone support", time: "< 2 minutes wait" },
              { icon: Mail, label: "Email response", time: "< 6 hours" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <item.icon className="w-4 h-4 text-zinc-500" />
                <div>
                  <span className="text-xs text-zinc-500 font-semibold">{item.label}: </span>
                  <span className="text-xs text-zinc-300 font-black">{item.time}</span>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Popular Help Articles ── */}
      <section className="bg-white border-t border-zinc-200 py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-5 sm:px-6 space-y-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="space-y-3"
          >
            <motion.span
              variants={fadeUp}
              className="text-[10px] font-mono font-bold tracking-widest text-amber-600 uppercase"
            >
              Popular Articles
            </motion.span>
            <motion.h2
              variants={fadeUp}
              className="text-2xl sm:text-3xl font-black tracking-tighter text-zinc-900 leading-tight"
            >
              Most read help guides.
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-1 sm:grid-cols-2 gap-3"
          >
            {[
              { icon: Car, title: "How to track your Rydr in real time", tag: "Rides" },
              { icon: Wallet, title: "Adding money to Rydr Wallet via UPI", tag: "Payments" },
              { icon: RotateCcw, title: "How to request a fare adjustment", tag: "Refunds" },
              { icon: Package, title: "Recovering lost items after a trip", tag: "Lost Items" },
              { icon: AlertCircle, title: "Reporting a driver — what happens next", tag: "Safety" },
              { icon: HelpCircle, title: "How Rydr calculates your ride fare", tag: "Pricing" },
            ].map((article, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="flex items-center gap-4 p-4 border border-zinc-200 rounded-xl hover:border-zinc-400 hover:bg-[#F8F8F8] transition-all cursor-pointer group"
              >
                <div className="w-9 h-9 rounded-lg bg-zinc-100 border border-zinc-200 flex items-center justify-center shrink-0">
                  <article.icon className="w-4 h-4 text-zinc-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-zinc-900 truncate">{article.title}</div>
                  <div className="text-[10px] text-zinc-400 font-semibold mt-0.5">{article.tag}</div>
                </div>
                <ArrowRight className="w-4 h-4 text-zinc-300 group-hover:text-zinc-700 group-hover:translate-x-0.5 transition-all shrink-0" />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
