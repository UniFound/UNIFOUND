"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Calendar, Tag, Box, Palette, ShieldCheck } from "lucide-react";
import api from "../api/axios.js";
import Navbar from "../components/Navbar.jsx";
import ClaimFormModal from "../components/ClaimFormModal.jsx";


export default function ItemDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
   const [showClaimModal, setShowClaimModal] = useState(false);

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

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFDFF]">
        <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );

  if (!item)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFDFF] text-slate-500 font-medium">
        Item not found.
      </div>
    );

  return (
    <div className="min-h-screen bg-[#FDFDFF] font-sans">
      <Navbar />

      <div className="max-w-5xl mx-auto px-6 pt-32 pb-16">
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)}
          className="group flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-colors mb-8 font-bold text-sm uppercase tracking-widest"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Back to Listings
        </button>

        <div className="bg-white rounded-[45px] shadow-[0_30px_100px_-20px_rgba(0,0,0,0.04)] border border-slate-50 overflow-hidden flex flex-col md:flex-row gap-8 p-4 md:p-6">
          
          {/* LEFT: IMAGE SECTION */}
          <div className="md:w-1/2 relative group">
            <div className="absolute inset-0 bg-blue-600/5 group-hover:bg-transparent transition-colors z-10 rounded-[35px]" />
            <img
              src={item.image_url}
              alt={item.title}
              className="w-full h-[400px] md:h-full object-cover rounded-[35px] shadow-inner transition-transform duration-700 group-hover:scale-[1.02]"
            />
            <div className="absolute top-6 left-6 z-20">
              <span className={`px-5 py-2 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl backdrop-blur-md ${
                item.status === 'lost' ? 'bg-blue-600 text-white' : 'bg-emerald-500 text-white'
              }`}>
                {item.status}
              </span>
            </div>
          </div>

          {/* RIGHT: CONTENT SECTION */}
          <div className="md:w-1/2 flex flex-col justify-between p-4 md:p-8">
            <div className="space-y-6">
              <div>
                <p className="text-blue-600 font-black text-xs uppercase tracking-[0.2em] mb-2">Item Details</p>
                <h2 className="text-4xl font-black text-slate-900 tracking-tight leading-tight">{item.title}</h2>
              </div>

              <p className="text-slate-500 text-lg leading-relaxed font-medium">
                {item.description || "No description provided for this item."}
              </p>

              <div className="grid grid-cols-2 gap-y-6 gap-x-4 pt-4 border-t border-slate-50">
                <DetailItem icon={<Tag size={18}/>} label="Category" value={item.category} />
                <DetailItem icon={<Palette size={18}/>} label="Color" value={item.color} />
                <DetailItem icon={<MapPin size={18}/>} label="Location" value={item.location} />
                <DetailItem icon={<Calendar size={18}/>} label="Reported" value={new Date(item.createdAt).toLocaleDateString()} />
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex flex-col sm:flex-row gap-4 mt-12">
              <button
                onClick={() => setShowClaimModal(true)}
                className="flex-[2] bg-blue-600 text-white py-5 rounded-[22px] font-black text-sm uppercase tracking-widest shadow-xl shadow-blue-200 hover:bg-blue-700 hover:shadow-blue-300 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <ShieldCheck size={20} />
                This is Mine
                
              </button>
              <div className="flex items-center justify-center px-4 py-2 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">ID: {item.itemId}</span>
              </div>
            </div>
          </div>
        </div>
        

        {/* TRUST NOTE */}
        <p className="mt-8 text-center text-slate-400 text-xs font-medium italic">
          Please ensure you provide proper proof of ownership when claiming an item.
        </p>

        {/* Claim Modal */}
      {showClaimModal && <ClaimFormModal item={item} onClose={() => setShowClaimModal(false)} />}
      </div>
    </div>
  );
}

// Helper Component for Info Grid
function DetailItem({ icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <div className="p-2.5 bg-slate-50 text-blue-600 rounded-xl">
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
        <p className="text-slate-900 font-bold text-sm">{value || "N/A"}</p>
      </div>
    </div>
  );
}