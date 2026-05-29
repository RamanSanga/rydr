"use client";

import { useState } from "react";
import { MapPin, Navigation, Calendar, Clock, Sparkles, ArrowRight, Check, ShieldCheck, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface RideType {
  id: string;
  name: string;
  description: string;
  price: string;
  eta: string;
  seats: number;
  badge?: string;
  badgeColor?: string;
}

export default function RideBookingCard() {
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [selectedRide, setSelectedRide] = useState("premium");
  const [isScheduling, setIsScheduling] = useState(false);
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [bookingState, setBookingState] = useState<"idle" | "searching" | "confirmed">("idle");
  const [loadingStep, setLoadingStep] = useState(0);

  const rideTypes: RideType[] = [
    {
      id: "premium",
      name: "Rydr Daily",
      description: "Quick commutes, top-rated operators",
      price: "$14.50",
      eta: "3m",
      seats: 4,
      badge: "Popular",
      badgeColor: "bg-zinc-100 text-zinc-800 border border-zinc-200",
    },
    {
      id: "ev",
      name: "Rydr EV Eco",
      description: "Zero-emission Tesla & Audi fleets",
      price: "$16.20",
      eta: "4m",
      seats: 4,
      badge: "CO2 -95%",
      badgeColor: "bg-emerald-50 text-emerald-700 border border-emerald-200/60",
    },
    {
      id: "luxe",
      name: "Rydr Luxe",
      description: "Elite premium business sedans",
      price: "$28.00",
      eta: "5m",
      seats: 4,
      badge: "Premium",
      badgeColor: "bg-blue-50 text-blue-700 border border-blue-200/60",
    },
  ];

  const stepsText = [
    "Finding you a friendly driver nearby...",
    "Securing your upfront price...",
    "Connecting with a verified driver...",
    "Your driver is heading your way!",
  ];

  const triggerSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pickup || !destination) return;

    setBookingState("searching");
    setLoadingStep(0);

    const timer = setInterval(() => {
      setLoadingStep((prev) => {
        if (prev >= stepsText.length - 1) {
          clearInterval(timer);
          setTimeout(() => {
            setBookingState("confirmed");
          }, 800);
          return prev;
        }
        return prev + 1;
      });
    }, 900);
  };

  const resetBooking = () => {
    setBookingState("idle");
    setPickup("");
    setDestination("");
  };

  return (
    <div className="w-full bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden p-6 relative">
      <AnimatePresence mode="wait">
        {bookingState === "idle" && (
          <motion.div
            key="booking-form"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.15 }}
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-[16px] font-bold text-zinc-900 tracking-tight">Book a Ride</h3>
              <div className="flex items-center space-x-1.5 text-xs text-zinc-550 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                <span>FARES LOCKED</span>
              </div>
            </div>

            <form onSubmit={triggerSearch} className="space-y-4">
              {/* Pickup & Destination Inputs */}
              <div className="relative flex flex-col space-y-3.5">
                {/* Connecting Line */}
                <div className="absolute left-6 top-10 bottom-10 w-[1px] bg-zinc-200 pointer-events-none" />

                {/* Pickup Field */}
                <div className="flex items-center space-x-3 bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 focus-within:border-zinc-400 focus-within:bg-white transition-colors duration-150">
                  <div className="p-1 bg-white border border-zinc-200 rounded-md text-zinc-500">
                    <MapPin className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Enter pickup location"
                      value={pickup}
                      onChange={(e) => setPickup(e.target.value)}
                      required
                      className="w-full bg-transparent border-0 outline-0 p-0 text-sm text-zinc-900 placeholder-zinc-450 focus:ring-0 font-medium"
                    />
                  </div>
                  {pickup && (
                    <button
                      type="button"
                      onClick={() => setPickup("")}
                      className="text-zinc-400 hover:text-black text-xs font-semibold cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Dropoff Field */}
                <div className="flex items-center space-x-3 bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 focus-within:border-zinc-400 focus-within:bg-white transition-colors duration-150">
                  <div className="p-1 bg-white border border-zinc-200 rounded-md text-zinc-500">
                    <Navigation className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Where to?"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      required
                      className="w-full bg-transparent border-0 outline-0 p-0 text-sm text-zinc-900 placeholder-zinc-455 focus:ring-0 font-medium"
                    />
                  </div>
                  {destination && (
                    <button
                      type="button"
                      onClick={() => setDestination("")}
                      className="text-zinc-400 hover:text-black text-xs font-semibold cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {/* Ride Type Selector */}
              <div className="space-y-2 pt-1">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">
                  Select Ride Tier
                </label>
                <div className="flex flex-col space-y-2">
                  {rideTypes.map((type) => (
                    <div
                      key={type.id}
                      onClick={() => setSelectedRide(type.id)}
                      className={`flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer ${
                        selectedRide === type.id
                          ? "bg-zinc-50 border-black shadow-2xs"
                          : "bg-white border-zinc-200 hover:border-zinc-300"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                            selectedRide === type.id ? "border-black bg-black" : "border-zinc-300 bg-white"
                          }`}
                        >
                          {selectedRide === type.id && <Check className="w-2.5 h-2.5 text-white stroke-[3.5px]" />}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-[14px] font-bold text-zinc-900 tracking-tight">{type.name}</span>
                            {type.badge && (
                              <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md ${type.badgeColor}`}>
                                {type.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-[12px] text-zinc-500 mt-0.5 leading-none">{type.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[14px] font-black text-zinc-900">{type.price}</span>
                        <div className="text-[11px] text-zinc-400 mt-0.5">ETA {type.eta}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Scheduling Selector */}
              <div className="border-t border-zinc-200 pt-3">
                <button
                  type="button"
                  onClick={() => setIsScheduling(!isScheduling)}
                  className="flex items-center space-x-2 text-[11px] font-bold text-zinc-500 hover:text-black transition-colors py-1 cursor-pointer"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{isScheduling ? "Depart Immediately" : "Schedule Departure Time"}</span>
                </button>

                <AnimatePresence>
                  {isScheduling && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden mt-3.5 grid grid-cols-2 gap-3"
                    >
                      <div className="bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 flex items-center space-x-2 focus-within:bg-white focus-within:border-zinc-400">
                        <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                        <input
                          type="date"
                          value={scheduleDate}
                          onChange={(e) => setScheduleDate(e.target.value)}
                          className="bg-transparent border-0 outline-0 text-xs text-zinc-800 placeholder-zinc-405 w-full focus:ring-0 font-medium"
                        />
                      </div>
                      <div className="bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 flex items-center space-x-2 focus-within:bg-white focus-within:border-zinc-400">
                        <Clock className="w-3.5 h-3.5 text-zinc-400" />
                        <input
                          type="time"
                          value={scheduleTime}
                          onChange={(e) => setScheduleTime(e.target.value)}
                          className="bg-transparent border-0 outline-0 text-xs text-zinc-800 placeholder-zinc-405 w-full focus:ring-0 font-medium"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={!pickup || !destination}
                className={`w-full py-3.5 rounded-xl font-bold text-sm tracking-wide transition-all duration-150 flex items-center justify-center space-x-2 ${
                  pickup && destination
                    ? "bg-black text-white hover:bg-zinc-800 cursor-pointer active:scale-98 shadow-sm"
                    : "bg-zinc-100 text-zinc-450 cursor-not-allowed"
                }`}
              >
                <span>Find Rides</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}

        {bookingState === "searching" && (
          <motion.div
            key="booking-searching"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="py-12 flex flex-col items-center justify-center text-center space-y-6"
          >
            <div className="relative flex items-center justify-center">
              <Loader2 className="w-12 h-12 text-zinc-800 animate-spin stroke-[1.5]" />
              <div className="absolute text-[11px] font-bold text-zinc-650 font-mono">{loadingStep + 1}</div>
            </div>
            <div className="space-y-1">
              <h4 className="text-base font-bold text-zinc-900 tracking-tight">Matching with a friendly driver...</h4>
              <p className="text-xs text-zinc-500 font-mono h-4">
                {stepsText[loadingStep]}
              </p>
            </div>
            <div className="w-full max-w-[200px] bg-zinc-100 h-[3px] rounded-full overflow-hidden">
              <motion.div
                className="bg-black h-full"
                initial={{ width: "0%" }}
                animate={{ width: `${(loadingStep + 1) * 25}%` }}
                transition={{ duration: 0.9, ease: "easeInOut" }}
              />
            </div>
          </motion.div>
        )}

        {bookingState === "confirmed" && (
          <motion.div
            key="booking-confirmed"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="py-6 flex flex-col items-center justify-center text-center space-y-6"
          >
            <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-250 flex items-center justify-center text-emerald-600">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
            </div>

            <div className="space-y-1">
              <h4 className="text-lg font-bold text-zinc-900 tracking-tight">You're all set!</h4>
              <p className="text-xs text-zinc-500 max-w-[260px] mx-auto leading-normal">
                Your driver Aria is heading your way in a clean white Tesla. Pickup locked at <span className="text-black font-semibold">{pickup}</span>.
              </p>
            </div>

            <div className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-4.5 text-left divide-y divide-zinc-200 space-y-2.5">
              <div className="flex justify-between items-center pb-2">
                <span className="text-xs text-zinc-500 font-semibold">Vehicle Tier</span>
                <span className="text-xs font-bold text-zinc-900">
                  {selectedRide === "premium" ? "Rydr Daily" : selectedRide === "ev" ? "Rydr EV Eco" : "Rydr Luxe"}
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-xs text-zinc-500 font-semibold">Estimated Arrival</span>
                <span className="text-xs font-bold text-emerald-600">2.8 mins</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-xs text-zinc-500 font-semibold">Fare Locked</span>
                <span className="text-xs font-black text-zinc-900">
                  {rideTypes.find((r) => r.id === selectedRide)?.price}
                </span>
              </div>
            </div>

            <button
              onClick={resetBooking}
              className="w-full py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 transition-colors text-xs font-bold rounded-lg border border-zinc-200 cursor-pointer"
            >
              Request Another Ride
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}