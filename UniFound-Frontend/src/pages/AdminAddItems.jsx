"use client";

import React, { useState, useEffect } from "react";
import { X, Camera, Loader2, Type, Tag, MapPin, AlignLeft, Palette, CheckCircle2, AlertCircle, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import api from "../api/axios.js";
import uploadMediaToSupabase from "../supabaseClient.js";

const categoryOptions = ["Laptop", "Mobile Phone", "Student ID", "Electronics", "Laptop Charger", "Backpack", "Other"];
const locationOptions = ["Basement", "Canteen", "New Building", "Main Building", "Near the Beach", "Library", "Anohana Canteen", "Office Area", "Other"];
const colorOptions = [
  { name: "Black", hex: "#000000" },
  { name: "White", hex: "#FFFFFF" },
  { name: "Red", hex: "#EF4444" },
  { name: "Blue", hex: "#3B82F6" },
  { name: "Green", hex: "#10B981" },
  { name: "Silver", hex: "#94A3B8" },
  { name: "Gold", hex: "#F59E0B" },
];

export default function AdminAddItems({ isOpen, onClose, isEditing, initialData, onSuccess }) {
  const [newData, setNewData] = useState({
    title: "", description: "", category: "", color: "", location: "", status: "lost", image: null, category_other: "", location_other: ""
  });
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      if (isEditing && initialData) {
        const isStandardCategory = categoryOptions.includes(initialData.category);
        const isStandardLocation = locationOptions.includes(initialData.location);

        setNewData({
          ...initialData,
          image: null,
          category: isStandardCategory ? initialData.category : "Other",
          category_other: isStandardCategory ? "" : initialData.category,
          location: isStandardLocation ? initialData.location : "Other",
          location_other: isStandardLocation ? "" : initialData.location,
        });
        setPreviewUrl(initialData.image_url);
      } else {
        resetForm();
      }
    }
  }, [isEditing, initialData, isOpen]);

  useEffect(() => {
    const newErrors = {};
    if (!newData.title) newErrors.title = "Title is required";
    else if (newData.title.length < 5) newErrors.title = "At least 5 characters required";
    
    if (!newData.category) newErrors.category = "Category required";
    if (newData.category === "Other" && !newData.category_other) newErrors.category = "Specify category";

    if (!newData.location) newErrors.location = "Location required";
    if (newData.location === "Other" && !newData.location_other) newErrors.location = "Specify location";

    if (!previewUrl && !newData.image) newErrors.image = "Image is mandatory";

    setErrors(newErrors);
  }, [newData, previewUrl]);

  const resetForm = () => {
    setNewData({ title: "", description: "", category: "", color: "", location: "", status: "lost", image: null, category_other: "", location_other: "" });
    setPreviewUrl(null);
    setErrors({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (["title", "color", "category_other", "location_other"].includes(name) && /\d/.test(value)) {
      setErrors(prev => ({ ...prev, [name]: "Numbers are not allowed" }));
      return;
    }
    setNewData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.keys(errors).length > 0) return toast.error("Please fix validation errors");

    setIsSubmitting(true);
    const loadingToast = toast.loading(isEditing ? "Updating record..." : "Creating record...");

    try {
      let finalImageUrl = previewUrl;
      if (newData.image && typeof newData.image !== "string") {
        finalImageUrl = await uploadMediaToSupabase(newData.image);
      }

      const user = JSON.parse(localStorage.getItem("user"));
      
      const payload = { 
        ...newData,
        image_url: finalImageUrl, 
        user_id: user?.userId,
        isAdmin: true, 
        category: newData.category === "Other" ? newData.category_other : newData.category,
        location: newData.location === "Other" ? newData.location_other : newData.location,
      };

      if (isEditing) {
        await api.put(`/items/${newData._id}`, payload);
        toast.success("Inventory updated", { id: loadingToast });
      } else {
        await api.post("/items", payload);
        toast.success("Item auto-approved", { id: loadingToast });
      }

      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed", { id: loadingToast });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300 font-['Inter',_sans-serif]">
      <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className={`px-10 py-8 text-white flex justify-between items-center transition-colors duration-700 ${newData.status === 'lost' ? 'bg-indigo-600' : 'bg-emerald-600'}`}>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-white/70 mb-1">Internal Database</p>
            <h2 className="text-2xl font-extrabold tracking-tight uppercase flex items-center gap-3">
              {isEditing ? "Modify" : "Register"} <span className="text-white/60">Asset</span>
            </h2>
          </div>
          <button onClick={onClose} className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-2xl flex items-center justify-center transition-all active:scale-90 border border-white/10">
            <X size={24}/>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 md:p-10 space-y-7 overflow-y-auto custom-scrollbar">
          
          {/* Status Selector */}
          <div className="flex p-1 bg-slate-100 rounded-xl w-fit border border-slate-200/50">
            {["lost", "found"].map((s) => (
              <button key={s} type="button" onClick={() => setNewData({...newData, status: s})}
                className={`px-8 py-2.5 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all ${newData.status === s ? "bg-white text-slate-900 shadow-md" : "text-slate-400 hover:text-slate-600"}`}>
                {s} Record
              </button>
            ))}
          </div>

          {/* Image Upload Area */}
          <div className="space-y-3">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Evidence / Item Photo *</label>
            <div onClick={() => !previewUrl && document.getElementById('admin-upload').click()} 
              className={`group h-44 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center cursor-pointer overflow-hidden relative transition-all ${previewUrl ? 'border-indigo-400 bg-slate-50' : 'border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/30'}`}>
              
              {previewUrl ? (
                <div className="relative w-full h-full group">
                  <img src={previewUrl} className="w-full h-full object-cover" alt="Preview" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <button type="button" onClick={(e) => { e.stopPropagation(); setPreviewUrl(null); setNewData(p => ({...p, image: null})); }} 
                      className="p-3 bg-rose-500 text-white rounded-2xl hover:bg-rose-600 transition-transform hover:scale-110 shadow-xl">
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
                    <Camera size={24} />
                  </div>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Click to upload photo</p>
                </div>
              )}
              <input id="admin-upload" type="file" hidden accept="image/*" onChange={(e) => {
                const file = e.target.files[0];
                if(file) { 
                  setNewData({...newData, image: file}); 
                  setPreviewUrl(URL.createObjectURL(file)); 
                }
              }} />
            </div>
            {errors.image && <p className="text-[11px] text-rose-500 font-semibold ml-2 italic">{errors.image}</p>}
          </div>

          {/* Main Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Title *</label>
                <div className="relative">
                  <Type size={18} className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${errors.title ? 'text-rose-400' : 'text-slate-400'}`} />
                  <input type="text" name="title" value={newData.title} placeholder="e.g. Silver Laptop" required onChange={handleInputChange} 
                    className={`w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl font-semibold text-sm border outline-none transition-all focus:ring-4 ${errors.title ? 'border-rose-200 focus:ring-rose-50' : 'border-slate-100 focus:border-indigo-400 focus:bg-white focus:ring-indigo-50/50'}`} />
                </div>
                {errors.title && <p className="text-[11px] text-rose-500 font-semibold ml-2 italic">{errors.title}</p>}
            </div>

            <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Quick Color Select</label>
                <div className="flex flex-wrap gap-2 pt-1">
                  {colorOptions.map((c) => (
                    <button key={c.name} type="button" onClick={() => setNewData({ ...newData, color: c.name })}
                      className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-110 ${newData.color === c.name ? 'border-indigo-500 ring-4 ring-indigo-50' : 'border-white shadow-sm'}`}
                      style={{ backgroundColor: c.hex }} title={c.name}
                    />
                  ))}
                  <input type="text" name="color" value={newData.color} placeholder="Custom..." onChange={handleInputChange} 
                    className="flex-1 min-w-[80px] px-4 text-[11px] font-bold bg-slate-50 rounded-full border border-slate-200 outline-none focus:border-indigo-400" />
                </div>
            </div>
          </div>

          {/* Category & Location Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Category *</label>
              <div className="relative">
                <Tag size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <select name="category" value={newData.category} onChange={handleInputChange} 
                  className="w-full pl-12 pr-10 py-4 bg-slate-50 rounded-2xl font-bold text-sm border border-slate-100 outline-none appearance-none focus:border-indigo-400 transition-all cursor-pointer">
                  <option value="">Select Category</option>
                  {categoryOptions.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              {newData.category === "Other" && (
                <input type="text" name="category_other" value={newData.category_other} placeholder="Specify category..." onChange={handleInputChange} 
                  className="w-full mt-2 p-3.5 bg-indigo-50/50 rounded-xl font-bold text-sm border border-indigo-100 outline-none animate-in slide-in-from-top-2" />
              )}
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Location *</label>
              <div className="relative">
                <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <select name="location" value={newData.location} onChange={handleInputChange} 
                  className="w-full pl-12 pr-10 py-4 bg-slate-50 rounded-2xl font-bold text-sm border border-slate-100 outline-none appearance-none focus:border-indigo-400 transition-all cursor-pointer">
                  <option value="">Select Location</option>
                  {locationOptions.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              {newData.location === "Other" && (
                <input type="text" name="location_other" value={newData.location_other} placeholder="Specify location..." onChange={handleInputChange} 
                  className="w-full mt-2 p-3.5 bg-indigo-50/50 rounded-xl font-bold text-sm border border-indigo-100 outline-none animate-in slide-in-from-top-2" />
              )}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2 pb-4">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Internal Notes / Description</label>
            <div className="relative">
                <AlignLeft size={18} className="absolute left-4 top-4 text-slate-400" />
                <textarea name="description" value={newData.description} placeholder="Add unique marks, contents or condition..." rows="3" 
                className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl font-semibold text-sm border border-slate-100 outline-none focus:border-indigo-400 focus:bg-white transition-all shadow-inner" 
                onChange={(e) => setNewData({...newData, description: e.target.value})}></textarea>
            </div>
          </div>

          {/* Floating Action Buttons */}
          <div className="flex gap-4 sticky bottom-0 bg-white/90 backdrop-blur-md pt-6 pb-2 mt-auto border-t border-slate-100">
             <button type="button" onClick={onClose} 
              className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-xl font-bold uppercase text-[12px] tracking-widest hover:bg-slate-200 transition-all active:scale-95">
                Discard
             </button>
             <button type="submit" disabled={isSubmitting || Object.keys(errors).length > 0} 
                className={`flex-[2] py-4 text-white rounded-xl font-bold uppercase text-[12px] tracking-widest shadow-xl transition-all flex items-center justify-center gap-2 ${newData.status === 'lost' ? 'bg-indigo-600 shadow-indigo-100 hover:bg-indigo-700' : 'bg-emerald-600 shadow-emerald-100 hover:bg-emerald-700'} ${isSubmitting || Object.keys(errors).length > 0 ? 'opacity-50 cursor-not-allowed grayscale' : 'active:scale-95 hover:-translate-y-0.5'}`}>
                {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <CheckCircle2 size={18} />}
                {isSubmitting ? "Processing..." : (isEditing ? "Update Entry" : "Commit to Database")}
             </button>
          </div>
        </form>
      </div>
    </div>
  );
}