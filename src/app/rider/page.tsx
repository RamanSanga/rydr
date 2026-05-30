"use client";

import { useState, useEffect } from "react";
import RiderNavbar from "@/components/RiderNavbar";
import RideBookingCard from "@/components/RideBookingCard";
import { Ride, getRouteDistance, calculateFare } from "@/lib/data";
import { fetchUserRides } from "@/actions/ride";
import { getNearbyDrivers } from "@/actions/driver";
import { fetchSavedLocations, createSavedLocation } from "@/actions/savedLocation";
import { Home, Briefcase, Plane, Activity, MapPin, Clock, Navigation2 } from "lucide-react";
import Link from "next/link";
import MapboxMap from "@/components/MapboxMap";
import { motion } from "framer-motion";

const greetings = [
  "👀 Aaj kis taraf bhatakna hai?",
  "😏 Seedha destination batao, judge nahi karenge.",
  "🚖 Ghar? Ya plan kuch aur hai?",
  "🌆 City ready hai. Tum ready ho?",
  "🤔 Itni der se app khol ke dekh kya rahe ho? Kahan jaana hai?",
  "🌙 Raat lambi ho gayi? Ab ghar chalte hain?",
  "🛣️ Long drive ka mood hai?",
  "☕ Coffee peene ja rahe ho ya bas ghoomne?",
  "😌 Traffic hum dekh lenge. Tum bas plan banao."
];

const inspirationCards = [
  {
    title: "Airport Transfer",
    subtitle: "Never miss a flight.",
    image: "/images/airport_pickup.png",
    shortcut: "IGI Airport T3, New Delhi"
  },
  {
    title: "Weekend Escape",
    subtitle: "Roads are calling.",
    image: "/images/sunset_drive.png",
    shortcut: "Cyber Hub, Gurugram"
  },
  {
    title: "Coffee Run",
    subtitle: "Take the scenic route.",
    image: "/images/daily_commute.png",
    shortcut: "Connaught Place, New Delhi"
  },
  {
    title: "Late Night Ride",
    subtitle: "We'll get you home safely.",
    image: "/images/late_night_ride.png",
    shortcut: "Home"
  }
];

export default function RiderDashboard() {
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

  // Poll for nearby drivers
  useEffect(() => {
    let interval: NodeJS.Timeout;

    const fetchDrivers = async () => {
      if (pickupCoords) {
        try {
          const drivers = await getNearbyDrivers(pickupCoords[1], pickupCoords[0]); // pass lat, lng
          setNearbyDrivers(drivers);
        } catch (err) {
          console.error("Failed to fetch nearby drivers", err);
        }
      }
    };

    fetchDrivers();
    interval = setInterval(fetchDrivers, 10000);

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

  const lastCompletedRide = 
    localRides.find(r => r.status === "Requested") || 
    localRides.find(r => r.status === "Driver Assigned") || 
    localRides.find(r => r.status === "On The Way") || 
    localRides.find(r => r.status === "Completed") ||
    localRides.find(r => r.status === "Cancelled");

  return (
    <main className="relative min-h-screen bg-white text-[#111111] antialiased pb-24 pt-24 md:pt-28">
      <RiderNavbar />

      <div className="max-w-[1200px] mx-auto px-5 sm:px-6">
        
        {/* Dynamic Greeting */}
        <div className="mb-6 md:mb-10">
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tighter text-zinc-900"
          >
            {greeting}
          </motion.h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
          
          {/* Left Column: Booking & Map */}
          <div className="lg:col-span-7 flex flex-col space-y-6">
            
            {/* Quick Shortcuts (Horizontal Scroll) */}
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
                    className="flex items-center gap-2 px-4 py-3 bg-[#F8F8F8] border border-zinc-200 hover:border-zinc-400 hover:bg-zinc-50 rounded-2xl transition-all whitespace-nowrap active:scale-95 cursor-pointer shadow-3xs"
                  >
                    <Icon className="w-4 h-4 text-zinc-600" />
                    <span className="text-sm font-bold text-zinc-900">{addr.label}</span>
                  </button>
                );
              })}
              <Link
                href="/profile"
                className="flex items-center gap-2 px-4 py-3 bg-white border border-dashed border-zinc-300 hover:border-zinc-500 rounded-2xl transition-all whitespace-nowrap active:scale-95 cursor-pointer text-zinc-500 hover:text-zinc-800"
              >
                <span className="text-sm font-bold">Add Place</span>
              </Link>
            </div>

            {/* Ride Booking Card & Map Container */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-2xl border border-zinc-200/60 flex flex-col">
              
              {/* Map taking top half on mobile, or just integrated */}
              <div className="w-full h-[250px] sm:h-[350px] relative z-0">
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

              {/* Booking Card underneath */}
              <div className="relative z-10 bg-white -mt-4 rounded-t-2xl shadow-[0_-8px_30px_rgba(0,0,0,0.12)] p-2">
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

          </div>

          {/* Right Column: Inspiration & Recent Activity */}
          <div className="lg:col-span-5 space-y-10">
            
            {/* Inspiration Cards */}
            <div className="space-y-4">
              <h3 className="text-lg font-black text-zinc-900 tracking-tight">Ride Inspiration</h3>
              <div className="grid grid-cols-2 gap-4">
                {inspirationCards.map((card, i) => (
                  <div
                    key={i}
                    onClick={() => {
                      setDestination(card.shortcut);
                      // In a real app we'd trigger the geocoding here too, but just setting text works well enough for demo
                    }}
                    className="group relative h-40 sm:h-48 rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all"
                  >
                    <img 
                      src={card.image} 
                      alt={card.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                    <div className="absolute bottom-4 left-4 pr-4">
                      <h4 className="text-white font-black text-sm tracking-tight leading-tight">{card.title}</h4>
                      <p className="text-zinc-300 text-[10px] font-semibold mt-0.5">{card.subtitle}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Ride Teaser */}
            <div className="space-y-4">
              <h3 className="text-lg font-black text-zinc-900 tracking-tight">Recent Activity</h3>
              
              {loading ? (
                <div className="bg-[#F8F8F8] border border-zinc-200 rounded-2xl p-5 space-y-4 animate-pulse">
                   <div className="w-1/3 h-4 bg-zinc-200 rounded" />
                   <div className="w-full h-12 bg-zinc-200 rounded" />
                </div>
              ) : lastCompletedRide ? (
                <Link href="/rides" className="block bg-[#F8F8F8] border border-zinc-200 hover:border-zinc-350 rounded-2xl p-5 transition-all group">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-white border border-zinc-200 flex items-center justify-center shadow-3xs">
                        <Clock className="w-4 h-4 text-zinc-600" />
                      </div>
                      <div>
                        <div className="text-xs font-black text-zinc-900">{lastCompletedRide.status}</div>
                        <div className="text-[10px] text-zinc-500 font-semibold">{lastCompletedRide.date}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-black text-zinc-900">{lastCompletedRide.price}</div>
                      <div className="text-[10px] text-zinc-500 font-semibold">{lastCompletedRide.tier}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs text-zinc-600 font-semibold bg-white border border-zinc-200 p-2.5 rounded-xl">
                    <Navigation2 className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                    <span className="truncate">{lastCompletedRide.destination}</span>
                  </div>
                </Link>
              ) : (
                <div className="bg-[#F8F8F8] border border-zinc-200 rounded-2xl p-6 text-center text-sm font-semibold text-zinc-500">
                  No recent rides. Where to next?
                </div>
              )}
            </div>

          </div>

        </div>
      </div>
    </main>
  );
}
