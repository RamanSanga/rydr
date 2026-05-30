"use client";

import { useState } from "react";
import { ChevronDown, MessageCircle, PhoneCall, Mail, Package, AlertCircle, HelpCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import Footer from "@/components/Footer";

interface FAQItem {
  question: string;
  answer: string;
}

export default function HelpPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const faqs: FAQItem[] = [
    {
      question: "My driver cancelled after I waited. What happens now?",
      answer: "If a driver cancels after you've been waiting, you won't be charged any cancellation fee. The app will automatically pair you with another driver. If this happens repeatedly, please report it via the Help section.",
    },
    {
      question: "How does RYDR lock my fare upfront?",
      answer: "We use OSRM routing distance and pre-calculated tier rates. The fare you see when you click 'Book' is the exact amount charged at trip completion. Route detours or traffic delays do not increase your fare.",
    },
    {
      question: "What payment methods does RYDR accept?",
      answer: "We accept all UPI transfers (PhonePe, Google Pay, Paytm), major credit/debit cards, and net banking. Payouts are fully cashless and automatic.",
    },
    {
      question: "I left an item in the vehicle. How do I get it back?",
      answer: "Go to 'My Rides', select the trip, and tap 'Lost Item'. You can contact the driver directly or email our recovery team. We coordinate returns for all high-value items.",
    },
    {
      question: "How do I report a driver for unprofessional behavior?",
      answer: "After your trip finishes, rate the driver. You can tap 'Report Issue' to immediately escalate unprofessional behavior to our Driver Relations desk.",
    },
  ];

  const quickActions = [
    { title: "Report Issue", desc: "Report route delays or vehicle issues", icon: AlertCircle, color: "text-amber-600", bg: "bg-amber-50" },
    { title: "Lost Item", desc: "Coordinate recovery of items left behind", icon: Package, color: "text-blue-600", bg: "bg-blue-50" },
    { title: "Billing Help", desc: "Dispute transaction or fare differences", icon: HelpCircle, color: "text-emerald-600", bg: "bg-emerald-50" },
    { title: "Emergency", desc: "Immediate 24/7 safety incident assistance", icon: PhoneCall, color: "text-rose-600", bg: "bg-rose-50" },
  ];

  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white text-zinc-900 flex flex-col pt-8 sm:pt-12">
      <main className="flex-1 max-w-4xl w-full mx-auto px-5 sm:px-6 space-y-16 pb-20">
        
        {/* Clean Hero Search */}
        <div className="text-center max-w-xl mx-auto space-y-5">
          <span className="eyebrow block">SUPPORT CENTRE</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 leading-tight">
            How can we help?
          </h1>
          <p className="text-zinc-500 text-sm sm:text-base leading-relaxed">
            Search our frequently asked questions or select an action card below to contact support.
          </p>
          
          {/* Search bar */}
          <div className="relative pt-2 max-w-md mx-auto">
            <input 
              type="text" 
              placeholder="Search help guides, refunds, payments..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3.5 text-sm placeholder-zinc-400 focus:outline-none focus:border-zinc-350 focus:bg-white transition-all shadow-3xs"
            />
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((act, idx) => {
            const Icon = act.icon;
            return (
              <div 
                key={idx}
                className="bg-white border border-zinc-200 p-5 rounded-2xl flex flex-col justify-between hover:shadow-md hover:border-zinc-350 transition-all shadow-sm hover-lift cursor-pointer min-h-[140px]"
              >
                <div className={`h-9 w-9 rounded-lg ${act.bg} ${act.color} flex items-center justify-center shadow-3xs`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="space-y-1 pt-4">
                  <h4 className="text-sm font-bold text-zinc-900">{act.title}</h4>
                  <p className="text-[11px] text-zinc-500 font-semibold leading-normal">{act.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* FAQ Accordion Section */}
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-zinc-900">Common Questions</h3>
          
          <div className="space-y-3">
            {filteredFaqs.map((faq, i) => (
              <div
                key={i}
                className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-3xs hover:border-zinc-300 transition-all duration-200"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 cursor-pointer"
                >
                  <span className="text-xs sm:text-sm font-bold text-zinc-950">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-zinc-400 shrink-0 transition-transform duration-200 ${
                      openIndex === i ? "rotate-180 text-zinc-900" : ""
                    }`}
                  />
                </button>
                {openIndex === i && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-zinc-550 leading-relaxed font-semibold border-t border-zinc-100 pt-4 bg-zinc-50/50">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
            {filteredFaqs.length === 0 && (
              <p className="text-sm text-zinc-450 font-semibold text-center py-6">No matching questions found.</p>
            )}
          </div>
        </div>

        {/* Contact Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-zinc-200/60">
          <div className="bg-white border border-zinc-200 p-5 rounded-2xl space-y-4 shadow-sm hover-lift text-center">
            <div className="h-10 w-10 rounded-xl bg-zinc-50 border border-zinc-150 flex items-center justify-center mx-auto text-zinc-550 shadow-3xs">
              <MessageCircle className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-zinc-900">In-App Chat</h4>
              <p className="text-[11px] text-zinc-500 font-semibold mt-1">Direct support on active rides screen.</p>
            </div>
            <button className="w-full py-2 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold rounded-lg transition-all cursor-pointer">
              Open Chat
            </button>
          </div>

          <div className="bg-white border border-zinc-200 p-5 rounded-2xl space-y-4 shadow-sm hover-lift text-center">
            <div className="h-10 w-10 rounded-xl bg-zinc-50 border border-zinc-150 flex items-center justify-center mx-auto text-zinc-550 shadow-3xs">
              <PhoneCall className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-zinc-900">Phone Support</h4>
              <p className="text-[11px] text-zinc-500 font-semibold mt-1">Talk to operations: 1800-RYDR-01.</p>
            </div>
            <button className="w-full py-2 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 text-zinc-800 text-xs font-semibold rounded-lg transition-all cursor-pointer">
              Call Now
            </button>
          </div>

          <div className="bg-white border border-zinc-200 p-5 rounded-2xl space-y-4 shadow-sm hover-lift text-center">
            <div className="h-10 w-10 rounded-xl bg-zinc-50 border border-zinc-150 flex items-center justify-center mx-auto text-zinc-550 shadow-3xs">
              <Mail className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-zinc-900">Email Support</h4>
              <p className="text-[11px] text-zinc-500 font-semibold mt-1">We respond to support@rydr.in in 6h.</p>
            </div>
            <button className="w-full py-2 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 text-zinc-800 text-xs font-semibold rounded-lg transition-all cursor-pointer">
              Email Us
            </button>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
