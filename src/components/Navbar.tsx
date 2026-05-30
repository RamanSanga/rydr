"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton, useUser } from "@clerk/nextjs";
import { Menu, X, HelpCircle, Shield, Car, Info, User, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { isSignedIn, isLoaded } = useUser();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Standard premium links based on auth state
  const baseLinks = [
    { label: "Ride", href: "/rider", icon: Car },
    { label: "Drive", href: "/driver", icon: Shield },
    { label: "Safety", href: "/safety", icon: Shield },
    { label: "About", href: "/about", icon: Info },
  ];

  const authLinks = isSignedIn
    ? [
        { label: "My Rides", href: "/rides", icon: Clock },
        { label: "Profile", href: "/profile", icon: User },
      ]
    : [];

  const navLinks = [...baseLinks, ...authLinks];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/70 backdrop-blur-xl border-b border-zinc-200/50 py-3 shadow-[0_2px_20px_rgba(0,0,0,0.02)]"
          : "bg-white/40 backdrop-blur-md border-b border-zinc-100/30 py-5"
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-6 sm:px-8 flex items-center justify-between">
        
        {/* Left Side: Brand Logo & Navigation */}
        <div className="flex items-center space-x-10">
          <Link href="/" className="flex items-center space-x-2 group">
            <span className="text-2xl font-black tracking-tighter text-zinc-900 group-hover:opacity-80 transition-all duration-200">
              RYDR
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-zinc-900 group-hover:scale-125 transition-transform duration-200" />
          </Link>

          {/* Premium Desktop Nav */}
          <nav className="hidden lg:flex items-center space-x-6">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`text-[13px] font-semibold transition-all duration-200 px-3.5 py-1.5 rounded-full relative ${
                    isActive
                      ? "text-zinc-950 bg-zinc-900/5"
                      : "text-zinc-550 hover:text-zinc-950 hover:bg-zinc-900/[0.02]"
                  }`}
                >
                  <span className="relative z-10">{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Side: Auth / Actions */}
        <div className="hidden lg:flex items-center space-x-5">
          <Link
            href="/help"
            className={`flex items-center space-x-1.5 text-[13px] font-semibold px-3.5 py-1.5 rounded-full transition-all duration-200 ${
              pathname === "/help"
                ? "text-zinc-950 bg-zinc-900/5"
                : "text-zinc-500 hover:text-zinc-950 hover:bg-zinc-900/[0.02]"
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Help</span>
          </Link>

          {/* User Sign In/Up or Clerk Profile */}
          <div className="flex items-center pl-4 border-l border-zinc-200/60">
            {isLoaded ? (
              isSignedIn ? (
                <div className="flex items-center space-x-3 bg-zinc-900/5 hover:bg-zinc-900/10 px-3 py-1.5 rounded-full border border-zinc-200/30 transition-all duration-200 shadow-2xs">
                  <span className="text-[11.5px] font-bold text-zinc-800 pr-1 pl-1">Account</span>
                  <div className="scale-95 origin-center">
                    <UserButton />
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link
                    href="/sign-in"
                    className="text-[13px] font-semibold text-zinc-650 hover:text-zinc-950 px-4 py-2 transition-all duration-150"
                  >
                    Log in
                  </Link>
                  <Link
                    href="/sign-up"
                    className="px-4.5 py-2 bg-zinc-950 hover:bg-zinc-850 active:scale-97 text-white text-[13px] font-bold rounded-full shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    Sign up
                  </Link>
                </div>
              )
            ) : (
              <div className="h-8 w-8 rounded-full bg-zinc-100 animate-pulse" />
            )}
          </div>
        </div>

        {/* Mobile Hamburger menu trigger */}
        <div className="lg:hidden flex items-center space-x-3">
          {isLoaded && isSignedIn && (
            <div className="scale-95">
              <UserButton />
            </div>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-zinc-500 hover:text-zinc-950 rounded-full hover:bg-zinc-100 transition-all cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5.5 h-5.5" /> : <Menu className="w-5.5 h-5.5" />}
          </button>
        </div>
      </div>

      {/* Premium Glassmorphic Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="lg:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-2xl border-b border-zinc-200 shadow-xl overflow-hidden"
          >
            <div className="px-6 py-6 flex flex-col space-y-3.5">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 text-[15px] font-bold px-4 py-3 rounded-2xl transition-all ${
                      isActive
                        ? "bg-zinc-950 text-white shadow-md shadow-zinc-950/10"
                        : "text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100"
                    }`}
                  >
                    <link.icon className={`w-4.5 h-4.5 ${isActive ? "text-white" : "text-zinc-400"}`} />
                    <span>{link.label}</span>
                  </Link>
                );
              })}

              <Link
                href="/help"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center space-x-3 text-[15px] font-bold px-4 py-3 rounded-2xl transition-all ${
                  pathname === "/help"
                    ? "bg-zinc-950 text-white shadow-md"
                    : "text-zinc-650 hover:text-zinc-950 hover:bg-zinc-100"
                }`}
              >
                <HelpCircle className="w-4.5 h-4.5 text-zinc-400" />
                <span>Help Support</span>
              </Link>

              {isLoaded && !isSignedIn && (
                <div className="pt-4 flex flex-col space-y-2.5 border-t border-zinc-200/60">
                  <Link
                    href="/sign-in"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-3 text-center border border-zinc-200 text-zinc-900 font-bold text-sm rounded-xl hover:bg-zinc-50 active:scale-98 transition-all block"
                  >
                    Log in
                  </Link>
                  <Link
                    href="/sign-up"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-3 text-center bg-zinc-950 text-white font-bold text-sm rounded-xl hover:bg-zinc-850 active:scale-98 transition-all block shadow-sm"
                  >
                    Sign up
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}