"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getAdminDrivers, reviewDriverAction } from "@/actions/onboarding";
import {
  getAdminDashboardStats,
  getAdminUsers,
  getAdminRides,
  getAdminReferrals,
  getAdminReviews,
  toggleUserRoleAction
} from "@/actions/admin";
import {
  createPromoAction,
  deletePromoAction,
  fetchPromosAction,
  updatePromoAction
} from "@/actions/promo";
import {
  Loader2,
  ShieldCheck,
  ShieldAlert,
  Award,
  FileText,
  Check,
  X,
  ArrowRight,
  Eye,
  RefreshCw,
  Star,
  AlertTriangle,
  Users,
  Car,
  Ticket,
  Share2,
  TrendingUp,
  Activity,
  Plus,
  Trash2,
  Calendar,
  Layers,
  MapPin,
  Clock,
  CircleDot,
  CheckCircle2,
  Percent,
  ChevronRight
} from "lucide-react";
import Navbar from "@/components/Navbar";

function TableSkeleton({ cols }: { cols: number }) {
  return (
    <>
      {[1, 2, 3].map((row) => (
        <tr key={row} className="animate-pulse">
          {Array.from({ length: cols }).map((_, col) => (
            <td key={col} className="px-6 py-4.5">
              <div className="h-4 bg-zinc-205 rounded w-5/6" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

function ComplianceSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {[1, 2].map((i) => (
        <div key={i} className="bg-white border border-zinc-200/60 rounded-3xl p-5 sm:p-6 space-y-4.5">
          <div className="flex justify-between items-center">
            <div className="h-4 bg-zinc-200 rounded w-1/3" />
            <div className="h-4 bg-zinc-200 rounded w-16" />
          </div>
          <div className="h-[1px] bg-zinc-100" />
          <div className="h-10 bg-zinc-200 rounded-xl w-full" />
        </div>
      ))}
    </div>
  );
}

function ReviewFeedSkeleton() {
  return (
    <div className="divide-y divide-zinc-100 animate-pulse">
      {[1, 2].map((i) => (
        <div key={i} className="p-5.5 space-y-3">
          <div className="flex items-center space-x-2">
            <div className="h-4 bg-zinc-200/80 rounded w-24" />
            <div className="h-3 bg-zinc-250 rounded w-16" />
          </div>
          <div className="h-5 bg-zinc-200 rounded w-3/4" />
          <div className="h-3 bg-zinc-250 rounded w-1/2" />
        </div>
      ))}
    </div>
  );
}

export default function AdminPage() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"users" | "drivers" | "rides" | "promos" | "referrals" | "reviews">("users");

  // State Collections
  const [stats, setStats] = useState({
    totalRevenue: 0,
    activeRidesCount: 0,
    activeOnlineDriversCount: 0,
    couponUsageCount: 0
  });
  const [users, setUsers] = useState<any[]>([]);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [rides, setRides] = useState<any[]>([]);
  const [promos, setPromos] = useState<any[]>([]);
  const [referrals, setReferrals] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);

  // Promo Form State
  const [newPromoCode, setNewPromoCode] = useState("");
  const [newPromoType, setNewPromoType] = useState<"flat" | "percentage">("flat");
  const [newPromoValue, setNewPromoValue] = useState<number>(50);
  const [newPromoExpiry, setNewPromoExpiry] = useState("");
  const [promoSubmitting, setPromoSubmitting] = useState(false);

  // Load administrative datasets
  const loadAllData = async () => {
    setLoading(true);
    try {
      const [
        statsRes,
        usersRes,
        driversRes,
        ridesRes,
        promosRes,
        referralsRes,
        reviewsRes
      ] = await Promise.all([
        getAdminDashboardStats(),
        getAdminUsers(),
        getAdminDrivers(),
        getAdminRides(),
        fetchPromosAction(),
        getAdminReferrals(),
        getAdminReviews()
      ]);

      if (statsRes.success) setStats(statsRes);
      if (usersRes.success) setUsers(usersRes.users);
      if (driversRes.success) setDrivers(driversRes.drivers);
      if (ridesRes.success) setRides(ridesRes.rides);
      setPromos(promosRes);
      if (referralsRes.success) setReferrals(referralsRes.referrals);
      if (reviewsRes.success) setReviews(reviewsRes.reviews);
    } catch (err) {
      console.error("Failed to load control desk datasets", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const handleQuickApprove = async (driverId: string) => {
    setLoading(true);
    try {
      await reviewDriverAction(driverId, "Approved");
      await loadAllData();
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
      await loadAllData();
    } catch (err) {
      alert("Failed to reject driver");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleRole = async (userId: string, currentRole: string) => {
    setLoading(true);
    try {
      const nextRole = currentRole === "rider" ? "driver" : currentRole === "driver" ? "admin" : "rider";
      await toggleUserRoleAction(userId, nextRole);
      await loadAllData();
    } catch (err) {
      alert("Failed to update user role");
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePromo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPromoCode || !newPromoExpiry) {
      alert("Please provide promo code and expiry date");
      return;
    }
    setPromoSubmitting(true);
    try {
      await createPromoAction(
        newPromoCode,
        newPromoType,
        newPromoValue,
        newPromoExpiry,
        true
      );
      setNewPromoCode("");
      setNewPromoExpiry("");
      await loadAllData();
    } catch (err: any) {
      alert(err.message || "Failed to create promo code");
    } finally {
      setPromoSubmitting(false);
    }
  };

  const handleDeletePromo = async (id: string) => {
    if (!confirm("Are you sure you want to delete this coupon?")) return;
    setLoading(true);
    try {
      await deletePromoAction(id);
      await loadAllData();
    } catch (err) {
      alert("Failed to delete promo code");
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePromoActive = async (promo: any) => {
    setLoading(true);
    try {
      await updatePromoAction(
        promo.id,
        promo.code,
        promo.discountType,
        promo.discountValue,
        promo.expiryDate.toISOString(),
        !promo.active
      );
      await loadAllData();
    } catch (err) {
      alert("Failed to toggle promo status");
    } finally {
      setLoading(false);
    }
  };

  // Status Styling Helpers
  const driverStatusColors = {
    Approved: "bg-emerald-50 text-emerald-600 border-emerald-200",
    Pending: "bg-amber-50 text-amber-600 border-amber-200 animate-pulse",
    "Under Review": "bg-blue-50 text-blue-600 border-blue-200",
    Rejected: "bg-red-50 text-red-600 border-red-200",
  } as Record<string, string>;

  const rideStatusColors = {
    Requested: "bg-amber-50 text-amber-700 border-amber-200",
    Accepted: "bg-blue-50 text-blue-700 border-blue-200",
    "Driver Arriving": "bg-indigo-50 text-indigo-700 border-indigo-200",
    "On Trip": "bg-purple-50 text-purple-700 border-purple-200 animate-pulse",
    Completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Cancelled: "bg-zinc-100 text-zinc-500 border-zinc-200",
  } as Record<string, string>;

  // Compute Review Star Distribution
  const reviewCount = reviews.length;
  const starCounts = [0, 0, 0, 0, 0]; // index 0=1 star, 4=5 stars
  reviews.forEach((r) => {
    const star = Math.max(1, Math.min(5, r.rating));
    starCounts[star - 1]++;
  });

  return (
    <main className="relative min-h-screen bg-zinc-50 text-zinc-900 antialiased pb-24 pt-28">
      {/* Visual background fine grid */}
      <div className="absolute inset-0 premium-grid-fine opacity-[0.03] pointer-events-none" />
      <Navbar />

      <div className="max-w-[1300px] mx-auto px-4 sm:px-6 md:px-8 relative z-10 space-y-8">
        
        {/* Typographic Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 pb-6 border-b border-zinc-200/60">
          <div className="space-y-1.5">
            <span className="text-[10px] font-mono tracking-[0.25em] text-zinc-400 font-bold uppercase leading-none">
              Command & Control
            </span>
            <h1 className="text-3xl font-black tracking-tight text-zinc-950 leading-tight">
              RYDR Command Desk
            </h1>
            <p className="text-zinc-500 text-sm font-semibold">
              Live operational telemetry, document compliance approvals, wallets, promos, and referral ledgers.
            </p>
          </div>

          <button
            onClick={loadAllData}
            className="flex items-center justify-center gap-1.5 px-4.5 py-2.5 bg-white border border-zinc-200 hover:border-zinc-400 font-bold text-xs rounded-full transition-colors active:scale-97 cursor-pointer shadow-3xs text-zinc-700"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Sync Control Systems</span>
          </button>
        </div>

        {/* Global Metric widgets (Interactive and elegant) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="bg-white border border-zinc-200 rounded-3xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.01)] flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[9.5px] font-mono font-bold text-zinc-400 uppercase tracking-widest block">Total Earnings</span>
              {loading ? (
                <div className="h-7 w-24 bg-zinc-200 rounded animate-pulse my-1" />
              ) : (
                <p className="text-xl sm:text-2xl font-black text-zinc-950 font-sans">₹{stats.totalRevenue.toLocaleString()}</p>
              )}
              <span className="text-[9.5px] text-emerald-600 font-extrabold flex items-center gap-0.5 mt-0.5">
                <TrendingUp className="w-2.5 h-2.5" />
                <span>100% Platform Revenue</span>
              </span>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-zinc-50 border border-zinc-150 flex items-center justify-center text-zinc-800">
              <Award className="w-5 h-5 stroke-[1.75]" />
            </div>
          </div>

          <div className="bg-white border border-zinc-200 rounded-3xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.01)] flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[9.5px] font-mono font-bold text-zinc-400 uppercase tracking-widest block">Active Trips</span>
              {loading ? (
                <div className="h-7 w-12 bg-zinc-200 rounded animate-pulse my-1" />
              ) : (
                <p className="text-xl sm:text-2xl font-black text-zinc-950 font-mono">{stats.activeRidesCount}</p>
              )}
              <span className="text-[9.5px] text-blue-600 font-extrabold flex items-center gap-1 mt-0.5 animate-pulse">
                <Activity className="w-2.5 h-2.5" />
                <span>Live Dispatching</span>
              </span>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-blue-50/50 border border-blue-100 flex items-center justify-center text-blue-600">
              <Car className="w-5 h-5 stroke-[1.75]" />
            </div>
          </div>

          <div className="bg-white border border-zinc-200 rounded-3xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.01)] flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[9.5px] font-mono font-bold text-zinc-400 uppercase tracking-widest block">Online Drivers</span>
              {loading ? (
                <div className="h-7 w-12 bg-zinc-200 rounded animate-pulse my-1" />
              ) : (
                <p className="text-xl sm:text-2xl font-black text-zinc-950 font-mono">{stats.activeOnlineDriversCount}</p>
              )}
              <span className="text-[9.5px] text-emerald-600 font-extrabold flex items-center gap-1 mt-0.5">
                <CircleDot className="w-2.5 h-2.5 fill-emerald-500 text-emerald-500 animate-ping" />
                <span>GPS Telemetry Active</span>
              </span>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-emerald-50/50 border border-emerald-100 flex items-center justify-center text-emerald-600">
              <Users className="w-5 h-5 stroke-[1.75]" />
            </div>
          </div>

          <div className="bg-white border border-zinc-200 rounded-3xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.01)] flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[9.5px] font-mono font-bold text-zinc-400 uppercase tracking-widest block">Promo Redeemed</span>
              {loading ? (
                <div className="h-7 w-12 bg-zinc-200 rounded animate-pulse my-1" />
              ) : (
                <p className="text-xl sm:text-2xl font-black text-zinc-950 font-mono">{stats.couponUsageCount}</p>
              )}
              <span className="text-[9.5px] text-amber-600 font-extrabold flex items-center gap-0.5 mt-0.5">
                <Percent className="w-2.5 h-2.5" />
                <span>Active coupons active</span>
              </span>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-amber-50/50 border border-amber-100 flex items-center justify-center text-amber-600">
              <Ticket className="w-5 h-5 stroke-[1.75]" />
            </div>
          </div>

        </div>

        {/* Tab Selection */}
        <div className="flex items-center space-x-1.5 bg-zinc-200/50 border border-zinc-200/80 p-1 rounded-2xl overflow-x-auto scrollbar-none shrink-0">
          {[
            { id: "users", label: "Users Panel", icon: Users },
            { id: "drivers", label: "Compliance Desk", icon: ShieldCheck },
            { id: "rides", label: "Trips Log", icon: Car },
            { id: "promos", label: "Promo Center", icon: Ticket },
            { id: "referrals", label: "Referral Rewards", icon: Share2 },
            { id: "reviews", label: "Review Audits", icon: Star }
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-4.5 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap active:scale-97 ${
                  active
                    ? "bg-white text-zinc-950 shadow-2xs border border-zinc-200"
                    : "text-zinc-500 hover:text-zinc-800"
                }`}
              >
                <Icon className="w-3.5 h-3.5 stroke-[2]" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Main interactive Tab Content Grid */}
        <div className="space-y-6">

          {/* TAB 1: USERS PANEL */}
          {activeTab === "users" && (
            <div className="bg-white border border-zinc-200 rounded-3xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.005)]">
              <div className="px-6 py-5 border-b border-zinc-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-base font-extrabold text-zinc-950">RYDR User Directory</h2>
                  <p className="text-xs text-zinc-500 font-semibold mt-0.5">Edit credentials, configure user roles, and inspect verification flags.</p>
                </div>
                <div className="bg-zinc-100 border border-zinc-200 rounded-full px-3.5 py-1 text-[10.5px] font-bold text-zinc-700 font-mono self-start sm:self-auto">
                  {users.length} Registered Accounts
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-[12.5px] font-semibold text-zinc-700">
                  <thead>
                    <tr className="bg-zinc-50/70 border-b border-zinc-150 text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
                      <th className="px-6 py-3.5">Name / Email</th>
                      <th className="px-6 py-3.5">Account ID</th>
                      <th className="px-6 py-3.5">Current Role</th>
                      <th className="px-6 py-3.5">Onboarding State</th>
                      <th className="px-6 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {loading ? (
                      <TableSkeleton cols={5} />
                    ) : users.length > 0 ? (
                      users.map((user) => {
                        let onboardingState = "Not Started";
                        let statusColor = "bg-zinc-100 text-zinc-500";
                        if (user.role === "rider" && user.riderProfile) {
                          onboardingState = user.riderProfile.onboarded ? "Onboarded" : "In Progress";
                          statusColor = user.riderProfile.onboarded ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-amber-50 text-amber-700 border-amber-100";
                        } else if (user.role === "driver" && user.driverProfile) {
                          onboardingState = user.driverProfile.onboarded
                            ? `Onboarded (${user.driverProfile.verificationStatus})`
                            : "In Progress";
                          statusColor = user.driverProfile.verificationStatus === "Approved"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                            : user.driverProfile.verificationStatus === "Rejected"
                            ? "bg-red-50 text-red-700 border-red-100"
                            : "bg-amber-50 text-amber-700 border-amber-100";
                        }
                        
                        return (
                          <tr key={user.id} className="hover:bg-zinc-50/50 transition-colors">
                            <td className="px-6 py-4.5">
                              <div className="flex items-center space-x-3">
                                <div className="w-8.5 h-8.5 rounded-full bg-zinc-950 text-white flex items-center justify-center font-black text-xs font-sans shadow-3xs shrink-0">
                                  {user.name ? user.name.substring(0, 2).toUpperCase() : "??"}
                                </div>
                                <div>
                                  <p className="text-zinc-950 font-bold leading-tight">{user.name}</p>
                                  <p className="text-[10.5px] text-zinc-450 mt-0.5">{user.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4.5 font-mono text-[10.5px] text-zinc-450">{user.id}</td>
                            <td className="px-6 py-4.5">
                              <span className={`px-2.5 py-0.5 rounded-full text-[10.5px] font-bold capitalize border ${
                                user.role === "admin"
                                  ? "bg-red-50 text-red-700 border-red-100"
                                  : user.role === "driver"
                                  ? "bg-blue-50 text-blue-700 border-blue-100"
                                  : "bg-zinc-100 text-zinc-700 border-zinc-200"
                              }`}>
                                {user.role || "Unselected"}
                              </span>
                            </td>
                            <td className="px-6 py-4.5">
                              <span className={`px-2 py-0.5 rounded border text-[10px] font-bold ${statusColor}`}>
                                {onboardingState}
                              </span>
                            </td>
                            <td className="px-6 py-4.5 text-right">
                              <button
                                onClick={() => handleToggleRole(user.id, user.role || "rider")}
                                className="px-3.5 py-1.5 bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 rounded-lg text-[11px] font-bold text-zinc-800 transition-colors active:scale-97 cursor-pointer shadow-3xs"
                              >
                                Toggle Role
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={5} className="text-center py-12 text-zinc-400 font-semibold">
                          No users registered in database.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: COMPLIANCE DESK */}
          {activeTab === "drivers" && (
            <div className="space-y-5">
              <div className="bg-white border border-zinc-200 rounded-3xl p-6.5 shadow-[0_4px_20px_rgba(0,0,0,0.005)]">
                <h2 className="text-base font-extrabold text-zinc-950">KYC Verification & Driver Registration</h2>
                <p className="text-xs text-zinc-500 font-semibold mt-0.5">Perform comprehensive documentation inspection, review background files, and authorize driver accounts.</p>
              </div>

              <div className="space-y-5">
                {loading ? (
                  <ComplianceSkeleton />
                ) : drivers.length > 0 ? (
                  drivers.map((driver) => {
                    const profile = driver.driverProfile;
                    const status = profile?.verificationStatus || "Pending";
                    
                    return (
                      <div
                        key={driver.id}
                        className="bg-white border border-zinc-200 rounded-3xl p-5 sm:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:border-zinc-350 transition-all duration-200 space-y-4.5"
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
                              <span className="text-[10px] text-zinc-450 mt-0.5 block font-semibold">
                                ID: {driver.id} · {driver.email}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center space-x-3">
                            <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${driverStatusColors[status]}`}>
                              {status}
                            </span>
                            {profile?.rejectionReason && (
                              <span className="text-[10.5px] text-red-500 font-bold bg-red-50 px-2 py-0.5 rounded border border-red-100 flex items-center gap-1 shrink-0">
                                <AlertTriangle className="w-3 h-3" />
                                <span>Rejection Reason Logged</span>
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
                            <span className="text-[9px] font-mono font-bold text-zinc-400 uppercase tracking-wide">License Credentials</span>
                            <p className="text-zinc-800 font-extrabold mt-1 font-mono">{profile?.licenseNumber || "N/A"}</p>
                            <span className="text-[10px] text-zinc-455 block mt-0.5">Expires: {profile?.licenseExpiry || "N/A"}</span>
                          </div>

                          <div>
                            <span className="text-[9px] font-mono font-bold text-zinc-400 uppercase tracking-wide">KYC Files Submitted</span>
                            <div className="flex flex-wrap gap-1.5 mt-1.5">
                              {profile?.aadhaarUrl ? (
                                <Link href={profile.aadhaarUrl} target="_blank" className="bg-zinc-100 text-zinc-700 px-2 py-0.5 rounded text-[9.5px] font-bold border border-zinc-200 hover:bg-zinc-200">Aadhaar 🔗</Link>
                              ) : (
                                <span className="text-[9.5px] text-zinc-400 italic">No Aadhaar</span>
                              )}
                              {profile?.panUrl ? (
                                <Link href={profile.panUrl} target="_blank" className="bg-zinc-100 text-zinc-700 px-2 py-0.5 rounded text-[9.5px] font-bold border border-zinc-200 hover:bg-zinc-200">PAN 🔗</Link>
                              ) : (
                                <span className="text-[9.5px] text-zinc-400 italic">No PAN</span>
                              )}
                              {profile?.selfieUrl ? (
                                <Link href={profile.selfieUrl} target="_blank" className="bg-zinc-100 text-zinc-700 px-2 py-0.5 rounded text-[9.5px] font-bold border border-zinc-200 hover:bg-zinc-200">Selfie 🔗</Link>
                              ) : (
                                <span className="text-[9.5px] text-zinc-400 italic">No Selfie</span>
                              )}
                              {profile?.rcUrl ? (
                                <Link href={profile.rcUrl} target="_blank" className="bg-zinc-100 text-zinc-700 px-2 py-0.5 rounded text-[9.5px] font-bold border border-zinc-200 hover:bg-zinc-200">RC 🔗</Link>
                              ) : (
                                <span className="text-[9.5px] text-zinc-400 italic">No RC</span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="h-[1px] bg-zinc-100" />

                        {/* Actions */}
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
                              <span>Inspect Documents</span>
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
                      <h4 className="text-base font-extrabold text-zinc-950">No driver registrations found</h4>
                      <p className="text-xs text-zinc-500 max-w-[280px] mt-1 leading-normal font-semibold">
                        Driver profiles will be loaded here for document audit once they register on the onboarding screen.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: TRIPS LOG */}
          {activeTab === "rides" && (
            <div className="bg-white border border-zinc-200 rounded-3xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.005)]">
              <div className="px-6 py-5 border-b border-zinc-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-base font-extrabold text-zinc-950">Chronological Ride Ledger</h2>
                  <p className="text-xs text-zinc-500 font-semibold mt-0.5">Audit complete platform history, trace routes, fares, matched drivers, and coupon deductions.</p>
                </div>
                <div className="bg-zinc-100 border border-zinc-200 rounded-full px-3.5 py-1 text-[10.5px] font-bold text-zinc-700 font-mono self-start sm:self-auto">
                  {rides.length} Dispatches Registered
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-[12.5px] font-semibold text-zinc-700">
                  <thead>
                    <tr className="bg-zinc-50/70 border-b border-zinc-150 text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
                      <th className="px-6 py-3.5">Ride details</th>
                      <th className="px-6 py-3.5">Rider / Passenger</th>
                      <th className="px-6 py-3.5">Driver Matched</th>
                      <th className="px-6 py-3.5">Route</th>
                      <th className="px-6 py-3.5 font-mono text-right">Fare (INR)</th>
                      <th className="px-6 py-3.5 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {loading ? (
                      <TableSkeleton cols={6} />
                    ) : rides.length > 0 ? (
                      rides.map((ride) => {
                        const dateFormatted = new Date(ride.createdAt).toLocaleString("en-IN", {
                          dateStyle: "short",
                          timeStyle: "short"
                        });
                        return (
                          <tr key={ride.id} className="hover:bg-zinc-50/50 transition-colors">
                            <td className="px-6 py-4.5">
                              <div>
                                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wide bg-zinc-900 text-white font-mono shadow-3xs">
                                  {ride.rideType}
                                </span>
                                <p className="text-[10px] text-zinc-450 font-mono mt-1">ID: #{ride.id.substring(0, 8)}...</p>
                                <span className="text-[9.5px] text-zinc-400 block mt-0.5 font-normal">{dateFormatted}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4.5">
                              <p className="text-zinc-950 font-bold leading-tight">{ride.user?.name || "Passenger"}</p>
                              <p className="text-[10px] text-zinc-450 font-mono font-normal mt-0.5">{ride.user?.email}</p>
                            </td>
                            <td className="px-6 py-4.5">
                              {ride.driver ? (
                                <div>
                                  <p className="text-zinc-950 font-bold leading-tight">{ride.driver.name}</p>
                                  <p className="text-[10px] text-zinc-450 font-mono font-normal mt-0.5">{ride.driver.email}</p>
                                </div>
                              ) : (
                                <span className="text-zinc-400 font-mono italic text-[11px]">Unassigned</span>
                              )}
                            </td>
                            <td className="px-6 py-4.5">
                              <div className="max-w-[180px] space-y-0.5 text-[11.5px] text-zinc-800 leading-tight">
                                <p className="truncate font-bold text-zinc-950"><span className="text-[9.5px] text-emerald-600 font-mono mr-1">A</span>{ride.pickup}</p>
                                <p className="truncate text-zinc-550"><span className="text-[9.5px] text-red-500 font-mono mr-1">B</span>{ride.destination}</p>
                              </div>
                            </td>
                            <td className="px-6 py-4.5 text-right font-bold text-zinc-950">
                              <div className="flex flex-col items-end">
                                <span>₹{ride.fare ? Math.round(ride.fare) : 0}</span>
                                {ride.promoCode && (
                                  <span className="text-[9px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded font-mono font-bold mt-0.5 uppercase">
                                    -{ride.promoCode.code}
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4.5 text-right">
                              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${rideStatusColors[ride.status] || "bg-zinc-100 border-zinc-200"}`}>
                                {ride.status}
                              </span>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={6} className="text-center py-12 text-zinc-400 font-semibold">
                          No rides logged inside database registry.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: PROMO CENTER */}
          {activeTab === "promos" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Promo Creator */}
              <div className="bg-white border border-zinc-200 rounded-3xl p-6.5 shadow-[0_4px_20px_rgba(0,0,0,0.005)] h-fit space-y-5">
                <div>
                  <h2 className="text-base font-extrabold text-zinc-950">Create Promotion Coupon</h2>
                  <p className="text-xs text-zinc-500 mt-1 leading-normal font-semibold">Issue platform-wide dynamic coupons applying percentage or flat INR discounts.</p>
                </div>

                <form onSubmit={handleCreatePromo} className="space-y-4.5">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider block">Coupon Code</label>
                    <input
                      type="text"
                      placeholder="e.g. RYDRVIP100"
                      value={newPromoCode}
                      onChange={(e) => setNewPromoCode(e.target.value)}
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-4.5 py-3 text-xs font-bold text-zinc-900 focus:outline-none focus:border-zinc-400 transition-all font-mono uppercase"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider block">Discount Type</label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setNewPromoType("flat")}
                        className={`flex-1 py-2.5 rounded-xl border text-xs font-extrabold cursor-pointer transition-all ${
                          newPromoType === "flat"
                            ? "bg-zinc-950 border-zinc-950 text-white shadow-3xs"
                            : "bg-white border-zinc-200 text-zinc-700 hover:border-zinc-350"
                        }`}
                      >
                        Flat INR (₹)
                      </button>
                      <button
                        type="button"
                        onClick={() => setNewPromoType("percentage")}
                        className={`flex-1 py-2.5 rounded-xl border text-xs font-extrabold cursor-pointer transition-all ${
                          newPromoType === "percentage"
                            ? "bg-zinc-950 border-zinc-950 text-white shadow-3xs"
                            : "bg-white border-zinc-200 text-zinc-700 hover:border-zinc-350"
                        }`}
                      >
                        Percentage (%)
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider block">Discount Value</label>
                    <input
                      type="number"
                      value={newPromoValue}
                      onChange={(e) => setNewPromoValue(Math.max(1, parseInt(e.target.value) || 0))}
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-4.5 py-3 text-xs font-bold text-zinc-900 focus:outline-none focus:border-zinc-400 transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider block">Expiry Date</label>
                    <input
                      type="date"
                      value={newPromoExpiry}
                      onChange={(e) => setNewPromoExpiry(e.target.value)}
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-4.5 py-3 text-xs font-bold text-zinc-900 focus:outline-none focus:border-zinc-400 transition-all"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={promoSubmitting}
                    className="w-full py-3 bg-zinc-950 hover:bg-zinc-850 disabled:bg-zinc-300 text-white font-bold text-xs rounded-2xl shadow-sm transition-all active:scale-97 cursor-pointer flex items-center justify-center space-x-1.5"
                  >
                    {promoSubmitting ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>Issue Promo Coupon</span>
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Promo List */}
              <div className="bg-white border border-zinc-200 rounded-3xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.005)] lg:col-span-2">
                <div className="px-6 py-5 border-b border-zinc-100">
                  <h2 className="text-base font-extrabold text-zinc-950">Active Promo Coupons</h2>
                  <p className="text-xs text-zinc-500 font-semibold mt-0.5">Toggle active states, monitor code validity details, and terminate promo codes instantly.</p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-[12.5px] font-semibold text-zinc-700">
                    <thead>
                      <tr className="bg-zinc-50/70 border-b border-zinc-150 text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
                        <th className="px-6 py-3.5">Promo Code</th>
                        <th className="px-6 py-3.5">Benefit</th>
                        <th className="px-6 py-3.5">Expiry Date</th>
                        <th className="px-6 py-3.5">Status</th>
                        <th className="px-6 py-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                      {loading ? (
                        <TableSkeleton cols={5} />
                      ) : promos.length > 0 ? (
                        promos.map((promo) => {
                          const isExpired = new Date(promo.expiryDate) < new Date();
                          const dateFormatted = new Date(promo.expiryDate).toLocaleDateString("en-IN", {
                            dateStyle: "medium"
                          });
                          return (
                            <tr key={promo.id} className="hover:bg-zinc-50/50 transition-colors">
                              <td className="px-6 py-4.5">
                                <span className="bg-zinc-950 text-white font-mono font-black text-xs px-2.5 py-0.5 rounded shadow-3xs">
                                  {promo.code}
                                </span>
                              </td>
                              <td className="px-6 py-4.5">
                                {promo.discountType === "percentage" ? (
                                  <span className="text-blue-600 font-bold">{promo.discountValue}% OFF</span>
                                ) : (
                                  <span className="text-emerald-600 font-bold">₹{promo.discountValue} FLAT</span>
                                )}
                              </td>
                              <td className="px-6 py-4.5 text-zinc-500">{dateFormatted}</td>
                              <td className="px-6 py-4.5">
                                {isExpired ? (
                                  <span className="text-[10px] bg-red-50 text-red-600 font-bold border border-red-100 px-2 py-0.5 rounded">
                                    Expired
                                  </span>
                                ) : promo.active ? (
                                  <span className="text-[10px] bg-emerald-50 text-emerald-600 font-bold border border-emerald-100 px-2 py-0.5 rounded animate-pulse">
                                    Active
                                  </span>
                                ) : (
                                  <span className="text-[10px] bg-zinc-100 text-zinc-500 font-bold border border-zinc-200 px-2 py-0.5 rounded">
                                    Paused
                                  </span>
                                )}
                              </td>
                              <td className="px-6 py-4.5 text-right">
                                <div className="flex items-center justify-end space-x-2">
                                  <button
                                    onClick={() => handleTogglePromoActive(promo)}
                                    className={`px-2.5 py-1 text-[11px] font-bold rounded-lg border cursor-pointer transition-colors shadow-3xs ${
                                      promo.active
                                        ? "bg-zinc-100 hover:bg-zinc-200 border-zinc-200 text-zinc-700"
                                        : "bg-emerald-600 hover:bg-emerald-700 border-emerald-600 text-white"
                                    }`}
                                  >
                                    {promo.active ? "Pause" : "Activate"}
                                  </button>
                                  <button
                                    onClick={() => handleDeletePromo(promo.id)}
                                    className="p-1.5 bg-red-50 hover:bg-red-100 border border-red-100 rounded-lg text-red-600 cursor-pointer transition-colors shadow-3xs"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={5} className="text-center py-12 text-zinc-400 font-semibold">
                            No coupons generated yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 5: REFERRAL REWARDS */}
          {activeTab === "referrals" && (
            <div className="bg-white border border-zinc-200 rounded-3xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.005)]">
              <div className="px-6 py-5 border-b border-zinc-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-base font-extrabold text-zinc-950">Referral Reward Ledger</h2>
                  <p className="text-xs text-zinc-500 font-semibold mt-0.5">Track wallet incentives issued to inviting referrers and newly referred passengers on the RYDR platform.</p>
                </div>
                <div className="bg-zinc-100 border border-zinc-200 rounded-full px-3.5 py-1 text-[10.5px] font-bold text-zinc-700 font-mono self-start sm:self-auto">
                  ₹{(referrals.length * 100).toLocaleString()} Reward Incentives Distributed
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-[12.5px] font-semibold text-zinc-700">
                  <thead>
                    <tr className="bg-zinc-50/70 border-b border-zinc-150 text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
                      <th className="px-6 py-3.5">Referral ID</th>
                      <th className="px-6 py-3.5">Inviting Referrer</th>
                      <th className="px-6 py-3.5">Referred User (New Member)</th>
                      <th className="px-6 py-3.5 text-right">Incentive Reward</th>
                      <th className="px-6 py-3.5 text-right">Processed At</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {loading ? (
                      <TableSkeleton cols={5} />
                    ) : referrals.length > 0 ? (
                      referrals.map((referral) => {
                        const dateFormatted = new Date(referral.createdAt).toLocaleString("en-IN", {
                          dateStyle: "medium",
                          timeStyle: "short"
                        });
                        return (
                          <tr key={referral.id} className="hover:bg-zinc-50/50 transition-colors">
                            <td className="px-6 py-4.5 font-mono text-[10.5px] text-zinc-450">#{referral.id.substring(0, 8)}...</td>
                            <td className="px-6 py-4.5">
                              <p className="text-zinc-950 font-bold leading-tight">{referral.referrer?.name || "Referrer"}</p>
                              <p className="text-[10.5px] text-zinc-450 font-mono font-normal mt-0.5">{referral.referrer?.email}</p>
                            </td>
                            <td className="px-6 py-4.5">
                              <p className="text-zinc-950 font-bold leading-tight">{referral.referredUser?.name || "Referred User"}</p>
                              <p className="text-[10.5px] text-zinc-450 font-mono font-normal mt-0.5">{referral.referredUser?.email}</p>
                            </td>
                            <td className="px-6 py-4.5 text-right font-black text-emerald-600">
                              ₹{referral.rewardAmount.toFixed(2)}
                            </td>
                            <td className="px-6 py-4.5 text-right text-zinc-500 font-normal">
                              {dateFormatted}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={5} className="text-center py-12 text-zinc-400 font-semibold">
                          No referral matches logged yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 6: REVIEW AUDITS */}
          {activeTab === "reviews" && (
            <div className="space-y-6">
              
              {/* Star breakdown & aggregates */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                <div className="bg-white border border-zinc-200 rounded-3xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.005)] md:col-span-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest block">Average Rating Score</span>
                    <div className="flex items-baseline space-x-2">
                      <p className="text-4xl font-black text-zinc-950 font-sans">
                        {reviews.length > 0 
                          ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(2)
                          : "5.00"}
                      </p>
                      <span className="text-zinc-400 text-xs font-semibold">out of 5 stars</span>
                    </div>
                    <div className="flex items-center space-x-0.5 text-amber-500 mt-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className="w-4 h-4 fill-amber-500 stroke-[1.5]" />
                      ))}
                    </div>
                  </div>
                  
                  <div className="border-t border-zinc-100 pt-4 mt-6">
                    <p className="text-[10.5px] text-zinc-500 leading-normal font-semibold">
                      Calculated rolling average score computed over <span className="font-bold text-zinc-900">{reviewCount} submitted trip reviews</span> on the platform.
                    </p>
                  </div>
                </div>

                <div className="bg-white border border-zinc-200 rounded-3xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.005)] md:col-span-2 space-y-4">
                  <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest block">Star Distribution Breakdown</span>
                  
                  <div className="space-y-2.5">
                    {[5, 4, 3, 2, 1].map((stars) => {
                      const count = starCounts[stars - 1];
                      const percentage = reviewCount > 0 ? (count / reviewCount) * 100 : 0;
                      return (
                        <div key={stars} className="flex items-center space-x-3.5 text-xs font-semibold text-zinc-700">
                          <span className="w-10 font-mono text-zinc-500 block text-right shrink-0">{stars} Stars</span>
                          <div className="flex-1 h-2.5 bg-zinc-100 border border-zinc-200/50 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-zinc-950 rounded-full transition-all duration-300"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="w-12 font-mono text-zinc-950 font-bold shrink-0">{count} reviews</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* Chronological review feed */}
              <div className="bg-white border border-zinc-200 rounded-3xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.005)]">
                <div className="px-6 py-5 border-b border-zinc-100">
                  <h2 className="text-base font-extrabold text-zinc-950">Submitted Trip Reviews</h2>
                  <p className="text-xs text-zinc-500 font-semibold mt-0.5">Audit exact star ratings, written textual feedback, route descriptions, and user connections.</p>
                </div>

                <div className="divide-y divide-zinc-100">
                  {loading ? (
                    <ReviewFeedSkeleton />
                  ) : reviews.length > 0 ? (
                    reviews.map((rev) => {
                      const dateFormatted = new Date(rev.createdAt).toLocaleString("en-IN", {
                        dateStyle: "medium",
                        timeStyle: "short"
                      });
                      return (
                        <div key={rev.id} className="p-5.5 hover:bg-zinc-50/50 transition-colors flex flex-col md:flex-row md:items-start justify-between gap-5 text-[12.5px] font-semibold text-zinc-700">
                          
                          <div className="space-y-2">
                            {/* Star rating banner */}
                            <div className="flex items-center space-x-2">
                              <div className="flex items-center space-x-0.5 text-amber-500">
                                {Array.from({ length: rev.rating }).map((_, i) => (
                                  <Star key={i} className="w-3.5 h-3.5 fill-amber-500 stroke-none" />
                                ))}
                                {Array.from({ length: 5 - rev.rating }).map((_, i) => (
                                  <Star key={i} className="w-3.5 h-3.5 text-zinc-200 fill-zinc-100 stroke-[1.5]" />
                                ))}
                              </div>
                              <span className="text-[10px] text-zinc-450 font-mono font-normal">#{rev.id.substring(0, 8)}...</span>
                            </div>

                            <p className="text-zinc-900 font-extrabold text-[13.5px] leading-snug">
                              &ldquo;{rev.review || "No written text feedback provided."}&rdquo;
                            </p>

                            <div className="flex items-center space-x-2 text-[10.5px] text-zinc-450 font-normal">
                              <span className="bg-zinc-100 text-zinc-650 px-2 py-0.5 rounded font-bold font-mono uppercase">Route</span>
                              <span className="font-semibold text-zinc-600 truncate max-w-[280px]">
                                {rev.ride?.pickup} to {rev.ride?.destination}
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-col md:items-end text-left md:text-right shrink-0 gap-1 mt-1 md:mt-0 text-[11px] text-zinc-500 font-normal">
                            <p className="font-bold text-zinc-800">
                              From: <span className="font-black text-zinc-950">{rev.rider?.name || "Rider"}</span>
                            </p>
                            <p className="font-bold text-zinc-800">
                              To Driver: <span className="font-black text-zinc-950">{rev.driver?.name || "Driver"}</span>
                            </p>
                            <span className="text-[9.5px] text-zinc-400 mt-1">{dateFormatted}</span>
                          </div>

                        </div>
                      );
                    })
                  ) : (
                    <div className="p-16 text-center text-zinc-400 font-semibold">
                      No review telemetry collected yet.
                    </div>
                  )}
                </div>
              </div>

            </div>
          )}

        </div>

      </div>

    </main>
  );
}
