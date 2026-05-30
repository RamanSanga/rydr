"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, type ComponentType } from "react";
import { CarFront, Circle, CircleDot, Coins, ShieldCheck, TrendingUp, UserCircle2, Loader2 } from "lucide-react";
import {
  acceptedRides,
  completedRides,
  driverProfile,
  earningsBreakdown,
  earningsSummaryCards,
  monthlyEarnings,
  rideRequests,
  weeklyPayouts,
  type DriverAvailability,
  type DriverRideStatus,
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
  "New Request": "bg-amber-50 text-amber-700 border-amber-250/65",
  Accepted: "bg-blue-50 text-blue-700 border-blue-250/65",
  "Driver Arriving": "bg-blue-50 text-blue-700 border-blue-250/65",
  "On Trip": "bg-emerald-50 text-emerald-700 border-emerald-250/65",
  Completed: "bg-zinc-100 text-zinc-700 border-zinc-200",
  Cancelled: "bg-red-50 text-red-700 border-red-250/65",
};

const tierStyles: Record<string, string> = {
  Daily: "bg-zinc-100 text-zinc-700",
  "EV Eco": "bg-emerald-50 text-emerald-700",
  Luxe: "bg-amber-50 text-amber-700",
};

function TopLink({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={`rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] transition-colors ${
        active ? "border-zinc-950 bg-zinc-950 text-white" : "border-zinc-200 bg-white text-zinc-500 hover:border-zinc-300 hover:text-zinc-950"
      }`}
    >
      {label}
    </Link>
  );
}

function SectionHeading({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <div className="space-y-2">
      <p className="text-[10px] font-mono font-bold uppercase tracking-[0.32em] text-amber-600">{eyebrow}</p>
      <h2 className="text-2xl font-black tracking-tighter text-zinc-950 md:text-3xl">{title}</h2>
      <p className="max-w-2xl text-sm font-medium text-zinc-500">{description}</p>
    </div>
  );
}

function StatCard({ label, value, detail, icon: Icon }: { label: string; value: string; detail: string; icon: IconType }) {
  return (
    <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-3xs hover:border-zinc-350 transition-colors duration-200">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl border border-zinc-200 bg-zinc-50 text-zinc-950 shadow-3xs">
        <Icon className="h-4 w-4" />
      </div>
      <p className="text-xs font-mono font-bold uppercase tracking-[0.24em] text-zinc-400">{label}</p>
      <p className="mt-2 text-3xl font-black tracking-tighter text-zinc-950 leading-none">{value}</p>
      <p className="mt-2.5 text-xs font-semibold text-zinc-500">{detail}</p>
    </div>
  );
}

