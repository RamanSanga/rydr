"use client";

import Link from "next/link";
import { Globe, ArrowUpRight } from "lucide-react";

export default function Footer() {
  const productLinks = [
    { label: "Book a Ride", href: "/rider" },
    { label: "Become a Driver", href: "/driver" },
    { label: "Safety First", href: "/safety" },
    { label: "Help Centre", href: "/help" },
  ];

  const companyLinks = [
    { label: "About Us", href: "/about" },
    { label: "Safety", href: "/safety" },
    { label: "Careers", href: "/about" },
    { label: "Press & News", href: "/about" },
  ];

  const travelLinks = [
    { label: "Daily Commute", href: "/rider" },
    { label: "Airport Drop-offs", href: "/rider" },
    { label: "Outstation Trips", href: "/rider" },
    { label: "Premium Services", href: "/rider" },
  ];

  const legalLinks = [
    { label: "Privacy Policy", href: "#privacy" },
    { label: "Terms of Service", href: "#terms" },
    { label: "Cookie Settings", href: "#cookies" },
  ];

  return (
    <footer className="bg-zinc-50 border-t border-zinc-200/60 pt-16 pb-12 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-5 sm:px-6 relative z-10 space-y-12">
        
        {/* Top Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          
          {/* Logo & Tagline Column */}
          <div className="md:col-span-4 space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-xl font-black tracking-tighter text-zinc-900">
                RYDR
              </span>
            </Link>
            <p className="text-zinc-500 text-sm max-w-xs leading-relaxed">
              Premium and safe rides in seconds. We are building the future of friendly urban mobility in India.
            </p>
          </div>

          {/* Links Grid */}
          <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-8">
            
            {/* Products Column */}
            <div className="space-y-4">
              <h5 className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">Product</h5>
              <ul className="space-y-2.5">
                {productLinks.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm text-zinc-550 hover:text-emerald-700 transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Travel Solutions Column */}
            <div className="space-y-4">
              <h5 className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">Solutions</h5>
              <ul className="space-y-2.5">
                {travelLinks.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm text-zinc-550 hover:text-emerald-700 transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Column */}
            <div className="space-y-4 col-span-2 sm:col-span-1">
              <h5 className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">Company</h5>
              <ul className="space-y-2.5">
                {companyLinks.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm text-zinc-550 hover:text-emerald-700 transition-colors flex items-center gap-1 group">
                      <span>{link.label}</span>
                      <ArrowUpRight className="w-3 h-3 text-zinc-400 group-hover:text-emerald-700 transition-colors opacity-0 group-hover:opacity-100" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

          </div>

        </div>

        {/* Separator line */}
        <div className="h-[1px] bg-zinc-200" />

        {/* Bottom Section */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Legal Links & Copyright */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-6 gap-y-2 text-xs text-zinc-400 font-semibold">
            <span className="text-zinc-500">© {new Date().getFullYear()} RYDR Technologies Private Limited.</span>
            {legalLinks.map((link) => (
              <Link key={link.label} href={link.href} className="hover:text-zinc-900 transition-colors">
                {link.label}
              </Link>
            ))}
          </div>

          {/* Region Selector */}
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2 bg-white border border-zinc-200 px-3.5 py-1.5 rounded-lg text-[10px] font-mono text-zinc-500 font-bold uppercase cursor-pointer hover:border-zinc-350 transition-colors shadow-3xs">
              <Globe className="w-3.5 h-3.5 text-zinc-400" />
              <span>India • INR (₹)</span>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}
