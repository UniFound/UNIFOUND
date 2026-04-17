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

// Note: Ensure 'Inter' font is imported in your global CSS or index.html
// @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

export default function ItemDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showClaimModal, setShowClaimModal] = useState(false);

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
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-[3px] border-slate-200 border-t-blue-600 rounded-full animate-spin" />
          <p className="text-slate-500 font-medium text-sm tracking-tight">Loading details...</p>
        </div>
      </div>
    );

  if (!item)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC] text-slate-600">
        <Info size={40} className="mb-4 text-slate-300" />
        <h1 className="text-xl font-semibold tracking-tight">Item not found</h1>
        <button onClick={() => navigate('/browse')} className="mt-4 text-blue-600 font-medium text-sm hover:underline">Back to Browse</button>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-['Inter',_sans-serif] flex flex-col justify-between">
      <Navbar />

      <div className="max-w-7xl mx-auto w-full px-6 pt-32 pb-16 flex-grow">
        
        {/* Navigation Breadcrumb */}
        <button 
          onClick={() => navigate(-1)}
          className="group flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-all mb-8 font-semibold text-xs uppercase tracking-wider"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Listings
        </button>

        {/* MAIN ITEM CARD */}
        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200/60 overflow-hidden flex flex-col lg:flex-row p-5 mb-20">
          
          {/* Image sub-section */}
          <div className="lg:w-5/12 relative">
            <img
              src={item.image_url}
              alt={item.title}
              className="w-full h-[450px] lg:h-[550px] object-cover rounded-[1.5rem]"
            />
            <div className="absolute top-5 left-5">
              <span className={`px-4 py-1.5 rounded-lg font-bold text-[11px] uppercase tracking-wider shadow-sm text-white ${
                item.status === 'lost' ? 'bg-blue-600' : 'bg-emerald-500'
              }`}>
                {item.status}
              </span>
            </div>
          </div>

          {/* Details sub-section */}
          <div className="lg:w-7/12 flex flex-col p-8 lg:p-12">
            <div className="mb-10">
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-md font-bold text-[10px] uppercase tracking-widest border border-blue-100">
                  Verified Entry
                </span>
              </div>
              <h2 className="text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6">
                {item.title}
              </h2>
              <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                <p className="text-slate-600 text-[15px] leading-relaxed font-normal">
                  {item.description || "No detailed description provided by the reporter."}
                </p>
              </div>
            </div>

            {/* Specification Grid */}
            <div className="grid grid-cols-2 gap-y-10 gap-x-4 mb-12">
              <DetailItem icon={<Tag size={18}/>} label="Category" value={item.category} />
              <DetailItem icon={<Palette size={18}/>} label="Color Theme" value={item.color} />
              <DetailItem icon={<MapPin size={18}/>} label="Location" value={item.location} />
              <DetailItem icon={<Calendar size={18}/>} label="Found Date" value={new Date(item.createdAt).toLocaleDateString()} />
            </div>

            {/* Main Action Call */}
            <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-slate-100 mt-auto">
              <button
                onClick={() => setShowClaimModal(true)}
                className="flex-[3] bg-[#1E293B] text-white py-4.5 rounded-xl font-bold text-sm tracking-tight shadow-lg hover:bg-blue-600 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
              >
                <ShieldCheck size={18} />
                Initialize Claim Process
              </button>
              
              <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 rounded-xl border border-slate-100 py-3">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Record ID</span>
                <span className="text-[13px] font-bold text-slate-700">#{item.itemId?.slice(-6).toUpperCase()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* AI SUGGESTIONS SECTION */}
        <div className="relative">
          <div className="flex flex-col mb-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-600 rounded-lg text-white">
                <Sparkles size={18} fill="currentColor" />
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Smart Matches</h2>
            </div>
            <p className="text-slate-500 text-[14px] font-medium">Based on your record, our system found these high-probability matches.</p>
          </div>

          {loadingMatches ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-200">
              <Search className="text-blue-600 animate-pulse mb-3" size={28} />
              <p className="text-slate-400 font-semibold text-xs uppercase tracking-widest">Scanning Registry...</p>
            </div>
          ) : matches.length === 0 ? (
            <div className="bg-slate-50 rounded-3xl p-12 text-center border border-slate-200/60">
              <p className="text-slate-500 font-medium text-sm">No high-probability matches found at this time.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {matches.map((matchObj, index) => {
                const { item: matchedItem, matchPercentage } = matchObj;
                return (
                  <div key={index} className="group bg-white rounded-2xl overflow-hidden border border-slate-200 hover:shadow-xl transition-all duration-300 flex flex-col">
                    <div className="h-44 overflow-hidden relative">
                      <img 
                        src={matchedItem.image_url} 
                        alt={matchedItem.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 right-3">
                        <div className="bg-white/90 backdrop-blur px-2.5 py-1 rounded-lg border border-white shadow-sm">
                           <span className="text-blue-600 font-bold text-[11px]">{matchPercentage}% Match</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-5 flex-grow flex flex-col">
                      <h3 className="font-bold text-slate-900 text-[15px] mb-1 tracking-tight line-clamp-1">{matchedItem.title}</h3>
                      <div className="flex items-center gap-1.5 text-slate-500 font-medium text-[12px] mb-5">
                        <MapPin size={14} className="text-slate-400" />
                        {matchedItem.location}
                      </div>

                      <button 
                        onClick={() => {
                            navigate(`/items/${matchedItem.itemId}`);
                            window.scrollTo(0, 0);
                        }}
                        className="w-full mt-auto py-2.5 bg-slate-50 group-hover:bg-blue-600 group-hover:text-white text-slate-600 font-bold text-[12px] rounded-lg transition-all flex items-center justify-center gap-2"
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

        <div className="mt-24 py-8 border-t border-slate-200 flex flex-col items-center">
            <p className="text-slate-400 text-[11px] font-semibold uppercase tracking-[0.2em]">UniFound Secure Claims Protocol</p>
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
      <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl border border-blue-100">
        {icon}
      </div>
      <div>
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">{label}</p>
        <p className="text-slate-900 font-bold text-[15px] tracking-tight">{value || "Unspecified"}</p>
      </div>
    </div>
  );
}