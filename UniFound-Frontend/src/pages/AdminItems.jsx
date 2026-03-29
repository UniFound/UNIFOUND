import React, { useState } from "react";
import { 
  Search, 
  Filter, 
  Package, 
  MapPin, 
  Calendar, 
  Tag, 
  Trash2, 
  Edit3, 
  CheckCircle,
  Clock,
  ExternalLink
} from "lucide-react";

export default function AdminItems() {
  const [activeTab, setActiveTab] = useState("found"); // "lost" or "found"

  // Sample Data - පසුව Backend එකෙන් ලබාගත හැක
  const foundItems = [
    { id: "FI-102", name: "Black Laptop Charger", category: "Electronics", location: "Library Floor 2", date: "2024-03-25", status: "In Storage", image: "https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=100&h=100&fit=crop" },
    { id: "FI-105", name: "Nike Water Bottle", category: "Personal", location: "Main Gym", date: "2024-03-24", status: "Claimed", image: "https://images.unsplash.com/photo-1602143399827-7211bf3ad3ed?w=100&h=100&fit=crop" },
  ];

  const lostItems = [
    { id: "LI-501", name: "Student ID - Kasun", category: "Documents", location: "Canteen Area", date: "2024-03-22", status: "Searching", image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&h=100&fit=crop" },
    { id: "LI-508", name: "Blue Backpack", category: "Bags", location: "Lecture Hall 04", date: "2024-03-21", status: "Reported", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=100&h=100&fit=crop" },
  ];

  const currentItems = activeTab === "found" ? foundItems : lostItems;

  return (
    /* Font එක Inter, Segoe UI, සහ sans-serif ලෙස ඉතා පැහැදිලි එකකට වෙනස් කර ඇත */
    <div className="space-y-8 animate-in fade-in duration-500 font-['Inter',_-apple-system,_.SFNSText-Regular,'Segoe_UI','Helvetica_Neue',sans-serif]">
      
      {/* --- HEADER & TABS --- */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Items Management</h1>
          <p className="text-slate-500 font-bold text-xs mt-1 uppercase tracking-widest">
            Monitor and manage all reported items across campus
          </p>

          {/* TABS SELECTOR */}
          <div className="flex gap-2 mt-8 bg-slate-100 p-1.5 rounded-[22px] w-fit border border-slate-200/50">
            <button 
              onClick={() => setActiveTab("found")}
              className={`px-8 py-3 rounded-[18px] text-xs font-bold uppercase tracking-widest transition-all ${
                activeTab === "found" 
                ? "bg-white text-blue-600 shadow-sm" 
                : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Found Items
            </button>
            <button 
              onClick={() => setActiveTab("lost")}
              className={`px-8 py-3 rounded-[18px] text-xs font-bold uppercase tracking-widest transition-all ${
                activeTab === "lost" 
                ? "bg-white text-rose-600 shadow-sm" 
                : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Lost Items
            </button>
          </div>
        </div>

        {/* SEARCH & FILTER */}
        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder={`Search ${activeTab} items...`} 
              className="pl-12 pr-6 py-3.5 bg-white border border-slate-100 rounded-2xl text-sm font-medium text-slate-700 w-full md:w-72 shadow-sm focus:ring-4 focus:ring-blue-50 focus:border-blue-200 outline-none transition-all"
            />
          </div>
          <button className="p-3.5 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-blue-600 transition-all shadow-sm">
            <Filter size={20} />
          </button>
        </div>
      </div>

      {/* --- ITEMS TABLE --- */}
      <div className="bg-white rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-50">
                <th className="px-8 py-6 text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Item Info</th>
                <th className="px-8 py-6 text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Category</th>
                <th className="px-8 py-6 text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Location & Date</th>
                <th className="px-8 py-6 text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Status</th>
                <th className="px-8 py-6 text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {currentItems.map((item) => (
                <tr key={item.id} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="relative overflow-hidden w-12 h-12 rounded-2xl border border-slate-100 bg-slate-100">
                         <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-900 leading-tight">{item.name}</span>
                        <span className="text-[10px] font-bold text-blue-600 uppercase tracking-tighter mt-1">{item.id}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      <Tag size={14} className="text-slate-300" />
                      <span className="text-xs font-bold text-slate-600">{item.category}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-slate-500">
                        <MapPin size={14} className="text-slate-300" />
                        <span className="text-[11px] font-medium">{item.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-400">
                        <Calendar size={14} className="text-slate-300" />
                        <span className="text-[11px] font-medium">{item.date}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-widest border ${
                      item.status === 'Claimed' || item.status === 'Searching' 
                      ? 'bg-green-50 text-green-600 border-green-100' 
                      : 'bg-amber-50 text-amber-600 border-amber-100'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2.5 bg-white border border-slate-100 text-slate-400 hover:text-blue-600 hover:border-blue-200 rounded-xl transition-all shadow-sm">
                        <Edit3 size={16} />
                      </button>
                      <button className="p-2.5 bg-white border border-slate-100 text-slate-400 hover:text-rose-500 hover:border-rose-200 rounded-xl transition-all shadow-sm">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}