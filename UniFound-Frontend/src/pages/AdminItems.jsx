"use client";

import React, { useState, useEffect, useCallback } from "react";
import api from "../api/axios.js";
import { Toaster, toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion"; // Required for smooth UI
import { 
  Search, MapPin, Trash2, Plus, CheckCircle, Loader2, X, 
  ShieldCheck, ArrowRight, Clock, Database, Edit3, Tag, 
  Filter, Layers, ChevronRight
} from "lucide-react";

import AdminAddItems from "./AdminAddItems"; 

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
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans selection:bg-blue-100">
      <Toaster position="top-right" />

      {/* Navigation */}
      <nav className="sticky top-0 z-[60] bg-white/70 backdrop-blur-2xl border-b border-slate-200/60 px-6 py-4">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-xl shadow-slate-200">
              <Layers size={20} />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight text-slate-900">UNI<span className="text-blue-600">FOUND</span></h1>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                <ShieldCheck size={10} className="text-blue-500"/> System Admin
              </p>
            </div>
          </div>
          
          <button 
            onClick={() => { setIsEditing(false); setIsModalOpen(true); }} 
            className="group flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs transition-all active:scale-95 shadow-lg shadow-blue-100"
          >
            <Plus size={16} strokeWidth={3} /> New Record
          </button>
        </div>
      </nav>

      <main className="max-w-[1600px] w-full mx-auto p-6 lg:p-10 space-y-10">
        
        {/* Metric Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: "Pending Review", val: activeTab === 'pending' ? items.length : '--', icon: Clock, color: "text-amber-500", bg: "bg-amber-50" },
            { label: "Verified Assets", val: activeTab === 'approved' ? items.length : '--', icon: CheckCircle, color: "text-blue-600", bg: "bg-blue-50" },
            { label: "Database Health", val: "Optimal", icon: Database, color: "text-emerald-500", bg: "bg-emerald-50" }
          ].map((stat, idx) => (
            <div key={idx} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-5">
              <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center`}>
                <stat.icon size={24}/>
              </div>
              <div>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">{stat.label}</p>
                <p className="text-2xl font-black text-slate-800">{stat.val}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-slate-100/50 p-2 rounded-[2rem]">
          <div className="flex p-1 bg-white rounded-2xl shadow-sm">
            {["pending", "approved"].map((tab) => (
              <button 
                key={tab} 
                onClick={() => setActiveTab(tab)} 
                className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? "bg-slate-900 text-white shadow-md" : "text-slate-400 hover:text-slate-600"}`}
              >
                {tab}
              </button>
            ))}
          </div>
          
          <div className="relative w-full md:max-w-md mr-2">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search by Title or ID..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-6 py-3 bg-white border border-slate-200 focus:border-blue-400 rounded-2xl font-bold text-sm outline-none transition-all shadow-sm" 
            />
          </div>
        </div>

        {/* Main Table View */}
        <div className="bg-white rounded-[2.5rem] border border-slate-200/60 shadow-xl overflow-hidden relative">
          {loading && <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-20 flex items-center justify-center"><Loader2 className="animate-spin text-blue-600" /></div>}
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/30">
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Asset Information</th>
                  <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Category</th>
                  <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Current Status</th>
                  <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Location</th>
                  <th className="px-8 py-6"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredItems.map((item) => (
                  <tr key={item._id} onClick={() => setSelectedItem(item)} className="group hover:bg-slate-50/80 cursor-pointer transition-all">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <img src={item.image_url} className="w-12 h-12 rounded-xl object-cover shadow-sm" />
                        <div>
                          <p className="font-bold text-slate-800">{item.title}</p>
                          <p className="text-[9px] text-blue-500 font-black uppercase">ID: {item.itemId?.slice(-8)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5"><span className="text-[10px] font-black text-slate-500 bg-slate-100 px-3 py-1 rounded-lg uppercase">{item.category}</span></td>
                    <td className="px-6 py-5">
                      <div className={`text-[10px] font-black uppercase flex items-center gap-1.5 ${item.status === 'lost' ? 'text-rose-500' : 'text-blue-600'}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${item.status === 'lost' ? 'bg-rose-500' : 'bg-blue-600'}`} />
                        {item.status}
                      </div>
                    </td>
                    <td className="px-6 py-5 flex items-center gap-2 text-slate-500 font-bold text-xs mt-4 border-none"><MapPin size={12}/> {item.location}</td>
                    <td className="px-8 py-5 text-right"><ChevronRight size={18} className="ml-auto text-slate-300 group-hover:text-blue-600 transition-colors" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* PROFESSIONAL DETAIL OVERLAY */}
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedItem(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl"
            />

            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 40 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 40 }}
              className="relative bg-white w-full max-w-6xl h-[85vh] rounded-[3rem] overflow-hidden shadow-2xl flex flex-col md:flex-row border border-white/20"
            >
              {/* Left Side: Image Preview */}
              <div className="md:w-5/12 relative h-72 md:h-auto bg-slate-200">
                <img src={selectedItem.image_url} className="w-full h-full object-cover" alt="Selected Asset" />
                <div className="absolute top-8 left-8">
                  <span className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl backdrop-blur-md ${selectedItem.status === 'lost' ? 'bg-rose-600 text-white' : 'bg-blue-600 text-white'}`}>
                    {selectedItem.status} Asset
                  </span>
                </div>
              </div>

              {/* Right Side: Tabbed Details */}
              <div className="md:w-7/12 flex flex-col bg-white">
                <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                  <div className="flex p-1 bg-slate-200/50 rounded-xl">
                    <button onClick={() => setIsEditing(false)} className={`px-8 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${!isEditing ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'}`}>Overview</button>
                    <button onClick={() => { setIsEditing(true); setIsModalOpen(true); }} className="px-8 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600">Edit Asset</button>
                  </div>
                  <button onClick={() => setSelectedItem(null)} className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-rose-50 hover:text-rose-500 transition-all"><X size={18}/></button>
                </div>

                <div className="flex-1 overflow-y-auto p-10 lg:p-14 space-y-10">
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                    <h3 className="text-4xl font-black text-slate-900 tracking-tight leading-tight">{selectedItem.title}</h3>
                    <p className="text-blue-500 font-bold text-xs mt-3 flex items-center gap-2 tracking-wider">
                      <Database size={14}/> SYSTEM REFERENCE: {selectedItem.itemId}
                    </p>
                  </motion.div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Location</p>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-blue-600"><MapPin size={18}/></div>
                        <span className="font-bold text-slate-700">{selectedItem.location}</span>
                      </div>
                    </div>
                    <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Asset Group</p>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-indigo-600"><Tag size={18}/></div>
                        <span className="font-bold text-slate-700">{selectedItem.category}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Metadata & Description</p>
                    <p className="text-slate-600 leading-relaxed text-lg font-medium p-8 bg-blue-50/40 rounded-[2.5rem] border border-blue-100/30">
                      {selectedItem.description || "No specific metadata found."}
                    </p>
                  </div>
                </div>

                <div className="p-10 bg-slate-50 border-t border-slate-100 flex gap-4">
                  {activeTab === "pending" && (
                    <button onClick={() => handleApprove(selectedItem._id)} className="flex-[3] py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black uppercase text-[11px] tracking-widest shadow-xl shadow-blue-100 transition-all flex items-center justify-center gap-3">
                      <CheckCircle size={18}/> Authorize Asset
                    </button>
                  )}
                  <button onClick={() => handleDelete(selectedItem)} className="flex-1 py-4 bg-white border border-slate-200 text-rose-500 hover:bg-rose-500 hover:text-white rounded-2xl transition-all flex items-center justify-center">
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
        onClose={() => { setIsModalOpen(false); setIsEditing(false); }} 
        isEditing={isEditing} 
        initialData={selectedItem} 
        onSuccess={() => { fetchItems(); setSelectedItem(null); }} 
      />
    </div>
  );
}