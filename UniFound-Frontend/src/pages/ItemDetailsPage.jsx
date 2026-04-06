"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, MapPin, Calendar, Tag, Palette, ShieldCheck, 
  Sparkles, ChevronRight, Info, Search, CheckCircle2 
} from "lucide-react";
import api from "../api/axios.js";
import Navbar from "../components/Navbar.jsx";
import ClaimFormModal from "../components/ClaimFormModal.jsx";
import Footer from "../components/Footer.jsx";

export default function ItemDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showClaimModal, setShowClaimModal] = useState(false);

  // Auto-Match State
  const [matches, setMatches] = useState([]);
  const [loadingMatches, setLoadingMatches] = useState(true);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const { data } = await api.get(`/items/${id}`);
        setItem(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id]);

  useEffect(() => {
    const fetchMatchingItems = async () => {
      if (!item || !item.itemId) return;
      try {
        setLoadingMatches(true);
        const response = await api.get(`/items/auto-match/${item.itemId}`);
        if (response.data.success) {
          setMatches(response.data.matches);
        }
      } catch (error) {
        console.error("Error fetching matches:", error);
      } finally {
        setLoadingMatches(false);
      }
    };
    fetchMatchingItems();
  }, [item]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAFC]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
          <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Loading details...</p>
        </div>
      </div>
    );

  if (!item)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAFAFC] text-slate-500">
        <Info size={48} className="mb-4 text-slate-300" />
        <h1 className="text-xl font-black uppercase tracking-tight">Item not found</h1>
        <button onClick={() => navigate('/browse')} className="mt-4 text-blue-600 font-bold text-sm underline">Back to Browse</button>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#FAFAFC] font-sans flex flex-col justify-between">
      <Navbar />

      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 pt-28 pb-16 flex-grow">
        
        {/* Navigation Breadcrumb */}
        <button 
          onClick={() => navigate(-1)}
          className="group flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-all mb-8 font-bold text-[10px] uppercase tracking-[0.2em]"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Back to Listings
        </button>

        {/* MAIN ITEM CARD */}
        <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_-20px_rgba(0,0,0,0.05)] border border-slate-100 overflow-hidden flex flex-col lg:flex-row gap-0 lg:gap-4 p-4 mb-20">
          
          {/* Image sub-section */}
          <div className="lg:w-1/2 relative">
            <img
              src={item.image_url}
              alt={item.title}
              className="w-full h-[400px] lg:h-[550px] object-cover rounded-[2rem]"
            />
            <div className="absolute top-6 left-6 flex gap-2">
              <span className={`px-5 py-2 rounded-full font-black text-[10px] uppercase tracking-widest shadow-xl text-white ${
                item.status === 'lost' ? 'bg-blue-600' : 'bg-emerald-500'
              }`}>
                {item.status}
              </span>
            </div>
          </div>

          {/* Details sub-section */}
          <div className="lg:w-1/2 flex flex-col p-8 lg:p-12">
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-px w-8 bg-blue-600"></div>
                <p className="text-blue-600 font-bold text-[10px] uppercase tracking-[0.3em]">Verified Entry</p>
              </div>
              <h2 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-none mb-6 italic uppercase">
                {item.title}
              </h2>
              <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
                <p className="text-slate-500 text-sm leading-relaxed font-medium">
                  {item.description || "No detailed description provided by the reporter."}
                </p>
              </div>
            </div>

            {/* Specification Grid */}
            <div className="grid grid-cols-2 gap-8 mb-12">
              <DetailItem icon={<Tag size={16}/>} label="Category" value={item.category} />
              <DetailItem icon={<Palette size={16}/>} label="Color Theme" value={item.color} />
              <DetailItem icon={<MapPin size={16}/>} label="Last Seen" value={item.location} />
              <DetailItem icon={<Calendar size={16}/>} label="Timestamp" value={new Date(item.createdAt).toDateString()} />
            </div>

            {/* Main Action Call */}
            <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-slate-50 mt-auto">
              <button
                onClick={() => setShowClaimModal(true)}
                className="flex-[3] bg-slate-900 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-slate-200 hover:bg-blue-600 transition-all active:scale-[0.98] flex items-center justify-center gap-3 group"
              >
                <ShieldCheck size={18} className="group-hover:rotate-12 transition-transform" />
                Initialize Claim Process
              </button>
              
              <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 rounded-2xl border border-slate-100 py-4">
                <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">Record ID</span>
                <span className="text-xs font-bold text-slate-600">{item.itemId}</span>
              </div>
            </div>
          </div>
        </div>

        {/* AI SUGGESTIONS SECTION */}
        <div className="relative">
          <div className="flex flex-col mb-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-600 rounded-lg text-white shadow-lg shadow-blue-200">
                <Sparkles size={20} fill="currentColor" />
              </div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">Smart Matches</h2>
            </div>
            <p className="text-slate-400 text-sm font-bold tracking-tight">Our algorithm identified these potentially related items based on metadata.</p>
          </div>

          {loadingMatches ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[2rem] border border-dashed border-slate-200">
              <Search className="text-blue-600 animate-pulse mb-4" size={32} />
              <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest">Scanning Database...</p>
            </div>
          ) : matches.length === 0 ? (
            <div className="bg-slate-100/50 rounded-[2rem] p-12 text-center border border-slate-200">
              <p className="text-slate-400 font-bold text-sm">No high-probability matches found at this time.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {matches.map((matchObj, index) => {
                const { item: matchedItem, matchPercentage } = matchObj;
                return (
                  <div key={index} className="group bg-white rounded-3xl overflow-hidden border border-slate-100 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 flex flex-col">
                    <div className="h-48 overflow-hidden relative">
                      <img 
                        src={matchedItem.image_url} 
                        alt={matchedItem.title} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="bg-black/40 backdrop-blur-md p-2 rounded-xl flex items-center justify-between border border-white/20">
                           <span className="text-white font-black text-[10px] uppercase tracking-widest">Confidence</span>
                           <span className="text-emerald-400 font-black text-[10px]">{matchPercentage}%</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 flex-grow flex flex-col">
                      <h3 className="font-black text-slate-900 text-sm mb-2 uppercase tracking-tight line-clamp-1">{matchedItem.title}</h3>
                      <div className="flex items-center gap-2 text-slate-400 font-bold text-[10px] mb-6">
                        <MapPin size={12} />
                        {matchedItem.location}
                      </div>

                      <button 
                        onClick={() => navigate(`/items/${matchedItem.itemId}`)}
                        className="w-full mt-auto py-3 bg-slate-50 group-hover:bg-blue-600 group-hover:text-white text-slate-600 font-black text-[9px] uppercase tracking-[0.2em] rounded-xl transition-all flex items-center justify-center gap-2"
                      >
                        Inspect Item
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="mt-24 py-8 border-t border-slate-100 flex flex-col items-center">
            <CheckCircle2 size={24} className="text-blue-200 mb-3" />
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">Secure Claims Protocol Active</p>
        </div>

        {showClaimModal && <ClaimFormModal item={item} onClose={() => setShowClaimModal(false)} />}
      </div>

      <Footer/>
    </div>
  );
}

function DetailItem({ icon, label, value }) {
  return (
    <div className="flex items-start gap-4">
      <div className="p-3 bg-white shadow-sm border border-slate-50 text-blue-600 rounded-2xl transition-transform hover:scale-110">
        {icon}
      </div>
      <div>
        <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-0.5">{label}</p>
        <p className="text-slate-900 font-black text-sm uppercase tracking-tight leading-none">{value || "Unspecified"}</p>
      </div>
    </div>
  );
}