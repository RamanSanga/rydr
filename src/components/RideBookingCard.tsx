"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Navigation, Calendar, Clock, ArrowRight, Check, ShieldCheck, Loader2, User, Star, Car, Search, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createRideAction } from "@/actions/ride";
import { getNearbyDrivers } from "@/actions/driver";

interface RideType {
  id: string;
  name: string;
  description: string;
  eta: string;
  seats: number;
  badge?: string;
  badgeColor?: string;
}

interface RideBookingCardProps {
  pickup?: string;
  setPickup?: (v: string) => void;
  destination?: string;
  setDestination?: (v: string) => void;
  pickupCoords?: [number, number] | null;
  setPickupCoords?: (coords: [number, number] | null) => void;
  destinationCoords?: [number, number] | null;
  setDestinationCoords?: (coords: [number, number] | null) => void;
  distanceMiles?: number | null;
  setDistanceMiles?: (d: number | null) => void;
  durationMins?: number | null;
  setDurationMins?: (m: number | null) => void;
  setRouteGeometry?: (g: any | null) => void;
  setIsLoadingRoute?: (l: boolean) => void;
}

export default function RideBookingCard({
  pickup,
  setPickup,
  destination,
  setDestination,
  pickupCoords,
  setPickupCoords,
  destinationCoords,
  setDestinationCoords,
  distanceMiles,
  setDistanceMiles,
  durationMins,
  setDurationMins,
  setRouteGeometry,
  setIsLoadingRoute,
}: RideBookingCardProps) {
  const router = useRouter();
  const [selectedRide, setSelectedRide] = useState("premium");
  const [isScheduling, setIsScheduling] = useState(false);
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [bookingState, setBookingState] = useState<"idle" | "searching" | "driverFound" | "noDriverFound" | "confirmed">("idle");
  const [loadingStep, setLoadingStep] = useState(0);
  const [foundDriver, setFoundDriver] = useState<any | null>(null);

  // Temporary Debug State
  const [debugSearchMeta, setDebugSearchMeta] = useState<any>(null);
  const [debugNoDriverReason, setDebugNoDriverReason] = useState<string | null>(null);

  // Local fallback states if props are omitted:
  const [localPickup, setLocalPickup] = useState("");
  const [localDestination, setLocalDestination] = useState("");
  const [localPickupCoords, setLocalPickupCoords] = useState<[number, number] | null>(null);
  const [localDestinationCoords, setLocalDestinationCoords] = useState<[number, number] | null>(null);
  const [localDistanceMiles, setLocalDistanceMiles] = useState<number | null>(null);
  const [localDurationMins, setLocalDurationMins] = useState<number | null>(null);
  const [localRouteGeometry, setLocalRouteGeometry] = useState<any | null>(null);
  const [localIsLoadingRoute, setLocalIsLoadingRoute] = useState(false);

  // Resolved values:
  const pValue = pickup !== undefined ? pickup : localPickup;
  const setPValue = setPickup !== undefined ? setPickup : setLocalPickup;

  const dValue = destination !== undefined ? destination : localDestination;
  const setDValue = setDestination !== undefined ? setDestination : setLocalDestination;

  const pCoords = pickupCoords !== undefined ? pickupCoords : localPickupCoords;
  const setPCoords = setPickupCoords !== undefined ? setPickupCoords : setLocalPickupCoords;

  const dCoords = destinationCoords !== undefined ? destinationCoords : localDestinationCoords;
  const setDCoords = setDestinationCoords !== undefined ? setDestinationCoords : setLocalDestinationCoords;

  const distMiles = distanceMiles !== undefined ? distanceMiles : localDistanceMiles;
  const setDistMiles = setDistanceMiles !== undefined ? setDistanceMiles : setLocalDistanceMiles;

  const durMins = durationMins !== undefined ? durationMins : localDurationMins;
  const setDurMins = setDurationMins !== undefined ? setDurationMins : setLocalDurationMins;

  const setRGeom = setRouteGeometry !== undefined ? setRouteGeometry : setLocalRouteGeometry;
  const setLoadRoute = setIsLoadingRoute !== undefined ? setIsLoadingRoute : setLocalIsLoadingRoute;

  // Suggestions state
  const [pickupSuggestions, setPickupSuggestions] = useState<any[]>([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState<any[]>([]);
  const [activeInput, setActiveInput] = useState<"pickup" | "destination" | null>(null);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [suggestionsError, setSuggestionsError] = useState<string | null>(null);

  const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || "";
  const hasToken = token.trim().length > 0;

  const pickupInputRef = useRef<HTMLDivElement>(null);
  const destinationInputRef = useRef<HTMLDivElement>(null);
  const debounceTimeoutRef = useRef<any>(null);

  // Clean up debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);
    };
  }, []);

  // Handle clicking outside to close suggestions panels
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        pickupInputRef.current &&
        !pickupInputRef.current.contains(event.target as Node)
      ) {
        setPickupSuggestions([]);
      }
      if (
        destinationInputRef.current &&
        !destinationInputRef.current.contains(event.target as Node)
      ) {
        setDestinationSuggestions([]);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const rideTypes: RideType[] = [
    {
      id: "economy",
      name: "Rydr Economy",
      description: "Eco-friendly, budget commutes",
      eta: "3m",
      seats: 4,
      badge: "Eco Choice",
      badgeColor: "bg-emerald-50 text-emerald-700 border border-emerald-200/60",
    },
    {
      id: "premium",
      name: "Rydr Premium",
      description: "Vetted professional sedan comfort",
      eta: "4m",
      seats: 4,
      badge: "Popular",
      badgeColor: "bg-zinc-100 text-zinc-800 border border-zinc-200",
    },
    {
      id: "xl",
      name: "Rydr XL",
      description: "Spacious SUVs for up to 6 seats",
      eta: "5m",
      seats: 6,
      badge: "Spacious",
      badgeColor: "bg-blue-50 text-blue-700 border border-blue-200/60",
    },
  ];

  const stepsText = [
    "Searching nearby drivers...",
    "Looking for available vehicles...",
    "Checking driver proximity...",
    "Connecting to the Rydr network...",
  ];

  // Feature 6: Simulated Surge Pricing Helper based on hour of the day
  const getSurgeInfo = () => {
    const now = new Date();
    const hour = now.getHours();
    
    let isSurge = false;
    let multiplier = 1.0;
    let label = "";

    if (hour >= 18 && hour < 21) { // 6 PM - 9 PM
      isSurge = true;
      multiplier = 1.5;
      label = "Peak Commute Hour";
    } else if ((hour >= 23 && hour < 24) || (hour >= 0 && hour < 3)) { // 11 PM - 3 AM
      isSurge = true;
      multiplier = 1.3;
      label = "Late Night Surge";
    }

    return { isSurge, multiplier, label };
  };

  // Helper to simulate dynamic traffic index based on minutes (Light, Moderate, Heavy)
  const getTrafficLevel = () => {
    const now = new Date();
    const min = now.getMinutes();
    
    if (min % 3 === 0) {
      return { level: "Heavy", multiplier: 1.4 };
    } else if (min % 2 === 0) {
      return { level: "Moderate", multiplier: 1.2 };
    } else {
      return { level: "Light", multiplier: 1.0 };
    }
  };

  // Feature 7: Automatic Ride Tier Recommendations based on OSRM distance (stored in distMiles)
  const isRecommended = (tier: string) => {
    const dist = distMiles || 5.0;
    if (dist < 5.0) return tier === "economy";
    if (dist >= 15.0) return tier === "premium";
    return tier === "xl";
  };

  // Feature 5: AI Fare Prediction & Indian Rupees (₹) pricing range
  const getAIFareRange = (tier: string) => {
    const dist = distMiles || 5.0;
    const surge = getSurgeInfo();
    const traffic = getTrafficLevel();

    let baseRate = 40;
    let perKmRate = 12;

    if (tier === "economy") {
      baseRate = 40;
      perKmRate = 12;
    } else if (tier === "premium") {
      baseRate = 75;
      perKmRate = 18;
    } else { // xl
      baseRate = 110;
      perKmRate = 25;
    }

    const price = (baseRate + dist * perKmRate) * surge.multiplier * traffic.multiplier;
    const minPrice = Math.max(50, Math.floor(price * 0.9));
    const maxPrice = Math.floor(price * 1.1);

    return `₹${minPrice} - ₹${maxPrice}`;
  };

  // Dynamic Distance-based single fare for database saving
  const getFare = (tier: string) => {
    const dist = distMiles || 5.0;
    const surge = getSurgeInfo();
    const traffic = getTrafficLevel();

    let baseRate = 40;
    let perKmRate = 12;

    if (tier === "economy") {
      baseRate = 40;
      perKmRate = 12;
    } else if (tier === "premium") {
      baseRate = 75;
      perKmRate = 18;
    } else {
      baseRate = 110;
      perKmRate = 25;
    }

    return Math.floor((baseRate + dist * perKmRate) * surge.multiplier * traffic.multiplier).toString();
  };

  // Fetch Geocoding suggestions using OpenStreetMap Nominatim API (Free and OpenSource)
  const fetchSuggestions = async (query: string, type: "pickup" | "destination") => {
    if (!query.trim()) {
      if (type === "pickup") setPickupSuggestions([]);
      else setDestinationSuggestions([]);
      setSuggestionsError(null);
      return;
    }

    setIsLoadingSuggestions(true);
    setSuggestionsError(null);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=jsonv2&countrycodes=in&addressdetails=1&q=${encodeURIComponent(query)}&limit=10`
      );
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        // Filter and Score results to prioritize airports, stations, bus stands, colleges, landmarks
        const scored = data.map((item: any) => {
          const name = (item.display_name || "").toLowerCase();
          const pType = (item.type || "").toLowerCase();
          const cls = (item.class || "").toLowerCase();
          let score = 0;

          if (name.includes("airport") || pType.includes("airport") || cls === "aeroway") score += 100;
          if (name.includes("railway") || name.includes("station") || name.includes(" junction") || pType.includes("railway") || cls === "railway") score += 90;
          if (name.includes("bus stand") || name.includes("bus terminal") || name.includes("isbt") || name.includes("bus stop") || pType.includes("bus")) score += 80;
          if (name.includes("college") || name.includes("university") || name.includes("campus") || name.includes("school") || name.includes("iit") || name.includes("nit") || pType.includes("university") || pType.includes("college")) score += 70;
          if (name.includes("cyber city") || name.includes("sector") || name.includes("plaza") || name.includes("mall") || name.includes("market") || name.includes("fort") || name.includes("temple")) score += 60;
          if (pType === "city" || pType === "town" || pType === "suburb" || pType === "administrative" || cls === "place") score += 50;

          return { item, score };
        });

        // Sort by score descending
        scored.sort((a, b) => b.score - a.score);

        // Map top 5
        const formatted = scored.slice(0, 5).map(({ item }) => {
          const address = item.address || {};
          const city = address.city || address.town || address.village || address.suburb || address.city_district || address.district || "";
          const state = address.state || "";
          
          let secondary = "";
          if (city && state) {
            secondary = city === state ? city : `${city}, ${state}`;
          } else if (city) {
            secondary = city;
          } else if (state) {
            secondary = state;
          }

          const parts = (item.display_name || "").split(",");
          let title = parts[0]?.trim() || "Location";
          if (parts.length > 1 && (title.length <= 3 || !isNaN(Number(title)))) {
            title = `${title}, ${parts[1].trim()}`;
          }

          return {
            id: item.place_id ? String(item.place_id) : Math.random().toString(),
            place_name: item.display_name,
            title,
            secondary: secondary || "India",
            coordinates: [parseFloat(item.lon), parseFloat(item.lat)] as [number, number],
          };
        });

        if (type === "pickup") setPickupSuggestions(formatted);
        else setDestinationSuggestions(formatted);
      }
    } catch (err) {
      console.warn("Nominatim Geocoding suggestions query failed, falling back to Indian mock places:", err);
      setSuggestionsError("Failed to fetch locations. Using offline places.");
      // Offline fallback mock Indian places
      const places = [
        { id: "mock_1", title: "Delhi Airport", secondary: "New Delhi, Delhi", place_name: "Indira Gandhi International Airport (DEL), New Delhi, Delhi, India", coordinates: [77.1000, 28.5562] as [number, number] },
        { id: "mock_2", title: "New Delhi Railway Station", secondary: "New Delhi, Delhi", place_name: "New Delhi Railway Station, Bhavbhuti Marg, New Delhi, Delhi, India", coordinates: [77.2215, 28.6430] as [number, number] },
        { id: "mock_3", title: "Jind Bus Stand", secondary: "Jind, Haryana", place_name: "Jind Bus Stand, Jind, Haryana, India", coordinates: [76.3125, 29.3175] as [number, number] },
        { id: "mock_4", title: "Gurugram Cyber City", secondary: "Gurugram, Haryana", place_name: "DLF Cyber City, Gurugram, Haryana, India", coordinates: [77.0878, 28.4950] as [number, number] },
        { id: "mock_5", title: "Noida Sector 18", secondary: "Noida, Uttar Pradesh", place_name: "Sector 18 Metro Station, Noida, Uttar Pradesh, India", coordinates: [77.3260, 28.5708] as [number, number] },
      ];
      const filtered = places.filter(p => p.place_name.toLowerCase().includes(query.toLowerCase()) || p.title.toLowerCase().includes(query.toLowerCase()));
      if (type === "pickup") setPickupSuggestions(filtered);
      else setDestinationSuggestions(filtered);
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  // Trigger Driving Route Calculations
  // Trigger Driving Route Calculations using OSRM Routing API (Free and OpenSource)
  const calculateRoute = async (start: [number, number], end: [number, number]) => {
    setLoadRoute(true);
    try {
      const res = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${start[0]},${start[1]};${end[0]},${end[1]}?overview=full&geometries=geojson`
      );
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      if (data.routes && data.routes[0]) {
        const route = data.routes[0];
        setRGeom(route.geometry);
        setDistMiles(route.distance / 1000); // meters to kilometers
        setDurMins(route.duration / 60); // seconds to minutes
      }
    } catch (err) {
      console.warn("OSRM directions routing fetch failed, falling back to mock route:", err);
      // Offline fallback mock calculation
      setRGeom({ type: "LineString", coordinates: [start, end] });
      setDistMiles(8.7); // 8.7 km
      setDurMins(18.0); // 18 min
    } finally {
      setLoadRoute(false);
    }
  };

  const triggerSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pValue || !dValue) return;

    if (!pCoords || !dCoords) {
      console.warn("Real GPS coordinates are required for both pickup and destination. Please select a valid location from the dropdown or allow location access.");
      setSuggestionsError("Please select a valid location from the suggestions.");
      return;
    }

    const start: [number, number] = pCoords;
    const end: [number, number] = dCoords;

    // Compute route if not already done (e.g., typing-only flow)
    if (!distMiles) {
      calculateRoute(start, end);
    }

    setBookingState("searching");
    setLoadingStep(0);

    let currentStep = 0;
    const stepInterval = setInterval(() => {
      if (currentStep < 3) {
        currentStep++;
        setLoadingStep(currentStep);
      }
    }, 1500);

    let nearbyDrivers: any[] = [];
    let meta: any = null;
    try {
      const response = await getNearbyDrivers(start[1], start[0]);
      nearbyDrivers = response.drivers || [];
      meta = response;
      setDebugSearchMeta(response);
    } catch (err: any) {
      console.error(err);
      setDebugNoDriverReason(`CLIENT CATCH BLOCK ERROR: ${err.message || "Unknown error"}`);
    }

    const waitTime = nearbyDrivers.length > 0 ? 4500 : 15000;
    
    setTimeout(() => {
      clearInterval(stepInterval);
      if (nearbyDrivers.length > 0) {
        setFoundDriver(nearbyDrivers[0]);
        setBookingState("driverFound");
      } else {
        setBookingState("noDriverFound");
        if (meta) {
          if (meta.error) setDebugNoDriverReason(`SERVER EXCEPTION: ${meta.error}`);
          else if (meta.totalOnline === 0) setDebugNoDriverReason("No online drivers exist in database.");
          else if (meta.totalOnline > 0 && meta.totalWithinRadius === 0) setDebugNoDriverReason(`Drivers exist (${meta.totalOnline}), but none within ${meta.radius}km radius.`);
          else setDebugNoDriverReason("Unknown matching issue.");
        }
      }
    }, waitTime);
  };

  const confirmRide = () => {
    if (!pValue || !dValue || !pCoords) return;
    
    // Save the ride in PostgreSQL database via Server Action!
    setBookingState("confirmed");
    const fare = parseFloat(getFare(selectedRide).replace(/,/g, ""));
    createRideAction(pValue, dValue, selectedRide, pCoords[1], pCoords[0], fare)
      .then(() => {
        setTimeout(() => {
          router.push("/rides");
        }, 1200);
      })
      .catch((err) => {
        console.error("Error creating ride in database:", err);
        setBookingState("idle");
      });
  };

  const resetBooking = () => {
    setBookingState("idle");
    setPValue("");
    setDValue("");
    setPCoords(null);
    setDCoords(null);
    setDistMiles(null);
    setDurMins(null);
    setRGeom(null);
    setFoundDriver(null);
  };

  return (
    <div className="w-full bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden p-6 relative">
      <AnimatePresence mode="wait">
        {bookingState === "idle" && (
          <motion.div
            key="booking-form"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.15 }}
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-[16px] font-bold text-zinc-900 tracking-tight">Book a Ride</h3>
            </div>



            <form onSubmit={triggerSearch} className="space-y-4">
              {/* Feature 6: Simulated Surge Pricing Banner */}
              {getSurgeInfo().isSurge && (
                <div className="bg-amber-50 border border-amber-200/70 rounded-xl p-3 flex items-center space-x-2.5 text-amber-800 text-[11px] font-bold shadow-3xs leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-ping shrink-0" />
                  <span>⚡ High Demand Area • Surge Active ({getSurgeInfo().multiplier}x) — {getSurgeInfo().label}</span>
                </div>
              )}

              {/* Pickup & Destination Inputs */}
              <div className="relative flex flex-col space-y-3.5">
                {/* Connecting Line */}
                <div className="absolute left-6 top-10 bottom-10 w-[1px] bg-zinc-200 pointer-events-none" />

                {/* Pickup Field */}
                <div ref={pickupInputRef} className="relative">
                  <div className="flex items-center space-x-3 bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 focus-within:border-zinc-400 focus-within:bg-white transition-colors duration-150">
                    <div className="p-1 bg-white border border-zinc-200 rounded-md text-zinc-500">
                      <MapPin className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1">
                      <input
                        name="pickup"
                        type="text"
                        placeholder="Enter pickup location"
                        value={pValue}
                        onChange={(e) => {
                          setPValue(e.target.value);
                          setActiveInput("pickup");
                          
                          // Debounce geocoder requests to respect Nominatim limits
                          if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);
                          debounceTimeoutRef.current = setTimeout(() => {
                            fetchSuggestions(e.target.value, "pickup");
                          }, 400);
                        }}
                        onFocus={() => {
                          setActiveInput("pickup");
                          if (pValue) fetchSuggestions(pValue, "pickup");
                        }}
                        required
                        autoComplete="off"
                        className="w-full bg-transparent border-0 outline-0 p-0 text-sm text-zinc-900 placeholder-zinc-450 focus:ring-0 font-medium"
                      />
                    </div>
                    {pValue && (
                      <button
                        type="button"
                        onClick={() => {
                          setPValue("");
                          setPCoords(null);
                          setDistMiles(null);
                          setRGeom(null);
                        }}
                        className="text-zinc-400 hover:text-black text-xs font-semibold cursor-pointer"
                      >
                        Clear
                      </button>
                    )}
                  </div>

                  {/* Pickup Autocomplete Dropdown List */}
                  {activeInput === "pickup" && (pickupSuggestions.length > 0 || isLoadingSuggestions || suggestionsError) && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-zinc-200 rounded-xl shadow-lg z-50 overflow-hidden divide-y divide-zinc-100 max-h-64 overflow-y-auto animate-fade-in">
                      {isLoadingSuggestions ? (
                        <div className="px-4 py-3.5 flex items-center space-x-2.5 text-xs text-zinc-450 font-semibold font-mono animate-pulse">
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-zinc-550 shrink-0" />
                          <span>Searching locations...</span>
                        </div>
                      ) : (
                        <>
                          {suggestionsError && (
                            <div className="px-4 py-2.5 bg-red-50 text-[11px] text-red-600 font-semibold flex items-center space-x-1.5 border-b border-zinc-100">
                              <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                              <span>{suggestionsError}</span>
                            </div>
                          )}
                          {pickupSuggestions.map((s) => (
                            <div
                              key={s.id}
                              onClick={() => {
                                setPValue(s.place_name);
                                setPCoords(s.coordinates);
                                setPickupSuggestions([]);
                                setActiveInput(null);
                                setSuggestionsError(null);
                                if (dCoords) {
                                  calculateRoute(s.coordinates, dCoords);
                                }
                              }}
                              className="px-4 py-2.5 hover:bg-zinc-50 cursor-pointer transition-colors flex items-start space-x-2.5"
                            >
                              <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0 mt-0.5" />
                              <div className="flex flex-col min-w-0">
                                <span className="text-xs font-bold text-zinc-800 truncate">{s.title || s.place_name}</span>
                                {s.secondary && (
                                  <span className="text-[10px] text-zinc-400 mt-0.5 truncate">{s.secondary}</span>
                                )}
                              </div>
                            </div>
                          ))}
                        </>
                      )}
                    </div>
                  )}
                </div>

                {/* Dropoff Field */}
                <div ref={destinationInputRef} className="relative">
                  <div className="flex items-center space-x-3 bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 focus-within:border-zinc-400 focus-within:bg-white transition-colors duration-150">
                    <div className="p-1 bg-white border border-zinc-200 rounded-md text-zinc-500">
                      <Navigation className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1">
                      <input
                        name="destination"
                        type="text"
                        placeholder="Where to?"
                        value={dValue}
                        onChange={(e) => {
                          setDValue(e.target.value);
                          setActiveInput("destination");
                          
                          // Debounce geocoder requests to respect Nominatim limits
                          if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);
                          debounceTimeoutRef.current = setTimeout(() => {
                            fetchSuggestions(e.target.value, "destination");
                          }, 400);
                        }}
                        onFocus={() => {
                          setActiveInput("destination");
                          if (dValue) fetchSuggestions(dValue, "destination");
                        }}
                        required
                        autoComplete="off"
                        className="w-full bg-transparent border-0 outline-0 p-0 text-sm text-zinc-900 placeholder-zinc-455 focus:ring-0 font-medium"
                      />
                    </div>
                    {dValue && (
                      <button
                        type="button"
                        onClick={() => {
                          setDValue("");
                          setDCoords(null);
                          setDistMiles(null);
                          setRGeom(null);
                        }}
                        className="text-zinc-400 hover:text-black text-xs font-semibold cursor-pointer"
                      >
                        Clear
                      </button>
                    )}
                  </div>

                  {/* Destination Autocomplete Dropdown List */}
                  {activeInput === "destination" && (destinationSuggestions.length > 0 || isLoadingSuggestions || suggestionsError) && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-zinc-200 rounded-xl shadow-lg z-50 overflow-hidden divide-y divide-zinc-100 max-h-64 overflow-y-auto animate-fade-in">
                      {isLoadingSuggestions ? (
                        <div className="px-4 py-3.5 flex items-center space-x-2.5 text-xs text-zinc-450 font-semibold font-mono animate-pulse">
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-zinc-550 shrink-0" />
                          <span>Searching locations...</span>
                        </div>
                      ) : (
                        <>
                          {suggestionsError && (
                            <div className="px-4 py-2.5 bg-red-50 text-[11px] text-red-600 font-semibold flex items-center space-x-1.5 border-b border-zinc-100">
                              <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                              <span>{suggestionsError}</span>
                            </div>
                          )}
                          {destinationSuggestions.map((s) => (
                            <div
                              key={s.id}
                              onClick={() => {
                                setDValue(s.place_name);
                                setDCoords(s.coordinates);
                                setDestinationSuggestions([]);
                                setActiveInput(null);
                                setSuggestionsError(null);
                                if (pCoords) {
                                  calculateRoute(pCoords, s.coordinates);
                                }
                              }}
                              className="px-4 py-2.5 hover:bg-zinc-50 cursor-pointer transition-colors flex items-start space-x-2.5"
                            >
                              <Navigation className="w-3.5 h-3.5 text-zinc-400 shrink-0 mt-0.5" />
                              <div className="flex flex-col min-w-0">
                                <span className="text-xs font-bold text-zinc-800 truncate">{s.title || s.place_name}</span>
                                {s.secondary && (
                                  <span className="text-[10px] text-zinc-400 mt-0.5 truncate">{s.secondary}</span>
                                )}
                              </div>
                            </div>
                          ))}
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Note: Ride Tiers and Fare estimates are now hidden until a driver is found. */}

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={!pValue || !dValue}
                className={`w-full py-3.5 rounded-xl font-bold text-sm tracking-wide transition-all duration-150 flex items-center justify-center space-x-2 ${
                  pValue && dValue
                    ? "bg-black text-white hover:bg-zinc-800 cursor-pointer active:scale-98 shadow-sm"
                    : "bg-zinc-100 text-zinc-455 cursor-not-allowed"
                }`}
              >
                <span>Find Rides</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}

        {bookingState === "searching" && (
          <motion.div
            key="booking-searching"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="py-12 flex flex-col items-center justify-center text-center space-y-6"
          >
            <div className="relative flex items-center justify-center">
              <Loader2 className="w-12 h-12 text-zinc-800 animate-spin stroke-[1.5]" />
              <div className="absolute text-[11px] font-bold text-zinc-650 font-mono">{loadingStep + 1}</div>
            </div>
            <div className="space-y-1">
              <h4 className="text-base font-bold text-zinc-900 tracking-tight">Matching with a friendly driver...</h4>
              <p className="text-xs text-zinc-500 font-mono h-4">
                {stepsText[loadingStep]}
              </p>
            </div>
            <div className="w-full max-w-[200px] bg-zinc-100 h-[3px] rounded-full overflow-hidden">
              <motion.div
                className="bg-black h-full"
                initial={{ width: "0%" }}
                animate={{ width: `${(loadingStep + 1) * 25}%` }}
                transition={{ duration: 0.9, ease: "easeInOut" }}
              />
            </div>
          </motion.div>
        )}

        {bookingState === "driverFound" && foundDriver && (
          <motion.div
            key="booking-driver-found"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="flex flex-col space-y-5"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-[16px] font-bold text-zinc-900 tracking-tight">Driver Found</h3>
              <div className="flex items-center space-x-1.5 text-xs text-zinc-550 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                <span>FARES LOCKED</span>
              </div>
            </div>

            {/* Driver Profile */}
            <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-4 flex items-center justify-between shadow-sm">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-zinc-200 rounded-full flex items-center justify-center overflow-hidden border border-zinc-300">
                  <User className="w-6 h-6 text-zinc-500 mt-1" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-zinc-900">{foundDriver.user?.name || "Rohit Kumar"}</h4>

                  <div className="flex items-center space-x-2 mt-0.5">
                    <div className="flex items-center space-x-1 text-amber-500">
                      <Star className="w-3 h-3 fill-current" />
                      <span className="text-[11px] font-bold text-zinc-700">4.9</span>
                    </div>
                    <span className="text-[10px] text-zinc-400">•</span>
                    <span className="text-[11px] text-zinc-600 font-medium">Swift Dzire</span>
                  </div>
                </div>
              </div>
              <div className="text-right flex flex-col items-end">
                <div className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-200">
                  {distMiles ? Math.max(2, Math.min(7, Math.floor(distMiles * 0.4))) : 4} min away
                </div>
                <div className="text-[10px] text-zinc-500 font-semibold mt-1">
                  2.1 km
                </div>
              </div>
            </div>

            {/* Ride Type Selector */}
            <div className="space-y-2 pt-1">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">
                Select Ride Tier
              </label>
              <div className="flex flex-col space-y-2">
                <input type="hidden" name="rideType" value={selectedRide} />
                {rideTypes.map((type) => (
                  <div
                    key={type.id}
                    onClick={() => setSelectedRide(type.id)}
                    className={`flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer ${
                      selectedRide === type.id
                        ? "bg-zinc-50 border-black shadow-2xs"
                        : "bg-white border-zinc-200 hover:border-zinc-300"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                          selectedRide === type.id ? "border-black bg-black" : "border-zinc-300 bg-white"
                        }`}
                      >
                        {selectedRide === type.id && <Check className="w-2.5 h-2.5 text-white stroke-[3.5px]" />}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-[14px] font-bold text-zinc-900 tracking-tight">{type.name}</span>
                          {isRecommended(type.id) && (
                            <span className="text-[8px] font-mono tracking-tight font-extrabold px-1.5 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-250/60 uppercase">
                              Recommended
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[14px] font-black text-zinc-900">{getAIFareRange(type.id)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-3 pt-2">
              <button
                onClick={resetBooking}
                type="button"
                className="flex-1 py-3.5 rounded-xl font-bold text-sm bg-zinc-100 text-zinc-600 hover:bg-zinc-200 transition-colors border border-zinc-200"
              >
                Cancel
              </button>
              <button
                onClick={confirmRide}
                type="button"
                className="flex-[2] py-3.5 rounded-xl font-bold text-sm bg-black text-white hover:bg-zinc-800 transition-colors shadow-sm"
              >
                Confirm Ride
              </button>
            </div>
          </motion.div>
        )}

        {bookingState === "noDriverFound" && (
          <motion.div
            key="booking-no-driver-found"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="flex flex-col items-center justify-center text-center py-10 space-y-4"
          >
            <div className="w-16 h-16 bg-red-50 border border-red-100 rounded-full flex items-center justify-center text-red-500 mb-2">
              <XCircle className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-zinc-900">No Drivers Found</h3>
              <p className="text-sm text-zinc-500 mt-1">
                We couldn't find any available drivers near your location.
              </p>
              {debugNoDriverReason && (
                <p className="text-xs text-emerald-600 font-semibold bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-full inline-block mt-3">
                  {debugNoDriverReason.replace("SERVER EXCEPTION: ", "").replace("CLIENT CATCH BLOCK ERROR: ", "")}
                </p>
              )}
            </div>
            <button
              onClick={() => setBookingState("idle")}
              className="mt-4 px-6 py-2.5 bg-black text-white text-sm font-bold rounded-xl active:scale-95 transition-transform"
            >
              Try Again
            </button>
          </motion.div>
        )}

        {bookingState === "confirmed" && (
          <motion.div
            key="booking-confirmed"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="py-6 flex flex-col items-center justify-center text-center space-y-6"
          >
            <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-250 flex items-center justify-center text-emerald-600">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
            </div>

            <div className="space-y-1">
              <h4 className="text-lg font-bold text-zinc-900 tracking-tight">You're all set!</h4>
              <p className="text-xs text-zinc-500 max-w-[260px] mx-auto leading-normal">
                Your driver {foundDriver?.user?.name?.split(" ")[0] || "Aria"} is heading your way. Pickup locked at <span className="text-black font-semibold">{pValue.split(",")[0]}</span>.
              </p>
            </div>

            <div className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-4.5 text-left divide-y divide-zinc-200 space-y-2.5">
              <div className="flex justify-between items-center pb-2">
                <span className="text-xs text-zinc-500 font-semibold">Vehicle Tier</span>
                <span className="text-xs font-bold text-zinc-900">
                  {selectedRide === "premium" ? "Rydr Premium" : selectedRide === "economy" ? "Rydr Economy" : "Rydr XL"}
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-xs text-zinc-500 font-semibold">Estimated Arrival</span>
                <span className="text-xs font-bold text-emerald-600">2.8 mins</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-xs text-zinc-500 font-semibold">Fare Locked</span>
                <span className="text-xs font-black text-zinc-900">
                  ₹{getFare(selectedRide)}
                </span>
              </div>
            </div>

            <button
              onClick={resetBooking}
              className="w-full py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 transition-colors text-xs font-bold rounded-lg border border-zinc-200 cursor-pointer"
            >
              Request Another Ride
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}