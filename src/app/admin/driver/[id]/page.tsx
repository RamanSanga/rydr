"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getDriverProfileById, reviewDriverAction } from "@/actions/onboarding";
import { Loader2, ArrowLeft, CheckCircle2, XCircle, FileText, Calendar, ShieldCheck, MapPin, Phone, Mail, Award, AlertTriangle, Sparkles } from "lucide-react";
import Navbar from "@/components/Navbar";

// Premium Document Preview component with Lightbox modal zoom (Phase 2)
function DocumentPreview({ url, label }: { url?: string; label: string }) {
  const [expanded, setExpanded] = useState(false);
  if (!url) return null;

  const isPdf = url.includes(".pdf") || url.startsWith("data:application/pdf");
  const isImage = url.startsWith("data:image") || url.startsWith("http") || url.includes(".png") || url.includes(".jpg") || url.includes(".jpeg");

  return (
    <div className="mt-3 bg-zinc-50 border border-zinc-200/80 rounded-2xl overflow-hidden shadow-inner group relative">
      {isPdf ? (
        <div className="relative">
          <iframe src={url} className="w-full h-36 border-0 pointer-events-none" title={label} />
          <button 
            type="button" 
            onClick={() => setExpanded(true)}
            className="absolute inset-0 w-full h-full bg-black/0 hover:bg-black/30 transition-all flex items-center justify-center text-white opacity-0 hover:opacity-100 font-bold text-xs cursor-pointer gap-1.5 backdrop-blur-2xs"
          >
            <FileText className="w-4 h-4" />
            <span>Open PDF Document</span>
          </button>
        </div>
      ) : isImage ? (
        <div className="relative overflow-hidden cursor-pointer" onClick={() => setExpanded(true)}>
          <img src={url} className="w-full h-36 object-cover group-hover:scale-102 transition-transform duration-200" alt={label} />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center text-white opacity-0 group-hover:opacity-100 font-bold text-[11px] backdrop-blur-2xs">
            Inspect Image Zoom
          </div>
        </div>
      ) : (
        <div className="p-4 text-center text-xs text-zinc-400 font-bold uppercase tracking-widest font-mono">
          Simulated File: {url.substring(0, 16)}...
        </div>
      )}

      {/* Expanded Lightbox Modal */}
      {expanded && (
        <div 
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-6 backdrop-blur-sm animate-fade-in"
          onClick={() => setExpanded(false)}
        >
          <div 
            className="relative max-w-4xl max-h-[85vh] w-full bg-white rounded-3xl overflow-hidden shadow-2xl p-3 flex flex-col justify-between animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="overflow-auto max-h-[80vh] flex items-center justify-center">
              {isPdf ? (
                <iframe src={url} className="w-full h-[75vh] border-0" title={label} />
              ) : (
                <img src={url} className="w-full h-auto max-h-[75vh] object-contain rounded-2xl" alt={label} />
              )}
            </div>
            <button 
              type="button" 
              onClick={() => setExpanded(false)}
              className="absolute top-4 right-4 bg-zinc-900 hover:bg-zinc-850 text-white p-2 rounded-full cursor-pointer shadow-md transition-all font-bold text-xs flex items-center justify-center"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminDriverReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const driverId = resolvedParams.id;

  const [loading, setLoading] = useState(true);
  const [driver, setDriver] = useState<any | null>(null);

  // Status controls
  const [reviewStatus, setReviewStatus] = useState<"Approved" | "Rejected">("Approved");
  const [rejectionReason, setRejectionReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function loadDriver() {
      try {
        const res = await getDriverProfileById(driverId);
        if (res.success && res.driver) {
          setDriver(res.driver);
          if (res.driver.driverProfile?.rejectionReason) {
            setRejectionReason(res.driver.driverProfile.rejectionReason);
          }
        } else {
          alert("Driver not found");
          router.push("/admin");
        }
      } catch (err) {
        console.error("Failed to load driver profile", err);
      } finally {
        setLoading(false);
      }
    }
    loadDriver();
  }, [driverId]);

  const handleSubmitReview = async () => {
    setIsSubmitting(true);
    try {
      await reviewDriverAction(
        driverId,
        reviewStatus,
        reviewStatus === "Rejected" ? rejectionReason : undefined
      );
      router.push("/admin");
    } catch (err) {
      alert("Error saving administrative review");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 text-zinc-950 animate-spin" />
        <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase">Fetching compliance records...</span>
      </div>
    );
  }

  const profile = driver?.driverProfile;

  return (
    <main className="relative min-h-screen bg-zinc-50 text-zinc-900 antialiased pb-24 pt-28">
      {/* Subtle fine visual grid */}
      <div className="absolute inset-0 premium-grid-fine opacity-[0.04] pointer-events-none" />
      <Navbar />

      <div className="max-w-[1200px] mx-auto px-6 sm:px-8 relative z-10 space-y-8">
        
        {/* Navigation back and header */}
        <div className="space-y-4 pb-6 border-b border-zinc-200/60">
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 text-zinc-500 hover:text-zinc-950 text-xs font-bold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Review Desk</span>
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono tracking-[0.25em] text-red-600 font-bold uppercase leading-none">
                Compliance Inspection
              </span>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tighter text-zinc-950 leading-tight">
                Review: {driver?.name}
              </h1>
            </div>
            <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-3.5 py-1 rounded-full border self-start sm:self-auto ${
              profile?.verificationStatus === "Approved"
                ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                : profile?.verificationStatus === "Rejected"
                ? "bg-red-500/10 text-red-600 border-red-500/20"
                : "bg-amber-500/10 text-amber-600 border-amber-500/20"
            }`}>
              Status: {profile?.verificationStatus || "Pending"}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column (8/12): Submitted Documents Preview Frame */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Operator specs summary */}
            <div className="bg-white border border-zinc-200/60 rounded-3xl p-6.5 shadow-3xs space-y-4">
              <h3 className="text-base font-black text-zinc-950 tracking-tight">Operator Credentials</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4.5 text-[12.5px] font-semibold text-zinc-650">
                <div className="flex items-center space-x-3 bg-zinc-50 border border-zinc-150 rounded-2xl p-4 shadow-3xs">
                  <Phone className="w-4.5 h-4.5 text-zinc-400 shrink-0" />
                  <div>
                    <span className="text-[9px] font-mono font-bold text-zinc-400 uppercase tracking-wider block">Phone Contact</span>
                    <span className="text-zinc-900 font-extrabold">{profile?.phone}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-3 bg-zinc-50 border border-zinc-150 rounded-2xl p-4 shadow-3xs">
                  <Mail className="w-4.5 h-4.5 text-zinc-400 shrink-0" />
                  <div>
                    <span className="text-[9px] font-mono font-bold text-zinc-400 uppercase tracking-wider block">Email Address</span>
                    <span className="text-zinc-900 font-extrabold">{driver?.email}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-3 bg-zinc-50 border border-zinc-150 rounded-2xl p-4 shadow-3xs col-span-full">
                  <MapPin className="w-4.5 h-4.5 text-zinc-400 shrink-0" />
                  <div>
                    <span className="text-[9px] font-mono font-bold text-zinc-400 uppercase tracking-wider block">Registered Address</span>
                    <span className="text-zinc-900 font-extrabold">{profile?.address}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Document inspection previews cards */}
            <div className="space-y-4.5">
              <h3 className="text-base font-black text-zinc-950 tracking-tight">Submitted Documents Checklist</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Aadhaar Preview Card */}
                <div className="bg-white border border-zinc-200 rounded-3xl p-5.5 shadow-3xs space-y-4 hover:border-zinc-350 transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
                      <h4 className="text-[13px] font-bold text-zinc-900">Aadhaar Card PDF</h4>
                      <span className="text-[9px] font-mono text-zinc-400 uppercase font-bold">Aadhaar Verified</span>
                    </div>
                    {/* Simulated document layout */}
                    <div className="mt-4 bg-zinc-50 border border-zinc-200/80 rounded-2xl p-4 flex items-center gap-3.5 shadow-inner">
                      <div className="p-2 bg-emerald-500/10 text-emerald-600 rounded-xl border border-emerald-500/20">
                        <ShieldCheck className="w-5 h-5 stroke-[2.5]" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[12.5px] font-extrabold text-zinc-900 truncate">UIDAI Aadhaar Verified</p>
                        <p className="text-[9.5px] text-zinc-400 font-mono mt-0.5 uppercase tracking-wide">ID Linked: 12-digit matched</p>
                      </div>
                    </div>
                    <DocumentPreview url={profile?.aadhaarUrl} label="Aadhaar Card" />
                  </div>
                  <span className="text-[10px] text-zinc-400 font-semibold block mt-4 font-mono truncate">FILE: {profile?.aadhaarUrl}</span>
                </div>

                {/* PAN Preview Card */}
                <div className="bg-white border border-zinc-200 rounded-3xl p-5.5 shadow-3xs space-y-4 hover:border-zinc-350 transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
                      <h4 className="text-[13px] font-bold text-zinc-900">PAN Card Photo</h4>
                      <span className="text-[9px] font-mono text-zinc-400 uppercase font-bold">PAN Verified</span>
                    </div>
                    <div className="mt-4 bg-zinc-50 border border-zinc-200/80 rounded-2xl p-4 flex items-center gap-3.5 shadow-inner">
                      <div className="p-2 bg-emerald-500/10 text-emerald-600 rounded-xl border border-emerald-500/20">
                        <ShieldCheck className="w-5 h-5 stroke-[2.5]" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[12.5px] font-extrabold text-zinc-900 truncate">PAN Income Tax Verified</p>
                        <p className="text-[9.5px] text-zinc-400 font-mono mt-0.5 uppercase tracking-wide">Status: Active Card</p>
                      </div>
                    </div>
                    <DocumentPreview url={profile?.panUrl} label="PAN Card" />
                  </div>
                  <span className="text-[10px] text-zinc-400 font-semibold block mt-4 font-mono truncate">FILE: {profile?.panUrl}</span>
                </div>

                {/* Driving License Preview */}
                <div className="bg-white border border-zinc-200 rounded-3xl p-5.5 shadow-3xs space-y-4 hover:border-zinc-350 transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
                      <h4 className="text-[13px] font-bold text-zinc-900">Driving License</h4>
                      <span className="text-[9px] font-mono text-zinc-400 uppercase font-bold">Motor Vehicle Permit</span>
                    </div>
                    <div className="mt-4 bg-zinc-50 border border-zinc-200/80 rounded-2xl p-4 flex items-center gap-3.5 shadow-inner">
                      <div className="p-2 bg-zinc-900 text-white rounded-xl">
                        <Award className="w-5 h-5 stroke-[2.5]" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[12.5px] font-extrabold text-zinc-900 truncate">No: {profile?.licenseNumber}</p>
                        <p className="text-[9.5px] text-zinc-400 font-mono mt-0.5 uppercase tracking-wide">Expires: {profile?.licenseExpiry}</p>
                      </div>
                    </div>
                    <DocumentPreview url={profile?.licenseUrl} label="Driving License" />
                  </div>
                  <span className="text-[10px] text-zinc-400 font-semibold block mt-4 font-mono truncate">FILE: {profile?.licenseUrl}</span>
                </div>

                {/* Vehicle RC Preview */}
                <div className="bg-white border border-zinc-200 rounded-3xl p-5.5 shadow-3xs space-y-4 hover:border-zinc-350 transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
                      <h4 className="text-[13px] font-bold text-zinc-900">Registration & Insurance</h4>
                      <span className="text-[9px] font-mono text-zinc-400 uppercase font-bold">Commercial Fleet File</span>
                    </div>
                    <div className="mt-4 bg-zinc-50 border border-zinc-200/80 rounded-2xl p-4 flex items-center gap-3.5 shadow-inner">
                      <div className="p-2 bg-zinc-900 text-white rounded-xl">
                        <FileText className="w-5 h-5 stroke-[2.5]" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[12.5px] font-extrabold text-zinc-900 truncate">{profile?.vehicleModel}</p>
                        <p className="text-[9.5px] text-zinc-400 font-mono mt-0.5 uppercase tracking-wide">No: {profile?.vehicleNumber}</p>
                      </div>
                    </div>
                    <DocumentPreview url={profile?.rcUrl} label="Registration Certificate" />
                  </div>
                  <span className="text-[10px] text-zinc-400 font-semibold block mt-4 font-mono truncate">FILE: {profile?.rcUrl}</span>
                </div>

              </div>
            </div>

          </div>

          {/* Right Column (4/12): Admin Decision Console */}
          <div className="lg:col-span-4 bg-white border border-zinc-200/60 rounded-3xl p-6.5 shadow-[0_8px_30px_rgb(0,0,0,0.02)] space-y-6">
            <div>
              <span className="text-[8.5px] font-mono font-bold text-zinc-450 uppercase tracking-widest block">Review Controller</span>
              <h3 className="text-lg font-black text-zinc-900 tracking-tight mt-0.5">Audit Decision</h3>
            </div>

            <div className="space-y-5">
              {/* Select Status */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Decision</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setReviewStatus("Approved")}
                    className={`py-3.5 px-4 border rounded-2xl text-xs font-black transition-all text-center flex flex-col items-center justify-center space-y-1.5 cursor-pointer ${
                      reviewStatus === "Approved"
                        ? "border-emerald-500 bg-emerald-500/10 text-emerald-700 shadow-sm"
                        : "border-zinc-200 bg-white text-zinc-550 hover:border-zinc-400"
                    }`}
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    <span>APPROVE</span>
                  </button>

                  <button
                    onClick={() => setReviewStatus("Rejected")}
                    className={`py-3.5 px-4 border rounded-2xl text-xs font-black transition-all text-center flex flex-col items-center justify-center space-y-1.5 cursor-pointer ${
                      reviewStatus === "Rejected"
                        ? "border-red-500 bg-red-500/10 text-red-700 shadow-sm"
                        : "border-zinc-200 bg-white text-zinc-550 hover:border-zinc-400"
                    }`}
                  >
                    <XCircle className="w-5 h-5" />
                    <span>REJECT</span>
                  </button>
                </div>
              </div>

              {/* Rejection Reason Input (Conditionally display if Rejected is selected) */}
              {reviewStatus === "Rejected" && (
                <div className="space-y-2 animate-fade-in">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Rejection Reason</label>
                  <textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Enter explicit reason for driver decline (e.g. driving license image was blurry)..."
                    className="w-full h-24 bg-zinc-50 border border-zinc-200 rounded-2xl p-4 text-xs font-semibold focus:bg-white focus:border-zinc-400 outline-0 focus:ring-0 resize-none text-zinc-800 leading-normal"
                  />
                  {/* Quick Preset declinement triggers */}
                  <div className="pt-2">
                    <span className="text-[9px] font-mono font-bold text-zinc-400 uppercase tracking-wide block mb-1">Audit Presets</span>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        "Aadhaar front image is blurry.",
                        "Driving license expired.",
                        "RC vehicle number plate mismatch.",
                      ].map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => setRejectionReason(preset)}
                          className="bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 rounded px-2.5 py-1 text-[9.5px] font-bold text-zinc-650"
                        >
                          {preset.split(" ")[0]} spec
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Action trigger */}
              <div className="pt-4.5 border-t border-zinc-100 space-y-4">
                <button
                  disabled={isSubmitting || (reviewStatus === "Rejected" && !rejectionReason)}
                  onClick={handleSubmitReview}
                  className="w-full py-3 bg-zinc-950 hover:bg-zinc-850 active:scale-97 disabled:opacity-50 disabled:pointer-events-none text-white font-bold text-xs rounded-full transition-all flex items-center justify-center space-x-1.5 shadow-md shadow-zinc-950/15"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <ShieldCheck className="w-4 h-4" />
                  )}
                  <span>Finalize Compliance Audit</span>
                </button>

                <p className="text-[10px] text-zinc-400 font-semibold leading-relaxed text-center">
                  Executing this compliance audit immediately updates PostgreSQL verification statuses and dispatches app gates.
                </p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
