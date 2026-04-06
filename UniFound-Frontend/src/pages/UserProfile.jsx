"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  LayoutDashboard, 
  Trophy, 
  Ticket, 
  Activity, 
  BarChart3, 
  Settings,
  Mail,
  ShieldCheck,
  LogOut,
  ChevronRight,
  ExternalLink
} from "lucide-react";

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) setUser(storedUser);
    else navigate("/login");
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  if (!user) return null;

  const pages = [
    { name: "Overview", path: "/profile/overview", icon: <LayoutDashboard size={22} />, color: "text-blue-600", bg: "bg-blue-50", desc: "General account statistics" },
    { name: "Leaderboard", path: "/profile/leaderboard", icon: <Trophy size={22} />, color: "text-amber-600", bg: "bg-amber-50", desc: "Check your global ranking" },
    { name: "Tickets", path: "/tickets", icon: <Ticket size={22} />, color: "text-indigo-600", bg: "bg-indigo-50", desc: "Manage your active tickets" },
    { name: "Activity", path: "/profile/activity", icon: <Activity size={22} />, color: "text-emerald-600", bg: "bg-emerald-50", desc: "View your recent actions" },
    { name: "Analytics", path: "/profile/analytics", icon: <BarChart3 size={22} />, color: "text-rose-600", bg: "bg-rose-50", desc: "Data driven insights" },
    { name: "Settings", path: "/profile/settings", icon: <Settings size={22} />, color: "text-slate-600", bg: "bg-slate-100", desc: "Security and preferences" },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-blue-100">
      
      {/* --- Top Navigation Bar --- */}
      <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors font-semibold"
          >
            <ArrowLeft size={20} />
            <span>Return</span>
          </button>
          <div className="flex items-center gap-4">
            <span className="hidden md:block text-xs font-bold text-slate-400 tracking-widest uppercase bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
              {user.userId}
            </span>
            <button onClick={handleLogout} className="p-2 hover:bg-red-50 rounded-full text-red-500 transition-colors">
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* --- Left Sidebar: Profile Card --- */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden sticky top-24">
            {/* Cover Decoration */}
            <div className="h-32 bg-gradient-to-br from-blue-600 to-indigo-700 relative">
               <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/graphy.png')]"></div>
            </div>
            
            <div className="px-8 pb-8">
              <div className="relative -mt-16 mb-6 flex justify-center lg:justify-start">
                <div className="p-1 bg-white rounded-[2.5rem] shadow-xl">
                  <img
                    src={user.profilePicture || `https://api.dicebear.com/7.x/initials/svg?seed=${user.firstName}`}
                    alt="Profile"
                    className="w-32 h-32 rounded-[2.2rem] object-cover border-2 border-slate-50"
                  />
                </div>
                {user.type === 'admin' && (
                  <div className="absolute bottom-0 right-0 lg:right-auto lg:left-24 bg-blue-600 text-white p-2 rounded-2xl border-4 border-white shadow-lg">
                    <ShieldCheck size={20} />
                  </div>
                )}
              </div>

              <div className="text-center lg:text-left">
                <h1 className="text-2xl font-black text-slate-800 tracking-tight">
                  {user.firstName} {user.lastName}
                </h1>
                <p className="text-blue-600 font-semibold text-sm mb-4 flex items-center justify-center lg:justify-start gap-1">
                  @{user.firstName?.toLowerCase()}{user.userId?.split('-')[1]} • {user.type}
                </p>
                
                <div className="space-y-3 pt-4 border-t border-slate-100 text-sm">
                  <div className="flex items-center gap-3 text-slate-500 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    <Mail size={16} className="text-blue-400" />
                    <span className="truncate">{user.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-500 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    <ShieldCheck size={16} className="text-emerald-400" />
                    <span>Account Verified</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- Right Content: Actions & Grid --- */}
        <div className="lg:col-span-8 space-y-6">
          {/* Welcome Banner */}
          <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Welcome back, {user.firstName}! 👋</h2>
              <p className="text-slate-500 mt-1">Everything looks good. Your account is active.</p>
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-bold text-sm transition-all shadow-lg shadow-blue-200 active:scale-95 flex items-center gap-2">
              Edit Profile <ExternalLink size={16} />
            </button>
          </div>

          {/* Quick Links Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {pages.map((page) => (
              <button
                key={page.name}
                onClick={() => navigate(page.path)}
                className="group bg-white p-4 rounded-[1.8rem] border border-slate-200 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 text-left flex items-center gap-5"
              >
                <div className={`${page.bg} ${page.color} w-16 h-16 rounded-[1.4rem] flex items-center justify-center transition-transform group-hover:scale-110 duration-500`}>
                  {page.icon}
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-slate-800">{page.name}</h3>
                    <ChevronRight size={18} className="text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                  </div>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">{page.desc}</p>
                </div>
              </button>
            ))}
          </div>

          {/* Statistics Summary Area (Visual Placeholder to fill space) */}
          <div className="bg-[#1E293B] p-8 rounded-[2rem] text-white relative overflow-hidden shadow-2xl">
             <div className="relative z-10 flex flex-col md:flex-row gap-8 justify-around text-center">
                <div>
                  <p className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-1">Status</p>
                  <p className="text-2xl font-bold">{user.isBlocked ? "Blocked" : "Active"}</p>
                </div>
                <div className="h-px md:h-12 w-full md:w-px bg-slate-700"></div>
                <div>
                  <p className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-1">Last Login</p>
                  <p className="text-2xl font-bold text-slate-100">Today</p>
                </div>
                <div className="h-px md:h-12 w-full md:w-px bg-slate-700"></div>
                <div>
                  <p className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-1">Created At</p>
                  <p className="text-2xl font-bold text-slate-100">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</p>
                </div>
             </div>
             {/* Decorative Circles */}
             <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl"></div>
             <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl"></div>
          </div>
        </div>
      </main>
    </div>
  );
}