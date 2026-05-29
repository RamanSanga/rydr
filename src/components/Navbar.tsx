"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { UserButton, useUser } from "@clerk/nextjs";
import { Menu, X, Globe, ChevronDown, HelpCircle, Shield, Briefcase, Car, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState("EN");

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

  const navLinks = [
    { label: "Ride", href: "#ride", icon: Car },
    { label: "Drive", href: "#drive", icon: Shield },
    { label: "Business", href: "#business", icon: Briefcase },
    { label: "Safety", href: "#safety", icon: Shield },
    { label: "About", href: "#about", icon: Info },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        scrolled
          ? "bg-white/90 backdrop-blur-md border-b border-zinc-200/80 py-3.5 shadow-sm"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-6 flex items-center justify-between">
        {/* Left Side: Logo & Primary Nav */}
        <div className="flex items-center space-x-12">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-black tracking-tighter text-[#111111] hover:opacity-90 transition-opacity">
              RYDR
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-[14px] font-medium text-zinc-500 hover:text-black transition-colors duration-150 relative group py-1"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#111111] transition-all duration-200 group-hover:w-full" />
              </Link>
            ))}
          </nav>
        </div>

        {/* Right Side: Language, Help, Clerk Auth */}
        <div className="hidden md:flex items-center space-x-6">
          {/* Language Switcher */}
          <div className="relative">
            <button
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="flex items-center space-x-1 text-zinc-500 hover:text-black transition-colors text-[13px] font-medium cursor-pointer"
            >
              <Globe className="w-4 h-4" />
              <span>{currentLang}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${langMenuOpen ? "rotate-180" : ""}`} />
            </button>

            <AnimatePresence>
              {langMenuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setLangMenuOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-32 bg-white border border-zinc-200 rounded-xl p-1.5 shadow-lg z-20"
                  >
                    {["EN", "ES", "FR", "DE"].map((lang) => (
                      <button
                        key={lang}
                        onClick={() => {
                          setCurrentLang(lang);
                          setLangMenuOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-[13px] transition-colors ${
                          currentLang === lang
                            ? "bg-zinc-100 text-black font-semibold"
                            : "text-zinc-500 hover:bg-zinc-50 hover:text-black"
                        }`}
                      >
                        {lang === "EN" ? "English" : lang === "ES" ? "Español" : lang === "FR" ? "Français" : "Deutsch"}
                      </button>
                    ))}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* Help */}
          <Link
            href="#help"
            className="flex items-center space-x-1 text-zinc-500 hover:text-black transition-colors text-[13px] font-medium"
          >
            <HelpCircle className="w-4 h-4" />
            <span>Help</span>
          </Link>

          {/* Authentication Block */}
          <div className="flex items-center space-x-4 border-l border-zinc-200 pl-6">
            {isLoaded && (
              <>
                {!isSignedIn ? (
                  <>
                    <Link href="/sign-in" className="text-[13px] font-semibold text-zinc-500 hover:text-black transition-colors">
                      Log in
                    </Link>
                    <Link href="/sign-up" className="px-4 py-2 bg-black text-white hover:bg-zinc-800 active:scale-98 transition-all text-[13px] font-semibold rounded-lg shadow-sm">
                      Sign up
                    </Link>
                  </>
                ) : (
                  <div className="flex items-center space-x-3 bg-zinc-50 border border-zinc-200 px-3.5 py-1.5 rounded-lg shadow-2xs">
                    <span className="text-[12px] font-semibold text-zinc-700">Dashboard</span>
                    <UserButton />
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Mobile Hamburger Trigger */}
        <div className="md:hidden flex items-center space-x-4">
          {isLoaded && isSignedIn && (
            <UserButton />
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-zinc-500 hover:text-black focus:outline-none cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="md:hidden bg-white border-b border-zinc-200 overflow-hidden shadow-md"
          >
            <div className="px-6 py-6 flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-3 text-base font-semibold text-zinc-700 hover:text-black transition-colors py-1.5"
                >
                  <link.icon className="w-4 h-4 text-zinc-400" />
                  <span>{link.label}</span>
                </Link>
              ))}

              <div className="h-[1px] bg-zinc-200/80 my-3" />

              <div className="flex flex-col space-y-4">
                <div className="flex items-center justify-between text-zinc-500">
                  <span className="text-sm font-semibold">Language</span>
                  <div className="flex space-x-2">
                    {["EN", "ES", "FR"].map((l) => (
                      <button
                        key={l}
                        onClick={() => setCurrentLang(l)}
                        className={`text-xs px-2.5 py-1 rounded-md ${
                          currentLang === l ? "bg-zinc-100 text-black font-bold" : "hover:text-black"
                        }`}
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                </div>

                {isLoaded && !isSignedIn && (
                  <>
                    <Link
                      href="/sign-in"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full py-2.5 text-center border border-zinc-200 text-black font-semibold text-sm rounded-lg hover:bg-zinc-50 transition-colors"
                    >
                      Log in
                    </Link>
                    <Link
                      href="/sign-up"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full py-2.5 text-center bg-black text-white font-semibold text-sm rounded-lg hover:bg-zinc-800 transition-colors"
                    >
                      Sign up
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}