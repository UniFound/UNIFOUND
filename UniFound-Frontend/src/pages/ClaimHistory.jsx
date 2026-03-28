import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Package, Clock, CheckCircle2, XCircle, MapPin, 
  Calendar, RefreshCw, ArrowLeft,
  ChevronRight, Filter, Sparkles
} from "lucide-react";
import Navbar from "../components/Navbar";

const ClaimHistory = () => {
  const mockClaims = [
    {
      _id: "1",
      claimId: "CLM-8821",
      itemId: "ITM-001",
      description: "My blue Nike backpack with a laptop inside",
      meetingLocation: "Main Library - 2nd Floor",
      status: "Approved",
      createdAt: "2024-03-15T10:00:00Z",
      evidenceImage: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80"
    },
    {
      _id: "2",
      claimId: "CLM-9042",
      itemId: "ITM-045",
      description: "Silver Apple Watch with a black sports band",
      meetingLocation: "Student Canteen",
      status: "Pending",
      createdAt: "2024-03-20T14:30:00Z",
      evidenceImage: null
    },
    {
      _id: "3",
      claimId: "CLM-7712",
      itemId: "ITM-102",
      description: "Samsung Galaxy S23 with a clear case",
      meetingLocation: "IT Faculty Office",
      status: "Rejected",
      createdAt: "2024-03-10T08:15:00Z",
      evidenceImage: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&q=80"
    }
  ];

  const [claims, setClaims] = useState(mockClaims || []);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchClaims = useCallback(async () => {
    setLoading(true);
    setTimeout(() => {
      setClaims(mockClaims);
      setLoading(false);
    }, 1200);
  }, []);

  // Card ekata ena theme colors (Light Pastel backgrounds)
  const getStatusTheme = (status) => {
    switch (status) {
      case "Approved": 
        return {
          cardBg: "bg-emerald-50/60", 
          borderColor: "border-emerald-100",
          accent: "text-emerald-600",
          badge: "bg-emerald-100 text-emerald-700"
        };
      case "Rejected": 
        return {
          cardBg: "bg-rose-50/60", 
          borderColor: "border-rose-100",
          accent: "text-rose-600",
          badge: "bg-rose-100 text-rose-700"
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
    <div className="min-h-screen bg-[#F8FAFC] selection:bg-blue-100 text-slate-600 font-sans overflow-x-hidden">
      <Navbar />
      
      {/* Subtle Background Glows */}
      <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden pointer-events-none opacity-40">
        <div className="absolute top-[-10%] left-[-5%] w-[50%] h-[50%] bg-blue-100 blur-[120px] rounded-full" />
        <div className="absolute bottom-[0%] right-[-5%] w-[40%] h-[40%] bg-indigo-50 blur-[100px] rounded-full" />
      </div>

      <div className="max-w-6xl mx-auto pt-36 pb-24 px-6 md:px-12 space-y-16">
        
        {/* Top Nav */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-3 text-slate-500 hover:text-blue-600 transition-all group w-fit"
          >
            <div className="p-2 bg-white rounded-2xl shadow-sm border border-slate-200 group-hover:shadow-md transition-all">
              <ArrowLeft size={16} />
            </div>
            <span className="tracking-widest text-[11px] uppercase font-bold">Return to panel</span>
          </button>
          
          <div className="flex items-center gap-3">
             <button className="flex items-center gap-2 px-4 py-2.5 bg-white text-slate-500 rounded-2xl border border-slate-200 hover:border-blue-300 transition-all text-xs font-bold shadow-sm">
                <Filter size={14} /> Filter
             </button>
             <button 
              onClick={fetchClaims}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-2xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 text-xs font-bold disabled:opacity-50"
            >
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
              {loading ? "Syncing..." : "Sync History"}
            </button>
          </div>
        </div>

        {/* Hero Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
             <div className="h-[2px] w-8 bg-blue-500" />
             <span className="text-[10px] uppercase tracking-[0.3em] text-blue-500 font-black">History Log</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-light text-slate-900 tracking-tight leading-tight">
            Track your <span className="font-bold">claims</span>.
          </h1>
        </div>

        {/* --- Claims List --- */}
        <div className="space-y-8">
          {claims.map((claim) => {
            const theme = getStatusTheme(claim.status);
            return (
              <div 
                key={claim._id} 
                className={`group ${theme.cardBg} border-2 ${theme.borderColor} rounded-[3rem] p-6 md:p-10 transition-all duration-500 hover:shadow-2xl hover:shadow-slate-200/50 hover:-translate-y-1`}
              >
                <div className="flex flex-col md:flex-row items-center gap-10">
                  {/* Image Container */}
                  <div className="shrink-0 relative">
                    <div className="w-32 h-32 md:w-44 md:h-44 rounded-[2.5rem] bg-white overflow-hidden shadow-inner border-4 border-white relative z-10">
                      {claim.evidenceImage ? (
                        <img src={claim.evidenceImage} alt="Item" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-200 bg-slate-50">
                          <Package size={48} strokeWidth={1} />
                        </div>
                      )}
                    </div>
                    {/* Subtle glow behind image */}
                    <div className={`absolute inset-0 blur-3xl opacity-20 ${theme.accent} -z-10`} />
                  </div>

                  {/* Info Section */}
                  <div className="flex-1 space-y-6 text-center md:text-left">
                    <div className="flex flex-wrap justify-center md:justify-start items-center gap-4">
                      <span className="text-[10px] tracking-widest px-4 py-1.5 bg-white text-slate-900 rounded-full font-black shadow-sm border border-slate-50">
                        REF: {claim.claimId}
                      </span>
                      <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full font-black text-[10px] tracking-widest shadow-sm ${theme.badge}`}>
                         {claim.status === "Approved" ? <CheckCircle2 size={12} /> : claim.status === "Rejected" ? <XCircle size={12} /> : <Clock size={12} />}
                        {claim.status?.toUpperCase()}
                      </div>
                    </div>
                    
                    <h3 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight leading-tight group-hover:text-blue-600 transition-colors">
                      {claim.description}
                    </h3>

                    <div className="flex flex-wrap justify-center md:justify-start items-center gap-x-10 gap-y-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white rounded-xl shadow-sm text-blue-500">
                          <MapPin size={18} />
                        </div>
                        <div>
                          <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Location</p>
                          <p className="text-slate-800 font-bold">{claim.meetingLocation}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white rounded-xl shadow-sm text-slate-400">
                          <Calendar size={18} />
                        </div>
                        <div>
                          <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Request Date</p>
                          <p className="text-slate-800 font-bold">
                            {claim.createdAt ? new Date(claim.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button 
                    onClick={() => navigate(`/claim-details/${claim.claimId}`)}
                    className="w-full md:w-auto px-10 py-5 bg-white text-slate-900 rounded-[2rem] font-black text-xs tracking-widest hover:bg-slate-900 hover:text-white transition-all duration-300 shadow-sm border border-slate-100 flex items-center justify-center gap-3 group/btn"
                  >
                    VIEW LOGS
                    <ChevronRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Support Section */}
        <div className="p-12 bg-white border border-slate-100 rounded-[4rem] text-center space-y-6 shadow-sm relative overflow-hidden group">
           <div className="absolute -top-10 -right-10 opacity-[0.03] group-hover:rotate-12 transition-transform duration-1000">
             <Sparkles size={250} />
           </div>
           <h4 className="text-2xl font-bold text-slate-900 tracking-tight relative z-10">
             Having trouble with your verification?
           </h4>
           <p className="text-slate-500 font-medium max-w-lg mx-auto relative z-10 leading-relaxed text-lg">
             Our administrators are ready to help. Reach out to the <span className="text-blue-600 font-bold cursor-pointer hover:underline">Support Center</span> for assistance.
           </p>
           <button className="relative z-10 px-8 py-3.5 bg-slate-900 text-white rounded-2xl font-bold text-xs tracking-widest uppercase hover:shadow-2xl transition-all">
             Contact Support Team
           </button>
        </div>

      </div>
    </div>
  );
};

export default ClaimHistory;