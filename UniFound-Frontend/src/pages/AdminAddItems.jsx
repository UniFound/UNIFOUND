import React, { useState, useEffect } from "react";
import { X, Camera, Loader2, Type, Tag, MapPin, AlignLeft, Palette, CheckCircle2 } from "lucide-react";
import { toast } from "react-hot-toast";
import api from "../api/axios.js";
import uploadMediaToSupabase from "../supabaseClient.js";

const categoryOptions = ["Laptop", "Mobile Phone", "Student ID", "Electronics", "Laptop Charger", "Backpack", "Other"];
const locationOptions = ["Basement", "Canteen", "New Building", "Main Building", "Near the Beach", "Library", "Anohana Canteen", "Office Area", "Other"];

export default function AdminAddItems({ isOpen, onClose, isEditing, initialData, onSuccess }) {
  const [newData, setNewData] = useState({
    title: "", description: "", category: "", color: "", location: "", status: "lost", image: null, category_other: "", location_other: ""
  });
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // පරණ දත්ත Form එකට ඇතුළත් කිරීමේ ප්‍රධාන තර්කනය
  useEffect(() => {
    if (isOpen) {
      if (isEditing && initialData) {
        // Edit mode එකේදී පරණ දත්ත set කිරීම
        const isStandardCategory = categoryOptions.includes(initialData.category);
        const isStandardLocation = locationOptions.includes(initialData.location);

        setNewData({
          ...initialData,
          image: null, // අලුත් image එකක් දානකම් null තියන්න
          category: isStandardCategory ? initialData.category : "Other",
          category_other: isStandardCategory ? "" : initialData.category,
          location: isStandardLocation ? initialData.location : "Other",
          location_other: isStandardLocation ? "" : initialData.location,
        });
        setPreviewUrl(initialData.image_url);
      } else {
        // අලුත් Item එකක් නම් Form එක හිස් කිරීම
        resetForm();
      }
    }
  }, [isEditing, initialData, isOpen]);

  const resetForm = () => {
    setNewData({ title: "", description: "", category: "", color: "", location: "", status: "lost", image: null, category_other: "", location_other: "" });
    setPreviewUrl(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Numbers වැලැක්වීමේ validation එක (title, color වැනි fields වලට පමණයි)
    if (["title", "color", "category_other", "location_other"].includes(name) && /\d/.test(value)) {
      toast.error("Numbers are not allowed in this field", { id: 'no-num' });
      return;
    }
    setNewData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!previewUrl && !newData.image) return toast.error("Item image is mandatory");
    if (newData.category === "Other" && !newData.category_other) return toast.error("Please specify the category");
    if (newData.location === "Other" && !newData.location_other) return toast.error("Please specify the location");

    setIsSubmitting(true);
    const loadingToast = toast.loading(isEditing ? "Updating item..." : "Registering item...");

    try {
      let finalImageUrl = previewUrl;
      // අලුත් image එකක් තෝරාගෙන තිබේ නම් පමණක් upload කරන්න
      if (newData.image && typeof newData.image !== "string") {
        finalImageUrl = await uploadMediaToSupabase(newData.image);
      }

      const user = JSON.parse(localStorage.getItem("user"));
      const payload = { 
        ...newData,
        image_url: finalImageUrl, 
        role: "admin",
        user_id: user?.userId,
        category: newData.category === "Other" ? newData.category_other : newData.category,
        location: newData.location === "Other" ? newData.location_other : newData.location,
      };

      if (isEditing) {
        await api.put(`/items/${newData._id}`, payload);
        toast.success("Item updated successfully", { id: loadingToast });
      } else {
        await api.post("/items", payload);
        toast.success("Item listed successfully", { id: loadingToast });
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
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/20 flex flex-col max-h-[90vh]">
        
        {/* Header Section */}
        <div className={`px-10 py-8 text-white flex justify-between items-center transition-colors duration-500 ${newData.status === 'lost' ? 'bg-indigo-600' : 'bg-emerald-600'}`}>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-70 mb-1">Administrative Action</p>
            <h2 className="text-2xl font-black tracking-tighter uppercase italic flex items-center gap-3">
              {isEditing ? "Edit" : "New"} <span className="text-white/80">Inventory Record</span>
            </h2>
          </div>
          <button onClick={onClose} className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-2xl flex items-center justify-center transition-all active:scale-90">
            <X size={24}/>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 md:p-10 space-y-6 overflow-y-auto custom-scrollbar">
          
          {/* Status Toggle */}
          <div className="flex p-1.5 bg-slate-100 rounded-2xl w-fit">
            {["lost", "found"].map((s) => (
              <button key={s} type="button" onClick={() => setNewData({...newData, status: s})}
                className={`px-8 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${newData.status === s ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}>
                {s} Item
              </button>
            ))}
          </div>

          {/* Image Upload Area */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Item Image</label>
            <div onClick={() => document.getElementById('admin-upload').click()} 
              className={`group h-48 border-2 border-dashed rounded-[2rem] flex flex-col items-center justify-center cursor-pointer overflow-hidden relative transition-all ${previewUrl ? 'border-indigo-400 bg-slate-50' : 'border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/30'}`}>
              {previewUrl ? (
                <div className="relative w-full h-full">
                  <img src={previewUrl} className="w-full h-full object-cover" alt="Preview" />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <Camera className="text-white" size={32} />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
                    <Camera size={24} />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Add Evidence Photo</p>
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
          </div>

          {/* Title & Color Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Title</label>
               <div className="relative">
                  <Type size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="text" name="title" value={newData.title} placeholder="e.g. Silver Laptop" required onChange={handleInputChange} className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl font-bold border border-slate-100 outline-none focus:border-indigo-400 focus:bg-white transition-all" />
               </div>
            </div>
            <div className="space-y-2">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Item Color</label>
               <div className="relative">
                  <Palette size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="text" name="color" value={newData.color} placeholder="Color name" onChange={handleInputChange} className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl font-bold border border-slate-100 outline-none focus:border-indigo-400 focus:bg-white transition-all" />
               </div>
            </div>
          </div>

          {/* Category & Location Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Category</label>
              <div className="relative">
                <Tag size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <select name="category" value={newData.category} onChange={handleInputChange} className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl font-bold border border-slate-100 outline-none appearance-none focus:border-indigo-400 transition-all">
                  <option value="">Select Category</option>
                  {categoryOptions.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              {newData.category === "Other" && (
                <input type="text" name="category_other" value={newData.category_other} placeholder="Name the category..." onChange={handleInputChange} className="w-full mt-2 p-3 bg-indigo-50/50 rounded-xl font-bold border border-indigo-100 outline-none animate-in slide-in-from-top-1" />
              )}
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Location</label>
              <div className="relative">
                <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <select name="location" value={newData.location} onChange={handleInputChange} className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl font-bold border border-slate-100 outline-none appearance-none focus:border-indigo-400 transition-all">
                  <option value="">Select Location</option>
                  {locationOptions.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              {newData.location === "Other" && (
                <input type="text" name="location_other" value={newData.location_other} placeholder="Name the location..." onChange={handleInputChange} className="w-full mt-2 p-3 bg-indigo-50/50 rounded-xl font-bold border border-indigo-100 outline-none animate-in slide-in-from-top-1" />
              )}
            </div>
          </div>

          {/* Description Area */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Additional Details</label>
            <div className="relative">
               <AlignLeft size={18} className="absolute left-4 top-4 text-slate-400" />
               <textarea name="description" value={newData.description} placeholder="Add any special identification marks or details..." rows="3" className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl font-bold border border-slate-100 outline-none focus:border-indigo-400 focus:bg-white transition-all" onChange={(e) => setNewData({...newData, description: e.target.value})}></textarea>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4 sticky bottom-0 bg-white pb-2 mt-auto">
             <button type="button" onClick={onClose} className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-2xl font-black uppercase text-[11px] tracking-widest hover:bg-slate-200 transition-all">
               Cancel
             </button>
             <button type="submit" disabled={isSubmitting} 
                className={`flex-[2] py-4 text-white rounded-2xl font-black uppercase text-[11px] tracking-widest shadow-lg transition-all flex items-center justify-center gap-2 ${newData.status === 'lost' ? 'bg-indigo-600 shadow-indigo-100 hover:bg-indigo-700' : 'bg-emerald-600 shadow-emerald-100 hover:bg-emerald-700'} ${isSubmitting ? 'opacity-70' : 'active:scale-95'}`}>
                {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <CheckCircle2 size={18} />}
                {isSubmitting ? "Syncing..." : (isEditing ? "Save Changes" : "Create Record")}
             </button>
          </div>
        </form>
      </div>
    </div>
  );
}