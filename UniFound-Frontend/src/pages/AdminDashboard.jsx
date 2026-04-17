import AdminLayout from "../pages/AdminLayout";
import { TrendingUp, Users as UsersIcon, Box, ShieldCheck, LifeBuoy, ArrowUpRight, ArrowDownRight, MoreHorizontal, FileText, FolderOpen, BarChart3 } from "lucide-react";
import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import AdminClaims from "./AdminClaims";
import AdminItems from "./AdminItems";
import AdminTicketsPage from "./AdminTicketsPage";
import ClaimDetailsPage from "./ClaimDetailsPage";
import ClaimsPieChart from "../components/ClaimsPieChart";

export default function AdminDashboard() {
  const [userCount, setUserCount] = useState("0");
  const [foundCount, setFoundCount] = useState("0");
  const [claimCount, setClaimCount] = useState("0");
  const [ticketCount, setTicketCount] = useState("0");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch real data from API
    const fetchDashboardData = async () => {
      try {
        // Fetch users count
        const usersResponse = await fetch('http://localhost:5000/api/admin-users');
        const usersData = await usersResponse.json();
        if (usersData && Array.isArray(usersData)) {
          setUserCount(usersData.length.toString());
        } else if (usersData.users && Array.isArray(usersData.users)) {
          setUserCount(usersData.users.length.toString());
        }

        // Fetch items count
        const itemsResponse = await fetch('http://localhost:5000/api/items');
        const itemsData = await itemsResponse.json();
        if (itemsData && Array.isArray(itemsData)) {
          setFoundCount(itemsData.length.toString());
        } else if (itemsData.items && Array.isArray(itemsData.items)) {
          setFoundCount(itemsData.items.length.toString());
        }

        // Fetch claims count
        const claimsResponse = await fetch('http://localhost:5000/api/claims');
        const claimsData = await claimsResponse.json();
        if (claimsData && Array.isArray(claimsData)) {
          setClaimCount(claimsData.length.toString());
        } else if (claimsData.claims && Array.isArray(claimsData.claims)) {
          setClaimCount(claimsData.claims.length.toString());
        }

        // Fetch tickets count
        const ticketsResponse = await fetch('http://localhost:5000/api/tickets');
        const ticketsData = await ticketsResponse.json();
        if (ticketsData && Array.isArray(ticketsData)) {
          setTicketCount(ticketsData.length.toString());
        } else if (ticketsData.tickets && Array.isArray(ticketsData.tickets)) {
          setTicketCount(ticketsData.tickets.length.toString());
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

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
                      icon={<UsersIcon size={20} />} 
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
                      value={ticketCount} 
                      trend="-2%" 
                      isPositive={false}
                    />
                  </div>

                  {/* BOTTOM SECTION */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 bg-white rounded-[32px] p-8 shadow-sm border border-slate-100/50 relative overflow-hidden">
                      {/* Subtle pattern background for the chart area */}
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
                      
                      <ClaimsPieChart />
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

function KeyCard({ icon, color, label, description, link }) {
  const theme = {
    violet: "bg-violet-100 border-violet-300 text-violet-800 hover:bg-violet-200 hover:border-violet-400",
    amber: "bg-amber-100 border-amber-300 text-amber-800 hover:bg-amber-200 hover:border-amber-400",
    cyan: "bg-cyan-100 border-cyan-300 text-cyan-800 hover:bg-cyan-200 hover:border-cyan-400",
  }[color];

  return (
    <div 
      className={`p-6 rounded-[30px] border transition-all duration-300 cursor-pointer group ${theme}`}
      onClick={() => window.location.href = link}
    >
      <div className="flex items-center justify-center mb-4">
        <div className={`p-4 rounded-2xl bg-white shadow-sm group-hover:scale-110 transition-transform`}>
          {icon}
        </div>
      </div>
      <div className="text-center">
        <p className="text-sm font-black text-slate-900 tracking-tight mb-2">{label}</p>
        <p className="text-[10px] font-medium text-slate-600 leading-tight">{description}</p>
      </div>
    </div>
  );
}