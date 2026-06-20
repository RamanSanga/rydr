"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import RideBookingCard from "@/components/RideBookingCard";
import { Ride, getRouteDistance, calculateFare } from "@/lib/data";
import { fetchUserRides } from "@/actions/ride";
import { getNearbyDrivers } from "@/actions/driver";
import { fetchSavedLocations, seedSavedLocationsAction } from "@/actions/savedLocation";
import { getOnboardingState } from "@/actions/onboarding";
import { Home, Briefcase, Plane, Activity, MapPin, Clock, Navigation2 } from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";

const MapboxMap = dynamic(() => import("@/components/MapboxMap"), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-zinc-150 animate-pulse animate-duration-1000" />,
});

const greetings = [
  "👋 Ready to roll?",
  "🚖 Where are we sneaking off to today?",
  "☕ Coffee run?",
  "✈️ Airport escape?",
  "🌃 City lights tonight?",
  "😏 Trying to avoid traffic again?"
];

export default function RiderDashboard() {
  const router = useRouter();
  const [greeting, setGreeting] = useState(greetings[0]);
  const [localRides, setLocalRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);

  // Mapbox Coordinates and Routing States
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [pickupCoords, setPickupCoords] = useState<[number, number] | null>(null);
  const [destinationCoords, setDestinationCoords] = useState<[number, number] | null>(null);
  const [routeGeometry, setRouteGeometry] = useState<any | null>(null);
  const [distanceMiles, setDistanceMiles] = useState<number | null>(null);
  const [durationMins, setDurationMins] = useState<number | null>(null);
  const [isLoadingRoute, setIsLoadingRoute] = useState(false);
  const [nearbyDrivers, setNearbyDrivers] = useState<any[]>([]);

  useEffect(() => {
    setGreeting(greetings[Math.floor(Math.random() * greetings.length)]);
  }, []);

  // Feature 1: Current Location detection via browser Geolocation + Nominatim Reverse Geocoding
  useEffect(() => {
    if (typeof window !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setPickupCoords([longitude, latitude]);

          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
            );
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            const data = await res.json();
            if (data && data.display_name) {
              const parts = data.display_name.split(",");
              const simplified = parts.slice(0, 3).join(",").trim();
              setPickup(simplified || data.display_name);
            } else {
              setPickup(`My Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`);
            }
          } catch (err) {
            console.warn("Reverse geocoding failed, falling back to My Location:", err);
            setPickup(`My Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`);
          }
        },
        (error) => {
          console.warn("Geolocation failed or denied:", error);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    }
  }, []);

  // Poll for nearby drivers with optimized state updates
  useEffect(() => {
    let interval: NodeJS.Timeout;

    const fetchDrivers = async () => {
      if (pickupCoords) {
        try {
          const response = await getNearbyDrivers(pickupCoords[1], pickupCoords[0]); // pass lat, lng
          
          setNearbyDrivers(prev => {
            // Only update state if drivers changed (prevents React from thrashing renders on MapboxMap and BookingCard)
            const prevIds = prev.map(d => `${d.userId}-${d.latitude.toFixed(4)}-${d.longitude.toFixed(4)}`).join(',');
            const newIds = response.drivers.map(d => `${d.userId}-${d.latitude.toFixed(4)}-${d.longitude.toFixed(4)}`).join(',');
            if (prevIds !== newIds) {
              return response.drivers;
            }
            return prev;
          });
        } catch (err) {
          console.error("Failed to fetch nearby drivers", err);
        }
      }
    };

    fetchDrivers();
    interval = setInterval(fetchDrivers, 15000); // Poll every 15s instead of 10s

    return () => clearInterval(interval);
  }, [pickupCoords]);

  // Saved Locations 
  const [dbSavedLocations, setDbSavedLocations] = useState<any[]>([]);

  const loadSavedLocations = async () => {
    try {
      const locs = await fetchSavedLocations();
      if (locs.length > 0) {
        setDbSavedLocations(locs);
      } else {
        // Fallback seed inside PostgreSQL if empty
        const initialLocs = [
          { label: "Home", address: "Sector 15, Part 2, Gurugram, Haryana", lat: 28.4619, lon: 77.0427 },
          { label: "Office", address: "Cyber Hub, DLF Cyber City, Gurugram", lat: 28.4950, lon: 77.0878 },
          { label: "College", address: "IIT Delhi, Hauz Khas, New Delhi", lat: 28.5450, lon: 77.1926 },
        ];
        const res = await seedSavedLocationsAction(initialLocs);
        if (res.success && res.locations) {
          setDbSavedLocations(res.locations);
        }
      }
    } catch (err) {
      console.error("Failed to load saved locations:", err);
    }
  };

  const handleQuickBook = async (addr: any) => {
    setDestination(addr.address);
    setDestinationCoords([addr.lon, addr.lat]);
    
    if (pickupCoords) {
      setIsLoadingRoute(true);
      try {
        const res = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${pickupCoords[0]},${pickupCoords[1]};${addr.lon},${addr.lat}?overview=full&geometries=geojson`
        );
        const data = await res.json();
        if (data.routes && data.routes[0]) {
          const route = data.routes[0];
          setRouteGeometry(route.geometry);
          setDistanceMiles(route.distance / 1000); // meters to KM
          setDurationMins(route.duration / 60); // seconds to minutes
        }
      } catch (err) {
        console.error("OSRM quickbook routing failed:", err);
      } finally {
        setIsLoadingRoute(false);
      }
    }
  };

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const state = await getOnboardingState();
        if (!state.success || !state.roleSelected) {
          router.push("/select-role");
          return;
        }

        const dbRides = await fetchUserRides();

        // Map raw DB logs to the high-fidelity UI format
        const formattedRides: Ride[] = dbRides.map((r) => ({
          id: r.id,
          date: new Date(r.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
          time: new Date(r.createdAt).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
          pickup: r.pickup,
          destination: r.destination,
          price: r.fare ? "₹" + r.fare : "₹" + calculateFare(getRouteDistance(r.pickup, r.destination), r.rideType),
          driverName: (r as any).driver?.name || "Unassigned",
          driverInitials: (r as any).driver?.name ? (r as any).driver.name.substring(0, 2).toUpperCase() : "??",
          vehicle: "Swift Dzire",
          status: r.status as any,
          tier: r.rideType === "economy" ? "Economy" : r.rideType === "premium" ? "Premium" : "XL",
        }));

        setLocalRides(formattedRides);
        await loadSavedLocations();
      } catch (err) {
        console.error("Error loading dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);



  // Mobile: fullscreen map + bottom sheet. Desktop: split-view.
  return (
    <>
      {/* ── MOBILE layout ── */}
      <main className="lg:hidden relative h-[100dvh] w-full overflow-hidden bg-zinc-950">
        {/* Fullscreen map */}
        <div className="absolute inset-0 z-0">
          <MapboxMap
            pickupCoords={pickupCoords}
            destinationCoords={destinationCoords}
            pickupName={pickup}
            destinationName={destination}
            routeGeometry={routeGeometry}
            distanceMiles={distanceMiles}
            durationMins={durationMins}
            isLoadingRoute={isLoadingRoute}
            nearbyDrivers={nearbyDrivers}
          />
        </div>

        {/* Floating top pill */}
        <div className="absolute top-0 inset-x-0 z-20 px-4 pt-4 pointer-events-none">
          <div className="flex items-center justify-between bg-white/90 backdrop-blur-md rounded-2xl px-4 py-3 shadow-md border border-zinc-200/60 pointer-events-auto">
            <span className="text-base font-black tracking-tighter text-zinc-950">RYDR</span>
            <div className="flex items-center gap-2 text-[10.5px] font-bold text-zinc-600">
              {pickupCoords ? (
                <>
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>GPS Active</span>
                </>
              ) : (
                <>
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
                  <span>Locating...</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Bottom sheet */}
        <div className="absolute bottom-0 inset-x-0 z-20 bg-white rounded-t-3xl shadow-[0_-8px_40px_rgba(0,0,0,0.14)] border-t border-zinc-200/60">
          <div className="flex justify-center pt-3 pb-1">
            <div className="w-10 h-1 rounded-full bg-zinc-300" />
          </div>

          <div className="px-5 pt-2 pb-[env(safe-area-inset-bottom,20px)] space-y-4 max-h-[80vh] sm:max-h-[68vh] overflow-y-auto">
            {destinationCoords === null && (
              <div>
                <p className="text-[10px] font-mono font-bold tracking-[0.2em] text-zinc-400 uppercase">Your next ride</p>
                <h1 className="text-xl font-black tracking-tight text-zinc-950 mt-1">{greeting}</h1>
              </div>
            )}

            {destinationCoords === null && dbSavedLocations.length > 0 && (
              <div className="flex gap-2 overflow-x-auto pb-1 -mx-5 px-5">
                {dbSavedLocations.map((addr) => {
                  const icons: any = { Home, Office: Briefcase, College: Plane, Gym: Activity };
                  const Icon = icons[addr.label] || MapPin;
                  return (
                    <button
                      key={addr.id}
                      onClick={() => handleQuickBook(addr)}
                      className="flex items-center gap-2 px-3.5 py-2 bg-zinc-100 hover:bg-zinc-200 rounded-full whitespace-nowrap active:scale-95 cursor-pointer transition-all min-h-[44px]"
                    >
                      <Icon className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                      <span className="text-[12px] font-bold text-zinc-800">{addr.label}</span>
                    </button>
                  );
                })}
              </div>
            )}

            <RideBookingCard
              pickup={pickup}
              setPickup={setPickup}
              destination={destination}
              setDestination={setDestination}
              pickupCoords={pickupCoords}
              setPickupCoords={setPickupCoords}
              destinationCoords={destinationCoords}
              setDestinationCoords={setDestinationCoords}
              distanceMiles={distanceMiles}
              setDistanceMiles={setDistanceMiles}
              durationMins={durationMins}
              setDurationMins={setDurationMins}
              setRouteGeometry={setRouteGeometry}
              setIsLoadingRoute={setIsLoadingRoute}
            />
          </div>
        </div>
      </main>

      {/* ── DESKTOP layout ── */}
      <main className="hidden lg:block relative min-h-screen bg-zinc-50 text-zinc-900 antialiased pb-20 pt-28">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1400px] h-[600px] bg-gradient-to-b from-zinc-100/50 via-transparent to-transparent pointer-events-none z-0" />
        <Navbar />

        <div className="max-w-[1400px] mx-auto px-8 relative z-10">
          <div className="mb-10">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="text-[11px] font-mono font-bold tracking-[0.25em] text-zinc-400 uppercase leading-none"
            >
              Your next ride
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="text-5xl font-black tracking-tighter text-zinc-950 mt-2"
            >
              {greeting}
            </motion.h1>
          </div>

          <div className="grid grid-cols-12 gap-10 items-stretch">
            <div className="col-span-5 flex flex-col space-y-5">
              <div className="flex gap-2.5 overflow-x-auto pb-1">
                {dbSavedLocations.map((addr) => {
                  const icons: any = { Home, Office: Briefcase, College: Plane, Gym: Activity };
                  const Icon = icons[addr.label] || MapPin;
                  return (
                    <button
                      key={addr.id}
                      onClick={() => handleQuickBook(addr)}
                      className="flex items-center gap-2 px-4 py-2.5 bg-white border border-zinc-200/80 hover:border-zinc-950 hover:bg-zinc-50 rounded-full transition-all whitespace-nowrap active:scale-95 cursor-pointer shadow-[0_2px_8px_rgba(0,0,0,0.02)]"
                    >
                      <Icon className="w-3.5 h-3.5 text-zinc-500" />
                      <span className="text-[12.5px] font-bold text-zinc-800">{addr.label}</span>
                    </button>
                  );
                })}
                <Link
                  href="/profile"
                  className="flex items-center gap-1.5 px-4 py-2.5 bg-zinc-100 hover:bg-zinc-200 border border-transparent rounded-full transition-all whitespace-nowrap active:scale-95 cursor-pointer text-zinc-600 font-bold text-[12.5px]"
                >
                  <span>+ Custom</span>
                </Link>
              </div>

              <div className="bg-white rounded-3xl border border-zinc-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.03)] p-6 flex flex-col flex-grow">
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
                    <h2 className="text-base font-black tracking-tight text-zinc-950">Where to?</h2>
                    <span className="text-[10px] font-mono font-bold tracking-widest text-zinc-400 uppercase">Step 1 of 2</span>
                  </div>
                  <RideBookingCard
                    pickup={pickup}
                    setPickup={setPickup}
                    destination={destination}
                    setDestination={setDestination}
                    pickupCoords={pickupCoords}
                    setPickupCoords={setPickupCoords}
                    destinationCoords={destinationCoords}
                    setDestinationCoords={setDestinationCoords}
                    distanceMiles={distanceMiles}
                    setDistanceMiles={setDistanceMiles}
                    durationMins={durationMins}
                    setDurationMins={setDurationMins}
                    setRouteGeometry={setRouteGeometry}
                    setIsLoadingRoute={setIsLoadingRoute}
                  />
                </div>
                <p className="text-[10.5px] text-zinc-400 font-semibold mt-6 leading-relaxed">
                  By booking, you agree to our safety policies. Your ride is tracked in real-time.
                </p>
              </div>
            </div>

            <div className="col-span-7 min-h-[500px] flex">
              <div className="bg-white rounded-3xl border border-zinc-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.03)] overflow-hidden w-full relative flex flex-col">
                <div className="absolute top-4 left-4 z-10 pointer-events-none">
                  <div className="bg-zinc-900/90 text-white backdrop-blur-md px-3.5 py-1.5 rounded-full flex items-center space-x-2 text-[10.5px] font-bold shadow-md">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>GPS Active</span>
                  </div>
                </div>
                <div className="flex-grow w-full h-full relative z-0">
                  <MapboxMap
                    pickupCoords={pickupCoords}
                    destinationCoords={destinationCoords}
                    pickupName={pickup}
                    destinationName={destination}
                    routeGeometry={routeGeometry}
                    distanceMiles={distanceMiles}
                    durationMins={durationMins}
                    isLoadingRoute={isLoadingRoute}
                    nearbyDrivers={nearbyDrivers}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}


