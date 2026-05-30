"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import RideBookingCard from "@/components/RideBookingCard";
import { Ride, getRouteDistance, calculateFare } from "@/lib/data";
import { fetchUserRides } from "@/actions/ride";
import { getNearbyDrivers } from "@/actions/driver";
import { fetchSavedLocations, createSavedLocation } from "@/actions/savedLocation";
import { getOnboardingState } from "@/actions/onboarding";
import { Home, Briefcase, Plane, Activity, MapPin, Clock, Navigation2 } from "lucide-react";
import Link from "next/link";
import MapboxMap from "@/components/MapboxMap";
import { motion } from "framer-motion";

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
        const seeded = [];
        for (const loc of initialLocs) {
          const res = await createSavedLocation(loc.label, loc.address, loc.lat, loc.lon);
          if (res.success && res.location) seeded.push(res.location);
        }
        setDbSavedLocations(seeded);
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
        if (!state.onboarded || state.role !== "rider") {
          router.push("/onboarding");
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
          price: "₹" + calculateFare(getRouteDistance(r.pickup, r.destination), r.rideType),
          driverName: "Vikram Malhotra",
          driverInitials: "VM",
          vehicle: "Tesla Model Y (White)",
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

  return (
    <main className="relative min-h-screen bg-zinc-50 text-zinc-900 antialiased pb-20 pt-28">
      {/* Subtle global gradient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1400px] h-[600px] bg-gradient-to-b from-zinc-100/50 via-transparent to-transparent pointer-events-none z-0" />
      <Navbar />

      <div className="max-w-[1400px] mx-auto px-6 sm:px-8 relative z-10">
        
        {/* Dynamic Typography Greeting */}
        <div className="mb-8 md:mb-12">
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
            className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-zinc-950 mt-2"
          >
            {greeting}
          </motion.h1>
        </div>

        {/* Clean, Premium Ride Interface (Split Screen Desktop, Fluid Mobile) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          
          {/* Left Column: Ride Input & Shortcuts */}
          <div className="lg:col-span-5 flex flex-col space-y-6">
            
            {/* Quick Shortcuts (Horizontal Scroll) */}
            <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-hide -mx-6 px-6 sm:mx-0 sm:px-0">
              {dbSavedLocations.map((addr) => {
                const addressIcons: any = {
                  Home: Home,
                  Office: Briefcase,
                  College: Plane,
                  Gym: Activity,
                };
                const Icon = addressIcons[addr.label] || MapPin;
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

            {/* Ride Booking Panel Card */}
            <div className="bg-white rounded-3xl border border-zinc-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.03)] p-6 transition-all duration-300 flex flex-col flex-grow justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
                  <h2 className="text-base font-black tracking-tight text-zinc-950">Hop in.</h2>
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

              {/* Minimalist Footnote instead of bulky details */}
              <p className="text-[10.5px] text-zinc-400 font-semibold mt-6 leading-relaxed">
                By booking, you agree to our premium safety policies. Your ride will be tracked in real-time.
              </p>
            </div>

          </div>

          {/* Right Column: Simulated/Real Map (Fills space beautifully) */}
          <div className="lg:col-span-7 min-h-[350px] lg:min-h-[500px] flex">
            <div className="bg-white rounded-3xl border border-zinc-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.03)] overflow-hidden w-full relative flex flex-col">
              
              {/* Subtle Map Status Overlay */}
              <div className="absolute top-4 left-4 z-10 pointer-events-none">
                <div className="bg-zinc-900/90 text-white backdrop-blur-md px-3.5 py-1.5 rounded-full flex items-center space-x-2 text-[10.5px] font-bold shadow-md">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Real-time GPS Dispatch</span>
                </div>
              </div>

              {/* Map Canvas */}
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
  );
}