function AvailabilityToggle({ availability, setAvailability }: { availability: DriverAvailability; setAvailability: (value: DriverAvailability) => void }) {
  return (
    <div className="flex items-center gap-3">
      <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-1.5 shadow-3xs">
        <button onClick={() => setAvailability("Offline")} className={`rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] transition-colors cursor-pointer ${availability === "Offline" ? "bg-white text-zinc-950 shadow-sm" : "text-zinc-500 hover:text-zinc-950"}`}>
          Offline
        </button>
        <button onClick={() => setAvailability("Online")} className={`rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] transition-colors cursor-pointer ${availability === "Online" ? "bg-zinc-950 text-white shadow-sm" : "text-zinc-500 hover:text-zinc-950"}`}>
          Online
        </button>
      </div>
      <div className={`flex items-center gap-2 rounded-2xl border px-4 py-3 text-xs font-bold uppercase tracking-wider shadow-3xs transition-all duration-150 ${availability === "Online" ? "border-emerald-250 bg-emerald-50 text-emerald-700" : "border-zinc-250 bg-zinc-50 text-zinc-650"}`}>
        {availability === "Online" ? <CircleDot className="h-4 w-4 animate-pulse" /> : <Circle className="h-4 w-4" />}
        <span>{availability}</span>
      </div>
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
  status?: DriverRideStatus | string;
  onAccept?: () => void;
  onDecline?: () => void;
  onUpdateStatus?: (status: string) => void;
  onComplete?: () => void;
}) {
  return (
    <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-3xs hover:border-zinc-350 hover:shadow-2xs transition-all duration-200">
      <div className="flex items-center justify-between gap-3">
        {status ? (
          <span className={`rounded-full border px-2.5 py-0.5 text-[9px] font-mono font-black uppercase tracking-wider shadow-3xs ${statusStyles[status]}`}>
            {status}
          </span>
        ) : (
          <span />
        )}
        <span className={`rounded-full px-2.5 py-0.5 text-[9px] font-mono font-black uppercase tracking-wider shadow-3xs ${tierStyles[tier]}`}>
          {tier}
        </span>
      </div>
      
      <p className="mt-3.5 text-[9.5px] font-mono font-bold text-zinc-400 uppercase tracking-widest leading-none">Passenger</p>
      <p className="mt-1 text-sm font-extrabold text-zinc-900 leading-tight">{rider}</p>
      
      <p className="mt-3.5 text-[9.5px] font-mono font-bold text-zinc-400 uppercase tracking-widest leading-none">Route Corridor</p>
      <p className="mt-1 text-[13.5px] font-black tracking-tight text-zinc-900 leading-tight">{route}</p>
      
      <div className="mt-4 flex items-center justify-between gap-3 text-xs text-zinc-500 font-semibold border-t border-zinc-100 pt-3">
        <span>{meta}</span>
        <span className="text-[15px] font-black text-zinc-950 font-sans">{amount}</span>
      </div>

      {/* Accept & Decline incoming triggers */}
      {(onAccept || onDecline) && (
        <div className="mt-4 flex items-center gap-2 pt-3 border-t border-zinc-100">
          {onDecline && (
            <button
              onClick={onDecline}
              className="flex-1 py-2 bg-zinc-50 hover:bg-zinc-100 text-zinc-700 font-bold border border-zinc-200 text-xs rounded-xl transition-all cursor-pointer shadow-3xs active:scale-97"
            >
              Decline
            </button>
          )}
          {onAccept && (
            <button
              onClick={onAccept}
              className="flex-1 py-2 bg-black hover:bg-zinc-800 text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow-3xs active:scale-97"
            >
              Accept Request
            </button>
          )}
        </div>
      )}

      {/* Active Trip Progress buttons */}
      {(onUpdateStatus || onComplete) && (
        <div className="mt-4 pt-3 border-t border-zinc-100">
          {status === "Accepted" && onUpdateStatus && (
            <button
              onClick={() => onUpdateStatus("Driver Arriving")}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow-3xs active:scale-97"
            >
              Mark Arrived
            </button>
          )}
          {status === "Driver Arriving" && onUpdateStatus && (
            <button
              onClick={() => onUpdateStatus("On Trip")}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow-3xs active:scale-97"
            >
              Start Trip
            </button>
          )}
          {status === "On Trip" && onComplete && (
            <button
              onClick={onComplete}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow-3xs active:scale-97 flex items-center justify-center space-x-1.5"
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
  const pathname = usePathname();
  const [availability, setAvailability] = useState<DriverAvailability>("Online");
  const [loading, setLoading] = useState(true);

  // Temporary Debug State
  const [debugLat, setDebugLat] = useState<number | null>(null);
  const [debugLng, setDebugLng] = useState<number | null>(null);
  const [debugLastUpdated, setDebugLastUpdated] = useState<string | null>(null);


  // Reactive operational queues loaded from PostgreSQL DB actions
  const [requests, setRequests] = useState<any[]>([]);
  const [accepted, setAccepted] = useState<any[]>([]);
  const [completed, setCompleted] = useState<any[]>([]);
  const [stats, setStats] = useState({
    todayEarnings: "₹0",
    activeRequestsCount: 0,
    completedRidesCount: 0,
    driverRating: "4.99 ★",
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
          pickup: r.pickup.split(",")[0],
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
    
    // Interval for fetching ride requests repeatedly
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
              setDebugLat(position.coords.latitude);
              setDebugLng(position.coords.longitude);
              setDebugLastUpdated(new Date().toLocaleTimeString());
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
            // We do NOT use fallback coordinates anymore. Must be based on rider/driver actual location.
          },
          { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
        );
      }
    };

    if (availability === "Online") {
      // Push immediately, then every 10 seconds
      pushLocation();
      geoInterval = setInterval(pushLocation, 10000);
    } else {
      // Push once to set as offline
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
    <main className="relative min-h-screen overflow-hidden bg-[#F8F8F8] text-[#111111] antialiased pb-12 pt-6">
      <div className="absolute inset-0 premium-grid-fine opacity-[0.07] pointer-events-none" />
      
      <div className="relative z-10 mx-auto max-w-[1400px] px-6 space-y-6">
        
        {/* Navigation blurred sticky bar */}
        <div className="flex flex-col gap-4 rounded-3xl border border-zinc-200 bg-white/95 p-4 shadow-3xs backdrop-blur-md lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-xl font-black tracking-tighter text-[#111111] hover:opacity-90 transition-opacity">
              RYDR
            </Link>
            <span className="rounded-full border border-amber-250 bg-amber-50 px-2.5 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider text-amber-700 shadow-3xs">
              Driver Portal
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <TopLink href="/driver" label="Dashboard" active={pathname === "/driver"} />
            <TopLink href="/driver/rides" label="Rides" active={pathname === "/driver/rides"} />
            <TopLink href="/driver/earnings" label="Earnings" active={pathname === "/driver/earnings"} />
          </div>

          <AvailabilityToggle availability={availability} setAvailability={setAvailability} />
        </div>

        {/* Overview Dashboard Hub */}
        {view === "overview" && (
          <div className="space-y-6">
            <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-3xs">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                <SectionHeading eyebrow="DRIVER CONSOLE" title="Shift Control Panel" description="Simple trips, live payouts, and status toggle at a glance." />
                <AvailabilityToggle availability={availability} setAvailability={setAvailability} />
              </div>

              <div className="mt-6 grid gap-4 grid-cols-2 lg:grid-cols-4">
                <StatCard label="Today's Earnings" value={stats.todayEarnings} detail="Base fares, bonuses, and tips" icon={Coins} />
                <StatCard label="Ride Requests" value={availability === "Online" ? requests.length.toString() : "0"} detail="Waiting to be accepted" icon={CarFront} />
                <StatCard label="Completed Rides" value={stats.completedRidesCount.toString()} detail="Trips finished this shift" icon={TrendingUp} />
                <StatCard label="Driver Profile" value={stats.driverRating} detail="Top Rated Operator" icon={UserCircle2} />
              </div>
            </section>

            {/* TEMPORARY DEBUG UI */}
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 shadow-sm mb-6 text-xs text-red-900 font-mono">
              <h3 className="font-bold mb-2 uppercase text-red-700">Driver Debug Info</h3>
              <p>Current Latitude: {debugLat ?? "Detecting..."}</p>
              <p>Current Longitude: {debugLng ?? "Detecting..."}</p>
              <p>Online Status: <span className="font-bold">{availability}</span></p>
              <p>Last Updated Time: {debugLastUpdated ?? "N/A"}</p>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
              {/* Requests Queue column */}
              <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-3xs space-y-5">
                <SectionHeading eyebrow="DRIVER QUEUE" title="Active Ride Requests" description="Incoming booking requests waiting for your immediate dispatcher approval." />
                
                <div className="space-y-4">
                  {availability === "Offline" ? (
                    <div className="py-12 text-center flex flex-col items-center justify-center space-y-4 border border-dashed border-zinc-200 rounded-3xl bg-zinc-50/50">
                      <div className="p-3.5 bg-zinc-100 border border-zinc-200 rounded-2xl text-zinc-400 shadow-3xs">
                        <CarFront className="w-7 h-7 stroke-[1.5]" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-sm font-extrabold text-zinc-950">You are offline</h4>
                        <p className="text-xs text-zinc-500 max-w-[280px] mx-auto font-semibold leading-normal">
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
                    <div className="py-12 text-center flex flex-col items-center justify-center space-y-4 border border-dashed border-zinc-200 rounded-3xl bg-zinc-50/50">
                      <div className="p-3.5 bg-zinc-100 border border-zinc-200 rounded-2xl text-zinc-400 shadow-3xs">
                        <CircleDot className="w-6 h-6 animate-pulse text-zinc-500" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-sm font-extrabold text-zinc-950 font-sans">Queue is clear</h4>
                        <p className="text-xs text-zinc-500 font-semibold">
                          Waiting for new incoming passenger requests in Bengaluru...
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </section>

              {/* Sidebar Profile & History column */}
              <section className="rounded-3xl border border-zinc-200 bg-zinc-50 p-6 shadow-3xs space-y-5">
                <SectionHeading eyebrow="PROFILE HUB" title="Driver Overview" description="Operator verification badges and completed shift trips." />
                
                <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-3xs space-y-4.5">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#111111] text-sm font-black text-white shadow-md">
                      {driverProfile.initials}
                    </div>
                    <div>
                      <p className="text-base font-black text-zinc-950 leading-tight">{driverProfile.name}</p>
                      <p className="text-[11px] text-zinc-400 font-bold uppercase mt-0.5 tracking-wider">{driverProfile.city} Operator</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3.5 text-xs font-semibold text-zinc-800">
                    <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-3 shadow-3xs">
                      <p className="text-[8.5px] font-mono font-bold uppercase tracking-wider text-zinc-400">VEHICLE CLASS</p>
                      <p className="mt-1 font-extrabold text-zinc-900 leading-tight">{driverProfile.vehicle}</p>
                    </div>
                    <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-3 shadow-3xs">
                      <p className="text-[8.5px] font-mono font-bold uppercase tracking-wider text-zinc-400">PLATE NUMBER</p>
                      <p className="mt-1 font-extrabold text-zinc-900 leading-tight font-mono">{driverProfile.plate}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs font-semibold text-zinc-500">
                    <ShieldCheck className="h-4.5 w-4.5 text-emerald-600" />
                    <span>Background Verified • Joined {driverProfile.memberSince}</span>
                  </div>
                </div>

                <div className="h-[1px] bg-zinc-200 my-2" />

                <div className="space-y-3.5">
                  <h4 className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-450">LATEST COMPLETED RUNS</h4>
                  {completed.slice(0, 3).map((ride) => (
                    <div key={ride.id} className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-3xs hover:border-zinc-300 transition-colors duration-150 space-y-3">
                      <div className="flex items-center justify-between gap-3">
                        <span className={`rounded-full px-2.5 py-0.5 text-[8.5px] font-mono font-black uppercase tracking-wider shadow-3xs ${tierStyles[ride.tier]}`}>
                          {ride.tier}
                        </span>
                        <span className="text-[10.5px] text-zinc-400 font-mono font-bold">{ride.time}</span>
                      </div>
                      <div>
                        <p className="text-[10px] text-zinc-400 font-mono uppercase tracking-wider leading-none">Passenger</p>
                        <p className="text-[12.5px] font-extrabold text-zinc-800 leading-tight mt-1">{ride.rider}</p>
                        
                        <p className="text-[10px] text-zinc-400 font-mono uppercase tracking-wider leading-none mt-3">Route</p>
                        <p className="text-[13px] font-black text-zinc-900 leading-tight mt-1 truncate">{ride.route}</p>
                      </div>
                      <div className="flex items-center justify-between text-xs font-semibold text-zinc-500 border-t border-zinc-100 pt-2.5 mt-1 leading-none">
                        <span>{ride.rating} Rating ★</span>
                        <span className="font-black text-zinc-950 font-sans">{ride.payout}</span>
                      </div>
                    </div>
                  ))}
                  {completed.length === 0 && (
                    <p className="text-xs text-zinc-450 font-semibold text-center py-4">No completed runs recorded.</p>
                  )}
                </div>
              </section>
            </div>
          </div>
        )}

        {/* Rides List Hub */}
        {view === "rides" && (
          <div className="space-y-6">
            <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-3xs">
              <SectionHeading eyebrow="TRIP CONTROL" title="Shift Ride Dispatcher" description="Incoming requests, accepted routing tasks, and shift logs in one centralized control board." />
            </section>

            <div className="grid gap-6 lg:grid-cols-3">
              {/* Requests column */}
              <section className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-3xs space-y-4">
                <SectionHeading eyebrow="INCOMING" title="Requests Queue" description="Trips waiting to be accepted or declined." />
                
                <div className="space-y-3.5">
                  {availability === "Offline" ? (
                    <div className="py-8 text-center flex flex-col items-center justify-center space-y-3">
                      <CarFront className="w-6 h-6 text-zinc-400" />
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
                      <CircleDot className="w-5 h-5 text-zinc-455 animate-pulse" />
                      <p className="text-xs text-zinc-500 font-semibold">Queue is clear.</p>
                    </div>
                  )}
                </div>
              </section>

              {/* Accepted column */}
              <section className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-3xs space-y-4">
                <SectionHeading eyebrow="ASSIGNED" title="Active Dispatches" description="Accepted trips in transit or passenger pickup phase." />
                
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
                      <p className="text-xs text-zinc-500 font-semibold max-w-[200px] mx-auto leading-normal">
                        No assigned rides. Accept requests from the queue to start.
                      </p>
                    </div>
                  )}
                </div>
              </section>

              {/* Completed column */}
              <section className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-3xs space-y-4">
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
              </section>
            </div>
          </div>
        )}

        {/* Earnings Hub */}
        {view === "earnings" && (
          <div className="space-y-6">
            <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-3xs">
              <SectionHeading eyebrow="FINANCE CENTER" title="Weekly & Monthly Payouts" description="A clean transparent review of completed shift payouts, bonus incentives, and tips." />
              
              <div className="mt-6 grid gap-4 grid-cols-2 lg:grid-cols-5">
                <StatCard label="Weekly Earnings" value="₹12,450" detail="5-day shift total" icon={TrendingUp} />
                {monthlyEarnings.map((item) => (
                  <StatCard key={item.label} label={item.label} value={item.value} detail={item.note} icon={Coins} />
                ))}
              </div>
            </section>

            <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
              {/* Monthly breakdown column */}
              <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-3xs space-y-5">
                <SectionHeading eyebrow="FINANCE METRICS" title="Monthly Summary Cards" description="Month-to-date shift aggregates and rush-hour surge payouts." />
                
                <div className="grid gap-4 md:grid-cols-2">
                  {earningsSummaryCards.map((item) => (
                    <div key={item.label} className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 shadow-3xs">
                      <p className="text-[8.5px] font-mono font-bold uppercase tracking-wider text-zinc-450">{item.label}</p>
                      <p className="mt-1.5 text-2xl font-black tracking-tighter text-zinc-950">{item.value}</p>
                      <p className="mt-1 text-xs font-semibold text-zinc-500">{item.note}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Weekly payouts list column */}
              <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-3xs space-y-5">
                <SectionHeading eyebrow="SHIFT SCHEDULE" title="Weekly Payout Journal" description="Recent day shift pay structures." />
                
                <div className="space-y-3">
                  {weeklyPayouts.map((item) => (
                    <div key={item.label} className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 shadow-3xs">
                      <div className="flex items-center justify-between gap-3 leading-none">
                        <div>
                          <p className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-450">{item.label}</p>
                          <p className="text-xs font-semibold text-zinc-500 mt-1">{item.note}</p>
                        </div>
                        <p className="text-base font-black text-zinc-950 font-sans">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="rounded-2xl border border-zinc-200 bg-zinc-950 p-4 text-white shadow-sm">
                  <p className="text-xs font-mono font-bold uppercase tracking-[0.24em] text-zinc-400">DAILY ACCRUED PAYOUT</p>
                  <p className="mt-2 text-3xl font-black tracking-tighter">{stats.todayEarnings}</p>
                  <p className="mt-2 text-xs text-zinc-400 font-semibold">Expected shift payout finalized at midnight tonight</p>
                </div>
              </section>
            </div>
          </div>
        )}
      </div>

      {/* Database sync loading overlay */}
      {loading && (
        <div className="absolute inset-0 bg-white/40 backdrop-blur-3xs z-50 flex items-center justify-center min-h-[500px]">
          <div className="flex flex-col items-center space-y-3 p-6 bg-white/90 border border-zinc-200 shadow-xl rounded-3xl animate-fade-in">
            <Loader2 className="w-8 h-8 text-zinc-950 animate-spin stroke-[1.5]" />
            <span className="text-[10px] font-mono font-black text-zinc-550 uppercase tracking-widest">Syncing Operator Console...</span>
          </div>
        </div>
      )}
    </main>
  );
}
