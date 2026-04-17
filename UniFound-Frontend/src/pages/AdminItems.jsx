"use client";

import React, { useState, useEffect, useCallback } from "react";
import api from "../api/axios.js";
import { Toaster, toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, MapPin, Trash2, Plus, CheckCircle, Loader2, X, 
  ShieldCheck, ArrowRight, Clock, Database, Edit3, Tag, 
  Filter, Layers, ChevronRight
} from "lucide-react";

import AdminAddItems from "./AdminAddItems"; 

// ප්‍රධාන වෙනස්කම්: 
// 1. font-black -> font-bold/font-extrabold ලෙස වඩාත් පිරිසිදු කර ඇත.
// 2. Tracking (අකුරු අතර පරතරය) නිවැරදි කර ඇත.
// 3. Inter font එකට අදාළව spacing සකසා ඇත.

export default function AdminItems() {
  const [activeTab, setActiveTab] = useState("pending");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const endpoint = activeTab === "pending" ? "/items/admin/pending" : "/items";
      const res = await api.get(endpoint);
      setItems(res.data.data || []);
    } catch (err) {
      toast.error("Network synchronization failed.");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleApprove = async (itemId) => {
    const t = toast.loading("Approving item...");
    try {
      await api.patch(`/items/admin/approve/${itemId}`);
      setItems(prev => prev.filter(i => i._id !== itemId));
      setSelectedItem(null);
      toast.success("Item verified and live", { id: t });
    } catch (err) { 
      toast.error("Approval failed", { id: t }); 
    }
  };

  const handleDelete = async (item) => {
    if (!window.confirm("Delete this record permanently?")) return;
    const t = toast.loading("Removing...");
    try {
      await api.delete(`/items/${item._id}`);
      setItems(prev => prev.filter(i => i._id !== item._id));
      setSelectedItem(null);
      toast.success("Record purged", { id: t });
    } catch (err) { 
      toast.error("Action failed", { id: t }); 
    }
  };

  const filteredItems = items.filter(i => 
    (i.title?.toLowerCase() || "").includes(searchQuery.toLowerCase()) || 
    (i.itemId?.toLowerCase() || "").includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-['Inter',_sans-serif] selection:bg-blue-100">
      <Toaster position="top-right" />

      {/* Navigation */}
      <nav className="sticky top-0 z-[60] bg-white/80 backdrop-blur-2xl border-b border-slate-200/60 px-8 py-4">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-lg">
              <Layers size={20} />
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight text-slate-900 leading-none">UNI<span className="text-blue-600">FOUND</span></h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1 mt-1">
                <ShieldCheck size={11} className="text-blue-500"/> System Admin
              </p>
            </div>
          </div>
          
          <button 
            onClick={() => { setIsEditing(false); setIsModalOpen(true); }} 
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs transition-all shadow-md"
          >
            <Plus size={16} strokeWidth={3} /> New Record
          </button>
        </div>
      </nav>

      <main className="max-w-[1600px] w-full mx-auto p-6 lg:p-10 space-y-10">
        
        {/* Metric Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { label: "Pending Review", val: activeTab === 'pending' ? items.length : '--', icon: Clock, color: "text-amber-500", bg: "bg-amber-50" },
            { label: "Verified Assets", val: activeTab === 'approved' ? items.length : '--', icon: CheckCircle, color: "text-blue-600", bg: "bg-blue-50" },
            { label: "Database Health", val: "Optimal", icon: Database, color: "text-emerald-500", bg: "bg-emerald-50" }
          ].map((stat, idx) => (
            <div key={idx} className="bg-white p-7 rounded-[2rem] border border-slate-200/50 shadow-sm flex items-center gap-6">
              <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center`}>
                <stat.icon size={26}/>
              </div>
              <div>
                <p className="text-slate-400 text-[11px] font-bold uppercase tracking-widest">{stat.label}</p>
                <p className="text-3xl font-extrabold text-slate-800 mt-1">{stat.val}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-2 rounded-2xl border border-slate-200/50 shadow-sm">
          <div className="flex p-1 bg-slate-100/80 rounded-xl">
            {["pending", "approved"].map((tab) => (
              <button 
                key={tab} 
                onClick={() => setActiveTab(tab)} 
                className={`px-10 py-2.5 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all ${activeTab === tab ? "bg-slate-900 text-white shadow-lg" : "text-slate-400 hover:text-slate-600"}`}
              >
                {tab}
              </button>
            ))}
          </div>
          
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search by Title or ID..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-6 py-3 bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-xl font-semibold text-sm outline-none transition-all" 
            />
          </div>
        </div>

        {/* Main Table View */}
        <div className="bg-white rounded-[2rem] border border-slate-200/60 shadow-xl overflow-hidden relative">
          {loading && <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-20 flex items-center justify-center"><Loader2 className="animate-spin text-blue-600" /></div>}
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Asset Information</th>
                  <th className="px-6 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Category</th>
                  <th className="px-6 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Current Status</th>
                  <th className="px-6 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Location</th>
                  <th className="px-8 py-5"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredItems.map((item) => (
                  <tr key={item._id} onClick={() => setSelectedItem(item)} className="group hover:bg-slate-50/80 cursor-pointer transition-all">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <img src={item.image_url} className="w-12 h-12 rounded-xl object-cover shadow-sm border border-slate-100" />
                        <div>
                          <p className="font-bold text-slate-800 text-[15px]">{item.title}</p>
                          <p className="text-[10px] text-blue-600 font-bold uppercase tracking-tight">ID: {item.itemId?.slice(-8).toUpperCase()}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg uppercase tracking-wider">{item.category}</span>
                    </td>
                    <td className="px-6 py-5">
                      <div className={`text-[11px] font-bold uppercase flex items-center gap-2 ${item.status === 'lost' ? 'text-rose-500' : 'text-emerald-600'}`}>
                        <div className={`w-2 h-2 rounded-full ${item.status === 'lost' ? 'bg-rose-500 animate-pulse' : 'bg-emerald-600'}`} />
                        {item.status}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-1.5 text-slate-500 font-semibold text-xs uppercase tracking-tight">
                        <MapPin size={14} className="text-slate-300"/> {item.location}
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right"><ChevronRight size={18} className="ml-auto text-slate-300 group-hover:text-blue-600 transition-colors" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* DETAIL OVERLAY */}
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedItem(null)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />

            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white w-full max-w-6xl h-[85vh] rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col md:flex-row border border-slate-200"
            >
              {/* Left Side: Image */}
              <div className="md:w-5/12 relative h-72 md:h-auto bg-slate-50">
                <img src={selectedItem.image_url} className="w-full h-full object-cover" alt="Selected Asset" />
                <div className="absolute top-8 left-8">
                  <span className={`px-5 py-2 rounded-xl text-[11px] font-bold uppercase tracking-wider shadow-lg text-white ${selectedItem.status === 'lost' ? 'bg-rose-600' : 'bg-emerald-600'}`}>
                    {selectedItem.status} Asset
                  </span>
                </div>
              </div>

              {/* Right Side: Details */}
              <div className="md:w-7/12 flex flex-col bg-white">
                <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
                  <div className="flex p-1 bg-slate-200/50 rounded-xl">
                    <button className="px-8 py-2 rounded-lg text-[11px] font-bold uppercase tracking-wider bg-white text-slate-900 shadow-sm">Overview</button>
                    <button 
                      onClick={() => { setIsEditing(true); setIsModalOpen(true); }} 
                      className="px-8 py-2 rounded-lg text-[11px] font-bold uppercase tracking-wider text-slate-400 hover:text-slate-600 flex items-center gap-2"
                    >
                      <Edit3 size={14} /> Edit Asset
                    </button>
                  </div>
                  <button onClick={() => setSelectedItem(null)} className="w-10 h-10 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center hover:bg-rose-50 hover:text-rose-500 transition-all"><X size={18}/></button>
                </div>

                <div className="flex-1 overflow-y-auto p-10 lg:p-12 space-y-10">
                  <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
                    <h3 className="text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">{selectedItem.title}</h3>
                    <p className="text-blue-600 font-bold text-[11px] mt-4 flex items-center gap-2 tracking-widest uppercase">
                      <Database size={14}/> System Reference: {selectedItem.itemId}
                    </p>
                  </motion.div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Location</p>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-blue-600 border border-slate-100"><MapPin size={18}/></div>
                        <span className="font-bold text-slate-800">{selectedItem.location}</span>
                      </div>
                    </div>
                    <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Asset Group</p>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-indigo-600 border border-slate-100"><Tag size={18}/></div>
                        <span className="font-bold text-slate-800">{selectedItem.category}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Metadata & Description</p>
                    <div className="p-8 bg-blue-50/40 rounded-3xl border border-blue-100/30">
                       <p className="text-slate-600 leading-relaxed text-[15px] font-medium">
                        {selectedItem.description || "No specific metadata found for this record."}
                       </p>
                    </div>
                  </div>
                </div>

                <div className="p-8 bg-slate-50 border-t border-slate-100 flex gap-4">
                  {activeTab === "pending" && (
                    <button onClick={() => handleApprove(selectedItem._id)} className="flex-[3] py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold uppercase text-[12px] tracking-widest transition-all flex items-center justify-center gap-3">
                      <CheckCircle size={18}/> Authorize Asset
                    </button>
                  )}
                  <button onClick={() => handleDelete(selectedItem)} className="flex-1 py-4 bg-white border border-slate-200 text-rose-500 hover:bg-rose-500 hover:text-white rounded-xl transition-all flex items-center justify-center">
                    <Trash2 size={20}/>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AdminAddItems 
        isOpen={isModalOpen} 
        onClose={() => { 
          setIsModalOpen(false); 
          setIsEditing(false); 
        }} 
        isEditing={isEditing} 
        initialData={selectedItem} 
        onSuccess={() => { 
          fetchItems(); 
          setSelectedItem(null); 
        }} 
      />
    </div>
  );
}