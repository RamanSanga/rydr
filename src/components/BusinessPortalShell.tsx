"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { CalendarDays, CreditCard, Users, Building2, ArrowUpRight, ReceiptText, ShieldCheck, Route, Check, Send, Download } from "lucide-react";
import { billingSummary as initialBilling, businessOverview, departmentSpend as initialSpend, teamRides as initialRides } from "@/lib/business-portal";
import { motion, AnimatePresence } from "framer-motion";

type BusinessView = "overview" | "team" | "billing";

function NavLink({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={`rounded-2xl border px-4 py-3.5 text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-between shadow-3xs ${
        active
          ? "border-zinc-950 bg-zinc-950 text-white"
          : "border-zinc-200 bg-white text-zinc-650 hover:border-zinc-350 hover:text-zinc-950"
      }`}
    >
      <span>{label}</span>
      <ArrowUpRight className={`w-3.5 h-3.5 opacity-60 ${active ? "text-white" : "text-zinc-400"}`} />
    </Link>
  );
}

function StatCard({ label, value, note, icon: Icon }: { label: string; value: string; note: string; icon: typeof Building2 }) {
  return (
    <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-3xs hover:border-zinc-350 transition-colors duration-200">
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-zinc-950 text-white shadow-3xs">
        <Icon className="h-4.5 w-4.5" />
      </div>
      <p className="mt-4 text-xs font-mono font-bold uppercase tracking-[0.24em] text-zinc-400">{label}</p>
      <p className="mt-2 text-3xl font-black tracking-tighter text-zinc-950 leading-none">{value}</p>
      <p className="mt-2.5 text-xs font-semibold text-zinc-500">{note}</p>
    </div>
  );
}

