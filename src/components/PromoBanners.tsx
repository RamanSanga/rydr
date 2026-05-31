"use client";

import { useState } from "react";
import { Sparkles, Copy, Check, Calendar, ArrowRight, Gift } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function PromoBanners({ promos }: { promos: any[] }) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!promos || promos.length === 0) return null;

  const handleCopy = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <section className="relative max-w-[1400px] mx-auto px-6 sm:px-8 py-8 z-20">
      <div className="space-y-4">
        {/* Section Heading */}
        <div className="flex items-center space-x-2">
          <div className="p-1 rounded-lg bg-amber-500/10 text-amber-600 border border-amber-500/20">
            <Sparkles className="w-4 h-4 text-amber-600 animate-pulse" />
          </div>
          <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-[0.2em]">Featured Offers & Discounts</h3>
        </div>

        {/* Promo Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {promos.map((promo) => {
            const isPercentage = promo.discountType === "percentage";
            const discountLabel = isPercentage ? `${promo.discountValue}% OFF` : `₹${promo.discountValue} OFF`;
            
            return (
              <motion.div
                key={promo.id}
                whileHover={{ y: -3 }}
                transition={{ duration: 0.2 }}
                className="bg-white border border-zinc-200/80 rounded-3xl p-5.5 flex flex-col justify-between shadow-[0_4px_25px_rgba(0,0,0,0.015)] hover:border-zinc-400 hover:shadow-[0_8px_30px_rgba(0,0,0,0.03)] transition-all group"
              >
                <div className="space-y-3">
                  {/* Card Badge */}
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-amber-600 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                      <Gift className="w-3 h-3" />
                      <span>{discountLabel}</span>
                    </span>
                    <span className="text-[9.5px] font-mono text-zinc-400 font-bold uppercase flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>
                        Valid Till {new Date(promo.expiryDate).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                        })}
                      </span>
                    </span>
                  </div>

                  {/* Header Title */}
                  <div className="space-y-1">
                    <h4 className="text-[14.5px] font-black text-zinc-950 tracking-tight leading-snug group-hover:text-amber-600 transition-colors">
                      {promo.code.includes("FIRST") || promo.code.includes("WELCOME")
                        ? `Save ${discountLabel} on your next ride`
                        : `${promo.code} Promotional Ride Special`}
                    </h4>
                    <p className="text-[11.5px] text-zinc-450 font-semibold leading-normal">
                      Apply this voucher code during ride booking to instantly lock your estimated discount.
                    </p>
                  </div>
                </div>

                {/* Promo Code Copy Capsule */}
                <div className="mt-5 pt-4.5 border-t border-zinc-100 flex items-center justify-between">
                  <div className="flex items-center space-x-1.5">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider font-mono">Code:</span>
                    <code className="text-sm font-black font-mono bg-zinc-900/5 text-zinc-900 border border-zinc-200 px-3 py-1 rounded-lg uppercase tracking-wide">
                      {promo.code}
                    </code>
                  </div>

                  <button
                    onClick={() => handleCopy(promo.id, promo.code)}
                    className="p-2 border border-zinc-200 hover:border-zinc-400 text-zinc-650 hover:text-zinc-950 rounded-xl bg-zinc-50/50 transition-all flex items-center justify-center cursor-pointer active:scale-95 shadow-3xs"
                    title="Copy Code"
                  >
                    <AnimatePresence mode="wait">
                      {copiedId === promo.id ? (
                        <motion.div
                          key="copied"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                        >
                          <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="copy"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                        >
                          <Copy className="w-4 h-4" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
