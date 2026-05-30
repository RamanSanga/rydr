"use client";

import { useEffect, useRef, useState } from "react";
import { MapPin, Navigation, Compass, Shield, Route, Info } from "lucide-react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

interface MapboxMapProps {
  pickupCoords: [number, number] | null;
  destinationCoords: [number, number] | null;
  pickupName: string;
  destinationName: string;
  routeGeometry: any | null;
  distanceMiles: number | null;
  durationMins: number | null;
  isLoadingRoute: boolean;
  nearbyDrivers?: any[];
}

export default function MapboxMap({
  pickupCoords,
  destinationCoords,
  pickupName,
  destinationName,
  routeGeometry,
  distanceMiles,
  durationMins,
  isLoadingRoute,
  nearbyDrivers = [],
}: MapboxMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const pickupMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const destinationMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const driverMarkersRef = useRef<{ [id: string]: mapboxgl.Marker }>({});
  
  const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || "";
  const hasToken = token.trim().length > 0;

  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(false);

  // Initialize Mapbox Map
  useEffect(() => {
    if (!hasToken || !mapContainerRef.current || mapRef.current) return;

    try {
      mapboxgl.accessToken = token;
      
      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/light-v11",
        center: [-122.4194, 37.7749], // SFO/SF default center
        zoom: 12,
        attributionControl: false,
      });

      map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), "top-right");

      map.on("load", () => {
        setMapLoaded(true);
      });

      map.on("error", (e) => {
        console.error("Mapbox GL Error:", e);
        setMapError(true);
      });

      mapRef.current = map;
    } catch (e) {
      console.error("Failed to initialize Mapbox:", e);
      setMapError(true);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [hasToken, token]);

  // Update Markers and Fit Bounds
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded) return;

    // 1. Manage Pickup Marker
    if (pickupCoords) {
      if (!pickupMarkerRef.current) {
        // Create custom emerald marker element
        const el = document.createElement("div");
        el.className = "w-6 h-6 rounded-full bg-emerald-500 border-2 border-white shadow-md flex items-center justify-center text-white ring-2 ring-emerald-500/20";
        el.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>';
        
        pickupMarkerRef.current = new mapboxgl.Marker({ element: el })
          .setLngLat(pickupCoords)
          .addTo(map);
      } else {
        pickupMarkerRef.current.setLngLat(pickupCoords);
      }
    } else if (pickupMarkerRef.current) {
      pickupMarkerRef.current.remove();
      pickupMarkerRef.current = null;
    }

    // 2. Manage Destination Marker
    if (destinationCoords) {
      if (!destinationMarkerRef.current) {
        // Create custom blue marker element
        const el = document.createElement("div");
        el.className = "w-6 h-6 rounded-full bg-blue-500 border-2 border-white shadow-md flex items-center justify-center text-white ring-2 ring-blue-500/20";
        el.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>';

        destinationMarkerRef.current = new mapboxgl.Marker({ element: el })
          .setLngLat(destinationCoords)
          .addTo(map);
      } else {
        destinationMarkerRef.current.setLngLat(destinationCoords);
      }
    } else if (destinationMarkerRef.current) {
      destinationMarkerRef.current.remove();
      destinationMarkerRef.current = null;
    }

    // 3. Draw Route Geometry Line
    const sourceId = "route-line-source";
    const layerId = "route-line-layer";

    if (routeGeometry) {
      const geojson: GeoJSON.Feature = {
        type: "Feature",
        properties: {},
        geometry: routeGeometry,
      };

      if (map.getSource(sourceId)) {
        (map.getSource(sourceId) as mapboxgl.GeoJSONSource).setData(geojson);
      } else {
        map.addSource(sourceId, {
          type: "geojson",
          data: geojson,
        });

        map.addLayer({
          id: layerId,
          type: "line",
          source: sourceId,
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            "line-color": "#18181b", // Zinc 900 line
            "line-width": 4.5,
            "line-opacity": 0.85,
          },
        });
      }
    } else {
      if (map.getLayer(layerId)) map.removeLayer(layerId);
      if (map.getSource(sourceId)) map.removeSource(sourceId);
    }

    // 4. Center & Bounds Fit
    if (pickupCoords && destinationCoords) {
      const bounds = new mapboxgl.LngLatBounds();
      bounds.extend(pickupCoords);
      bounds.extend(destinationCoords);
      map.fitBounds(bounds, {
        padding: { top: 70, bottom: 70, left: 60, right: 60 },
        duration: 1500,
      });
    } else if (pickupCoords) {
      map.easeTo({ center: pickupCoords, zoom: 14, duration: 1000 });
    } else if (destinationCoords) {
      map.easeTo({ center: destinationCoords, zoom: 14, duration: 1000 });
    }

    // 5. Manage Real-time Driver Markers
    const currentDriverIds = new Set(nearbyDrivers.map(d => d.userId));

    // Remove stale drivers
    Object.keys(driverMarkersRef.current).forEach(id => {
      if (!currentDriverIds.has(id)) {
        driverMarkersRef.current[id].remove();
        delete driverMarkersRef.current[id];
      }
    });

    // Add or update active drivers
    nearbyDrivers.forEach(driver => {
      if (driverMarkersRef.current[driver.userId]) {
        // Update position
        driverMarkersRef.current[driver.userId].setLngLat([driver.longitude, driver.latitude]);
      } else {
        // Create new driver marker (black car icon)
        const el = document.createElement("div");
        el.className = "w-7 h-7 rounded-full bg-zinc-900 border-2 border-white shadow-md flex items-center justify-center text-white ring-2 ring-zinc-900/20";
        el.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>';
        
        const newMarker = new mapboxgl.Marker({ element: el })
          .setLngLat([driver.longitude, driver.latitude])
          .addTo(map);
          
        driverMarkersRef.current[driver.userId] = newMarker;
      }
    });

  }, [pickupCoords, destinationCoords, routeGeometry, mapLoaded, nearbyDrivers]);

  // Determine fallback rendering
  const showFallback = !hasToken || mapError;

  return (
    <div className="w-full h-[320px] md:h-[500px] bg-zinc-100 rounded-3xl border border-zinc-200 shadow-sm overflow-hidden relative flex flex-col items-stretch">
      {/* Map Canvas */}
      {!showFallback ? (
        <div ref={mapContainerRef} className="w-full h-full relative" />
      ) : (
        /* High-fidelity custom mock canvas grid map */
        <div className="w-full h-full bg-[#FAF9F6] relative overflow-hidden flex flex-col justify-between p-6 select-none">
          {/* Subtle Vector grid pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)] bg-[size:40px_40px] opacity-75 pointer-events-none" />
          
          {/* Floating simulated vector lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <defs>
              <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
            </defs>
            {/* Draw a grid-aligned curved path if endpoints are selected */}
            {pickupCoords && destinationCoords && (
              <path
                d="M 30% 70% C 45% 45%, 70% 80%, 80% 30%"
                fill="none"
                stroke="url(#routeGradient)"
                strokeWidth="4"
                strokeDasharray="4 2"
                className="opacity-45"
              />
            )}
            {pickupCoords && destinationCoords && (
              <path
                d="M 30% 70% C 45% 45%, 70% 80%, 80% 30%"
                fill="none"
                stroke="#18181b"
                strokeWidth="4.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="animate-draw-line"
              />
            )}
          </svg>

          {/* Fallback Notice */}
          <div className="relative self-start bg-white/90 backdrop-blur-xs border border-zinc-200/80 rounded-xl px-3 py-1.5 flex items-center space-x-2 shadow-3xs max-w-xs">
            <Compass className="w-3.5 h-3.5 text-zinc-550 shrink-0" />
            <span className="text-[10px] font-mono font-bold tracking-tight text-zinc-600 uppercase">
              Simulated Vector Route Map
            </span>
          </div>

          {/* Interactive Visual Pins */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Mock Pickup Pin */}
            {pickupCoords && (
              <div 
                className="absolute flex flex-col items-center justify-center transition-all duration-300"
                style={{ left: "30%", top: "70%", transform: "translate(-50%, -100%)" }}
              >
                <div className="bg-emerald-50 border border-emerald-250 px-2 py-1 rounded-lg shadow-3xs text-[9px] font-extrabold text-emerald-800 bg-white/95 backdrop-blur-xs mb-1 border-dashed">
                  Pickup: {pickupName.split(",")[0]}
                </div>
                <div className="relative flex items-center justify-center">
                  <span className="absolute inline-flex h-6 w-6 rounded-full bg-emerald-400 opacity-30 animate-ping" />
                  <div className="w-6 h-6 rounded-full bg-emerald-500 border-2 border-white shadow-2xs flex items-center justify-center text-white">
                    <MapPin className="w-3 h-3" />
                  </div>
                </div>
              </div>
            )}

            {/* Mock Destination Pin */}
            {destinationCoords && (
              <div 
                className="absolute flex flex-col items-center justify-center transition-all duration-300"
                style={{ left: "80%", top: "30%", transform: "translate(-50%, -100%)" }}
              >
                <div className="bg-blue-50 border border-blue-250 px-2 py-1 rounded-lg shadow-3xs text-[9px] font-extrabold text-blue-800 bg-white/95 backdrop-blur-xs mb-1 border-dashed">
                  Drop: {destinationName.split(",")[0]}
                </div>
                <div className="relative flex items-center justify-center">
                  <span className="absolute inline-flex h-6 w-6 rounded-full bg-blue-400 opacity-30 animate-ping" />
                  <div className="w-6 h-6 rounded-full bg-blue-500 border-2 border-white shadow-2xs flex items-center justify-center text-white">
                    <Navigation className="w-3.5 h-3.5 shrink-0" />
                  </div>
                </div>
              </div>
            )}
            
            {/* Mock Nearby Drivers */}
            {pickupCoords && nearbyDrivers && nearbyDrivers.length > 0 && (
              <>
                {nearbyDrivers.map((driver, index) => {
                  // Generate a pseudo-random offset based on the index to scatter drivers around pickup
                  const offsetX = (index % 2 === 0 ? 1 : -1) * (15 + index * 5);
                  const offsetY = (index % 3 === 0 ? 1 : -1) * (20 + index * 4);
                  
                  return (
                    <div 
                      key={driver.userId || index}
                      className="absolute flex flex-col items-center justify-center transition-all duration-700"
                      style={{ 
                        left: `calc(30% + ${offsetX}px)`, 
                        top: `calc(70% + ${offsetY}px)`, 
                        transform: "translate(-50%, -50%)" 
                      }}
                    >
                      <div className="w-7 h-7 rounded-full bg-zinc-900 border-2 border-white shadow-md flex items-center justify-center text-white ring-2 ring-zinc-900/20">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/>
                        </svg>
                      </div>
                    </div>
                  );
                })}
              </>
            )}

            {/* Mock Nearby Driver Pins (Fallback) */}
            {nearbyDrivers && nearbyDrivers.length > 0 && !pickupCoords && !destinationCoords && nearbyDrivers.slice(0, 3).map((driver, idx) => {
              // Create pseudo-random offsets for fallback visualization
              const offsetX = (idx % 2 === 0 ? 1 : -1) * (40 + idx * 20);
              const offsetY = (idx % 3 === 0 ? 1 : -1) * (30 + idx * 15);
              return (
                <div 
                  key={driver.userId}
                  className="absolute flex flex-col items-center justify-center transition-all duration-1000 ease-in-out"
                  style={{ 
                    left: `calc(50% + ${offsetX}px)`, 
                    top: `calc(50% + ${offsetY}px)`, 
                    transform: "translate(-50%, -50%)" 
                  }}
                >
                  <div className="w-6 h-6 rounded-full bg-zinc-900 border-2 border-white shadow-2xs flex items-center justify-center text-white">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mock Center Guide */}
          {!pickupCoords && !destinationCoords && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center space-y-3.5">
              <div className="w-12 h-12 rounded-full bg-zinc-50 border border-zinc-200 flex items-center justify-center text-zinc-400 shadow-3xs">
                <Route className="w-5 h-5 stroke-[1.5]" />
              </div>
              <div>
                <h5 className="text-[12.5px] font-extrabold text-zinc-800 leading-tight">Interactive Map Canvas</h5>
                <p className="text-[10px] text-zinc-450 font-semibold max-w-[200px] mx-auto mt-1 leading-normal">
                  Enter pickup and destination details to plot your vector commute path.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Floating HUD Information Panel */}
      {(pickupCoords || destinationCoords || isLoadingRoute) && (
        <div className="absolute top-4 left-4 right-4 bg-white/95 backdrop-blur-md border border-zinc-200/90 rounded-2xl p-4.5 shadow-sm max-w-sm flex items-center justify-between">
          <div className="space-y-1.5 flex-1 min-w-0 pr-3">
            <span className="text-[8px] font-mono tracking-widest text-amber-600 font-bold uppercase block leading-none">
              ROUTE RESOLUTION
            </span>
            <div className="text-[13px] font-black text-zinc-900 truncate leading-tight">
              {pickupCoords ? pickupName.split(",")[0] : "Selecting Pickup..."} ➔{" "}
              {destinationCoords ? destinationName.split(",")[0] : "Selecting Drop..."}
            </div>
            
            {/* Route stats indicators */}
            {distanceMiles !== null && durationMins !== null && !isLoadingRoute ? (
              <div className="flex items-center space-x-2 text-[10.5px] text-zinc-500 font-semibold font-mono">
                <span className="bg-zinc-100 border border-zinc-200 px-2 py-0.5 rounded-md text-zinc-800 font-bold">
                  {distanceMiles.toFixed(1)} km
                </span>
                <span>•</span>
                <span className="bg-zinc-100 border border-zinc-200 px-2 py-0.5 rounded-md text-zinc-800 font-bold">
                  {Math.round(durationMins)} mins
                </span>
              </div>
            ) : isLoadingRoute ? (
              <span className="text-[10.5px] text-zinc-400 font-mono animate-pulse block">
                Solving driving route geometry...
              </span>
            ) : (
              <span className="text-[10.5px] text-zinc-450 font-mono block">
                Provide both stops to calculate travel distance.
              </span>
            )}
          </div>
          
          <div className="w-9 h-9 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-center text-zinc-600 shadow-3xs shrink-0">
            <Shield className="w-4 h-4 text-zinc-500" />
          </div>
        </div>
      )}
    </div>
  );
}
