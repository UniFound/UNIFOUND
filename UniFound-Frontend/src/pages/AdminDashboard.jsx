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

export default function AdminDashboard() {
  // Stat counts (පසුව Backend එකෙන් fetch කර මෙයට සම්බන්ධ කරන්න)
  const [userCount, setUserCount] = useState("12,423");
  const [foundCount, setFoundCount] = useState("1,221");
  const [claimCount, setClaimCount] = useState("423");

  return (
    /* Font එක Inter, Segoe UI, සහ sans-serif ලෙස වඩාත් පැහැදිලි එකකට වෙනස් කර ඇත */
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
                    <div className="lg:col-span-2 bg-white rounded-[32px] p-8 shadow-sm border border-slate-100/50 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full blur-3xl opacity-50 -mr-16 -mt-16"></div>
                      
                      <div className="flex items-center justify-between mb-10 relative z-10">
                        <div>
                          <h3 className="font-bold text-slate-900 text-lg tracking-tight">Platform Analytics</h3>
                          <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-[0.2em]">Activity Overview</p>
                        </div>
                        <button className="p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors">
                          <MoreHorizontal size={20} className="text-slate-400" />
                        </button>
                      </div>
                      
                      <div className="h-[340px] bg-slate-50/50 rounded-[24px] border border-slate-100 flex items-center justify-center">
                         <p className="text-slate-400 font-medium italic text-sm tracking-widest opacity-60 underline decoration-blue-500/30 decoration-4 underline-offset-8">Visual Data Stream</p>
                      </div>
                    </div>

                    {/* SIDE PROMO CARD */}
                    <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-[35px] p-10 text-white relative overflow-hidden flex flex-col justify-end shadow-xl shadow-blue-200">
                      <div className="absolute top-10 right-10 opacity-10 rotate-12"><ShieldCheck size={120} /></div>
                      <h2 className="text-2xl font-bold mb-4 leading-tight tracking-tight">Ready to verify new claims?</h2>
                      <p className="text-blue-100/80 text-sm font-medium mb-8 leading-relaxed">Check the latest item ownership proofs submitted by users today.</p>
                      <button className="bg-white text-blue-600 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-blue-50 transition-colors shadow-lg shadow-blue-900/20">
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