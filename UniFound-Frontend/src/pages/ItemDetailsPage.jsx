"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Calendar, Tag, Palette, ShieldCheck, Sparkles, ChevronRight, Info, Mail, Phone, ExternalLink } from "lucide-react";
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

  // 1. Fetch Current Item
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

  // 2. Fetch Matching Items (Algorithm)
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
        <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );

  if (!item)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAFC] text-slate-500 font-medium">
        Item not found.
      </div>
    );

  return (
    <div className="min-h-screen bg-[#FAFAFC] font-sans flex flex-col justify-between">
      {/* 1. NAVIGATION BAR */}
      <Navbar />

      {/* MAIN CONTENT AREA */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 pt-24 pb-16 flex-grow">
        
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)}
          className="group flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors mb-6 font-bold text-sm uppercase tracking-wider"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Listings
        </button>

        {/* 2. HERO / MAIN ITEM SECTION */}
        <div className="bg-white rounded-3xl shadow-[0_10px_40px_-15px_rgba(0,0,0,0.03)] border border-slate-100 overflow-hidden flex flex-col lg:flex-row gap-8 p-6 lg:p-8 mb-12">
          
          {/* Image Sub-Section */}
          <div className="lg:w-5/12 relative group">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/5 to-transparent z-10 rounded-2xl" />
            <img
              src={item.image_url}
              alt={item.title}
              className="w-full h-[350px] lg:h-[450px] object-cover rounded-2xl shadow-inner transition-transform duration-700 group-hover:scale-[1.01]"
            />
            <div className="absolute top-4 left-4 z-20">
              <span className={`px-4 py-1.5 rounded-full font-bold text-xs uppercase tracking-wider shadow-lg text-white ${
                item.status === 'lost' ? 'bg-blue-600' : 'bg-emerald-500'
              }`}>
                {item.status}
              </span>
            </div>
          </div>

          {/* Details & Actions Sub-Section */}
          <div className="lg:w-7/12 flex flex-col justify-between py-2">
            <div className="space-y-6">
              <div>
                <p className="text-blue-600 font-bold text-xs uppercase tracking-[0.2em] mb-1">Item Details</p>
                <h2 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">{item.title}</h2>
              </div>

              <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-100">
                <p className="text-slate-600 text-base leading-relaxed">
                  {item.description || "No description provided for this item."}
                </p>
              </div>

              {/* 3. ITEM SPECIFICATION SECTION */}
              <div className="grid grid-cols-2 gap-y-5 gap-x-4 pt-2">
                <DetailItem icon={<Tag size={16}/>} label="Category" value={item.category} />
                <DetailItem icon={<Palette size={16}/>} label="Color" value={item.color} />
                <DetailItem icon={<MapPin size={16}/>} label="Location" value={item.location} />
                <DetailItem icon={<Calendar size={16}/>} label="Reported Date" value={new Date(item.createdAt).toLocaleDateString()} />
              </div>
            </div>

            {/* 4. ACTION SECTION */}
            <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t border-slate-100">
              <button
                onClick={() => setShowClaimModal(true)}
                className="flex-[2] bg-blue-600 text-white py-4 rounded-xl font-bold text-sm uppercase tracking-wider shadow-lg shadow-blue-100 hover:bg-blue-700 hover:shadow-blue-200 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <ShieldCheck size={18} />
                This is Mine
              </button>
              
              <div className="flex items-center justify-center px-5 py-2 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">ID: {item.itemId}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 5. SMART SUGGESTIONS SECTION (ALGORITHM) */}
        <div className="mt-16">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles size={18} className="text-blue-600 fill-blue-600" />
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Suggested Matching Items</h2>
              </div>
              <p className="text-sm text-slate-500 font-medium">අපේ පද්ධතිය මඟින් මේ භාණ්ඩයට ගැලපෙන බවට හඳුනාගත් දේවල් මෙන්න.</p>
            </div>
          </div>

          {loadingMatches ? (
            <div className="text-center py-12 text-slate-500 font-medium">ගැලපෙන භාණ්ඩ සොයමින් පවතී... 🔍</div>
          ) : matches.length === 0 ? (
            <div className="text-center py-10 text-amber-700 bg-amber-50/50 border border-amber-100 rounded-2xl text-sm font-medium flex flex-col items-center gap-2">
              <Info size={20} className="text-amber-600" />
              කණගාටුයි, මෙයට ගැලපෙන වෙනත් කිසිදු භාණ්ඩයක් පද්ධතියේ නැත.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {matches.map((matchObj, index) => {
                const { item: matchedItem, matchPercentage } = matchObj;
                return (
                  <div key={index} className="group bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-[0_4px_20px_-10px_rgba(0,0,0,0.03)] hover:shadow-[0_15px_30px_-10px_rgba(0,0,0,0.06)] transition-all duration-300 flex flex-col justify-between">
                    
                    {/* Card Image Area */}
                    <div className="h-44 overflow-hidden bg-gray-50 relative">
                      <img 
                        src={matchedItem.image_url} 
                        alt={matchedItem.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {/* Score Badge */}
                      <div className={`absolute top-3 right-3 text-xs font-bold px-2.5 py-1 rounded-full text-white ${
                        matchPercentage >= 80 ? 'bg-emerald-500' : 'bg-blue-600'
                      }`}>
                        {matchPercentage}% Match
                      </div>
                    </div>

                    {/* Card Content Area */}
                    <div className="p-4 flex-grow flex flex-col justify-between">
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm mb-1 line-clamp-1">{matchedItem.title}</h3>
                        <p className="text-xs text-slate-500 line-clamp-2 mb-3 font-medium">{matchedItem.description || "No description provided."}</p>
                        
                        <div className="text-[11px] text-slate-400 font-bold space-y-1">
                          <div className="flex items-center gap-1">
                            <MapPin size={11} className="text-slate-300" />
                            <span>{matchedItem.location}</span>
                          </div>
                        </div>
                      </div>

                      {/* View Action */}
                      <button 
                        onClick={() => navigate(`/items/${matchedItem.itemId}`)}
                        className="w-full mt-4 text-xs font-bold py-2.5 px-3 border border-slate-100 hover:border-blue-600 hover:bg-blue-50 text-slate-600 hover:text-blue-600 rounded-xl transition-all flex items-center justify-center gap-1 group/btn"
                      >
                        View Details
                        <ChevronRight size={12} className="group-hover/btn:translate-x-0.5 transition-transform" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* TRUST NOTE */}
        <p className="mt-12 text-center text-slate-400 text-xs font-medium italic">
          Please ensure you provide proper proof of ownership when claiming an item.
        </p>

        {/* Claim Modal */}
        {showClaimModal && <ClaimFormModal item={item} onClose={() => setShowClaimModal(false)} />}
      </div>

      {/* 6. FOOTER SECTION */}
      <Footer/>
    </div>
  );
}

// Helper Component for Info Grid
function DetailItem({ icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</p>
        <p className="text-slate-800 font-bold text-sm">{value || "N/A"}</p>
      </div>
    </div>
  );
}