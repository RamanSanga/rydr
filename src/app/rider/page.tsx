"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import RideBookingCard from "@/components/RideBookingCard";
import { Ride, getRouteDistance, calculateFare } from "@/lib/data";
import { fetchUserRides } from "@/actions/ride";
import { getNearbyDrivers } from "@/actions/driver";
import { fetchSavedLocations, createSavedLocation } from "@/actions/savedLocation";
import { Home, Briefcase, Plane, Activity, MapPin, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";
import MapboxMap from "@/components/MapboxMap";
import { motion } from "framer-motion";

export default function RiderDashboard() {
  const { user } = useUser();
  const [greeting, setGreeting] = useState("Hello 👋");
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

  // Time-based greeting
  useEffect(() => {
    const hour = new Date().getHours();
    const name = user?.firstName ? `, ${user.firstName}` : "";
    if (hour < 12) {
      setGreeting(`Good morning${name} 👋`);
    } else if (hour < 17) {
      setGreeting(`Good afternoon${name} ☀️`);
    } else {
      setGreeting(`Good evening${name} 🌙`);
    }
  }, [user]);

  // Feature 1: Current Location detection
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

  // Poll for nearby drivers
  useEffect(() => {
    let interval: NodeJS.Timeout;

    const fetchDrivers = async () => {
      if (pickupCoords) {
        try {
          const response = await getNearbyDrivers(pickupCoords[1], pickupCoords[0]); // pass lat, lng
          
          setNearbyDrivers(prev => {
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
    interval = setInterval(fetchDrivers, 15000);

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
        const dbRides = await fetchUserRides();

        const formattedRides: Ride[] = dbRides.map((r) => ({
          id: r.id,
          date: new Date(r.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
          time: new Date(r.createdAt).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
          pickup: r.pickup,
          destination: r.destination,
          price: "₹" + calculateFare(getRouteDistance(r.pickup, r.destination), r.rideType),
          driverName: r.driverId ? "Vetted Partner" : "Searching...",
          driverInitials: "VP",
          vehicle: "RYDR Clean Cabin",
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

  const completedRides = localRides.slice(0, 3); // last 2-3 rides

  return (
    <main className="relative min-h-screen bg-white text-zinc-900 antialiased pb-24 pt-8 sm:pt-12">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1400px] h-[500px] bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.02),transparent_60%)] pointer-events-none z-0" />
      
      <div className="max-w-4xl mx-auto px-5 sm:px-6 relative z-10 space-y-8">
        
        {/* Dynamic Greeting */}
        <div className="flex items-center justify-between">
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900"
          >
            {greeting}
          </motion.h1>
        </div>

        {/* Section 1: Map Area (wrapped in beautiful h-[200px] sm:h-[280px] rounded-2xl container) */}
        <div className="w-full h-[200px] sm:h-[280px] rounded-2xl overflow-hidden border border-zinc-200/80 shadow-sm relative z-0">
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

        {/* Section 2: Ride Booking Card */}
        <div className="bg-white border border-zinc-200 rounded-3xl p-2 shadow-md relative z-10">
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

        {/* Section 3: Saved Locations Quick Shortcuts */}
        <div className="space-y-3">
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Where to?</span>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-5 px-5 sm:mx-0 sm:px-0">
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
                  className="flex items-center gap-2 px-4 py-3 bg-zinc-50 border border-zinc-200 hover:border-zinc-300 hover:bg-zinc-100/50 rounded-xl transition-all whitespace-nowrap active:scale-[0.98] cursor-pointer shadow-3xs"
                >
                  <Icon className="w-4 h-4 text-zinc-500 shrink-0" />
                  <span className="text-sm font-semibold text-zinc-950">{addr.label}</span>
                </button>
              );
            })}
            <Link
              href="/profile"
              className="flex items-center gap-2 px-4 py-3 bg-white border border-dashed border-zinc-300 hover:border-zinc-400 rounded-xl transition-all whitespace-nowrap active:scale-[0.98] cursor-pointer text-zinc-500 hover:text-zinc-700 shadow-3xs"
            >
              <span className="text-sm font-semibold">Add Place</span>
            </Link>
          </div>
        </div>

        {/* Section 4: Recent Rides */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Recent Activity</span>
            <Link href="/rides" className="text-xs font-bold text-emerald-600 hover:underline flex items-center gap-1">
              <span>View All</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          
          {loading ? (
            <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-5 space-y-4 animate-pulse">
               <div className="w-1/3 h-4 bg-zinc-200 rounded" />
               <div className="w-full h-12 bg-zinc-200 rounded" />
            </div>
          ) : completedRides.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {completedRides.map((ride) => (
                <div key={ride.id} className="bg-zinc-50 border border-zinc-200 rounded-2xl p-4.5 space-y-3.5 shadow-3xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-white border border-zinc-200 flex items-center justify-center shadow-3xs">
                        <Clock className="w-3.5 h-3.5 text-zinc-500" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-zinc-800">{ride.status}</div>
                        <div className="text-[9px] text-zinc-400 font-semibold">{ride.date}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-black text-zinc-900">{ride.price}</div>
                      <div className="text-[9px] text-zinc-400 font-semibold uppercase tracking-wider">{ride.tier}</div>
                    </div>
                  </div>
                  
                  <div className="text-[11px] text-zinc-550 font-medium bg-white border border-zinc-200 p-2.5 rounded-xl flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                    <span className="truncate">{ride.destination}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-6 text-center text-sm font-semibold text-zinc-400">
              No recent rides. Where would you like to go?
            </div>
          )}
        </div>

      </div>
    </main>
  );
}
