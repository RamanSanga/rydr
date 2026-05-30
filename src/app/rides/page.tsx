"use client";

import { useState, useEffect } from "react";
import { Ride, getRouteDistance, calculateFare } from "@/lib/data";
import { fetchUserRides } from "@/actions/ride";
import { Search, MapPin, Clock, ArrowRight, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Footer from "@/components/Footer";

type RideFilter = "All" | "Requested" | "Accepted" | "On Trip" | "Completed" | "Cancelled";

export default function RidesHistoryPage() {
  const [activeFilter, setActiveFilter] = useState<RideFilter>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [localRides, setLocalRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);

  const loadRides = async () => {
    try {
      const dbRides = await fetchUserRides();
      
      const formattedRides: Ride[] = dbRides.map((r: any) => ({
        id: r.id,
        date: new Date(r.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" }),
        time: new Date(r.createdAt).toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" }),
        pickup: r.pickup,
        destination: r.destination,
        price: r.fare ? "₹" + r.fare : "₹" + calculateFare(getRouteDistance(r.pickup, r.destination), r.rideType),
        driverName: r.driver?.name || "Vetted Driver Partner",
        driverInitials: r.driver?.name ? r.driver.name.substring(0, 2).toUpperCase() : "VD",
        vehicle: "RYDR Clean Cabin",
        status: r.status as any,
        tier: r.rideType === "economy" ? "Economy" : r.rideType === "premium" ? "Premium" : "XL",
      }));

      setLocalRides(formattedRides);
    } catch (err) {
      console.error("Error loading rides history:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRides();
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
    Requested: "bg-amber-50 text-amber-700 border-amber-100",
    Accepted: "bg-blue-50 text-blue-700 border-blue-100",
    "Driver Arriving": "bg-indigo-50 text-indigo-700 border-indigo-100",
    "On Trip": "bg-emerald-50 text-emerald-700 border-emerald-100",
    Completed: "bg-zinc-150 text-zinc-700 border-zinc-200",
    Cancelled: "bg-red-50 text-red-700 border-red-100",
  } as Record<string, string>;

  return (
    <div className="min-h-screen bg-white text-zinc-900 flex flex-col pt-8 sm:pt-12">
      <main className="flex-1 max-w-2xl w-full mx-auto px-5 sm:px-6 space-y-8 pb-20">
        
        {/* Title and Search */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4">
          <div className="space-y-1">
            <span className="eyebrow block">TRIP JOURNAL</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900">
              My Rides
            </h1>
          </div>

          {/* Search bar */}
          <div className="relative max-w-xs w-full">
            <input
              type="text"
              placeholder="Search destination, driver..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-xs placeholder-zinc-400 focus:outline-none focus:border-zinc-350 focus:bg-white transition-all shadow-3xs"
            />
          </div>
        </div>

        {/* Tab Filters */}
        <div className="flex gap-2 overflow-x-auto pb-1.5 scrollbar-hide -mx-5 px-5 sm:mx-0 sm:px-0">
          <div className="flex bg-zinc-100 p-1 border border-zinc-200 rounded-xl w-fit">
            {filterTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveFilter(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  activeFilter === tab 
                    ? "bg-white text-zinc-900 shadow-3xs"
                    : "text-zinc-500 hover:text-zinc-900"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Rides List */}
        <div className="space-y-4">
          {loading ? (
            <div className="space-y-4">
              {[1, 2].map((n) => (
                <div key={n} className="bg-white border border-zinc-200 rounded-2xl p-5 space-y-4 animate-pulse">
                  <div className="flex justify-between items-center">
                    <div className="w-1/3 h-4 bg-zinc-100 rounded" />
                    <div className="w-12 h-4 bg-zinc-100 rounded" />
                  </div>
                  <div className="h-[1px] bg-zinc-100" />
                  <div className="w-2/3 h-3 bg-zinc-100 rounded" />
                  <div className="w-1/2 h-3 bg-zinc-100 rounded" />
                </div>
              ))}
            </div>
          ) : filteredRides.length > 0 ? (
            filteredRides.map((ride) => (
              <div
                key={ride.id}
                className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm hover:border-zinc-300 hover:shadow-md transition-all space-y-4"
              >
                {/* Header: Status, Date, Fare */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border shadow-3xs ${statusColors[ride.status] || "bg-zinc-100"}`}>
                      {ride.status}
                    </span>
                    <span className="text-[10px] sm:text-xs text-zinc-400 font-semibold">{ride.date} • {ride.time}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-base font-extrabold text-zinc-950 block leading-none">{ride.price}</span>
                    <span className="text-[9px] font-bold text-zinc-400 uppercase block mt-1 tracking-wider">{ride.tier}</span>
                  </div>
                </div>

                <div className="h-[1px] bg-zinc-100" />

                {/* Timeline stops */}
                <div className="relative space-y-3.5 pl-5 ml-1 select-none">
                  {/* Connecting Line */}
                  <div className="absolute left-[3.5px] top-3.5 bottom-3.5 w-[1.5px] border-dashed border-l border-zinc-250 pointer-events-none" />

                  {/* Pickup */}
                  <div className="relative leading-none">
                    <div className="absolute -left-[24px] top-1 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white shadow-3xs" />
                    <span className="text-[8px] font-bold text-zinc-400 block uppercase tracking-wider">Pickup</span>
                    <p className="text-xs sm:text-sm font-semibold text-zinc-800 mt-1 leading-snug truncate">{ride.pickup}</p>
                  </div>

                  {/* Destination */}
                  <div className="relative leading-none">
                    <div className="absolute -left-[24px] top-1 w-2.5 h-2.5 rounded-full bg-blue-500 border-2 border-white shadow-3xs" />
                    <span className="text-[8px] font-bold text-zinc-400 block uppercase tracking-wider">Destination</span>
                    <p className="text-xs sm:text-sm font-semibold text-zinc-800 mt-1 leading-snug truncate">{ride.destination}</p>
                  </div>
                </div>

                {/* Driver information */}
                <div className="flex items-center justify-between pt-4 border-t border-zinc-100 mt-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-zinc-900 text-white text-[10px] font-extrabold flex items-center justify-center shrink-0">
                      {ride.driverInitials}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-zinc-800 block leading-tight">{ride.driverName}</span>
                      <span className="text-[10px] text-zinc-400 font-semibold">{ride.vehicle}</span>
                    </div>
                  </div>

                  <Link
                    href={`/rider?rideId=${ride.id}`}
                    className="text-[11px] font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
                  >
                    <span>Track Trip</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-8 text-center flex flex-col items-center justify-center space-y-3">
              <div className="p-3 bg-zinc-100 border border-zinc-200 rounded-xl text-zinc-400">
                <Clock className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-zinc-950">No rides found</h4>
                <p className="text-xs text-zinc-500 font-semibold max-w-[200px] mx-auto leading-normal">
                  Try adjusting your search queries or selecting a different filter tab.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Back Link */}
        <div className="pt-4 text-center">
          <Link
            href="/rider"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-500 hover:text-zinc-950 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Dashboard</span>
          </Link>
        </div>

      </main>

      <Footer />
    </div>
  );
}
