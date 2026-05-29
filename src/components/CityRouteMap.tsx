"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Star, Shield } from "lucide-react";

export default function CityRouteMap() {
  const [carProgress, setCarProgress] = useState(0);

  // Smoothly move the car dot along the route
  useEffect(() => {
    const interval = setInterval(() => {
      setCarProgress((prev) => (prev >= 100 ? 0 : prev + 0.45));
    }, 45);

    return () => clearInterval(interval);
  }, []);

  const getCoordinates = (p: number) => {
    const t = p / 100;
    const startX = 80;
    const endX = 400;
    const x = startX + (endX - startX) * t;
    const y = 220 - Math.sin(t * Math.PI) * 110 - Math.sin(t * Math.PI * 2) * 20;
    return { x, y };
  };

  const carPos = getCoordinates(carProgress);

  return (
    <div className="w-full relative aspect-square md:aspect-[4/3] rounded-2xl border border-zinc-200 bg-white shadow-sm overflow-hidden flex flex-col justify-between p-6">
      
      {/* Background Grid (Very Soft) */}
      <div className="absolute inset-0 premium-grid-fine opacity-[0.15] pointer-events-none" />

      {/* Simplified Header: Just a clean GPS Active indicator */}
      <div className="flex items-center justify-between z-10 pointer-events-none">
        <div className="flex items-center space-x-2 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-zinc-200 shadow-2xs">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
          <span className="text-[10px] font-bold text-zinc-800 tracking-tight">Active route match</span>
        </div>
      </div>

      {/* Main SVG Map Area */}
      <div className="absolute inset-0 flex items-center justify-center p-8">
        <svg className="w-full h-full text-zinc-200" viewBox="0 0 500 350" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Simple Curved Streets Network */}
          <path d="M 20 80 L 480 80" stroke="#F3F4F6" strokeWidth="4" />
          <path d="M 20 180 L 480 180" stroke="#F3F4F6" strokeWidth="4" />
          <path d="M 20 280 L 480 280" stroke="#F3F4F6" strokeWidth="4" />
          
          <path d="M 120 20 L 120 330" stroke="#F3F4F6" strokeWidth="4" />
          <path d="M 260 20 L 260 330" stroke="#F3F4F6" strokeWidth="4" />
          <path d="M 380 20 L 380 330" stroke="#F3F4F6" strokeWidth="4" />

          {/* Simple Route Line casing */}
          <path
            d="M 80 220 Q 240 80 260 180 T 380 100"
            stroke="rgba(37, 99, 235, 0.05)"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
          />
          {/* Confident Blue Route Path */}
          <path
            d="M 80 220 Q 240 80 260 180 T 380 100"
            stroke="#2563EB"
            strokeWidth="3.5"
            fill="none"
            strokeLinecap="round"
          />
          {/* Moving path flow dash */}
          <path
            d="M 80 220 Q 240 80 260 180 T 380 100"
            stroke="#FFFFFF"
            strokeWidth="3.5"
            fill="none"
            strokeLinecap="round"
            strokeDasharray="14 100"
            strokeDashoffset={-carProgress * 2.5}
            className="opacity-90"
          />

          {/* Pickup Pin - Green */}
          <g transform="translate(80, 220)">
            <circle r="10" fill="rgba(22, 163, 74, 0.1)" />
            <circle r="5" fill="#16A34A" />
            <circle r="1.5" fill="#FFFFFF" />
          </g>

          {/* Destination Pin - Blue */}
          <g transform="translate(380, 100)">
            <circle r="10" fill="rgba(37, 99, 235, 0.1)" />
            <circle r="5" fill="#2563EB" />
            <circle r="1.5" fill="#FFFFFF" />
          </g>

          {/* Active Car Marker - Pure Black Frame with white core */}
          <g transform={`translate(${carPos.x}, ${carPos.y})`}>
            <circle r="7.5" fill="#000000" stroke="#FFFFFF" strokeWidth="2" />
            <circle r="2.5" fill="#FFFFFF" />
          </g>
        </svg>
      </div>

      {/* Single, Calm Customer ETA alert overlay */}
      <div className="z-10 bg-white border border-zinc-200 rounded-xl p-4 shadow-sm flex items-center space-x-3.5 max-w-[320px] mx-auto sm:mx-0 shadow-2xs">
        <div className="p-2.5 bg-emerald-50 rounded-lg text-emerald-600 shrink-0">
          <Shield className="w-5 h-5" />
        </div>
        <div>
          <h5 className="text-[13px] font-bold text-zinc-900 leading-tight">Driver is arriving in 2 mins</h5>
          <p className="text-[11px] text-zinc-500 font-medium mt-1 leading-normal">
            Aria is verified, background-checked, and driving a clean Tesla Model 3.
          </p>
        </div>
      </div>
    </div>
  );
}
