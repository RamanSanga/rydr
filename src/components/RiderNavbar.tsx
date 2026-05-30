"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton, useUser } from "@clerk/nextjs";
import { Car, Clock, User, Home, Sparkles } from "lucide-react";

export default function RiderNavbar() {
  const pathname = usePathname();
  const { isSignedIn, isLoaded } = useUser();

  const links = [
    { label: "Dashboard", href: "/rider", icon: Car },
    { label: "My Rides", href: "/rides", icon: Clock },
    { label: "Profile", href: "/profile", icon: User },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/85 backdrop-blur-md border-b border-zinc-200/80 py-4 shadow-3xs">
      <div className="max-w-[1400px] mx-auto px-6 flex items-center justify-between">
        
        {/* Left: Brand Logotype */}
        <div className="flex items-center space-x-10">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-black tracking-tighter text-[#111111] hover:opacity-90 transition-opacity">
              RYDR
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-7">
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`text-[13.5px] font-bold flex items-center space-x-1.5 transition-colors py-1 relative group ${
                    isActive ? "text-black" : "text-zinc-500 hover:text-black"
                  }`}
                >
                  <link.icon className="w-3.5 h-3.5 opacity-80" />
                  <span>{link.label}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#111111]" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right: Auth Profile / Clerk */}
        <div className="flex items-center space-x-5">
          <Link
            href="/"
            className="hidden sm:flex items-center space-x-1 text-zinc-500 hover:text-black transition-colors text-[13px] font-bold"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>

          <div className="flex items-center space-x-3.5 border-l border-zinc-200 pl-5">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-[11px] font-mono text-zinc-400 font-bold uppercase leading-none">RIDER ACCOUNT</span>
              <span className="text-[12.5px] font-extrabold text-zinc-800 leading-tight mt-0.5">Aria Chen</span>
            </div>
            
            {isLoaded && isSignedIn ? (
              <UserButton />
            ) : (
              <div className="w-8 h-8 rounded-full bg-zinc-900 text-white flex items-center justify-center text-[10.5px] font-black shadow-3xs">
                AC
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Mobile Bar navigation (for visual consistency and absolute responsiveness) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-zinc-200 py-3 px-6 flex items-center justify-around z-50 shadow-lg">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.label}
              href={link.href}
              className={`flex flex-col items-center space-y-1 text-[11px] font-bold ${
                isActive ? "text-black" : "text-zinc-400"
              }`}
            >
              <link.icon className="w-4 h-4" />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </div>
    </header>
  );
}