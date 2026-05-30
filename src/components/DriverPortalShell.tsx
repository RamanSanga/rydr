"use client";

import Link from "next/link";
import { useState, useEffect, type ComponentType } from "react";
import { CarFront, CircleDot, Coins, ShieldCheck, TrendingUp, UserCircle2, Loader2, ArrowRight } from "lucide-react";
import {
  driverProfile,
  earningsSummaryCards,
  monthlyEarnings,
  weeklyPayouts,
  type DriverAvailability,
} from "@/lib/driver-portal";
import {
  fetchAvailableRideRequests,
  fetchDriverActiveRides,
  fetchDriverCompletedRides,
  fetchDriverStats,
  acceptRideAction,
  rejectRideAction,
  completeRideAction,
  updateDriverLocation,
  updateRideStatusAction,
} from "@/actions/driver";
import { getRouteDistance, calculateFare } from "@/lib/data";

type DriverPortalView = "overview" | "rides" | "earnings";
type IconType = ComponentType<{ className?: string }>;

const statusStyles: Record<string, string> = {
  "New Request": "bg-amber-50 text-amber-700 border-amber-100",
  Accepted: "bg-blue-50 text-blue-700 border-blue-100",
  "Driver Arriving": "bg-blue-50 text-blue-700 border-blue-100",
  "On Trip": "bg-emerald-50 text-emerald-700 border-emerald-100",
  Completed: "bg-zinc-100 text-zinc-700 border-zinc-200",
  Cancelled: "bg-red-50 text-red-700 border-red-100",
};

const tierStyles: Record<string, string> = {
  Daily: "bg-zinc-100 text-zinc-700",
  "EV Eco": "bg-emerald-50 text-emerald-700",
  Luxe: "bg-amber-50 text-amber-700",
};

function SectionHeading({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <div className="space-y-1.5">
      <span className="eyebrow">{eyebrow}</span>
      <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-zinc-900">{title}</h2>
      <p className="text-xs sm:text-sm text-zinc-500 font-medium">{description}</p>
    </div>
  );
}

function StatCard({ label, value, detail, icon: Icon }: { label: string; value: string; detail: string; icon: IconType }) {
  return (
    <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm hover:border-zinc-300 transition-all hover-lift">
      <div className="flex justify-between items-start mb-3">
        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">{label}</span>
        <div className="h-8 w-8 rounded-lg bg-zinc-50 border border-zinc-150 flex items-center justify-center text-zinc-500">
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <p className="text-2xl font-black text-zinc-900 leading-none">{value}</p>
      <p className="text-[11px] text-zinc-450 font-semibold mt-2">{detail}</p>
    </div>
  );
}

