"use client";

import React, { useEffect, useState } from "react";
import api from "../api/axios.js";
import { motion } from "framer-motion";
import { 
  BarChart3, ArrowLeft, Activity, 
  Download, MousePointer2, PieChart, Zap, Filter, MoreHorizontal 
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AdminAnalytics() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  
  const [stats, setStats] = useState({
    lost: 21, 
    found: 17, 
    successRate: 44.7, 
    mostCommonCategory: "Backpack"
  });

  // Dashboard එකේ විදිහටම සකස් කළ Data (මෙහි val එකට % ලකුණ අනිවාර්යයි)
  const weeklyData = [
    { day: "Mon", val: "65%", color: "bg-blue-400" },
    { day: "Tue", val: "85%", color: "bg-blue-500" },
    { day: "Wed", val: "45%", color: "bg-slate-300" },
    { day: "Thu", val: "95%", color: "bg-indigo-500" },
    { day: "Fri", val: "75%", color: "bg-blue-500" },
    { day: "Sat", val: "35%", color: "bg-slate-300" },
    { day: "Sun", val: "60%", color: "bg-blue-400" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/items");
        const data = res.data.data || [];
        if (data.length > 0) {
          const lost = data.filter(i => i.status === "lost").length;
          const found = data.filter(i => i.status === "found").length;
          const total = data.length;
          const rate = total > 0 ? ((found / total) * 100).toFixed(1) : 44.7;
          setStats(prev => ({ ...prev, lost, found, successRate: rate }));
        }
      } catch (err) {
        console.error("API error");
      } finally {
        setTimeout(() => setLoading(false), 500);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#F8FAFC]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 md:p-10 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div className="flex items-center gap-6">
          <button onClick={() => navigate(-1)} className="p-4 bg-white border border-slate-200 text-slate-600 rounded-2xl shadow-sm hover:bg-slate-50">
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Intelligence</h1>
              <span className="px-3 py-1 bg-blue-600 text-white text-[10px] font-black rounded-full uppercase tracking-widest">v2.0</span>
            </div>
            <p className="text-slate-500 font-medium mt-1">Analytical breakdown of system activity.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-6 py-4 bg-white border border-slate-200 text-slate-700 rounded-2xl font-bold text-xs"><Filter size={16} /> Filters</button>
          <button className="flex items-center gap-2 px-6 py-4 bg-slate-900 text-white rounded-2xl font-bold text-xs"><Download size={16} /> Export JSON</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side: Stats & Category */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-white rounded-[45px] p-10 border border-slate-100 shadow-sm flex flex-col items-center">
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.25em] mb-10">Recovery Success Rate</p>
            <div className="relative w-56 h-56 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90">
                <circle cx="112" cy="112" r="100" stroke="#F1F5F9" strokeWidth="18" fill="transparent" />
                <motion.circle 
                  cx="112" cy="112" r="100" stroke="#2563EB" strokeWidth="18" fill="transparent" 
                  strokeDasharray={628}
                  initial={{ strokeDashoffset: 628 }}
                  animate={{ strokeDashoffset: 628 - (628 * stats.successRate) / 100 }}
                  transition={{ duration: 2, ease: "easeOut" }}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute text-center">
                <span className="text-6xl font-black text-slate-900 tracking-tighter">{stats.successRate}%</span>
                <p className="text-[10px] font-bold text-emerald-500 mt-1 uppercase tracking-widest">Optimal Health</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 w-full mt-12">
              <div className="p-5 rounded-[30px] border border-rose-100 bg-rose-50 text-center">
                <p className="text-[9px] font-black uppercase text-rose-400 mb-1">Lost</p>
                <p className="text-3xl font-black text-rose-600">{stats.lost}</p>
              </div>
              <div className="p-5 rounded-[30px] border border-emerald-100 bg-emerald-50 text-center">
                <p className="text-[9px] font-black uppercase text-emerald-400 mb-1">Found</p>
                <p className="text-3xl font-black text-emerald-600">{stats.found}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[40px] p-8 text-white relative overflow-hidden shadow-2xl">
            <Zap className="absolute -right-6 -top-6 w-40 h-40 text-white/10 rotate-12" />
            <p className="text-[10px] font-black text-blue-200 uppercase tracking-widest mb-4">Trending Category</p>
            <h3 className="text-4xl font-black tracking-tighter mb-2">{stats.mostCommonCategory}</h3>
            <div className="mt-4 px-3 py-1 bg-white/20 w-fit rounded-full text-[10px] font-bold uppercase">Top Performer</div>
          </div>
        </div>

        {/* Right Side: Enhanced Bar Chart (Dashboard එකේ එක) */}
        <div className="lg:col-span-8 bg-white rounded-[45px] border border-slate-100 shadow-sm p-10 flex flex-col relative overflow-hidden">
          {/* Background Decor */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full blur-3xl opacity-50 -mr-16 -mt-16"></div>

          <div className="flex items-center justify-between mb-12 relative z-10">
            <div>
              <h3 className="font-bold text-slate-900 text-2xl tracking-tight">Platform Analytics</h3>
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

          {/* Interactive Bar Chart Container */}
          <div className="flex-1 flex items-end justify-between gap-2 px-4 pb-4 relative z-10 min-h-[300px]">
            {weeklyData.map((item, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-4 group">
                <div className="w-full relative flex items-end justify-center h-64">
                  {/* Tooltip */}
                  <div className="absolute -top-10 scale-0 group-hover:scale-100 transition-all duration-200 bg-slate-900 text-white text-[10px] font-bold py-1.5 px-2.5 rounded-lg z-20 shadow-xl shadow-slate-200 after:content-[''] after:absolute after:top-full after:left-1/2 after:-ml-1 after:border-4 after:border-transparent after:border-t-slate-900">
                    {item.val}
                  </div>
                  
                  {/* Bar with Framer Motion for Animation */}
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: item.val }}
                    transition={{ duration: 1, delay: idx * 0.1, ease: "circOut" }}
                    className={`w-full max-w-[35px] ${item.color} rounded-t-xl rounded-b-md transition-all duration-300 group-hover:brightness-110 group-hover:shadow-lg group-hover:shadow-blue-100 cursor-pointer relative overflow-hidden`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </motion.div>
                </div>
                <span className="text-[11px] font-bold text-slate-400 group-hover:text-slate-900 transition-colors uppercase tracking-tighter">
                  {item.day}
                </span>
              </div>
            ))}

            {/* Background Grid Lines */}
            <div className="absolute inset-x-0 top-0 h-64 flex flex-col justify-between pointer-events-none opacity-40">
              <div className="border-t border-dashed border-slate-200 w-full"></div>
              <div className="border-t border-dashed border-slate-200 w-full"></div>
              <div className="border-t border-dashed border-slate-200 w-full"></div>
              <div className="border-t border-dashed border-slate-200 w-full"></div>
            </div>
          </div>

          {/* Footer Tiles */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 pt-8 border-t border-slate-50">
            <div className="flex items-center gap-4 p-5 rounded-[30px] bg-slate-50/50 border border-slate-100">
              <div className="p-3 bg-white rounded-2xl text-blue-600 shadow-sm"><Activity size={18}/></div>
              <div><p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Health</p><p className="text-sm font-black text-slate-900">99.2%</p></div>
            </div>
            <div className="flex items-center gap-4 p-5 rounded-[30px] bg-slate-50/50 border border-slate-100">
              <div className="p-3 bg-white rounded-2xl text-blue-600 shadow-sm"><MousePointer2 size={18}/></div>
              <div><p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Interaction</p><p className="text-sm font-black text-slate-900">HIGH</p></div>
            </div>
            <div className="flex items-center gap-4 p-5 rounded-[30px] bg-slate-50/50 border border-slate-100">
              <div className="p-3 bg-white rounded-2xl text-blue-600 shadow-sm"><PieChart size={18}/></div>
              <div><p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Sync Status</p><p className="text-sm font-black text-slate-900">ONLINE</p></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}