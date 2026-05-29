"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, MapPin, CreditCard, ChevronRight, Check, MessageSquare, Camera } from "lucide-react";

export default function BusinessSection() {
  const [activeTab, setActiveTab] = useState<"stops" | "split" | "chat">("stops");

  const stopsList = [
    { name: "Sarah's House", time: "7:00 PM", address: "Pickup • 45 Orchard Road", color: "bg-amber-500" },
    { name: "David's Flat", time: "7:15 PM", address: "Pickup • 12 High Street", color: "bg-blue-500" },
    { name: "Chai Cafe Spot", time: "7:30 PM", address: "Destination • Settle here", color: "bg-emerald-500" },
  ];

  const friendsList = [
    { name: "Sarah Jenkins", role: "Playlist Manager", cost: "$4.50", initials: "SJ", polaroidClass: "rotate-[-2deg]" },
    { name: "David Miller", role: "Chai Requestor", cost: "$4.50", initials: "DM", polaroidClass: "rotate-[3deg]" },
    { name: "Aria Chen", role: "Ride Booker", cost: "$4.50", initials: "AC", polaroidClass: "rotate-[-1deg]" },
  ];

  const chatMessages = [
    { sender: "Sarah", text: "Are we there yet? Steaming tea cravings are real! ☕", time: "7:22 PM" },
    { sender: "David", text: "Aria, turn up the lo-fi monsoon playlist!", time: "7:24 PM" },
    { sender: "Driver Vikram", text: "Arriving at Chai Cafe in 2 mins. Fresh water bottles are ready!", time: "7:28 PM", isDriver: true },
  ];

  return (
    <section id="business" className="bg-white py-32 border-t border-zinc-200 relative overflow-hidden">
      
      {/* Background soft ambient grid */}
      <div className="absolute inset-0 premium-grid-fine opacity-[0.12] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Heading and feature listing */}
          <div className="lg:col-span-5 flex flex-col justify-center space-y-8">
            <div className="space-y-3.5">
              <span className="text-[10px] font-mono tracking-widest text-amber-600 font-bold uppercase">
                RYDR WITH FRIENDS
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tighter text-zinc-900">
                Chalo, let's share the ride.
              </h2>
              <p className="text-zinc-500 text-sm md:text-[14.5px] leading-relaxed font-semibold">
                Planning a spontaneous late-night chai run, a double date, or a weekend group escape? Settle routes, coordinate stops, and split fares cashless—right inside our beautiful app.
              </p>
            </div>

            {/* Outing checklists */}
            <div className="space-y-4 pt-1">
              {[
                "Split fares automatically in a single tap",
                "Add up to 5 multi-stops on your route",
                "Real-time location sharing with friends",
                "Monsoon-ready spacious cabins for the crew",
              ].map((bullet, idx) => (
                <div key={idx} className="flex items-center space-x-3">
                  <div className="w-5 h-5 rounded-full bg-amber-50 border border-amber-250/60 flex items-center justify-center text-amber-700 shrink-0 shadow-2xs">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  <span className="text-[13.5px] text-zinc-700 font-bold">
                    {bullet}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-1">
              <button className="px-5 py-3 bg-zinc-50 hover:bg-zinc-100 text-zinc-800 font-bold text-xs rounded-xl border border-zinc-200 transition-colors cursor-pointer flex items-center space-x-2 shadow-2xs">
                <span>Explore Group Outings</span>
                <ChevronRight className="w-4 h-4 text-zinc-400" />
              </button>
            </div>
          </div>

          {/* Right Column: Interactive Group Outing Console Mockup (Polaroid Diary Theme) */}
          <div className="lg:col-span-7 w-full flex flex-col justify-center">
            <div className="bg-white border border-zinc-250 rounded-3xl overflow-hidden shadow-sm relative p-5 md:p-7 flex flex-col space-y-6">
              
              {/* Header */}
              <div className="border-b border-zinc-200/60 pb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shadow-2xs">
                    <Camera className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-[13.5px] font-extrabold text-zinc-900 leading-tight">Friday Chai Outing</h4>
                    <span className="text-[9px] font-mono text-zinc-450 uppercase tracking-wider font-bold">Trip Journal & Splits</span>
                  </div>
                </div>

                {/* Segmented controls */}
                <div className="flex space-x-1 bg-zinc-150 p-1 rounded-xl border border-zinc-200 self-start sm:self-auto">
                  {["stops", "split", "chat"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab as any)}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-mono uppercase tracking-wider transition-colors cursor-pointer ${
                        activeTab === tab 
                          ? "bg-white text-black font-extrabold shadow-3xs"
                          : "text-zinc-550 hover:text-zinc-800"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              {/* Console Dashboard Area */}
              <div className="min-h-[280px] bg-white flex flex-col justify-center">
                <AnimatePresence mode="wait">
                  
                  {/* Tab: Stops Route timeline */}
                  {activeTab === "stops" && (
                    <motion.div
                      key="tab-stops"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ duration: 0.18 }}
                      className="space-y-6 relative py-2"
                    >
                      {/* Vertical street connection dotted line */}
                      <div className="absolute left-[18px] top-6 bottom-6 w-[2px] bg-zinc-200 pointer-events-none border-dashed border-l border-zinc-350" />

                      <div className="space-y-5">
                        {stopsList.map((stop, idx) => (
                          <div key={idx} className="flex items-center space-x-4 relative">
                            {/* Curved stop indicators */}
                            <div className={`w-9 h-9 rounded-full ${stop.color} text-white flex items-center justify-center text-[10.5px] font-black z-10 shadow-3xs`}>
                              {idx + 1}
                            </div>
                            <div className="flex-1 bg-zinc-50 border border-zinc-200 rounded-xl p-3.5 flex justify-between items-center shadow-3xs hover:border-zinc-350 transition-colors">
                              <div>
                                <h5 className="text-[12.5px] font-extrabold text-zinc-900 tracking-tight">{stop.name}</h5>
                                <p className="text-[10px] text-zinc-450 mt-0.5 leading-none font-semibold">{stop.address}</p>
                              </div>
                              <span className="text-[10px] font-mono text-zinc-500 font-bold bg-white px-2 py-0.5 rounded border border-zinc-200 shadow-3xs">
                                {stop.time}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Tab: Splits (Polaroid Diary Theme) */}
                  {activeTab === "split" && (
                    <motion.div
                      key="tab-split"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ duration: 0.18 }}
                      className="space-y-6 py-2"
                    >
                      {/* Equal Splits summary */}
                      <div className="bg-[#FFFBEB] border border-amber-250/60 rounded-2xl p-5 flex items-center justify-between shadow-3xs">
                        <div className="space-y-0.5">
                          <span className="text-[9px] font-mono text-amber-700 uppercase tracking-widest font-extrabold block">Equal Split Settled</span>
                          <span className="text-[19px] font-black text-zinc-950">$13.50 total spend</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[13px] font-extrabold text-zinc-800">3 Friends Split</span>
                          <span className="text-[9px] font-mono text-[#B45309] block mt-0.5 font-black">CASHLESS ON ARRIVAL</span>
                        </div>
                      </div>

                      {/* Polaroid cards grid */}
                      <div className="grid grid-cols-3 gap-4.5 pt-2">
                        {friendsList.map((friend, idx) => (
                          <div
                            key={idx}
                            className={`bg-white border border-zinc-200 p-3 pb-4.5 rounded-xl shadow-3xs flex flex-col items-center text-center space-y-3 transition-transform duration-200 hover:scale-103 ${friend.polaroidClass}`}
                          >
                            {/* Polaroid image outline placeholder */}
                            <div className="w-12 h-12 rounded-full bg-zinc-50 border border-zinc-200 flex items-center justify-center shadow-3xs">
                              <span className="text-[11px] font-black text-zinc-800">{friend.initials}</span>
                            </div>
                            {/* Info */}
                            <div>
                              <h5 className="text-[11px] font-extrabold text-zinc-900 tracking-tight leading-tight">{friend.name}</h5>
                              <span className="text-[9px] text-zinc-400 block mt-0.5 leading-none">{friend.role}</span>
                            </div>
                            <div className="pt-1.5 border-t border-zinc-150 w-full">
                              <span className="text-[11.5px] font-black text-zinc-800 block">{friend.cost}</span>
                              <span className="text-[8px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-250/40 px-1.5 py-0.5 rounded shadow-3xs uppercase block mt-1">
                                SETTLED
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Tab: Chat */}
                  {activeTab === "chat" && (
                    <motion.div
                      key="tab-chat"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ duration: 0.18 }}
                      className="space-y-4 py-2"
                    >
                      <div className="space-y-3.5 bg-zinc-50 border border-zinc-200 rounded-2xl p-4.5 shadow-3xs max-h-[240px] overflow-y-auto">
                        {chatMessages.map((msg, idx) => (
                          <div key={idx} className={`flex flex-col space-y-1 ${msg.isDriver ? "items-end" : "items-start"}`}>
                            <div className="flex items-center space-x-1.5 text-[8.5px] font-mono font-bold text-zinc-400">
                              <span>{msg.sender}</span>
                              <span>•</span>
                              <span>{msg.time}</span>
                            </div>
                            <div className={`p-3 rounded-2xl text-[12px] font-medium max-w-[85%] border leading-relaxed ${
                              msg.isDriver 
                                ? "bg-black text-white border-black rounded-tr-none" 
                                : "bg-white text-zinc-800 border-zinc-200 rounded-tl-none shadow-3xs"
                            }`}>
                              {msg.text}
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                </AnimatePresence>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
