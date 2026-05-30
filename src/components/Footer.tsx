"use client";

import Link from "next/link";
import { Globe, ArrowUpRight } from "lucide-react";

export default function Footer() {
  const productLinks = [
    { label: "Book a Ride", href: "/rider" },
    { label: "Become a Driver", href: "/driver" },
    { label: "Airport Drop-offs", href: "/rider" },
    { label: "Cozy Cabins", href: "#safety" },
  ];

  const driverLinks = [
    { label: "Drive with us", href: "/driver" },
    { label: "Earnings Visibility", href: "/driver" },
    { label: "Driver Support", href: "/help" },
    { label: "Help Center", href: "/help" },
  ];

  const companyLinks = [
    { label: "About Rydr", href: "/about" },
    { label: "Safety", href: "/safety" },
    { label: "Help Centre", href: "/help" },
    { label: "Become a Driver", href: "/driver" },
  ];

  const developerLinks = [
    { label: "Chai Runs", href: "#services" },
    { label: "Rain Mode", href: "#services" },
    { label: "Date Nights", href: "#services" },
    { label: "Weekend Escapes", href: "#services" },
  ];

  const legalLinks = [
    { label: "Privacy Policy", href: "#privacy" },
    { label: "Terms of Service", href: "#terms" },
    { label: "Data Privacy", href: "#telemetry" },
    { label: "Cookie Settings", href: "#cookies" },
  ];

  return (
    <footer className="bg-[#F8F8F8] border-t border-zinc-200 pt-24 pb-12 relative overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 relative z-10 space-y-16">
        
        {/* Top Section: Logo, Mission, App Downloads */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Logo & Intro */}
          <div className="lg:col-span-4 space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-xl font-black tracking-tighter text-black">
                RYDR
              </span>
            </Link>
            <p className="text-zinc-505 text-sm max-w-xs leading-relaxed font-semibold">
              Safe, comfortable, and friendly rides in seconds. Chai runs, airport trips, date nights, or weekend plans—we're ready when you are.
            </p>

            <div className="flex items-center space-x-4 pt-2">
              {/* iOS App Store badge */}
              <button className="bg-white border border-zinc-200 hover:border-zinc-350 px-4 py-2 rounded-xl text-left transition-all cursor-pointer flex items-center space-x-2 shadow-3xs">
                <div className="w-5 h-5 rounded bg-black text-white text-[9px] font-mono flex items-center justify-center font-bold">iOS</div>
                <div>
                  <span className="text-[8px] font-mono text-zinc-400 uppercase leading-none block font-bold">Download on</span>
                  <span className="text-[11px] font-black text-zinc-800 leading-tight block mt-0.5">App Store</span>
                </div>
              </button>

              {/* Google Play store badge */}
              <button className="bg-white border border-zinc-200 hover:border-zinc-350 px-4 py-2 rounded-xl text-left transition-all cursor-pointer flex items-center space-x-2 shadow-3xs">
                <div className="w-5 h-5 rounded bg-black text-white text-[9px] font-mono flex items-center justify-center font-bold">APK</div>
                <div>
                  <span className="text-[8px] font-mono text-zinc-400 uppercase leading-none block font-bold">Get it on</span>
                  <span className="text-[11px] font-black text-zinc-800 leading-tight block mt-0.5">Google Play</span>
                </div>
              </button>
            </div>
          </div>

          {/* Links Grid */}
          <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-8">
            
            {/* Products Column */}
            <div className="space-y-4">
              <h5 className="text-[10px] font-mono font-bold tracking-widest text-zinc-400 uppercase">Product</h5>
              <ul className="space-y-2.5">
                {productLinks.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-[13px] text-zinc-650 hover:text-black font-bold transition-colors duration-150">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Drivers Column */}
            <div className="space-y-4">
              <h5 className="text-[10px] font-mono font-bold tracking-widest text-zinc-400 uppercase">Join the Crew</h5>
              <ul className="space-y-2.5">
                {driverLinks.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-[13px] text-zinc-650 hover:text-black font-bold transition-colors duration-150">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Column */}
            <div className="space-y-4">
              <h5 className="text-[10px] font-mono font-bold tracking-widest text-zinc-400 uppercase">Our Story</h5>
              <ul className="space-y-2.5">
                {companyLinks.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-[13px] text-zinc-650 hover:text-black font-bold transition-colors duration-150">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Moments Column */}
            <div className="space-y-4 col-span-2 md:col-span-1">
              <h5 className="text-[10px] font-mono font-bold tracking-widest text-zinc-400 uppercase">Moments</h5>
              <ul className="space-y-2.5">
                {developerLinks.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-[13px] text-zinc-650 hover:text-black font-bold transition-colors duration-150 flex items-center gap-1 group">
                      <span>{link.label}</span>
                      <ArrowUpRight className="w-3 h-3 text-zinc-400 group-hover:text-black transition-colors opacity-0 group-hover:opacity-100" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

          </div>

        </div>

        {/* Separator line */}
        <div className="h-[1px] bg-zinc-200" />

        {/* Bottom Section: Legal, Socials, Selector */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Legal and copy */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-6 gap-y-2 text-[12px] text-zinc-400 font-semibold">
            <span className="text-zinc-500">© {new Date().getFullYear()} Rydr Inc.</span>
            {legalLinks.map((link) => (
              <Link key={link.label} href={link.href} className="hover:text-black transition-colors">
                {link.label}
              </Link>
            ))}
          </div>

          {/* Socials & Language switcher */}
          <div className="flex items-center space-x-6">
            {/* Social inline SVGs */}
            <div className="flex items-center space-x-4.5">
              {/* Twitter / X */}
              <Link href="#twitter" className="text-zinc-400 hover:text-black transition-colors duration-150">
                <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </Link>

              {/* GitHub */}
              <Link href="#github" className="text-zinc-400 hover:text-black transition-colors duration-150">
                <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                </svg>
              </Link>

              {/* LinkedIn */}
              <Link href="#linkedin" className="text-zinc-400 hover:text-black transition-colors duration-150">
                <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </Link>
            </div>

            {/* Region / Currency */}
            <div className="flex items-center space-x-2 bg-white border border-zinc-200 px-3.5 py-1.5 rounded-lg text-[10px] font-mono text-zinc-500 font-bold uppercase cursor-pointer shadow-3xs hover:border-zinc-350 transition-colors">
              <Globe className="w-3.5 h-3.5 text-zinc-400" />
              <span>US • USD ($)</span>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}