export default function BusinessPortalShell({ view }: { view: BusinessView }) {
  const pathname = usePathname();
  
  // Interactive corporate states
  const [ridesList, setRidesList] = useState(initialRides);
  const [activeDeptFilter, setActiveDeptFilter] = useState<string>("All");
  
  // Form states for employee invitation
  const [inviteName, setInviteName] = useState("");
  const [inviteDept, setInviteDept] = useState("Design");
  const [inviteSuccess, setInviteSuccess] = useState(false);
  const [invitedEmployees, setInvitedEmployees] = useState<string[]>([]);

  // Corporate travel credits balance states
  const [creditsBalance, setCreditsBalance] = useState(15000.00);
  const [outstandingBal, setOutstandingBal] = useState(1240.00);
  const [fundingLoad, setFundingLoad] = useState(false);
  const [fundedSuccess, setFundedSuccess] = useState(false);

  const handleInviteEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteName) return;

    // Simulate sending email and record invite
    setInvitedEmployees([inviteName, ...invitedEmployees]);

    // Dynamically insert a "Scheduled" employee trip for them to show in the logs instantly!
    const newRide = {
      id: "team_" + Math.random().toString(36).substring(2, 9),
      employee: inviteName,
      department: inviteDept,
      route: "Bengaluru HQ to Indiranagar Corridor",
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      time: "Scheduled Tomorrow",
      status: "Scheduled" as const,
      cost: "$22.50",
    };

    setRidesList([newRide, ...ridesList]);
    setInviteSuccess(true);
    setInviteName("");

    setTimeout(() => {
      setInviteSuccess(false);
    }, 3000);
  };

  const handleFundCredits = (amount: number) => {
    setFundingLoad(true);
    setFundedSuccess(false);
    
    setTimeout(() => {
      setFundingLoad(false);
      setCreditsBalance((prev) => prev + amount);
      // Reduce outstanding balance proportionally as travel credits absorb it
      setOutstandingBal((prev) => Math.max(0, prev - amount * 0.1));
      setFundedSuccess(true);

      setTimeout(() => {
        setFundedSuccess(false);
      }, 2500);
    }, 850);
  };

  const departments = ["All", "Design", "Sales", "Operations", "Finance"];

  const filteredRides = ridesList.filter((ride) => {
    return activeDeptFilter === "All" || ride.department === activeDeptFilter;
  });

  const isOverview = view === "overview";
  const isTeam = view === "team";
  const isBilling = view === "billing";

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#F8F8F8] text-[#111111] antialiased pb-12 pt-6">
      <div className="absolute inset-0 premium-grid-fine opacity-[0.07] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-[1400px] px-6">
        <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
          
          {/* Corporate Sidebar Shell Nav */}
          <aside className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-3xs space-y-5 lg:sticky lg:top-6 lg:h-[calc(100vh-3rem)] flex flex-col">
            <div className="flex items-center justify-between">
              <Link href="/" className="text-xl font-black tracking-tighter text-zinc-950">
                RYDR
              </Link>
              <span className="rounded-full border border-amber-250 bg-amber-50 px-2.5 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider text-amber-700 shadow-3xs">
                Business
              </span>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-zinc-950 p-4 text-white shadow-3xs">
              <p className="text-[9px] font-mono font-bold uppercase tracking-widest text-zinc-400">CORPORATE ACCOUNT</p>
              <p className="mt-1.5 text-base font-black tracking-tight leading-none">{businessOverview.company}</p>
              <span className="text-[10px] text-zinc-400 font-semibold block mt-1">{businessOverview.month} Shift</span>
            </div>

            <nav className="space-y-2.5 flex-1 mt-2">
              <NavLink href="/business" label="Overview" active={pathname === "/business"} />
              <NavLink href="/business/team" label="Team Rides" active={pathname === "/business/team"} />
              <NavLink href="/business/billing" label="Billing & Payouts" active={pathname === "/business/billing"} />
            </nav>

            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 shadow-3xs mt-auto">
              <div className="flex items-center gap-2 text-xs font-bold text-zinc-900 leading-none">
                <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Verified Corporate Admin</span>
              </div>
              <p className="mt-2 text-[10px] leading-normal font-semibold text-zinc-500">
                Authorized billing portal managing Rydr business accounts.
              </p>
            </div>
          </aside>

          {/* Main Business Panel View */}
          <section className="space-y-6">
            
            {/* Business Portal Banner */}
            <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-3xs">
              <p className="text-[9.5px] font-mono font-bold uppercase tracking-widest text-amber-600 leading-none">ENTERPRISE HUB</p>
              <div className="mt-2 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                  <h1 className="text-2xl md:text-3xl font-black tracking-tighter text-zinc-950 leading-none">
                    Corporate Travel Console
                  </h1>
                  <p className="mt-1.5 max-w-2xl text-xs font-semibold text-zinc-500">
                    Review automated team dispatches, employee commutes, and credit statement summaries in one clean, simple dashboard.
                  </p>
                </div>
                <div className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-xs font-bold text-zinc-700 shadow-3xs leading-none shrink-0 self-start md:self-auto">
                  {ridesList.length} total trips · {businessOverview.activeEmployees + invitedEmployees.length} employees
                </div>
              </div>
            </div>

            {/* Shift metrics cards */}
            <div className="grid gap-4 grid-cols-2 xl:grid-cols-4">
              <StatCard label="Active Personnel" value={(businessOverview.activeEmployees + invitedEmployees.length).toString()} note="Employees using Rydr profiles" icon={Users} />
              <StatCard label="Corporate Trips" value={ridesList.length.toString()} note="Shift trips logged MTD" icon={Route} />
              <StatCard label="Pre-Funded Credits" value={`$${creditsBalance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} note="Available travel budget" icon={CreditCard} />
              <StatCard label="Outstanding Balance" value={`$${outstandingBal.toFixed(2)}`} note="Due in 7 days" icon={ReceiptText} />
            </div>

            {/* Overview View Grid */}
            {isOverview && (
              <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                
                {/* Activity Feed */}
                <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-3xs space-y-5">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[9.5px] font-mono font-bold uppercase tracking-widest text-blue-600 leading-none">REAL-TIME FEEDS</p>
                      <h2 className="mt-1 text-lg font-black text-zinc-950 tracking-tight">Recent Team Rides</h2>
                    </div>
                    <CalendarDays className="h-5 w-5 text-zinc-400" />
                  </div>

                  <div className="space-y-3.5">
                    {ridesList.slice(0, 3).map((ride) => (
                      <div key={ride.id} className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 shadow-3xs hover:border-zinc-300 transition-all duration-150">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <span className="text-[8.5px] font-mono font-extrabold bg-zinc-150 border border-zinc-250 text-zinc-700 px-2 py-0.5 rounded shadow-3xs uppercase">
                              {ride.department} Department
                            </span>
                            <h4 className="text-sm font-extrabold text-zinc-950 mt-2 leading-none">{ride.employee}</h4>
                            <p className="mt-2 text-xs font-semibold text-zinc-500 leading-tight">Route: {ride.route}</p>
                            <span className="text-[10px] text-zinc-400 font-semibold block mt-1 font-mono">{ride.date} • {ride.time}</span>
                          </div>
                          
                          <div className="text-right">
                            <span className={`inline-block text-[9px] font-mono font-black uppercase tracking-wider px-2 py-0.5 rounded border shadow-3xs ${
                              ride.status === "Completed" 
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                                : ride.status === "Scheduled"
                                ? "bg-blue-50 text-blue-700 border-blue-200"
                                : "bg-amber-50 text-amber-700 border-amber-200"
                            }`}>
                              {ride.status}
                            </span>
                            <p className="mt-2.5 text-base font-black text-zinc-950 font-sans leading-none">{ride.cost}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <Link
                    href="/business/team"
                    className="w-full py-2.5 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 font-bold text-xs rounded-xl flex items-center justify-center space-x-1 transition-all cursor-pointer shadow-3xs"
                  >
                    <span>View All Team Rides</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-zinc-400" />
                  </Link>
                </div>

                {/* Right department stats panel */}
                <div className="space-y-6">
                  
                  {/* Department spend grid */}
                  <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-3xs space-y-4">
                    <div>
                      <p className="text-[9.5px] font-mono font-bold uppercase tracking-widest text-emerald-600 leading-none">COST CENTERING</p>
                      <h2 className="mt-1 text-lg font-black text-zinc-950 tracking-tight">MTD Budget Breakdown</h2>
                    </div>

                    <div className="space-y-2.5">
                      {initialSpend.map((item) => (
                        <div key={item.label} className="flex items-center justify-between rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 shadow-3xs">
                          <span className="text-xs font-bold text-zinc-700">{item.label} Team spend</span>
                          <span className="text-sm font-black text-zinc-900 font-sans">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Billing highlight card */}
                  <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-3xs space-y-2">
                    <p className="text-[9.5px] font-mono font-bold uppercase tracking-widest text-amber-600 leading-none">AUTO STATEMENT</p>
                    <h2 className="text-base font-black text-zinc-950 tracking-tight">Auto Cashless Invoicing</h2>
                    <p className="text-xs text-zinc-500 font-semibold leading-relaxed">
                      Company commutes are auto-drafted cashless from the pre-funded credit wallet. Balance statements compile dynamically at month-end.
                    </p>
                  </div>

                </div>
              </div>
            )}

            {/* Team Directory & Rides Hub */}
            {isTeam && (
              <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                
                {/* Employee dispatches list */}
                <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-3xs space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <p className="text-[9.5px] font-mono font-bold uppercase tracking-widest text-blue-600 leading-none">TEAM HUB</p>
                      <h2 className="mt-1 text-lg font-black text-zinc-950 tracking-tight">Employee Trip Logs</h2>
                    </div>
                    
                    {/* Department filters */}
                    <div className="flex flex-wrap gap-1 bg-zinc-100 p-1 border border-zinc-200 rounded-xl max-w-max self-start sm:self-auto">
                      {departments.map((dept) => (
                        <button
                          key={dept}
                          onClick={() => setActiveDeptFilter(dept)}
                          className={`px-3 py-1.5 rounded-lg text-[10.5px] font-bold transition-all cursor-pointer leading-none ${
                            activeDeptFilter === dept
                              ? "bg-white text-black shadow-3xs"
                              : "text-zinc-500 hover:text-zinc-800"
                          }`}
                        >
                          {dept}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Scrollable list */}
                  <div className="space-y-3.5 max-h-[500px] overflow-y-auto pr-1">
                    {filteredRides.length > 0 ? (
                      filteredRides.map((ride) => (
                        <div key={ride.id} className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 shadow-3xs hover:border-zinc-300 transition-colors duration-150">
                          <div className="flex items-start justify-between gap-3">
                            <div className="space-y-1">
                              <span className="text-[8.5px] font-mono font-extrabold bg-white border border-zinc-250 text-zinc-700 px-2 py-0.5 rounded shadow-3xs uppercase">
                                {ride.department} Team
                              </span>
                              <h4 className="text-sm font-extrabold text-zinc-950 leading-none pt-2">{ride.employee}</h4>
                              <p className="text-xs font-semibold text-zinc-500 leading-tight">Route: {ride.route}</p>
                              <span className="text-[10px] text-zinc-400 font-semibold block font-mono">{ride.date} • {ride.time}</span>
                            </div>
                            <div className="text-right">
                              <span className={`inline-block text-[9px] font-mono font-black uppercase tracking-wider px-2 py-0.5 rounded border shadow-3xs ${
                                ride.status === "Completed" 
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                                  : ride.status === "Scheduled"
                                  ? "bg-blue-50 text-blue-700 border-blue-200"
                                  : "bg-amber-50 text-amber-700 border-amber-200"
                              }`}>
                                {ride.status}
                              </span>
                              <p className="mt-2.5 text-base font-black text-zinc-950 font-sans leading-none">{ride.cost}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="py-12 text-center flex flex-col items-center justify-center space-y-3 border border-dashed border-zinc-200 rounded-3xl bg-zinc-50/50">
                        <Users className="w-6 h-6 text-zinc-400" />
                        <p className="text-xs text-zinc-500 font-semibold">No rides logged for this department.</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Sidebar invitation form */}
                <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-3xs space-y-5 self-start">
                  <div>
                    <p className="text-[9.5px] font-mono font-bold uppercase tracking-widest text-amber-600 leading-none">MEMBER MANAGEMENT</p>
                    <h2 className="mt-1 text-lg font-black text-zinc-950 tracking-tight">Invite Employee</h2>
                    <p className="text-xs text-zinc-500 font-semibold mt-1">
                      Authorise a team member to book rides under the pre-funded company travel account.
                    </p>
                  </div>

                  <form onSubmit={handleInviteEmployee} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-mono font-bold text-zinc-400 uppercase tracking-wider block">Employee Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Aria Chen"
                        value={inviteName}
                        onChange={(e) => setInviteName(e.target.value)}
                        required
                        className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-xs font-bold text-zinc-800 placeholder-zinc-450 focus:bg-white focus:border-zinc-400 outline-0 transition-colors shadow-3xs"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[9px] font-mono font-bold text-zinc-400 uppercase tracking-wider block">Team Department</label>
                      <select
                        value={inviteDept}
                        onChange={(e) => setInviteDept(e.target.value)}
                        className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-xs font-bold text-zinc-800 focus:bg-white focus:border-zinc-400 outline-0 transition-colors shadow-3xs"
                      >
                        <option value="Design">Design Team</option>
                        <option value="Sales">Sales Team</option>
                        <option value="Operations">Operations Team</option>
                        <option value="Finance">Finance Team</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3.5 bg-black hover:bg-zinc-800 text-white font-bold text-xs rounded-xl flex items-center justify-center space-x-1.5 transition-all shadow-3xs active:scale-97 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Send Portal Invitation</span>
                    </button>
                  </form>

                  <AnimatePresence>
                    {inviteSuccess && (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center space-x-2 shadow-3xs"
                      >
                        <Check className="w-4 h-4 stroke-[3] text-emerald-600 shrink-0" />
                        <span>Invitation sent! employee profile created.</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {invitedEmployees.length > 0 && (
                    <div className="space-y-3 pt-3 border-t border-zinc-150">
                      <h4 className="text-[9px] font-mono font-bold uppercase text-zinc-400 tracking-wider">PENDING PORTAL INVITES</h4>
                      <div className="space-y-2">
                        {invitedEmployees.map((emp, i) => (
                          <div key={i} className="flex items-center justify-between rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2 shadow-3xs">
                            <span className="text-xs font-bold text-zinc-800">{emp}</span>
                            <span className="text-[8px] font-mono font-black text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded uppercase">
                              INVITED
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Billing Statements Hub */}
            {isBilling && (
              <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                
                {/* Statements overview */}
                <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-3xs space-y-5">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[9.5px] font-mono font-bold uppercase tracking-widest text-emerald-600 leading-none">STATEMENTS</p>
                      <h2 className="mt-1 text-lg font-black text-zinc-950 tracking-tight">Invoice Breakdown</h2>
                    </div>
                    <CreditCard className="h-5 w-5 text-zinc-400" />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    {initialBilling.map((item) => (
                      <div key={item.label} className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 shadow-3xs">
                        <p className="text-[9px] font-mono font-bold uppercase tracking-widest text-zinc-400 leading-none">{item.label}</p>
                        {item.label === "Outstanding balance" ? (
                          <p className="mt-2 text-2xl font-black tracking-tighter text-zinc-950">${outstandingBal.toFixed(2)}</p>
                        ) : (
                          <p className="mt-2 text-2xl font-black tracking-tighter text-zinc-950">{item.value}</p>
                        )}
                        <p className="mt-2 text-xs font-semibold text-zinc-500 leading-none">{item.note}</p>
                      </div>
                    ))}
                  </div>

                  <div className="h-[1px] bg-zinc-150 my-2" />

                  {/* Statement logs */}
                  <div className="space-y-3.5">
                    <h4 className="text-[10px] font-mono font-bold uppercase text-zinc-400 tracking-widest">MTD BILLING JOURNAL</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between rounded-2xl border border-zinc-200 bg-zinc-50 p-4 shadow-3xs">
                        <div>
                          <h5 className="text-xs font-extrabold text-zinc-800">Rydr Billing Statement — May 2026</h5>
                          <span className="text-[10px] text-zinc-400 font-semibold font-mono">Status: Drafted • finalizes May 31</span>
                        </div>
                        <button className="p-2.5 bg-white hover:bg-zinc-50 text-zinc-700 border border-zinc-200 rounded-xl transition-colors cursor-pointer shadow-3xs">
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between rounded-2xl border border-zinc-200 bg-zinc-50 p-4 shadow-3xs">
                        <div>
                          <h5 className="text-xs font-extrabold text-zinc-800">Rydr Billing Statement — Apr 2026</h5>
                          <span className="text-[10px] text-zinc-450 font-semibold font-mono">Status: Paid via Corporate Card • Apr 30</span>
                        </div>
                        <button className="p-2.5 bg-white hover:bg-zinc-50 text-zinc-700 border border-zinc-200 rounded-xl transition-colors cursor-pointer shadow-3xs">
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sidebar funding preloaded credits */}
                <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-3xs space-y-5 self-start">
                  <div>
                    <p className="text-[9.5px] font-mono font-bold uppercase tracking-widest text-blue-600 leading-none">PRE-FUNDING WALLET</p>
                    <h2 className="mt-1 text-lg font-black text-zinc-950 tracking-tight">Deposit Travel Credits</h2>
                    <p className="text-xs text-zinc-500 font-semibold mt-1">
                      Top up your pre-funded enterprise account wallet. Deposited credits instantly absorb outstanding billing balances.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="rounded-2xl border border-zinc-250 bg-zinc-50 p-4.5 text-center shadow-3xs">
                      <p className="text-[9px] font-mono font-extrabold text-zinc-400 uppercase tracking-widest leading-none">PRE-FUNDED TRAVEL CREDIT BALANCE</p>
                      <p className="text-3xl font-black text-zinc-950 font-sans tracking-tight mt-2.5">
                        ${creditsBalance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                    </div>

                    <div className="space-y-2 pt-2">
                      <label className="text-[9px] font-mono font-bold text-zinc-400 uppercase tracking-wider block">Quick Fund Options</label>
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          disabled={fundingLoad}
                          onClick={() => handleFundCredits(500)}
                          className="py-2.5 bg-zinc-50 hover:bg-zinc-100 text-zinc-950 font-extrabold border border-zinc-200 text-xs rounded-xl shadow-3xs active:scale-97 cursor-pointer transition-all"
                        >
                          +$500
                        </button>
                        <button
                          disabled={fundingLoad}
                          onClick={() => handleFundCredits(1000)}
                          className="py-2.5 bg-zinc-50 hover:bg-zinc-100 text-zinc-950 font-extrabold border border-zinc-200 text-xs rounded-xl shadow-3xs active:scale-97 cursor-pointer transition-all"
                        >
                          +$1,000
                        </button>
                        <button
                          disabled={fundingLoad}
                          onClick={() => handleFundCredits(2500)}
                          className="py-2.5 bg-zinc-50 hover:bg-zinc-100 text-zinc-950 font-extrabold border border-zinc-200 text-xs rounded-xl shadow-3xs active:scale-97 cursor-pointer transition-all"
                        >
                          +$2,500
                        </button>
                      </div>
                    </div>
                  </div>

                  <AnimatePresence>
                    {fundingLoad && (
                      <div className="py-2 text-center text-xs font-mono text-zinc-500 font-bold uppercase tracking-wider animate-pulse">
                        PROCESSING FUND TRANSFER...
                      </div>
                    )}
                    {fundedSuccess && (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="p-3 bg-emerald-50 border border-emerald-250 rounded-xl text-emerald-800 text-xs font-semibold flex items-center space-x-2 shadow-3xs"
                      >
                        <Check className="w-4 h-4 stroke-[3] text-emerald-600 shrink-0" />
                        <span>Corporate wallet funded successfully!</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="rounded-2xl border border-zinc-200 bg-zinc-950 p-4 text-white shadow-3xs mt-2">
                    <p className="text-[9px] font-mono font-bold uppercase tracking-wider text-zinc-400">CORPORATE CARD</p>
                    <p className="mt-1.5 text-xs font-semibold text-zinc-200">Visa Business Card •••• 5024</p>
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
