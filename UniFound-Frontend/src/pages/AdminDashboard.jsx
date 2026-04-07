import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

import { 
  Users, Box, ShieldCheck, LifeBuoy, 
  ArrowUpRight, ArrowDownRight, MoreHorizontal 
} from "lucide-react";
import AdminClaims from "./AdminClaims";
import AdminItems from "./AdminItems";
import AdminTicketsPage from "./AdminTicketsPage";
import ClaimDetailsPage from "./ClaimDetailsPage";

export default function AdminDashboard() {
  const [userCount, setUserCount] = useState("12,423");
  const [foundCount, setFoundCount] = useState("1,221");
  const [claimCount, setClaimCount] = useState("423");

  // Chart එක සඳහා sample data ටිකක්
  const weeklyData = [
    { day: "Mon", val: "65%", color: "bg-blue-400" },
    { day: "Tue", val: "85%", color: "bg-blue-500" },
    { day: "Wed", val: "45%", color: "bg-slate-300" },
    { day: "Thu", val: "95%", color: "bg-indigo-500" },
    { day: "Fri", val: "75%", color: "bg-blue-500" },
    { day: "Sat", val: "35%", color: "bg-slate-300" },
    { day: "Sun", val: "60%", color: "bg-blue-400" },
  ];

  return (
    <div className="flex min-h-screen bg-[#F8FAFF] font-['Inter',_-apple-system,_.SFNSText-Regular,'Segoe_UI','Helvetica_Neue',sans-serif] text-[#1E293B]">
      {/* Sidebar - Fixed Left */}
      <Sidebar />
      
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header - Fixed Top */}
        <Header />
        
        {/* Main Content Area - Scrollable */}
        <main className="flex-1 p-8 overflow-y-auto custom-scrollbar">
          <Routes>
            {/* --- MAIN DASHBOARD VIEW --- */}
            <Route
              path="/"
              element={
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                  {/* REFINED STATS GRID */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard 
                      icon={<Users size={20} />} 
                      color="blue"
                      label="Total Users" 
                      value={userCount} 
                      trend="+12%" 
                      isPositive={true}
                    />
                    <StatCard 
                      icon={<Box size={20} />} 
                      color="emerald"
                      label="Found Items" 
                      value={foundCount} 
                      trend="+5.4%" 
                      isPositive={true}
                    />
                    <StatCard 
                      icon={<ShieldCheck size={20} />} 
                      color="orange"
                      label="Active Claims" 
                      value={claimCount} 
                      trend="+2.1%" 
                      isPositive={true}
                    />
                    <StatCard 
                      icon={<LifeBuoy size={20} />} 
                      color="rose"
                      label="Open Tickets" 
                      value="18" 
                      trend="-2%" 
                      isPositive={false}
                    />
                  </div>

                  {/* BOTTOM SECTION */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* ENHANCED PLATFORM ANALYTICS */}
                    <div className="lg:col-span-2 bg-white rounded-[32px] p-8 shadow-sm border border-slate-100/50 relative overflow-hidden flex flex-col">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full blur-3xl opacity-50 -mr-16 -mt-16"></div>
                      
                      <div className="flex items-center justify-between mb-12 relative z-10">
                        <div>
                          <h3 className="font-bold text-slate-900 text-lg tracking-tight">Platform Analytics</h3>
                          <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-[0.2em]">Weekly Activity Overview</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 rounded-full border border-emerald-100">
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Live Updates</span>
                          </div>
                          <button className="p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors">
                            <MoreHorizontal size={20} className="text-slate-400" />
                          </button>
                        </div>
                      </div>
                      
                      {/* Interactive Bar Chart */}
                      <div className="flex-1 flex items-end justify-between gap-2 px-4 pb-4 relative z-10 min-h-[250px]">
                        {weeklyData.map((item, idx) => (
                          <div key={idx} className="flex-1 flex flex-col items-center gap-4 group">
                            <div className="w-full relative flex items-end justify-center h-48">
                              {/* Hover Value Tooltip */}
                              <div className="absolute -top-10 scale-0 group-hover:scale-100 transition-all duration-200 bg-slate-900 text-white text-[10px] font-bold py-1.5 px-2.5 rounded-lg z-20 shadow-xl shadow-slate-200 after:content-[''] after:absolute after:top-full after:left-1/2 after:-ml-1 after:border-4 after:border-transparent after:border-t-slate-900">
                                {item.val}
                              </div>
                              {/* The Bar */}
                              <div 
                                style={{ height: item.val }} 
                                className={`w-full max-w-[32px] ${item.color} rounded-t-xl rounded-b-md transition-all duration-700 ease-out group-hover:brightness-110 group-hover:shadow-lg group-hover:shadow-blue-100 cursor-pointer relative overflow-hidden`}
                              >
                                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                              </div>
                            </div>
                            <span className="text-[11px] font-bold text-slate-400 group-hover:text-slate-900 transition-colors uppercase tracking-tighter">
                              {item.day}
                            </span>
                          </div>
                        ))}
                        
                        {/* Background Grid Lines */}
                        <div className="absolute inset-x-0 top-0 h-48 flex flex-col justify-between pointer-events-none opacity-40">
                          <div className="border-t border-dashed border-slate-200 w-full"></div>
                          <div className="border-t border-dashed border-slate-200 w-full"></div>
                          <div className="border-t border-dashed border-slate-200 w-full"></div>
                        </div>
                      </div>
                    </div>

                    {/* SIDE PROMO CARD */}
                    <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-[35px] p-10 text-white relative overflow-hidden flex flex-col justify-end shadow-xl shadow-blue-200">
                      <div className="absolute top-10 right-10 opacity-10 rotate-12"><ShieldCheck size={120} /></div>
                      <h2 className="text-2xl font-bold mb-4 leading-tight tracking-tight">Ready to verify new claims?</h2>
                      <p className="text-blue-100/80 text-sm font-medium mb-8 leading-relaxed">Check the latest item ownership proofs submitted by users today.</p>
                      <button className="bg-white text-blue-600 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-blue-50 transition-all shadow-lg shadow-blue-900/20 active:scale-95">
                        Review Now
                      </button>
                    </div>
                  </div>
                </div>
              }
            />

            {/* --- ADMIN ROUTES --- */}
            <Route path="/claims" element={<AdminClaims />} />
            <Route path="/items" element={<AdminItems />} />
            <Route path="/tickets" element={<AdminTicketsPage />} />
            <Route path="/claims/:claimId" element={<ClaimDetailsPage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

// Reusable Stat Card Component
function StatCard({ icon, color, label, value, trend, isPositive }) {
  const theme = {
    blue: "bg-blue-50/50 border-blue-100 text-blue-600 hover:border-blue-300",
    emerald: "bg-emerald-50/50 border-emerald-100 text-emerald-600 hover:border-emerald-300",
    orange: "bg-orange-50/50 border-orange-100 text-orange-600 hover:border-orange-300",
    rose: "bg-rose-50/50 border-rose-100 text-rose-600 hover:border-rose-300",
  }[color];

  return (
    <div className={`p-6 rounded-[30px] border transition-all duration-300 group ${theme}`}>
      <div className="flex items-center justify-between mb-5">
        <div className={`p-3 rounded-2xl bg-white shadow-sm group-hover:scale-110 transition-transform`}>
          {icon}
        </div>
        <div className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold text-[10px] bg-white shadow-sm ${
          isPositive ? 'text-emerald-600' : 'text-rose-600'
        }`}>
          {isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
          {trend}
        </div>
      </div>
      <div>
        <p className="text-[10px] font-bold opacity-70 uppercase tracking-[0.15em] mb-1">{label}</p>
        <p className="text-2xl font-bold text-slate-900 tracking-tighter">{value}</p>
      </div>
    </div>
  );
}