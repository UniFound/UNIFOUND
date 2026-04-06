"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Package, Clock, CheckCircle2, XCircle, MapPin, 
  Calendar, RefreshCw, ArrowLeft,
  ChevronRight, Filter, Sparkles, Plus, Tag, MessageSquare
} from "lucide-react";
import Navbar from "../components/Navbar";

const ClaimHistory = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  // 🗂️ Handle Active Tab (Default is my-claims)
  const [activeTab, setActiveTab] = useState("my-claims");

  const [claims, setClaims] = useState([]);
  const [reportedItems, setReportedItems] = useState([]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const userString = localStorage.getItem("user");
      
      let userId = null;
      let email = null;
      
      if (userString) {
        const parsedUser = JSON.parse(userString);
        userId = parsedUser.userId; // e.g., "USR-b3791f25"
        email = parsedUser.email;   // e.g., "nadeesha.perera@example.com"
      }

      const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      };

      const BASE_URL = "http://localhost:5000/api"; 

      // 1. Fetching user's claims using Query Parameters 🎯
      if (userId) {
        const claimsRes = await fetch(`${BASE_URL}/claims?userId=${userId}`, { headers });
        const claimsData = await claimsRes.json();
        
        console.log("Real Claims Data:", claimsData);

        if (claimsRes.ok) {
          setClaims(claimsData || []);
        }
      }

      // 2. Fetching user's reported items 🔒
      if (userId) {
        const itemsRes = await fetch(`${BASE_URL}/items/user-items/${userId}`, { headers });
        const itemsData = await itemsRes.json();
        if (itemsRes.ok) setReportedItems(itemsData.data || []);
      }

    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // UseEffect to fetch data on component load
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Card Theme Color Helper
  const getStatusTheme = (status) => {
    const normalizedStatus = status ? status.toLowerCase() : "";
    
    switch (normalizedStatus) {
      case "approved":
      case "verified":
      case "found": 
        return {
          cardBg: "bg-emerald-50/60", 
          borderColor: "border-emerald-100",
          accent: "text-emerald-600",
          badge: "bg-emerald-100 text-emerald-700"
        };
      case "rejected": 
        return {
          cardBg: "bg-rose-50/60", 
          borderColor: "border-rose-100",
          accent: "text-rose-600",
          badge: "bg-rose-100 text-rose-700"
        };
      case "lost": 
        return {
          cardBg: "bg-orange-50/60", 
          borderColor: "border-orange-100",
          accent: "text-orange-600",
          badge: "bg-orange-100 text-orange-700"
        };
      default: 
        return {
          cardBg: "bg-blue-50/60", 
          borderColor: "border-blue-100",
          accent: "text-blue-600",
          badge: "bg-blue-100 text-blue-700"
        };
    }
  };

  return (
    <div className="h-screen w-screen bg-[#F8FAFC] selection:bg-blue-100 text-slate-600 font-sans overflow-hidden flex flex-col">
      <Navbar />
      
      {/* 🌌 Ultra Modern Dynamic Background */}
      <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden pointer-events-none opacity-50">
        <div className="absolute top-[-10%] left-[-5%] w-[45%] h-[45%] bg-gradient-to-br from-blue-100 to-transparent blur-[120px] rounded-full" />
        <div className="absolute bottom-[0%] right-[-5%] w-[40%] h-[40%] bg-gradient-to-tl from-indigo-50 to-transparent blur-[100px] rounded-full" />
      </div>

      {/* ⚡ Full-Height Split Screen Container */}
      <div className="flex-1 flex flex-col xl:flex-row pt-20 overflow-hidden">
        
        {/* ================= 🔲 LEFT SIDEBAR PANEL (Fixed) ================= */}
        <div className="w-full xl:w-[380px] xl:h-full bg-white/70 backdrop-blur-xl border-r border-slate-200/60 p-6 md:p-8 flex flex-col justify-between overflow-y-auto">
          
          {/* Top Section */}
          <div className="space-y-6">
            {/* Action Buttons */}
            <div className="flex items-center justify-between gap-4">
              <button 
                onClick={() => navigate(-1)}
                className="flex items-center gap-2.5 text-slate-500 hover:text-blue-600 transition-all group font-bold text-xs"
              >
                <div className="p-2 bg-white rounded-xl shadow-sm border border-slate-100 group-hover:border-blue-100 group-hover:text-blue-600 transition-all">
                  <ArrowLeft size={14} />
                </div>
                <span>RETURN</span>
              </button>

              <button 
                onClick={fetchData}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 text-xs font-bold disabled:opacity-50"
              >
                <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
                {loading ? "Syncing..." : "Refresh"}
              </button>
            </div>

            {/* Hero Typography */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="h-[2px] w-6 bg-blue-500" />
                <span className="text-[10px] uppercase tracking-[0.3em] text-blue-500 font-black">History Log</span>
              </div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight leading-snug">
                Portal <span className="text-blue-600">History</span>.
              </h1>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                Seamlessly track your submitted claims and items reported to the system.
              </p>
            </div>

            <hr className="border-slate-100" />

            {/* 🗂️ MODERN VERTICAL TABS */}
            <div className="space-y-3">
              <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-black">Views</span>
              
              {/* Tab 1 */}
              <button
                onClick={() => setActiveTab("my-claims")}
                className={`w-full flex items-center justify-between p-4 rounded-xl transition-all duration-300 ${
                  activeTab === "my-claims"
                    ? "bg-slate-900 text-white shadow-xl shadow-slate-900/10"
                    : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-100"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Package size={16} className={activeTab === 'my-claims' ? 'text-blue-400' : 'text-slate-400'} />
                  <span className="font-bold text-xs uppercase tracking-wider">My Claims</span>
                </div>
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-lg ${activeTab === 'my-claims' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>
                  {claims.length}
                </span>
              </button>

              {/* Tab 2 */}
              <button
                onClick={() => setActiveTab("my-items")}
                className={`w-full flex items-center justify-between p-4 rounded-xl transition-all duration-300 ${
                  activeTab === "my-items"
                    ? "bg-slate-900 text-white shadow-xl shadow-slate-900/10"
                    : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-100"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Tag size={16} className={activeTab === 'my-items' ? 'text-blue-400' : 'text-slate-400'} />
                  <span className="font-bold text-xs uppercase tracking-wider">Reported Items</span>
                </div>
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-lg ${activeTab === 'my-items' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>
                  {reportedItems.length}
                </span>
              </button>
            </div>
          </div>

          {/* Bottom Section - Support */}
          <div className="mt-8 p-5 bg-gradient-to-br from-blue-50 to-transparent border border-blue-100/50 rounded-2xl relative overflow-hidden group">
            <div className="absolute -top-6 -right-6 opacity-[0.05] group-hover:rotate-12 transition-transform duration-700">
              <Sparkles size={80} />
            </div>
            <h4 className="text-sm font-bold text-slate-900 tracking-tight">Need assistance?</h4>
            <p className="text-xs text-slate-500 font-medium leading-relaxed mt-1">
              Connect with our support team for verification issues.
            </p>
            <button className="mt-4 w-full px-4 py-2.5 bg-white border border-blue-200 text-blue-600 rounded-xl font-bold text-xs tracking-widest uppercase hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all shadow-sm">
              Contact Admin
            </button>
          </div>
        </div>

        {/* ================= 📊 RIGHT CONTENT PANEL (Scrollable Bento Grid) ================= */}
        <div className="flex-1 h-full overflow-y-auto bg-slate-50/50 p-6 md:p-8 xl:p-10">
          
          {/* Header Action Bar */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                {activeTab === 'my-claims' ? "Active & Past Claims" : "Your Reported Items"}
              </h2>
              <p className="text-xs text-slate-400 font-medium">Manage and view detailed status logs.</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-white text-slate-600 rounded-xl border border-slate-200 hover:border-blue-300 transition-all text-xs font-bold shadow-sm">
              <Filter size={14} /> Filter List
            </button>
          </div>

          {/* --- Dynamic Content Grid --- */}
          
          {/* 1. MY CLAIMS GRID 🔥 */}
          {activeTab === "my-claims" && (
            claims.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center h-[50vh] bg-white/80 backdrop-blur border border-slate-200/60 rounded-3xl p-12">
                <Package size={50} strokeWidth={1} className="text-slate-300 mb-4" />
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">No claims found</p>
                <p className="text-xs text-slate-400 mt-1">You haven't made any claims yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">
                {claims.map((claim) => {
                  const theme = getStatusTheme(claim.status);
                  const itemInfo = claim.itemData || {}; 
                  
                  const claimStatus = claim.status ? claim.status.toLowerCase() : "";

                  return (
                    <div 
                      key={claim._id} 
                      className={`group bg-white border border-slate-200/60 rounded-2xl p-6 transition-all duration-500 flex flex-col justify-between min-h-[290px] ${
                        claimStatus === "rejected" 
                          ? "opacity-75" 
                          : "hover:shadow-2xl hover:shadow-slate-200/50 hover:-translate-y-1.5"
                      }`}
                    >
                      <div>
                        {/* Header */}
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-[10px] tracking-widest px-2.5 py-1 bg-slate-50 text-slate-600 rounded-lg font-bold border border-slate-100">
                            REF: {claim.claimId}
                          </span>
                          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-bold text-[10px] tracking-widest ${theme.badge}`}>
                             {claimStatus === "approved" || claimStatus === "verified" ? (
                               <CheckCircle2 size={10} />
                             ) : claimStatus === "rejected" ? (
                               <XCircle size={10} />
                             ) : (
                               <Clock size={10} />
                             )}
                            {claim.status?.toUpperCase()}
                          </div>
                        </div>

                        {/* Title & Image */}
                        <div className="flex gap-4 items-start mb-5">
                          <div className="w-14 h-14 shrink-0 rounded-xl overflow-hidden border border-slate-100 bg-slate-50">
                            {claim.evidenceImage || itemInfo.image_url ? (
                              <img src={claim.evidenceImage || itemInfo.image_url} alt="Item" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-blue-300 bg-blue-50">
                                <Package size={20} strokeWidth={1.5} />
                              </div>
                            )}
                          </div>
                          <div>
                            <h3 className="text-base font-bold text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors line-clamp-2">
                              {itemInfo.title || "Item Claimed"}
                            </h3>
                            <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{claim.description}</p>
                            <div className="flex items-center gap-1 text-slate-400 mt-1">
                              <Calendar size={12} />
                              <span className="text-[10px] font-bold">
                                {claim.createdAt ? new Date(claim.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : "N/A"}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Location Specs Box */}
                        <div className="p-3 bg-slate-50 rounded-xl space-y-1 mb-4 border border-slate-100/50">
                          <p className="text-[8px] uppercase font-bold text-slate-400 tracking-widest">Meeting Point</p>
                          <div className="flex items-center gap-1.5 text-slate-700">
                            <MapPin size={12} className="text-blue-500" />
                            <p className="font-bold text-xs truncate">{claim.meetingLocation}</p>
                          </div>
                        </div>
                      </div>

                      {/* 🛠️ Dynamic Action Button Based on Status */}
                      {claimStatus === "approved" || claimStatus === "verified" ? (
                        <div className="flex flex-col gap-2">
                          {/* 1. Chat with Finder Button */}
                          <button 
                            onClick={() => navigate(`/chat/${claim.claimId}`)}
                            className="w-full py-2.5 bg-blue-600 text-white rounded-xl font-bold text-xs tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 flex items-center justify-center gap-2"
                          >
                            <MessageSquare size={12} />
                            CHAT WITH FINDER
                            <ChevronRight size={12} />
                          </button>
                          
                          {/* 2. View Logs Button (අලුතින් එකතු කරපු) */}
                          <button 
                            onClick={() => navigate(`/claim-details/${claim.claimId}`)}
                            className="w-full py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-xs tracking-widest transition-all flex items-center justify-center gap-2 hover:bg-slate-50 hover:text-slate-700 hover:border-slate-300"
                          >
                            VIEW LOGS
                            <ChevronRight size={12} />
                          </button>
                        </div>
                      ) : claimStatus === "rejected" ? (
                        <button 
                          onClick={() => navigate(`/claim-details/${claim.claimId}`)}
                          className="w-full py-3 bg-white border border-slate-200 text-slate-400 rounded-xl font-bold text-xs tracking-widest transition-all flex items-center justify-center gap-2 hover:bg-slate-50 hover:text-slate-700 hover:border-slate-300"
                        >
                          VIEW LOGS
                          <ChevronRight size={12} />
                        </button>
                      ) : (
                        <button 
                          onClick={() => navigate(`/claim-details/${claim.claimId}`)}
                          className="w-full py-3 bg-white border border-slate-200 text-slate-700 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 rounded-xl font-bold text-xs tracking-widest transition-all duration-300 flex items-center justify-center gap-2"
                        >
                          VIEW LOGS
                          <ChevronRight size={12} />
                        </button>
                      )}
                    </div>
                  )
                })}
              </div>
            )
          )}

          {/* 2. MY REPORTED ITEMS GRID 🔒 */}
          {activeTab === "my-items" && (
            reportedItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center h-[50vh] bg-white/80 backdrop-blur border border-slate-200/60 rounded-3xl p-12">
                <Package size={50} strokeWidth={1} className="text-slate-300 mb-4" />
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">No items found</p>
                <p className="text-xs text-slate-400 mt-1 mb-4">You haven't reported any items yet.</p>
                <button 
                  onClick={() => navigate("/report")}
                  className="px-4 py-2.5 bg-blue-600 text-white text-xs font-bold rounded-xl flex items-center gap-1 hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all"
                >
                  <Plus size={14} /> Report an Item
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">
                {reportedItems.map((item) => {
                  const theme = getStatusTheme(item.status);
                  return (
                    <div 
                      key={item._id} 
                      className="group bg-white border border-slate-200/60 rounded-2xl p-6 transition-all duration-500 hover:shadow-2xl hover:shadow-slate-200/50 hover:-translate-y-1.5 flex flex-col justify-between min-h-[290px]"
                    >
                      <div>
                        {/* Header */}
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-[10px] tracking-widest px-2.5 py-1 bg-slate-50 text-slate-600 rounded-lg font-bold border border-slate-100">
                            ID: {item.itemId}
                          </span>
                          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-bold text-[10px] tracking-widest ${theme.badge}`}>
                             {item.status === 'found' ? <CheckCircle2 size={10} /> : <XCircle size={10} />}
                            {item.status?.toUpperCase()}
                          </div>
                        </div>

                        {/* Title & Image */}
                        <div className="flex gap-4 items-start mb-5">
                          <div className="w-14 h-14 shrink-0 rounded-xl overflow-hidden border border-slate-100 bg-slate-50">
                            {item.image_url ? (
                              <img src={item.image_url} alt="Item" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-blue-300 bg-blue-50">
                                <Package size={20} strokeWidth={1.5} />
                              </div>
                            )}
                          </div>
                          <div>
                            <h3 className="text-base font-bold text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors line-clamp-2">
                              {item.title}
                            </h3>
                            <div className="flex items-center gap-1.5 mt-1">
                              <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-50 text-amber-600 rounded-md flex items-center gap-1">
                                <Tag size={10} /> {item.category}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Specs Box */}
                        <div className="p-3 bg-slate-50 rounded-xl grid grid-cols-2 gap-2 mb-4 border border-slate-100/50">
                          <div>
                            <p className="text-[8px] uppercase font-bold text-slate-400 tracking-widest">Location</p>
                            <p className="font-bold text-xs text-slate-700 truncate">{item.location}</p>
                          </div>
                          <div>
                            <p className="text-[8px] uppercase font-bold text-slate-400 tracking-widest">Reported On</p>
                            <p className="font-bold text-xs text-slate-700">
                              {item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : "N/A"}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Action Button */}
                      <button 
                        onClick={() => navigate(`/items/${item.itemId}`)}
                        className="w-full py-3 bg-white border border-slate-200 text-slate-700 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 rounded-xl font-bold text-xs tracking-widest transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        VIEW ITEM
                        <ChevronRight size={12} />
                      </button>
                    </div>
                  )
                })}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default ClaimHistory;