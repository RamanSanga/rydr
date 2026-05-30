"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton, useUser } from "@clerk/nextjs";
import { Home, Car, Navigation, Shield, HelpCircle, Info, User, Menu, X } from "lucide-react";

const NAV_LINKS = [
  { href: "/", label: "Home", icon: Home, mobileOnly: true },
  { href: "/rider", label: "Ride", icon: Car },
  { href: "/driver", label: "Drive", icon: Navigation },
  { href: "/safety", label: "Safety", icon: Shield },
  { href: "/help", label: "Help", icon: HelpCircle, desktopOnly: true },
  { href: "/about", label: "About", icon: Info, desktopOnly: true },
];

const MOBILE_TABS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/rider", label: "Ride", icon: Car },
  { href: "/driver", label: "Drive", icon: Navigation },
  { href: "/safety", label: "Safety", icon: Shield },
  { href: "/profile", label: "Profile", icon: User },
];

export default function AppNavbar() {
  const pathname = usePathname();
  const { isSignedIn, isLoaded } = useUser();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isHeroPage = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const isActive = useCallback(
    (href: string) => {
      if (href === "/") return pathname === "/";
      return pathname.startsWith(href);
    },
    [pathname]
  );

  const navBg =
    scrolled || !isHeroPage
      ? "bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-xs"
      : "bg-transparent";

  return (
    <>
      {/* ===== DESKTOP NAV ===== */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBg}`}
      >
        <div className="max-w-6xl mx-auto px-5 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-1.5 shrink-0">
              <span className="text-xl font-black tracking-tighter text-gray-900">
                RYDR
              </span>
            </Link>

            {/* Center nav links — desktop only */}
            <nav className="hidden md:flex items-center gap-1">
              {NAV_LINKS.filter((l) => !l.mobileOnly).map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                    isActive(link.href)
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right section */}
            <div className="flex items-center gap-3">
              {isLoaded && isSignedIn && (
                <>
                  <Link
                    href="/rides"
                    className="hidden md:inline-flex text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors px-3 py-2 rounded-full hover:bg-gray-50"
                  >
                    My Rides
                  </Link>
                  <UserButton
                    appearance={{
                      elements: {
                        avatarBox: "w-8 h-8",
                      },
                    }}
                  />
                </>
              )}
              {isLoaded && !isSignedIn && (
                <Link 
                  href="/sign-in"
                  className="hidden md:inline-flex px-5 py-2 bg-gray-900 text-white text-sm font-semibold rounded-full hover:bg-gray-800 transition-colors"
                >
                  Sign in
                </Link>
              )}

              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 -mr-2 text-gray-600 hover:text-gray-900"
                aria-label="Menu"
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
            <div className="px-5 py-4 space-y-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                    isActive(link.href)
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <link.icon className="w-4.5 h-4.5" />
                  {link.label}
                </Link>
              ))}
              <Link
                href="/rides"
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              >
                <User className="w-4.5 h-4.5" />
                My Rides
              </Link>
              <Link
                href="/profile"
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              >
                <User className="w-4.5 h-4.5" />
                Profile
              </Link>
              {isLoaded && !isSignedIn && (
                <Link 
                  href="/sign-in"
                  className="block w-full text-center mt-2 px-5 py-3 bg-gray-900 text-white text-sm font-bold rounded-xl hover:bg-gray-800 transition-colors"
                >
                  Sign in
                </Link>
              )}
            </div>
          </div>
        )}
      </header>

      {/* ===== MOBILE BOTTOM TAB BAR ===== */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-gray-200 safe-area-bottom">
        <div className="flex items-center justify-around h-16 px-2">
          {MOBILE_TABS.map((tab) => {
            const active = isActive(tab.href);
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`flex flex-col items-center justify-center gap-0.5 px-3 py-1.5 rounded-xl transition-colors min-w-[56px] ${
                  active ? "text-emerald-600" : "text-gray-400"
                }`}
              >
                <tab.icon
                  className={`w-5 h-5 ${active ? "stroke-[2.5]" : "stroke-[1.5]"}`}
                />
                <span
                  className={`text-[10px] leading-tight ${
                    active ? "font-bold" : "font-medium"
                  }`}
                >
                  {tab.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Spacer for fixed navbar */}
      <div className="h-16" />
    </>
  );
}
