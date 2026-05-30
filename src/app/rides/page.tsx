"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Ride, getRouteDistance, calculateFare } from "@/lib/data";
import { fetchUserRides } from "@/actions/ride";
import { Search, MapPin, Calendar, Clock, Star, ChevronRight, HelpCircle, RefreshCw } from "lucide-react";
import Link from "next/link";

type RideFilter = "All" | "Requested" | "Accepted" | "On Trip" | "Completed" | "Cancelled";

export default function RidesHistoryPage() {
  const [activeFilter, setActiveFilter] = useState<RideFilter>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [localRides, setLocalRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRides() {
      try {
        const dbRides = await fetchUserRides();
        
        // Map raw DB logs to the high-fidelity UI format
        const formattedRides: Ride[] = dbRides.map((r: any) => ({
          id: r.id,
          date: new Date(r.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
          time: new Date(r.createdAt).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
          pickup: r.pickup,
          destination: r.destination,
          price: r.fare ? "₹" + r.fare : "₹" + calculateFare(getRouteDistance(r.pickup, r.destination), r.rideType),
          driverName: r.driver?.name || "Unassigned",
          driverInitials: r.driver?.name ? r.driver.name.substring(0, 2).toUpperCase() : "??",
          vehicle: "Swift Dzire (White)", // We can make this dynamic if we add vehicle to DB later
          status: r.status as any,
          tier: r.rideType === "economy" ? "Economy" : r.rideType === "premium" ? "Premium" : "XL",
        }));

        setLocalRides(formattedRides);
      } catch (err) {
        console.error("Error loading rides history:", err);
      } finally {
        setLoading(false);
      }
    }
    
    // Initial load
    loadRides();

    // Poll every 10 seconds for real-time status updates
    const interval = setInterval(loadRides, 10000);
    return () => clearInterval(interval);
  }, []);

  const filteredRides = localRides.filter((ride) => {
    const matchesFilter = activeFilter === "All" || ride.status === activeFilter;
    const matchesSearch =
      ride.pickup.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ride.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ride.driverName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const filterTabs: RideFilter[] = ["All", "Requested", "Accepted", "On Trip", "Completed"];

  const statusColors = {
    Requested: "bg-amber-50 text-amber-700 border-amber-200/60",
    Accepted: "bg-blue-50 text-blue-700 border-blue-200/60",
    "Driver Arriving": "bg-indigo-50 text-indigo-700 border-indigo-200/60",
    "On Trip": "bg-emerald-50 text-emerald-700 border-emerald-200/60",
    Completed: "bg-zinc-100 text-zinc-700 border-zinc-200/60",
    Cancelled: "bg-red-50 text-red-700 border-red-200/60",
  } as Record<string, string>;

  return (
    <main className="relative min-h-screen bg-[#F8F8F8] text-[#111111] antialiased pb-24 md:pb-12 pt-28">
      {/* Rider Navbar */}
      <Navbar />

      <div className="max-w-[1000px] mx-auto px-6 space-y-8">
        
        {/* Page Title & Search Bar */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1.5">
            <span className="text-[10px] font-mono tracking-widest text-amber-600 font-bold uppercase">
              TRIP JOURNAL
            </span>
            <h1 className="text-3xl font-black tracking-tighter text-zinc-900 leading-none">
              My Rides
            </h1>
            <p className="text-zinc-500 text-sm font-semibold">
              Explore your ride history, scheduled trips, and spontaneous outings.
            </p>
          </div>

          {/* Search Input Box */}
          <div className="relative bg-white border border-zinc-200 rounded-xl px-4 py-2.5 flex items-center space-x-2.5 max-w-sm w-full focus-within:border-zinc-400 transition-colors shadow-3xs">
            <Search className="w-4 h-4 text-zinc-455 shrink-0" />
            <input
              type="text"
              placeholder="Search by driver, stop..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-0 outline-0 p-0 text-sm text-zinc-900 placeholder-zinc-455 focus:ring-0 font-medium w-full"
            />
          </div>
        </div>

        {/* Tab Filters segmented controls */}
        <div className="flex space-x-1.5 bg-zinc-150 p-1.5 rounded-xl border border-zinc-200 self-start md:self-auto max-w-max">
          {filterTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeFilter === tab 
                  ? "bg-white text-black shadow-3xs"
                  : "text-zinc-500 hover:text-zinc-800"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Rides List Showcase */}
        <div className="space-y-5">
          {loading ? (
            <div className="space-y-5">
              {[1, 2, 3].map((n) => (
                <div key={n} className="bg-white border border-zinc-200 rounded-3xl p-5 md:p-6.5 shadow-3xs space-y-4 animate-pulse">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <div className="w-16 h-5 bg-zinc-100 rounded-full" />
                      <div className="w-28 h-3 bg-zinc-100 rounded-md" />
                    </div>
                    <div className="text-right space-y-1">
                      <div className="w-12 h-4 bg-zinc-100 rounded-md ml-auto" />
                      <div className="w-16 h-2.5 bg-zinc-100 rounded-md ml-auto" />
                    </div>
                  </div>
                  <div className="h-[1px] bg-zinc-100" />
                  <div className="space-y-3.5 pl-5 py-1">
                    <div className="w-1/2 h-3.5 bg-zinc-100 rounded-md" />
                    <div className="w-2/3 h-3.5 bg-zinc-100 rounded-md" />
                  </div>
                  <div className="h-[1px] bg-zinc-100" />
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-zinc-100" />
                      <div className="space-y-1.5">
                        <div className="w-24 h-3 bg-zinc-100 rounded-md" />
                        <div className="w-20 h-2 bg-zinc-100 rounded-md" />
                      </div>
                    </div>
                    <div className="w-24 h-8 bg-zinc-100 rounded-xl" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredRides.length > 0 ? (
            filteredRides.map((ride) => (
              <div
                key={ride.id}
                className="bg-white border border-zinc-200 rounded-3xl p-5 md:p-6.5 shadow-3xs hover:border-zinc-350 hover:shadow-2xs transition-all duration-200 space-y-4"
              >
                
                {/* Header: Status, Date, Fare */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className={`text-[10px] font-mono font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border shadow-3xs ${statusColors[ride.status]}`}>
                      {ride.status}
                    </span>
                    <span className="text-[12.5px] font-mono font-bold text-zinc-400">{ride.date} • {ride.time}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[16px] font-black text-zinc-950 block">{ride.price}</span>
                    <span className="text-[9.5px] font-mono text-zinc-400 font-bold uppercase block mt-0.5">{ride.tier} Tier</span>
                  </div>
                </div>

                {/* Separator line */}
                <div className="h-[1px] bg-zinc-150" />

                {/* Route stops with vertical connecting dotted line */}
                <div className="relative space-y-4.5 pl-5 ml-1 select-none py-1">
                  {/* Dotted Line */}
                  <div className="absolute left-[3.5px] top-3.5 bottom-3.5 w-[1.5px] border-dashed border-l border-zinc-250 pointer-events-none" />

                  {/* Pickup */}
                  <div className="relative">
                    <div className="absolute -left-[24px] top-1 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white shadow-3xs" />
                    <span className="text-[9px] font-mono font-bold text-zinc-400 block uppercase tracking-wider leading-none">Pickup Location</span>
                    <p className="text-[13px] font-extrabold text-zinc-800 mt-1 leading-tight">{ride.pickup}</p>
                  </div>

                  {/* Destination */}
                  <div className="relative">
                    <div className="absolute -left-[24px] top-1 w-2.5 h-2.5 rounded-full bg-blue-500 border-2 border-white shadow-3xs" />
                    <span className="text-[9px] font-mono font-bold text-zinc-400 block uppercase tracking-wider leading-none">Destination Location</span>
                    <p className="text-[13px] font-extrabold text-zinc-800 mt-1 leading-tight">{ride.destination}</p>
                  </div>
                </div>

                {/* Separator line */}
                <div className="h-[1px] bg-zinc-150" />

                {/* Driver information & Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center space-x-3.5">
                    <div className="w-10 h-10 rounded-full bg-zinc-50 border border-zinc-200 flex items-center justify-center font-black text-xs text-zinc-800 shadow-3xs">
                      {ride.driverInitials}
                    </div>
                    <div>
                      <h5 className="text-[13px] font-extrabold text-zinc-900 leading-tight">
                        {ride.driverName}
                      </h5>
                      <span className="text-[10px] text-zinc-450 font-semibold mt-0.5 block">
                        {ride.vehicle}
                      </span>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center space-x-3">
                    <button className="px-4 py-2 bg-zinc-50 hover:bg-zinc-100 text-zinc-800 text-xs font-bold border border-zinc-200 rounded-xl transition-colors cursor-pointer shadow-3xs flex items-center space-x-1.5">
                      <HelpCircle className="w-3.5 h-3.5 text-zinc-450" />
                      <span>Get Help</span>
                    </button>
                    {ride.status === "Completed" && (
                      <button className="px-4 py-2 bg-black text-white hover:bg-zinc-800 text-xs font-bold rounded-xl active:scale-97 transition-all cursor-pointer shadow-3xs flex items-center space-x-1.5">
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Book Again</span>
                      </button>
                    )}
                  </div>
                </div>

              </div>
            ))
          ) : (
            <div className="bg-white border border-zinc-200 rounded-3xl p-12 text-center shadow-3xs flex flex-col items-center justify-center space-y-4.5">
              <div className="p-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-zinc-400 shadow-3xs">
                <Calendar className="w-6 h-6 stroke-[1.5]" />
              </div>
              <div className="space-y-1.5">
                <h4 className="text-base font-extrabold text-zinc-900 tracking-tight">No rides found</h4>
                <p className="text-xs text-zinc-500 max-w-[280px] mx-auto font-medium leading-normal">
                  We couldn't find any trips matching your search query or selected filter tab.
                </p>
              </div>
              <Link
                href="/rider"
                className="px-5 py-2.5 bg-black text-white hover:bg-zinc-800 text-xs font-bold rounded-xl active:scale-97 transition-all cursor-pointer shadow-3xs"
              >
                Book Your First Ride
              </Link>
            </div>
          )}
        </div>

      </div>
    </main>
  );
}
