"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, type ComponentType } from "react";
import { CarFront, Circle, CircleDot, Coins, ShieldCheck, TrendingUp, UserCircle2, Loader2, Navigation, MapPin } from "lucide-react";
import dynamic from "next/dynamic";

const MapboxMap = dynamic(() => import("@/components/MapboxMap"), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-zinc-100 animate-pulse" />,
});
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
  const [secondsLeft, setSecondsLeft] = useState(15);

  useEffect(() => {
    if (!onAccept || !onDecline) return;

    // Start 15s countdown offer timer
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onDecline(); // decline automatically when hits 0 to offer to next candidate!
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onAccept, onDecline]);

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

      {onAccept && onDecline && (
        <div className="mt-3.5 bg-amber-50 border border-amber-250 rounded-xl p-3 flex items-center justify-between shadow-3xs animate-pulse">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-amber-600 animate-ping" />
            <span className="text-[11px] font-bold text-amber-800">Incoming dispatch offer</span>
          </div>
          <span className="bg-amber-600 text-white font-mono font-black text-xs px-2.5 py-0.5 rounded shadow-2xs">
            {secondsLeft}s remaining
          </span>
        </div>
      )}
      
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
              className="flex-1 py-2.5 bg-zinc-950 hover:bg-zinc-850 text-white font-bold text-xs rounded-full transition-all cursor-pointer active:scale-97 shadow-sm flex items-center justify-center space-x-1.5"
            >
              <span>Accept Trip</span>
              <span className="bg-white/20 text-white text-[10px] font-mono px-1.5 py-0.5 rounded">
                {secondsLeft}s
              </span>
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
  const [driverCoords, setDriverCoords] = useState<[number, number] | null>([77.0266, 28.4595]);
  const [loading, setLoading] = useState(true);
  const [greeting, setGreeting] = useState(driverGreetings[0]);


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
            const { latitude, longitude } = position.coords;
            setDriverCoords([longitude, latitude]);
            try {
              await updateDriverLocation(
                latitude,
                longitude,
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
    <main className="relative h-[100dvh] w-full overflow-hidden bg-zinc-955 text-zinc-900 antialiased">
      {/* Dynamic Background Map */}
      <div className="absolute inset-0 z-0 w-full h-full">
        <MapboxMap
          pickupCoords={driverCoords}
          destinationCoords={null}
          pickupName="My Location"
          destinationName=""
          routeGeometry={null}
          distanceMiles={null}
          durationMins={null}
          isLoadingRoute={false}
          nearbyDrivers={[]}
        />
      </div>

      {/* Floating HUD Container */}
      <div className="relative z-10 flex flex-col h-full w-full justify-between pointer-events-none p-4 md:p-6 pb-8">
        
        {/* TOP: Floating Header & Tab Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 w-full bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-md border border-zinc-200/50 pointer-events-auto max-w-5xl mx-auto">
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center space-x-1.5 group pr-3 border-r border-zinc-200">
              <span className="text-xl font-black tracking-tighter text-zinc-900">
                RYDR
              </span>
              <span className="h-1.5 w-1.5 rounded-full bg-zinc-900" />
            </Link>
            <div className="space-y-0.5">
              <h2 className="text-xs font-black text-zinc-950 leading-none">Console HUD</h2>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">{driverProfile.city} Fleet</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <SubNavigation activeView={view} />
            <div
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[11px] font-bold shadow-sm transition-all duration-300 ${
                availability === "Online"
                  ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 font-black"
                  : "border-zinc-200 bg-zinc-100 text-zinc-500"
              }`}
            >
              {availability === "Online" ? (
                <>
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Online</span>
                </>
              ) : (
                <>
                  <span className="h-2 w-2 rounded-full bg-zinc-400" />
                  <span>Offline</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* MIDDLE: Content Area */}
        <div className="flex-grow flex items-start justify-start w-full max-w-5xl mx-auto my-4 overflow-hidden relative">
          
          {/* Rides panel */}
          {view === "rides" && (
            <div className="w-full md:w-[450px] max-h-full overflow-y-auto bg-white/95 backdrop-blur-md border border-zinc-200/80 rounded-2xl p-5 shadow-xl pointer-events-auto space-y-5 flex flex-col">
              <div className="pb-3 border-b border-zinc-100 flex items-center justify-between shrink-0">
                <h3 className="text-xs font-black text-zinc-950 uppercase tracking-widest font-mono">Dispatches</h3>
                <span className="text-[10px] bg-zinc-100 px-2 py-0.5 rounded-full font-bold text-zinc-600">
                  {accepted.length + requests.length} total
                </span>
              </div>
              
              <div className="space-y-6 overflow-y-auto pr-1 flex-grow">
                <div className="space-y-3">
                  <h4 className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider">Active Trip</h4>
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
                    <p className="text-xs text-zinc-400 italic py-2">No active rides.</p>
                  )}
                </div>

                <div className="space-y-3 border-t border-zinc-100 pt-4">
                  <h4 className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider">Nearby Requests</h4>
                  {availability === "Offline" ? (
                    <p className="text-xs text-zinc-400 italic py-2">Go online to receive nearby requests.</p>
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
                    <p className="text-xs text-zinc-400 italic py-2">No requests right now.</p>
                  )}
                </div>

                <div className="space-y-3 border-t border-zinc-100 pt-4">
                  <h4 className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider">Completed Runs</h4>
                  {completed.length > 0 ? (
                    completed.map((ride) => (
                      <RideTile
                        key={ride.id}
                        rider={ride.rider}
                        route={ride.route}
                        meta={`${ride.time} · ★ 5.0`}
                        amount={ride.payout}
                        tier={ride.tier}
                      />
                    ))
                  ) : (
                    <p className="text-xs text-zinc-400 italic py-2">No completed runs recorded today.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Earnings panel */}
          {view === "earnings" && (
            <div className="w-full md:w-[450px] max-h-full overflow-y-auto bg-white/95 backdrop-blur-md border border-zinc-200/80 rounded-2xl p-5 shadow-xl pointer-events-auto space-y-5">
              <div className="pb-3 border-b border-zinc-100 flex items-center justify-between shrink-0">
                <h3 className="text-xs font-black text-zinc-950 uppercase tracking-widest font-mono">Earnings</h3>
                <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200/60 px-2 py-0.5 rounded-full font-bold">
                  Today
                </span>
              </div>

              <div className="space-y-4">
                <div className="bg-zinc-950 text-white rounded-2xl p-4 shadow-md flex flex-col space-y-3">
                  <span className="text-[9px] font-mono font-bold tracking-widest text-zinc-400 uppercase">TODAY&apos;S EARNINGS</span>
                  <div className="flex items-end justify-between">
                    <span className="text-2xl font-black tracking-tight text-white">{stats.todayEarnings}</span>
                    <button className="px-3.5 py-1.5 bg-white text-black hover:bg-zinc-100 rounded-full font-bold text-[10.5px] active:scale-97 transition-all shadow-xs shrink-0 cursor-pointer">
                      Cashout
                    </button>
                  </div>
                  <p className="text-[10px] text-zinc-500 font-semibold leading-normal pt-1.5 border-t border-zinc-800">
                    Payouts settled daily at midnight.
                  </p>
                </div>

                <div className="space-y-2.5">
                  <h4 className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider block">Pay Breakdown</h4>
                  {weeklyPayouts.map((item) => (
                    <div key={item.label} className="bg-zinc-50 border border-zinc-100 rounded-xl p-3 flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wide">{item.label}</p>
                        <p className="text-[10px] font-semibold text-zinc-500 mt-0.5">{item.note}</p>
                      </div>
                      <p className="text-sm font-black text-zinc-950">{item.value}</p>
                    </div>
                  ))}
                </div>

                <div className="space-y-2.5 border-t border-zinc-100 pt-4">
                  <h4 className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider block">Summary</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {earningsSummaryCards.map((item) => (
                      <div key={item.label} className="bg-zinc-50 border border-zinc-100 rounded-xl p-3">
                        <span className="text-[9px] font-mono font-bold text-zinc-400 uppercase tracking-wide block">{item.label}</span>
                        <p className="text-base font-black text-zinc-950 mt-0.5">{item.value}</p>
                        <p className="text-[9.5px] text-zinc-500 font-semibold leading-none mt-1">{item.note}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Overview floating cards — pinned to bottom-left */}
          {view === "overview" && (
            <div className="absolute bottom-0 left-0 max-w-sm w-full space-y-3 pointer-events-none">
              
              {requests.length > 0 && availability === "Online" && (
                <div className="bg-white/95 backdrop-blur-md rounded-2xl p-5 border-2 border-emerald-500 shadow-2xl pointer-events-auto space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded">
                      NEW REQUEST NEARBY
                    </span>
                    <span className="text-xs font-black text-zinc-950">{requests[0].distance}</span>
                  </div>
                  <div>
                    <p className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest">Trip Route</p>
                    <p className="text-sm font-extrabold text-zinc-950 mt-1">{requests[0].pickup} ➔ {requests[0].destination}</p>
                  </div>
                  <div className="flex items-center justify-between border-t border-zinc-100 pt-3">
                    <span className="text-[11px] font-bold text-zinc-500">Estimated Payout</span>
                    <span className="text-lg font-black text-zinc-950">{requests[0].fare}</span>
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => handleDeclineRequest(requests[0].id)}
                      className="flex-1 py-3 min-h-[44px] bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold text-xs rounded-xl transition-all cursor-pointer"
                    >
                      Decline
                    </button>
                    <button
                      onClick={() => handleAcceptRequest(requests[0].id)}
                      className="flex-1 py-3 min-h-[44px] bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow-sm"
                    >
                      Accept Trip
                    </button>
                  </div>
                </div>
              )}

              {accepted.length > 0 && (
                <div className="bg-white/95 backdrop-blur-md rounded-2xl p-5 border border-zinc-200 shadow-2xl pointer-events-auto space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded uppercase">
                      Active Dispatch
                    </span>
                    <span className="text-xs font-black text-zinc-950">{accepted[0].eta}</span>
                  </div>
                  <div>
                    <p className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest">Trip Route</p>
                    <p className="text-sm font-extrabold text-zinc-950 mt-1 truncate">{accepted[0].route}</p>
                    <p className="text-[10px] text-zinc-400 mt-1">Passenger: {accepted[0].rider}</p>
                  </div>
                  
                  <div className="border-t border-zinc-100 pt-3 space-y-2">
                    {accepted[0].status === "Accepted" && (
                      <button
                        onClick={() => handleUpdateRideStatus(accepted[0].id, "Driver Arriving")}
                        className="w-full py-3 min-h-[44px] bg-zinc-950 hover:bg-zinc-800 text-white font-bold text-xs rounded-xl transition-all cursor-pointer"
                      >
                        I&apos;ve Arrived
                      </button>
                    )}
                    {accepted[0].status === "Driver Arriving" && (
                      <button
                        onClick={() => handleUpdateRideStatus(accepted[0].id, "On Trip")}
                        className="w-full py-3 min-h-[44px] bg-zinc-950 hover:bg-zinc-800 text-white font-bold text-xs rounded-xl transition-all cursor-pointer"
                      >
                        Start Trip
                      </button>
                    )}
                    {accepted[0].status === "On Trip" && (
                      <button
                        onClick={() => handleCompleteRide(accepted[0].id)}
                        className="w-full py-3 min-h-[44px] bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center space-x-1.5"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        <span>Complete Trip</span>
                      </button>
                    )}
                  </div>
                </div>
              )}

              {requests.length === 0 && accepted.length === 0 && (
                <div className="bg-white/95 backdrop-blur-md rounded-2xl p-4 border border-zinc-200/60 shadow-lg pointer-events-auto flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-mono font-bold text-zinc-400 uppercase tracking-wider">Shift Stats</span>
                    <div className="flex items-center space-x-3 mt-0.5 text-xs text-zinc-600 font-bold">
                      <span>Today: <strong className="text-zinc-950 font-black">{stats.todayEarnings}</strong></span>
                      <span>•</span>
                      <span>Runs: <strong className="text-zinc-950 font-black">{stats.completedRidesCount}</strong></span>
                      <span>•</span>
                      <span>Rating: <strong className="text-zinc-950 font-black">{stats.driverRating}</strong></span>
                    </div>
                  </div>
                  <div className="w-9 h-9 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-center text-zinc-800">
                    <Coins className="w-4 h-4" />
                  </div>
                </div>
              )}

            </div>
          )}

        </div>

        {/* BOTTOM: GO ONLINE / GO OFFLINE Toggle */}
        <div className="w-full max-w-sm mx-auto pointer-events-auto pt-2 shrink-0">
          {availability === "Offline" ? (
            <button
              onClick={() => setAvailability("Online")}
              className="h-14 w-full bg-emerald-500 hover:bg-emerald-600 active:scale-97 text-white font-black text-base tracking-wider rounded-2xl transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center space-x-2.5 cursor-pointer"
            >
              <Circle className="w-4 h-4 fill-white stroke-[2.5px]" />
              <span>GO ONLINE</span>
            </button>
          ) : (
            <button
              onClick={() => setAvailability("Offline")}
              className="h-14 w-full bg-zinc-950 hover:bg-zinc-800 active:scale-97 text-white font-black text-sm tracking-wider rounded-2xl transition-all shadow-md flex items-center justify-center space-x-2.5 cursor-pointer"
            >
              <CircleDot className="w-4 h-4 text-emerald-500 fill-emerald-500" />
              <span>GO OFFLINE</span>
            </button>
          )}
        </div>

      </div>

      {/* Loading spinner */}
      {loading && (
        <div className="fixed inset-0 z-50 bg-black/10 backdrop-blur-sm flex items-center justify-center pointer-events-auto">
          <div className="bg-white px-5 py-4 rounded-2xl shadow-xl flex items-center space-x-3 border border-zinc-200/80">
            <Loader2 className="w-5 h-5 text-zinc-950 animate-spin" />
            <span className="text-xs font-bold text-zinc-700">Updating...</span>
          </div>
        </div>
      )}
    </main>
  );
}
