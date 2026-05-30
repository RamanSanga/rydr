"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getAdminDrivers, reviewDriverAction } from "@/actions/onboarding";
import { Loader2, ShieldCheck, ShieldAlert, Award, FileText, Check, X, ArrowRight, Eye, RefreshCw, Star, AlertTriangle } from "lucide-react";
import Navbar from "@/components/Navbar";

export default function AdminPage() {
  const [loading, setLoading] = useState(true);
  const [drivers, setDrivers] = useState<any[]>([]);

  const loadDrivers = async () => {
    setLoading(true);
    try {
      const res = await getAdminDrivers();
      if (res.success) {
        setDrivers(res.drivers);
      }
    } catch (err) {
      console.error("Failed to load drivers for review", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDrivers();
  }, []);

  const handleQuickApprove = async (driverId: string) => {
    setLoading(true);
    try {
      await reviewDriverAction(driverId, "Approved");
      await loadDrivers();
    } catch (err) {
      alert("Failed to approve driver");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickReject = async (driverId: string) => {
    setLoading(true);
    try {
      await reviewDriverAction(driverId, "Rejected", "Aadhaar image was blurry. Please re-upload front and back views clearly.");
      await loadDrivers();
    } catch (err) {
      alert("Failed to reject driver");
    } finally {
      setLoading(false);
    }
  };

  if (loading && drivers.length === 0) {
    return (
      <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 text-zinc-950 animate-spin" />
        <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase">Opening Compliance Desk...</span>
      </div>
    );
  }

  const statusColors = {
    Approved: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    Pending: "bg-amber-500/10 text-amber-600 border-amber-500/20 animate-pulse",
    "Under Review": "bg-blue-500/10 text-blue-600 border-blue-500/20",
    Rejected: "bg-red-500/10 text-red-600 border-red-500/20",
  } as Record<string, string>;

  return (
    <main className="relative min-h-screen bg-zinc-50 text-zinc-900 antialiased pb-24 pt-28">
      {/* Visual background fine grid */}
      <div className="absolute inset-0 premium-grid-fine opacity-[0.04] pointer-events-none" />
      <Navbar />

      <div className="max-w-[1200px] mx-auto px-6 sm:px-8 relative z-10 space-y-8">
        
        {/* Typographic Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 pb-6 border-b border-zinc-200/60">
          <div className="space-y-1.5">
            <span className="text-[10px] font-mono tracking-[0.25em] text-red-600 font-bold uppercase leading-none">
              Security Compliance
            </span>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tighter text-zinc-950 leading-tight">
              Administrative Review Desk
            </h1>
            <p className="text-zinc-550 text-sm font-semibold">
              Approve, reject, or request compliance audits for registered driver accounts.
            </p>
          </div>

          <button
            onClick={loadDrivers}
            className="flex items-center gap-1.5 px-4.5 py-2.5 bg-white border border-zinc-200 hover:border-zinc-400 font-bold text-xs rounded-full transition-colors active:scale-97 cursor-pointer shadow-3xs text-zinc-700"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh Audit Feed</span>
          </button>
        </div>

        {/* Drivers review stack */}
        <div className="space-y-5">
          {drivers.length > 0 ? (
            drivers.map((driver) => {
              const profile = driver.driverProfile;
              const status = profile?.verificationStatus || "Pending";
              
              return (
                <div
                  key={driver.id}
                  className="bg-white border border-zinc-200 rounded-3xl p-5 sm:p-6.5 shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:border-zinc-350 hover:shadow-2xs transition-all duration-200 space-y-5"
                >
                  {/* Row Header: Name, Email, Status */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center space-x-3.5">
                      <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-200 flex items-center justify-center text-white font-black text-xs">
                        {driver.name ? driver.name.substring(0, 2).toUpperCase() : "??"}
                      </div>
                      <div>
                        <h3 className="text-[14.5px] font-bold text-zinc-950 leading-tight">
                          {driver.name}
                        </h3>
                        <span className="text-[10px] text-zinc-450 mt-0.5 block">
                          ID: {driver.id} · {driver.email}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${statusColors[status]}`}>
                        {status}
                      </span>
                      {profile?.rejectionReason && (
                        <span className="text-[10.5px] text-red-500 font-bold bg-red-50 px-2 py-0.5 rounded border border-red-100 flex items-center gap-1 shrink-0">
                          <AlertTriangle className="w-3 h-3" />
                          <span>Rejected Reason Added</span>
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="h-[1px] bg-zinc-100" />

                  {/* Document & Vehicle Summaries */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-[11.5px] font-semibold text-zinc-650">
                    <div>
                      <span className="text-[9px] font-mono font-bold text-zinc-400 uppercase tracking-wide">Vehicle Registered</span>
                      <p className="text-zinc-800 font-extrabold mt-1">{profile?.vehicleModel || "N/A"}</p>
                      <span className="text-[10px] font-mono text-zinc-455 block mt-0.5 uppercase">No: {profile?.vehicleNumber || "N/A"} · Type: {profile?.vehicleType || "N/A"}</span>
                    </div>

                    <div>
                      <span className="text-[9px] font-mono font-bold text-zinc-400 uppercase tracking-wide">License Number</span>
                      <p className="text-zinc-800 font-extrabold mt-1 font-mono">{profile?.licenseNumber || "N/A"}</p>
                      <span className="text-[10px] text-zinc-455 block mt-0.5">Expires: {profile?.licenseExpiry || "N/A"}</span>
                    </div>

                    <div>
                      <span className="text-[9px] font-mono font-bold text-zinc-400 uppercase tracking-wide">KYC Files Uploaded</span>
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {profile?.aadhaarUrl && (
                          <span className="bg-zinc-100 text-zinc-700 px-2 py-0.5 rounded text-[9.5px] font-bold border border-zinc-200">Aadhaar</span>
                        )}
                        {profile?.panUrl && (
                          <span className="bg-zinc-100 text-zinc-700 px-2 py-0.5 rounded text-[9.5px] font-bold border border-zinc-200">PAN</span>
                        )}
                        {profile?.selfieUrl && (
                          <span className="bg-zinc-100 text-zinc-700 px-2 py-0.5 rounded text-[9.5px] font-bold border border-zinc-200">Selfie</span>
                        )}
                        {profile?.rcUrl && (
                          <span className="bg-zinc-100 text-zinc-700 px-2 py-0.5 rounded text-[9.5px] font-bold border border-zinc-200">RC</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="h-[1px] bg-zinc-100" />

                  {/* Admin Audit Actions */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-1">
                    <p className="text-[10.5px] text-zinc-450 font-semibold italic">
                      {status === "Pending" ? "Awaiting administrative dispatch approval." : `Audit finalized. Status matches: ${status}.`}
                    </p>

                    <div className="flex items-center space-x-3 self-end sm:self-auto">
                      <Link
                        href={`/admin/driver/${driver.id}`}
                        className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-bold border border-zinc-200/60 rounded-xl transition-all cursor-pointer shadow-3xs flex items-center space-x-1.5"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect Files</span>
                      </Link>

                      {status !== "Approved" && (
                        <button
                          onClick={() => handleQuickApprove(driver.id)}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl active:scale-97 transition-all cursor-pointer shadow-3xs flex items-center space-x-1"
                        >
                          <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                          <span>Approve</span>
                        </button>
                      )}

                      {status !== "Rejected" && (
                        <button
                          onClick={() => handleQuickReject(driver.id)}
                          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl active:scale-97 transition-all cursor-pointer shadow-3xs flex items-center space-x-1"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Reject</span>
                        </button>
                      )}
                    </div>
                  </div>

                </div>
              );
            })
          ) : (
            <div className="bg-white border border-zinc-200 rounded-3xl p-16 text-center shadow-3xs flex flex-col items-center justify-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-zinc-50 border border-zinc-200 flex items-center justify-center text-zinc-400">
                <FileText className="w-6 h-6 stroke-[1.5]" />
              </div>
              <div>
                <h4 className="text-base font-extrabold text-zinc-950">No registered drivers</h4>
                <p className="text-xs text-zinc-500 max-w-[280px] mx-auto mt-1 leading-normal font-semibold">
                  We couldn't find any driver profiles registered inside the database currently. Sign up a new driver account to test!
                </p>
              </div>
            </div>
          )}
        </div>

      </div>

      {loading && (
        <div className="fixed inset-0 bg-white/40 backdrop-blur-3xs z-50 flex items-center justify-center">
          <div className="flex flex-col items-center space-y-3.5 p-7 bg-white border border-zinc-200 shadow-2xl rounded-3xl">
            <Loader2 className="w-8 h-8 text-zinc-950 animate-spin" />
            <span className="text-[10px] font-mono font-black text-zinc-500 uppercase tracking-widest">Processing Audits...</span>
          </div>
        </div>
      )}
    </main>
  );
}