function RideTile({
  rider,
  route,
  meta,
  amount,
  tier,
  status,
  onAccept,
  onDecline,
  onUpdateStatus,
  onComplete,
}: {
  rider: string;
  route: string;
  meta: string;
  amount: string;
  tier: "Daily" | "EV Eco" | "Luxe";
  status?: string;
  onAccept?: () => void;
  onDecline?: () => void;
  onUpdateStatus?: (status: string) => void;
  onComplete?: () => void;
}) {
  return (
    <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm hover:border-zinc-300 transition-all space-y-4">
      <div className="flex items-center justify-between gap-3">
        {status ? (
          <span className={`rounded-full border px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${statusStyles[status] || "bg-zinc-100"}`}>
            {status}
          </span>
        ) : (
          <span />
        )}
        <span className={`rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${tierStyles[tier] || "bg-zinc-100"}`}>
          {tier}
        </span>
      </div>
      
      <div>
        <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider block">Passenger</span>
        <p className="text-sm font-bold text-zinc-800 mt-0.5">{rider}</p>
      </div>

      <div>
        <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider block">Route Corridor</span>
        <p className="text-sm font-semibold text-zinc-900 mt-0.5">{route}</p>
      </div>
      
      <div className="flex items-center justify-between gap-3 text-xs text-zinc-500 font-semibold border-t border-zinc-100 pt-3 mt-2">
        <span>{meta}</span>
        <span className="text-base font-extrabold text-zinc-950">{amount}</span>
      </div>

      {/* Accept & Decline controls */}
      {(onAccept || onDecline) && (
        <div className="flex items-center gap-3 pt-3 border-t border-zinc-100">
          {onDecline && (
            <button
              onClick={onDecline}
              className="flex-1 py-2.5 bg-zinc-50 hover:bg-zinc-100 text-zinc-700 font-bold border border-zinc-200 text-xs rounded-xl transition-all cursor-pointer shadow-3xs active:scale-[0.98]"
            >
              Decline
            </button>
          )}
          {onAccept && (
            <button
              onClick={onAccept}
              className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow-sm active:scale-[0.98]"
            >
              Accept Request
            </button>
          )}
        </div>
      )}

      {/* Active Trip Progress buttons */}
      {(onUpdateStatus || onComplete) && (
        <div className="pt-3 border-t border-zinc-100">
          {status === "Accepted" && onUpdateStatus && (
            <button
              onClick={() => onUpdateStatus("Driver Arriving")}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow-sm active:scale-[0.98]"
            >
              Mark Arrived
            </button>
          )}
          {status === "Driver Arriving" && onUpdateStatus && (
            <button
              onClick={() => onUpdateStatus("On Trip")}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow-sm active:scale-[0.98]"
            >
              Start Trip
            </button>
          )}
          {status === "On Trip" && onComplete && (
            <button
              onClick={onComplete}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow-sm active:scale-[0.98] flex items-center justify-center space-x-1.5"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Complete Trip</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default function DriverPortalShell({ view }: { view: DriverPortalView }) {
  const [currentView, setCurrentView] = useState<DriverPortalView>(view);
  const [availability, setAvailability] = useState<DriverAvailability>("Online");
  const [loading, setLoading] = useState(true);

  // Operational queues loaded from PostgreSQL DB actions
  const [requests, setRequests] = useState<any[]>([]);
  const [accepted, setAccepted] = useState<any[]>([]);
  const [completed, setCompleted] = useState<any[]>([]);
  const [stats, setStats] = useState({
    todayEarnings: "₹0",
    activeRequestsCount: 0,
    completedRidesCount: 0,
    driverRating: "4.98 ★",
  });

  const loadDashboardData = async () => {
    try {
      const [dbRequests, dbActive, dbCompleted, dbStats] = await Promise.all([
        fetchAvailableRideRequests(),
        fetchDriverActiveRides(),
        fetchDriverCompletedRides(),
        fetchDriverStats(),
      ]);

      const formattedRequests = dbRequests.map((r: any) => {
        const dist = getRouteDistance(r.pickup, r.destination);
        const fare = calculateFare(dist, r.rideType);
        return {
          id: r.id,
          rider: r.user?.name || "Passenger",
          pickup: `${r.pickup.split(",")[0]} ➔ ${r.destination.split(",")[0]}`,
          destination: r.destination.split(",")[0],
          distance: `${dist} km`,
          fare: r.fare ? `₹${r.fare}` : `₹${fare}`,
          tier: r.rideType === "economy" ? "EV Eco" : r.rideType === "premium" ? "Daily" : "Luxe",
          status: "New Request" as const,
        };
      });

      const formattedActive = dbActive.map((r: any) => {
        const dist = getRouteDistance(r.pickup, r.destination);
        const fare = calculateFare(dist, r.rideType);
        return {
          id: r.id,
          rider: r.user?.name || "Passenger",
          route: `${r.pickup.split(",")[0]} ➔ ${r.destination.split(",")[0]}`,
          fare: r.fare ? `₹${r.fare}` : `₹${fare}`,
          eta: r.status === "Accepted" ? "Arriving at Pickup" : r.status === "Driver Arriving" ? "Arrived" : "In Transit to Destination",
          time: new Date(r.createdAt).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
          tier: r.rideType === "economy" ? "EV Eco" : r.rideType === "premium" ? "Daily" : "Luxe",
          status: r.status,
        };
      });

      const formattedCompleted = dbCompleted.map((r: any) => {
        const dist = getRouteDistance(r.pickup, r.destination);
        const fare = calculateFare(dist, r.rideType);
        return {
          id: r.id,
          rider: r.user?.name || "Passenger",
          route: `${r.pickup.split(",")[0]} ➔ ${r.destination.split(",")[0]}`,
          payout: r.fare ? `₹${r.fare}` : `₹${fare}`,
          rating: "5.0",
          time: new Date(r.createdAt).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
          tier: r.rideType === "economy" ? "EV Eco" : r.rideType === "premium" ? "Daily" : "Luxe",
        };
      });

      setRequests(formattedRequests);
      setAccepted(formattedActive);
      setCompleted(formattedCompleted);
      setStats(dbStats);
    } catch (err) {
      console.error("Error loading driver dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
    
    const interval = setInterval(() => {
      loadDashboardData();
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);

  // Real-time Geolocation Polling
  useEffect(() => {
    let geoInterval: NodeJS.Timeout;

    const pushLocation = () => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            try {
              await updateDriverLocation(
                position.coords.latitude,
                position.coords.longitude,
                availability === "Online"
              );
            } catch (err) {
              console.error("Failed to update driver location:", err);
            }
          },
          async (err) => {
            console.warn("Geolocation error. Cannot update driver location without real GPS coordinates:", err);
          },
          { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
        );
      }
    };

    if (availability === "Online") {
      pushLocation();
      geoInterval = setInterval(pushLocation, 10000);
    } else {
      pushLocation();
    }

    return () => {
      if (geoInterval) clearInterval(geoInterval);
    };
  }, [availability]);

  const handleAcceptRequest = async (id: string) => {
    try {
      setLoading(true);
      await acceptRideAction(id);
      await loadDashboardData();
    } catch (err) {
      console.error("Failed to accept ride:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeclineRequest = async (id: string) => {
    try {
      setLoading(true);
      await rejectRideAction(id);
      await loadDashboardData();
    } catch (err) {
      console.error("Failed to reject ride:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteRide = async (id: string) => {
    try {
      setLoading(true);
      await completeRideAction(id);
      await loadDashboardData();
    } catch (err) {
      console.error("Failed to complete ride:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRideStatus = async (id: string, newStatus: string) => {
    try {
      setLoading(true);
      await updateRideStatusAction(id, newStatus);
      await loadDashboardData();
    } catch (err) {
      console.error("Failed to update ride status:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen bg-zinc-50 text-zinc-900 antialiased pb-24 pt-8 sm:pt-12">
      {/* Subtle top glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1400px] h-[500px] bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.02),transparent_60%)] pointer-events-none z-0" />
      
      <div className="relative z-10 mx-auto max-w-4xl px-5 sm:px-6 space-y-8">
        
        {/* Top Header Card: Greeting & Tab Switched controls */}
        <div className="bg-white border border-zinc-200 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900">
              Ready to earn today? 💪
            </h1>
            <p className="text-zinc-500 text-xs sm:text-sm font-medium">
              Delhi NCR driver dispatcher portal active.
            </p>
          </div>

          {/* Internal Tab Switcher */}
          <div className="flex bg-zinc-100 p-1.5 border border-zinc-200 rounded-2xl w-fit">
            {(["overview", "rides", "earnings"] as DriverPortalView[]).map((v) => (
              <button
                key={v}
                onClick={() => setCurrentView(v)}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  currentView === v 
                    ? "bg-white text-zinc-900 shadow-sm"
                    : "text-zinc-500 hover:text-zinc-900"
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        {/* Prominent Satisfying Go Online Toggle Card */}
        <div className="bg-white border border-zinc-200 rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Operator Status</span>
            <div className="flex items-center gap-2">
              <span className={`h-2.5 w-2.5 rounded-full ${availability === "Online" ? "bg-emerald-500 animate-pulse" : "bg-zinc-400"}`} />
              <p className="text-lg font-black text-zinc-900 leading-none">
                You are currently {availability === "Online" ? "Receiving Trips" : "Offline"}
              </p>
            </div>
          </div>

          {/* Satisfying toggle switch */}
          <button
            onClick={() => setAvailability(availability === "Online" ? "Offline" : "Online")}
            className={`w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold uppercase tracking-wider text-xs shadow-md active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2 ${
              availability === "Online"
                ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/10"
                : "bg-zinc-800 hover:bg-zinc-900 text-white shadow-zinc-800/10"
            }`}
          >
            <span>Go {availability === "Online" ? "Offline" : "Online"}</span>
          </button>
        </div>

        {/* Overview Dashboard Hub */}
        {currentView === "overview" && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid gap-5 grid-cols-2 sm:grid-cols-4">
              <StatCard label="Today's Earnings" value={stats.todayEarnings} detail="Base fares, bonuses, tips" icon={Coins} />
              <StatCard label="Active Requests" value={availability === "Online" ? requests.length.toString() : "0"} detail="Trips in pool waiting" icon={CarFront} />
              <StatCard label="Completed Rides" value={stats.completedRidesCount.toString()} detail="Trips done this shift" icon={TrendingUp} />
              <StatCard label="Driver Rating" value={stats.driverRating} detail="Top Vetted Operator" icon={UserCircle2} />
            </div>

            {/* Main dashboard columns */}
            <div className="grid gap-6 grid-cols-1 md:grid-cols-[1.2fr_0.8fr]">
              {/* Requests Queue Column */}
              <div className="bg-white border border-zinc-200 p-6 rounded-3xl shadow-sm space-y-5">
                <SectionHeading eyebrow="DRIVER QUEUE" title="Active Ride Requests" description="Incoming booking requests waiting for your immediate approval." />
                
                <div className="space-y-4">
                  {availability === "Offline" ? (
                    <div className="py-12 text-center flex flex-col items-center justify-center space-y-4 border border-dashed border-zinc-200 rounded-2xl bg-zinc-50/50">
                      <div className="p-3 bg-zinc-100 border border-zinc-200 rounded-xl text-zinc-400">
                        <CarFront className="w-6 h-6 stroke-[1.5]" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-sm font-extrabold text-zinc-950">You are offline</h4>
                        <p className="text-xs text-zinc-500 max-w-[240px] mx-auto font-semibold leading-normal">
                          Go online using the status toggle controls to start receiving live incoming ride requests.
                        </p>
                      </div>
                    </div>
                  ) : requests.length > 0 ? (
                    requests.map((request) => (
                      <RideTile
                        key={request.id}
                        rider={request.rider}
                        route={request.pickup}
                        meta={`${request.destination} · ${request.distance}`}
                        amount={request.fare}
                        tier={request.tier}
                        status={request.status}
                        onAccept={() => handleAcceptRequest(request.id)}
                        onDecline={() => handleDeclineRequest(request.id)}
                      />
                    ))
                  ) : (
                    <div className="py-12 text-center flex flex-col items-center justify-center space-y-4 border border-dashed border-zinc-200 rounded-2xl bg-zinc-50/50">
                      <div className="p-3 bg-zinc-100 border border-zinc-200 rounded-xl text-zinc-400">
                        <CircleDot className="w-5 h-5 animate-pulse text-zinc-500" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-sm font-extrabold text-zinc-950">Queue is clear</h4>
                        <p className="text-xs text-zinc-500 font-semibold">
                          Waiting for new incoming passenger requests in your city...
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Sidebar Profile & History Column */}
              <div className="bg-zinc-50 border border-zinc-200 p-6 rounded-3xl shadow-sm space-y-6">
                <SectionHeading eyebrow="PROFILE HUB" title="Driver Overview" description="Operator verification badges and completed shift trips." />
                
                <div className="bg-white border border-zinc-200 p-5 rounded-2xl shadow-3xs space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-900 text-sm font-black text-white shadow-md">
                      {driverProfile.initials}
                    </div>
                    <div>
                      <p className="text-base font-bold text-zinc-950 leading-tight">{driverProfile.name}</p>
                      <p className="text-[10px] text-zinc-450 font-bold uppercase mt-0.5 tracking-wider">{driverProfile.city} Operator</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 text-xs font-semibold text-zinc-800">
                    <div className="bg-zinc-50 border border-zinc-200 p-3 rounded-xl">
                      <p className="text-[8px] font-bold uppercase tracking-wider text-zinc-400">VEHICLE CLASS</p>
                      <p className="mt-1 font-bold text-zinc-900 leading-tight">{driverProfile.vehicle}</p>
                    </div>
                    <div className="bg-zinc-50 border border-zinc-200 p-3 rounded-xl">
                      <p className="text-[8px] font-bold uppercase tracking-wider text-zinc-400">PLATE NUMBER</p>
                      <p className="mt-1 font-bold text-zinc-900 leading-tight font-mono">{driverProfile.plate}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs font-semibold text-zinc-500 pt-1">
                    <ShieldCheck className="h-4 w-4 text-emerald-600" />
                    <span>Background Verified • Joined {driverProfile.memberSince}</span>
                  </div>
                </div>

                <div className="h-[1px] bg-zinc-200 my-2" />

                <div className="space-y-4">
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">LATEST COMPLETED RUNS</h4>
                  {completed.slice(0, 3).map((ride) => (
                    <div key={ride.id} className="bg-white border border-zinc-200 p-4 rounded-xl shadow-3xs space-y-3">
                      <div className="flex items-center justify-between gap-3">
                        <span className={`rounded-full px-2.5 py-0.5 text-[8.5px] font-bold uppercase tracking-wider shadow-3xs ${tierStyles[ride.tier] || "bg-zinc-100"}`}>
                          {ride.tier}
                        </span>
                        <span className="text-[10.5px] text-zinc-400 font-bold">{ride.time}</span>
                      </div>
                      <div>
                        <p className="text-[10px] text-zinc-400 uppercase tracking-wider leading-none">Passenger</p>
                        <p className="text-xs font-bold text-zinc-800 leading-tight mt-1">{ride.rider}</p>
                        
                        <p className="text-[10px] text-zinc-400 uppercase tracking-wider leading-none mt-3">Route</p>
                        <p className="text-xs font-bold text-zinc-900 leading-tight mt-1 truncate">{ride.route}</p>
                      </div>
                      <div className="flex items-center justify-between text-xs font-semibold text-zinc-500 border-t border-zinc-100 pt-2.5 mt-1 leading-none">
                        <span>{ride.rating} Rating ★</span>
                        <span className="font-extrabold text-zinc-950">{ride.payout}</span>
                      </div>
                    </div>
                  ))}
                  {completed.length === 0 && (
                    <p className="text-xs text-zinc-450 font-semibold text-center py-4">No completed runs recorded.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Rides List Hub */}
        {currentView === "rides" && (
          <div className="space-y-8">
            <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
              {/* Requests Column */}
              <div className="bg-white border border-zinc-200 p-5 rounded-3xl shadow-sm space-y-4">
                <SectionHeading eyebrow="INCOMING" title="Requests Queue" description="Trips waiting for your dispatcher approval." />
                
                <div className="space-y-3.5">
                  {availability === "Offline" ? (
                    <div className="py-8 text-center flex flex-col items-center justify-center space-y-3">
                      <CarFront className="w-5 h-5 text-zinc-400" />
                      <p className="text-xs text-zinc-500 font-semibold">Offline. Go online to see requests.</p>
                    </div>
                  ) : requests.length > 0 ? (
                    requests.map((request) => (
                      <RideTile
                        key={request.id}
                        rider={request.rider}
                        route={request.pickup}
                        meta={`${request.destination} · ${request.distance}`}
                        amount={request.fare}
                        tier={request.tier}
                        status={request.status}
                        onAccept={() => handleAcceptRequest(request.id)}
                        onDecline={() => handleDeclineRequest(request.id)}
                      />
                    ))
                  ) : (
                    <div className="py-12 text-center flex flex-col items-center justify-center space-y-3">
                      <CircleDot className="w-4 h-4 text-zinc-500 animate-pulse" />
                      <p className="text-xs text-zinc-500 font-semibold">Queue is clear.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Assigned Column */}
              <div className="bg-white border border-zinc-200 p-5 rounded-3xl shadow-sm space-y-4">
                <SectionHeading eyebrow="ASSIGNED" title="Active Dispatches" description="Accepted trips in transit or pickup phase." />
                
                <div className="space-y-3.5">
                  {accepted.length > 0 ? (
                    accepted.map((ride) => (
                      <RideTile
                        key={ride.id}
                        rider={ride.rider}
                        route={ride.route}
                        meta={ride.eta}
                        amount={ride.fare}
                        tier={ride.tier}
                        status={ride.status}
                        onUpdateStatus={(newStatus) => handleUpdateRideStatus(ride.id, newStatus)}
                        onComplete={() => handleCompleteRide(ride.id)}
                      />
                    ))
                  ) : (
                    <div className="py-12 text-center flex flex-col items-center justify-center space-y-4 border border-dashed border-zinc-200 bg-zinc-50/50 rounded-2xl">
                      <CarFront className="w-5 h-5 text-zinc-400" />
                      <p className="text-xs text-zinc-500 font-semibold max-w-[200px] mx-auto text-center leading-normal">
                        No assigned rides. Accept requests from the queue to start.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Completed Column */}
              <div className="bg-white border border-zinc-200 p-5 rounded-3xl shadow-sm space-y-4">
                <SectionHeading eyebrow="SHIFT JOURNAL" title="Completed Runs" description="Successfully closed dispatches this shift." />
                
                <div className="space-y-3.5">
                  {completed.length > 0 ? (
                    completed.map((ride) => (
                      <RideTile
                        key={ride.id}
                        rider={ride.rider}
                        route={ride.route}
                        meta={`${ride.time} · ${ride.rating} rating`}
                        amount={ride.payout}
                        tier={ride.tier}
                      />
                    ))
                  ) : (
                    <div className="py-12 text-center text-xs text-zinc-450 font-semibold">
                      No rides completed yet.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Earnings Hub */}
        {currentView === "earnings" && (
          <div className="space-y-8">
            <div className="bg-white border border-zinc-200 p-6 rounded-3xl shadow-sm">
              <SectionHeading eyebrow="FINANCE CENTER" title="Weekly & Monthly Payouts" description="A clean transparent review of completed shift payouts, bonus incentives, and tips." />
              
              <div className="mt-6 grid gap-4 grid-cols-2 sm:grid-cols-5">
                <StatCard label="Weekly Earnings" value="₹12,450" detail="5-day shift total" icon={TrendingUp} />
                {monthlyEarnings.map((item) => (
                  <StatCard key={item.label} label={item.label} value={item.value} detail={item.note} icon={Coins} />
                ))}
              </div>
            </div>

            <div className="grid gap-6 grid-cols-1 md:grid-cols-[1.2fr_0.8fr]">
              {/* Monthly Summary Cards */}
              <div className="bg-white border border-zinc-200 p-6 rounded-3xl shadow-sm space-y-5">
                <SectionHeading eyebrow="FINANCE METRICS" title="Monthly Summary Cards" description="Month-to-date shift aggregates and rush-hour surge payouts." />
                
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                  {earningsSummaryCards.map((item) => (
                    <div key={item.label} className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 shadow-3xs hover-lift">
                      <p className="text-[8.5px] font-bold uppercase tracking-wider text-zinc-400">{item.label}</p>
                      <p className="mt-1.5 text-xl font-black text-zinc-950">{item.value}</p>
                      <p className="mt-1 text-xs font-semibold text-zinc-500">{item.note}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Weekly payouts list column */}
              <div className="bg-white border border-zinc-200 p-6 rounded-3xl shadow-sm space-y-6">
                <SectionHeading eyebrow="SHIFT SCHEDULE" title="Weekly Payout Journal" description="Recent day shift pay structures." />
                
                <div className="space-y-3">
                  {weeklyPayouts.map((item) => (
                    <div key={item.label} className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 shadow-3xs">
                      <div className="flex items-center justify-between gap-3 leading-none">
                        <div>
                          <p className="text-xs font-bold uppercase tracking-wider text-zinc-450">{item.label}</p>
                          <p className="text-[11px] text-zinc-500 mt-1 font-semibold">{item.note}</p>
                        </div>
                        <p className="text-base font-extrabold text-zinc-950">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-4 text-white shadow-sm">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-zinc-400">DAILY ACCRUED PAYOUT</p>
                  <p className="mt-2 text-2xl font-black">{stats.todayEarnings}</p>
                  <p className="mt-2 text-[10px] text-zinc-400 font-semibold">Expected shift payout finalized at midnight tonight</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Sync loading overlay */}
      {loading && (
        <div className="absolute inset-0 bg-white/40 backdrop-blur-3xs z-50 flex items-center justify-center min-h-[500px]">
          <div className="flex flex-col items-center space-y-3 p-6 bg-white/95 border border-zinc-200 shadow-xl rounded-3xl">
            <Loader2 className="w-8 h-8 text-zinc-950 animate-spin stroke-[1.5]" />
            <span className="text-[10px] font-mono font-black text-zinc-550 uppercase tracking-widest">Syncing Operator Console...</span>
          </div>
        </div>
      )}
    </main>
  );
}
