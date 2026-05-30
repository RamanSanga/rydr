"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, type ComponentType } from "react";
import { CarFront, Circle, CircleDot, Coins, ShieldCheck, TrendingUp, UserCircle2, Loader2, Navigation, MapPin, AlertTriangle, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import { getOnboardingState } from "@/actions/onboarding";
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
import { motion } from "framer-motion";

type DriverPortalView = "overview" | "rides" | "earnings";
type IconType = ComponentType<{ className?: string }>;

const statusStyles: Record<string, string> = {
  "New Request": "bg-amber-500/10 text-amber-600 border-amber-500/20",
  Accepted: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  "Driver Arriving": "bg-indigo-500/10 text-indigo-600 border-indigo-500/20",
  "On Trip": "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  Completed: "bg-zinc-100 text-zinc-600 border-zinc-200",
  Cancelled: "bg-red-500/10 text-red-600 border-red-500/20",
};

const tierStyles: Record<string, string> = {
  Daily: "bg-zinc-150 text-zinc-800",
  "EV Eco": "bg-emerald-500/10 text-emerald-600",
  Luxe: "bg-amber-500/10 text-amber-600",
};

const driverGreetings = [
  "💸 Ready to make some money?",
  "🚖 Riders are waiting.",
  "🔥 Let's make today count.",
  "☕ One more ride before chai?",
  "😎 Online and looking sharp."
];

function SubNavigation({ activeView }: { activeView: DriverPortalView }) {
  return (
    <div className="flex items-center space-x-1.5 p-1 bg-zinc-900/5 rounded-full self-start">
      <Link
        href="/driver"
        className={`px-4 py-1.5 rounded-full text-[12px] font-bold transition-all duration-200 ${
          activeView === "overview"
            ? "bg-white text-zinc-950 shadow-xs"
            : "text-zinc-550 hover:text-zinc-950"
        }`}
      >
        Console
      </Link>
      <Link
        href="/driver/rides"
        className={`px-4 py-1.5 rounded-full text-[12px] font-bold transition-all duration-200 ${
          activeView === "rides"
            ? "bg-white text-zinc-950 shadow-xs"
            : "text-zinc-550 hover:text-zinc-950"
        }`}
      >
        Dispatches
      </Link>
      <Link
        href="/driver/earnings"
        className={`px-4 py-1.5 rounded-full text-[12px] font-bold transition-all duration-200 ${
          activeView === "earnings"
            ? "bg-white text-zinc-950 shadow-xs"
            : "text-zinc-550 hover:text-zinc-950"
        }`}
      >
        Earnings
      </Link>
    </div>
  );
}

function PremiumAvailabilityToggle({ availability, setAvailability }: { availability: DriverAvailability; setAvailability: (value: DriverAvailability) => void }) {
  return (
    <div className="flex items-center gap-3">
      <div className="bg-zinc-900/5 p-1 rounded-full flex items-center shadow-2xs border border-zinc-200/20">
        <button
          onClick={() => setAvailability("Offline")}
          className={`px-4 py-2 rounded-full text-[12px] font-bold transition-all cursor-pointer ${
            availability === "Offline"
              ? "bg-white text-zinc-950 shadow-xs"
              : "text-zinc-500 hover:text-zinc-950"
          }`}
        >
          Offline
        </button>
        <button
          onClick={() => setAvailability("Online")}
          className={`px-4 py-2 rounded-full text-[12px] font-bold transition-all cursor-pointer ${
            availability === "Online"
              ? "bg-zinc-950 text-white shadow-xs"
              : "text-zinc-500 hover:text-zinc-950"
          }`}
        >
          Online
        </button>
      </div>

      <div
        className={`flex items-center gap-1.5 px-4 py-2 rounded-full border text-[11.5px] font-bold shadow-3xs transition-all duration-300 ${
          availability === "Online"
            ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-600"
            : "border-zinc-200 bg-zinc-100 text-zinc-500"
        }`}
      >
        {availability === "Online" ? (
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
        ) : (
          <span className="h-2 w-2 rounded-full bg-zinc-400" />
        )}
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
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.015)] hover:border-zinc-400 transition-all duration-200">
      <div className="flex items-center justify-between mb-4.5">
        <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-wide uppercase ${tierStyles[tier]}`}>
          {tier}
        </span>
        {status && (
          <span className={`rounded-full px-2.5 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider ${statusStyles[status]}`}>
            {status}
          </span>
        )}
      </div>
      
      <div className="space-y-3.5">
        <div>
          <p className="text-[10px] font-mono font-semibold text-zinc-400 uppercase tracking-widest leading-none">Passenger</p>
          <p className="text-[13.5px] font-bold text-zinc-950 mt-1">{rider}</p>
        </div>
        
        <div>
          <p className="text-[10px] font-mono font-semibold text-zinc-400 uppercase tracking-widest leading-none">Trip Route</p>
          <div className="flex items-start gap-2 mt-1.5">
            <div className="flex flex-col items-center mt-1">
              <div className="w-1.5 h-1.5 rounded-full bg-zinc-950" />
              <div className="w-[1.5px] h-4 bg-zinc-200" />
              <div className="w-1.5 h-1.5 rounded-full border border-zinc-950 bg-white" />
            </div>
            <div className="text-[13px] text-zinc-800 leading-snug font-semibold">
              <p className="text-zinc-950">{route}</p>
              <p className="text-zinc-450 text-[11.5px] font-normal mt-0.5">{meta}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-5 flex items-center justify-between border-t border-zinc-100 pt-4.5">
        <span className="text-[11px] font-mono font-bold text-zinc-400 uppercase">Payout</span>
        <span className="text-lg font-black text-zinc-950">{amount}</span>
      </div>

      {/* Accept & Decline incoming triggers */}
      {(onAccept || onDecline) && (
        <div className="mt-4 flex items-center gap-2">
          {onDecline && (
            <button
              onClick={onDecline}
              className="flex-1 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold text-xs rounded-full transition-all cursor-pointer active:scale-97"
            >
              Pass
            </button>
          )}
          {onAccept && (
            <button
              onClick={onAccept}
              className="flex-1 py-2.5 bg-zinc-950 hover:bg-zinc-850 text-white font-bold text-xs rounded-full transition-all cursor-pointer active:scale-97 shadow-sm"
            >
              Accept Trip
            </button>
          )}
        </div>
      )}

      {/* Active Trip Progress buttons */}
      {(onUpdateStatus || onComplete) && (
        <div className="mt-4">
          {status === "Accepted" && onUpdateStatus && (
            <button
              onClick={() => onUpdateStatus("Driver Arriving")}
              className="w-full py-2.5 bg-zinc-950 hover:bg-zinc-850 text-white font-bold text-xs rounded-full transition-all cursor-pointer active:scale-97"
            >
              Mark Arrived
            </button>
          )}
          {status === "Driver Arriving" && onUpdateStatus && (
            <button
              onClick={() => onUpdateStatus("On Trip")}
              className="w-full py-2.5 bg-zinc-950 hover:bg-zinc-850 text-white font-bold text-xs rounded-full transition-all cursor-pointer active:scale-97"
            >
              Start Ride
            </button>
          )}
          {status === "On Trip" && onComplete && (
            <button
              onClick={onComplete}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-full transition-all cursor-pointer active:scale-97 flex items-center justify-center space-x-1.5"
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
  const router = useRouter();
  const pathname = usePathname();
  const [availability, setAvailability] = useState<DriverAvailability>("Offline"); // Default to Offline when checking status
  const [verificationStatus, setVerificationStatus] = useState<string>("Pending");
  const [rejectionReason, setRejectionReason] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [greeting, setGreeting] = useState(driverGreetings[0]);

  // Temporary Debug State styled beautifully
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

  useEffect(() => {
    setGreeting(driverGreetings[Math.floor(Math.random() * driverGreetings.length)]);
  }, []);

  const loadDashboardData = async () => {
    try {
      const state = await getOnboardingState();
      if (!state.success || !state.roleSelected) {
        router.push("/select-role");
        return;
      }
      if (!state.onboarded || state.role !== "driver") {
        router.push("/onboarding");
        return;
      }

      setVerificationStatus(state.driverProfile?.verificationStatus || "Pending");
      setRejectionReason(state.driverProfile?.rejectionReason || null);

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

  if (verificationStatus !== "Approved") {
    return (
      <main className="relative min-h-screen bg-zinc-50 text-zinc-900 antialiased pb-20 pt-28">
        <div className="absolute inset-0 premium-grid-fine opacity-[0.04] pointer-events-none" />
        <Navbar />

        <div className="max-w-[600px] mx-auto px-6 relative z-10 pt-8 text-center space-y-6">
          <div className="relative flex justify-center">
            {verificationStatus === "Rejected" ? (
              <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 text-red-600 flex items-center justify-center shadow-lg animate-float-slow">
                <AlertTriangle className="w-7 h-7" />
              </div>
            ) : (
              <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 flex items-center justify-center shadow-lg animate-float-slow">
                <Loader2 className="w-7 h-7 animate-spin" />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <span className={`text-[10px] font-mono tracking-widest font-extrabold uppercase px-3.5 py-1 rounded-full border ${
              verificationStatus === "Rejected"
                ? "bg-red-50 text-red-600 border-red-200"
                : "bg-amber-50 text-amber-600 border-amber-200"
            }`}>
              Verification: {verificationStatus}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tighter text-zinc-950">
              {verificationStatus === "Rejected" ? "Verification Rejected" : "Compliance Verification Pending"}
            </h1>
            <p className="text-xs text-zinc-500 font-semibold leading-relaxed max-w-sm mx-auto">
              {verificationStatus === "Rejected"
                ? "Your document review has been declined. Please check the reason below and re-submit your onboarding data."
                : "Your professional driver credentials and vehicle files are currently under compliance review. You cannot go online until approved."}
            </p>
          </div>

          {verificationStatus === "Rejected" && rejectionReason && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-5 text-left max-w-md mx-auto space-y-1">
              <span className="text-[10px] font-mono font-bold text-red-500 uppercase tracking-wide">Declined Reason</span>
              <p className="text-xs font-bold text-red-800 leading-normal">{rejectionReason}</p>
            </div>
          )}

          <div className="bg-white border border-zinc-200 rounded-3xl p-6 text-left max-w-md mx-auto space-y-3 font-mono text-[11px] text-zinc-650 shadow-sm">
            <div className="flex justify-between pb-2 border-b border-zinc-150 font-bold text-zinc-900 uppercase">
              <span>CHECKLIST</span>
              <span>STATUS</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Aadhaar & PAN Match</span>
              <span className="text-emerald-600 font-bold uppercase text-[9.5px]">✓ Submitted</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Driving License</span>
              <span className="text-emerald-600 font-bold uppercase text-[9.5px]">✓ Submitted</span>
            </div>
            <div className="flex justify-between items-center">
              <span>RC & Insurance</span>
              <span className="text-emerald-600 font-bold uppercase text-[9.5px]">✓ Submitted</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Compliance Review</span>
              {verificationStatus === "Rejected" ? (
                <span className="text-red-600 font-bold uppercase text-[9.5px]">✕ Rejected</span>
              ) : (
                <span className="text-amber-600 font-bold uppercase text-[9.5px] animate-pulse">● In Review</span>
              )}
            </div>
          </div>

          <div className="pt-6 space-y-4">
            {verificationStatus === "Rejected" && (
              <button
                onClick={() => router.push("/onboarding")}
                className="w-full max-w-[200px] mx-auto py-2.5 bg-zinc-950 hover:bg-zinc-850 active:scale-97 text-white font-bold text-xs rounded-full transition-all shadow-sm"
              >
                Re-submit Documents
              </button>
            )}

            <div className="text-[11.5px] text-zinc-400 font-semibold">
              Testing RYDR?{" "}
              <Link href="/admin" className="text-zinc-900 font-extrabold hover:underline inline-flex items-center space-x-0.5">
                <span>Open Admin Dashboard to Approve</span>
                <ArrowRight className="w-3.5 h-3.5 text-zinc-800" />
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen bg-zinc-50 text-zinc-900 antialiased pb-20 pt-28">
      {/* Global backdrop visual grid */}
      <div className="absolute inset-0 premium-grid-fine opacity-[0.04] pointer-events-none" />
      <Navbar />

      <div className="max-w-[1200px] mx-auto px-6 sm:px-8 relative z-10 space-y-8">
        
        {/* Core Controls Header (Spacious and Premium) */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 pb-6 border-b border-zinc-200/60">
          <div className="space-y-1.5">
            <p className="text-[11px] font-mono font-bold tracking-[0.25em] text-zinc-400 uppercase leading-none">
              Driver portal
            </p>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tighter text-zinc-950 leading-tight">
              {greeting}
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <SubNavigation activeView={view} />
            <PremiumAvailabilityToggle availability={availability} setAvailability={setAvailability} />
          </div>
        </div>

        {/* ── View: Overview (Console) ── */}
        {view === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Main Stream: Shift Earnings & Live Queue */}
            <div className="lg:col-span-8 space-y-8">
              
              {/* Premium Shift Earnings Banner (No bulky boxes) */}
              <div className="bg-zinc-950 text-white rounded-3xl p-6.5 relative overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.08)]">
                {/* background lights */}
                <div className="absolute right-0 bottom-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
                
                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-mono font-bold tracking-widest text-zinc-400 uppercase">Shift Earnings</span>
                    <h2 className="text-4xl sm:text-5xl font-black tracking-tighter text-white mt-1.5">{stats.todayEarnings}</h2>
                    <p className="text-[12px] text-zinc-400 font-semibold mt-1">Base fares + tips accumulated today</p>
                  </div>
                  
                  <div className="flex items-center gap-6 text-right sm:border-l sm:border-zinc-800 sm:pl-8">
                    <div>
                      <span className="text-[10px] font-mono font-bold tracking-widest text-zinc-400 uppercase">Runs</span>
                      <p className="text-2xl font-black text-white mt-1">{stats.completedRidesCount}</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono font-bold tracking-widest text-zinc-400 uppercase">Rating</span>
                      <p className="text-2xl font-black text-white mt-1">{stats.driverRating}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Live Ride Requests Queue */}
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-black tracking-tight text-zinc-900">Live Requests Feed</h3>
                  {availability === "Online" && (
                    <span className="text-[10.5px] text-emerald-600 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-full animate-pulse">
                      Live dispatching...
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {availability === "Offline" ? (
                    <div className="col-span-full py-16 text-center border border-dashed border-zinc-200/80 bg-white rounded-3xl flex flex-col items-center justify-center space-y-4 shadow-sm">
                      <div className="p-4 bg-zinc-50 rounded-2xl text-zinc-400 border border-zinc-100">
                        <CarFront className="w-8 h-8" />
                      </div>
                      <div>
                        <h4 className="text-[14px] font-bold text-zinc-950">You are currently offline</h4>
                        <p className="text-xs text-zinc-450 font-semibold max-w-[280px] mx-auto mt-1 leading-normal">
                          Go online using the controller toggle to start receiving live incoming client bookings in Delhi NCR.
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
                    <div className="col-span-full py-16 text-center border border-dashed border-zinc-200/80 bg-white rounded-3xl flex flex-col items-center justify-center space-y-4 shadow-sm">
                      <div className="h-8 w-8 rounded-full border-2 border-zinc-450 border-t-transparent animate-spin" />
                      <div>
                        <h4 className="text-[14px] font-bold text-zinc-950">Waiting for requests...</h4>
                        <p className="text-xs text-zinc-450 font-semibold mt-1">
                          The dispatch board is currently clear. Stand by at local hot spots for premium rides.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </section>

              {/* Expanded, Telemetry-styled Debug Block (Premium design) */}
              <div className="bg-zinc-900 text-zinc-400 border border-zinc-800 rounded-3xl p-5 shadow-inner">
                <div className="flex items-center justify-between pb-3 border-b border-zinc-800 mb-3.5">
                  <span className="text-[10px] font-mono font-bold tracking-[0.2em] text-zinc-450 uppercase">REAL-TIME GPS TELEMETRY</span>
                  <span className="text-[10.5px] font-mono text-zinc-550">{debugLastUpdated ?? "Standby"}</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-[11.5px] text-zinc-300">
                  <div>
                    <p className="text-zinc-550 text-[9.5px] uppercase">Latitude</p>
                    <p className="font-bold text-white mt-0.5">{debugLat ? debugLat.toFixed(5) : "Searching GPS..."}</p>
                  </div>
                  <div>
                    <p className="text-zinc-550 text-[9.5px] uppercase">Longitude</p>
                    <p className="font-bold text-white mt-0.5">{debugLng ? debugLng.toFixed(5) : "Searching GPS..."}</p>
                  </div>
                  <div>
                    <p className="text-zinc-550 text-[9.5px] uppercase">Telemetry</p>
                    <p className="font-bold text-emerald-500 mt-0.5">Active</p>
                  </div>
                  <div>
                    <p className="text-zinc-550 text-[9.5px] uppercase">Console link</p>
                    <p className="font-bold text-white mt-0.5">{availability}</p>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Sidebar: Quick Profile & Timeline History */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Minimalist Profile Details Card */}
              <div className="rounded-3xl border border-zinc-200/80 bg-white p-5.5 shadow-[0_4px_20px_rgba(0,0,0,0.01)] space-y-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 bg-zinc-950 text-white rounded-full flex items-center justify-center font-black text-sm shadow-md">
                    {driverProfile.initials}
                  </div>
                  <div>
                    <h4 className="text-[14.5px] font-bold text-zinc-950 leading-none">{driverProfile.name}</h4>
                    <p className="text-[10.5px] text-zinc-400 font-bold uppercase mt-1 tracking-wider">{driverProfile.city} Fleet</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="bg-zinc-50 border border-zinc-100 rounded-2xl p-3 shadow-3xs">
                    <span className="text-[9px] font-mono font-bold text-zinc-400 uppercase tracking-wide">Vehicle</span>
                    <p className="text-[12px] font-bold text-zinc-800 mt-0.5 leading-tight">{driverProfile.vehicle}</p>
                  </div>
                  <div className="bg-zinc-50 border border-zinc-100 rounded-2xl p-3 shadow-3xs">
                    <span className="text-[9px] font-mono font-bold text-zinc-400 uppercase tracking-wide">Plate No</span>
                    <p className="text-[12px] font-bold text-zinc-800 mt-0.5 leading-tight font-mono">{driverProfile.plate}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[11px] font-semibold text-zinc-500 pt-1 border-t border-zinc-100">
                  <ShieldCheck className="h-4 w-4 text-zinc-800" />
                  <span>Aadhaar Verified Operator</span>
                </div>
              </div>

              {/* Latest Runs Timeline */}
              <div className="space-y-4">
                <h4 className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-400">Shift Timeline</h4>
                
                <div className="space-y-3.5">
                  {completed.slice(0, 2).map((ride) => (
                    <div key={ride.id} className="bg-white border border-zinc-200 rounded-2xl p-4 shadow-[0_2px_8px_rgba(0,0,0,0.01)] hover:border-zinc-350 transition-all flex flex-col space-y-2">
                      <div className="flex items-center justify-between">
                        <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${tierStyles[ride.tier]}`}>
                          {ride.tier}
                        </span>
                        <span className="text-[10px] text-zinc-400 font-mono font-bold">{ride.time}</span>
                      </div>
                      <div className="text-[12.5px] font-semibold text-zinc-800">
                        <p className="text-zinc-950 truncate">{ride.route}</p>
                        <p className="text-zinc-400 text-[10.5px] mt-0.5">Passenger: {ride.rider}</p>
                      </div>
                      <div className="flex items-center justify-between text-[11px] font-bold text-zinc-500 border-t border-zinc-100 pt-2 mt-1">
                        <span>★ 5.0 Rating</span>
                        <span className="text-zinc-950 font-black">{ride.payout}</span>
                      </div>
                    </div>
                  ))}
                  {completed.length === 0 && (
                    <p className="text-xs text-zinc-400 font-semibold text-center py-4 bg-white border border-zinc-200 rounded-2xl">No completed runs recorded.</p>
                  )}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ── View: Rides (Active Dispatches list) ── */}
        {view === "rides" && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Requests column */}
              <div className="space-y-4.5">
                <div className="pb-3 border-b border-zinc-200 flex items-center justify-between">
                  <h3 className="text-sm font-black tracking-tight text-zinc-950 uppercase font-mono">1. Incoming Requests</h3>
                  <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                </div>
                <div className="space-y-4">
                  {availability === "Offline" ? (
                    <p className="text-xs text-zinc-400 font-semibold text-center py-8 bg-white border border-zinc-200 rounded-2xl">Offline.</p>
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
                    <p className="text-xs text-zinc-400 font-semibold text-center py-8 bg-white border border-zinc-200 rounded-2xl">No incoming requests.</p>
                  )}
                </div>
              </div>

              {/* Accepted column */}
              <div className="space-y-4.5">
                <div className="pb-3 border-b border-zinc-200 flex items-center justify-between">
                  <h3 className="text-sm font-black tracking-tight text-zinc-950 uppercase font-mono">2. Active Dispatches</h3>
                  <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                </div>
                <div className="space-y-4">
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
                    <div className="py-12 text-center border border-dashed border-zinc-200 bg-white rounded-2xl p-6">
                      <CarFront className="w-5 h-5 text-zinc-350 mx-auto" />
                      <p className="text-xs text-zinc-500 font-semibold mt-2 leading-relaxed">
                        No assigned rides. Accept requests from the queue.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Completed column */}
              <div className="space-y-4.5">
                <div className="pb-3 border-b border-zinc-200 flex items-center justify-between">
                  <h3 className="text-sm font-black tracking-tight text-zinc-950 uppercase font-mono">3. Completed Runs</h3>
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                </div>
                <div className="space-y-4">
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
                    <p className="text-xs text-zinc-400 font-semibold text-center py-8 bg-white border border-zinc-200 rounded-2xl">No rides completed yet.</p>
                  )}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ── View: Earnings (Shift Financials Ledger) ── */}
        {view === "earnings" && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Weekly payout journal */}
              <div className="lg:col-span-8 space-y-6">
                <div className="bg-white border border-zinc-200 rounded-3xl p-6.5 shadow-sm space-y-5">
                  <h3 className="text-base font-black text-zinc-950 tracking-tight">Shift pay structures</h3>
                  
                  <div className="space-y-3">
                    {weeklyPayouts.map((item) => (
                      <div key={item.label} className="bg-zinc-50 hover:bg-zinc-100/80 border border-zinc-100 rounded-2xl p-4.5 shadow-3xs flex items-center justify-between transition-colors">
                        <div>
                          <p className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wide">{item.label}</p>
                          <p className="text-xs font-semibold text-zinc-500 mt-1">{item.note}</p>
                        </div>
                        <p className="text-lg font-black text-zinc-950 font-sans">{item.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Mini aggregates & highlights */}
              <div className="lg:col-span-4 space-y-6">
                
                {/* Aggregate details block */}
                <div className="bg-white border border-zinc-200 rounded-3xl p-5.5 shadow-sm space-y-4">
                  <h4 className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-450">Financial indicators</h4>
                  <div className="space-y-3.5">
                    {earningsSummaryCards.map((item) => (
                      <div key={item.label} className="border-b border-zinc-100 pb-3 last:border-b-0 last:pb-0">
                        <span className="text-[9px] font-mono font-bold text-zinc-400 uppercase tracking-wide">{item.label}</span>
                        <p className="text-xl font-black text-zinc-950 mt-0.5">{item.value}</p>
                        <p className="text-[10.5px] text-zinc-550 font-semibold leading-none mt-1">{item.note}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Instant payout action banner */}
                <div className="bg-zinc-950 text-white rounded-3xl p-5 shadow-md flex flex-col space-y-3">
                  <span className="text-[9px] font-mono font-bold tracking-widest text-zinc-450 uppercase">DAILY ACCRUED PAYOUT</span>
                  <div className="flex items-end justify-between">
                    <span className="text-2xl font-black tracking-tight text-white">{stats.todayEarnings}</span>
                    <button className="px-3.5 py-1.5 bg-white text-black hover:bg-zinc-100 rounded-full font-bold text-[10.5px] active:scale-97 transition-all shadow-xs shrink-0 cursor-pointer">
                      Instant Cashout
                    </button>
                  </div>
                  <p className="text-[10px] text-zinc-500 font-semibold leading-normal pt-1.5 border-t border-zinc-800">
                    Shift payouts are settled into your bank account daily at midnight.
                  </p>
                </div>

              </div>

            </div>
          </div>
        )}

      </div>

      {/* Sync/loading overlay */}
      {loading && (
        <div className="fixed inset-0 bg-white/60 backdrop-blur-3xs z-50 flex items-center justify-center">
          <div className="flex flex-col items-center space-y-3.5 p-7 bg-white/95 border border-zinc-200/60 shadow-2xl rounded-3xl animate-fade-in">
            <Loader2 className="w-8 h-8 text-zinc-950 animate-spin" />
            <span className="text-[10px] font-mono font-black text-zinc-500 uppercase tracking-widest">Syncing Operator Console...</span>
          </div>
        </div>
      )}
    </main>
  );
}
