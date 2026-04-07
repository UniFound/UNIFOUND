"use client";

import { useState, useEffect } from "react";
import Navbar from "../components/Navbar.jsx";
import uploadMediaToSupabase from "../supabaseClient.js";
import api from "../api/axios.js";
import { Upload, MapPin, Tag, Palette, Type, AlignLeft, CheckCircle2, AlertCircle, X, ChevronRight } from "lucide-react";

export default function ReportItemPage() {
  const [activeTab, setActiveTab] = useState("lost");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    color: "",
    location: "",
    image: null,
    category_other: "",
    location_other: "",
  });

  const [previewUrl, setPreviewUrl] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [submitError, setSubmitError] = useState("");

  const colorOptions = [
    { name: "Black", hex: "#000000" },
    { name: "White", hex: "#FFFFFF" },
    { name: "Red", hex: "#EF4444" },
    { name: "Blue", hex: "#3B82F6" },
    { name: "Green", hex: "#10B981" },
    { name: "Silver", hex: "#94A3B8" },
    { name: "Gold", hex: "#F59E0B" },
  ];

  const categoryOptions = ["Laptop", "Mobile Phone", "Student ID", "Electronics", "Laptop Charger", "Backpack", "Other"];
  const locationOptions = ["Basement", "Canteen", "New Building", "Main Building", "Near the Beach", "Library", "Anohana Canteen", "Office Area", "Other"];

  // Calculation for progress bar
  const completedFields = Object.values(formData).filter(value => value !== "" && value !== null).length;
  const progressPercentage = (completedFields / 6) * 100;

  useEffect(() => {
    const newErrors = {};
    if (!formData.title) {
      newErrors.title = "Title is required";
    } else if (formData.title.length < 5) {
      newErrors.title = "Title must be at least 5 characters long";
    }
    if (!formData.category) newErrors.category = "Category is required";
    if (formData.category === "Other" && !formData.category_other) newErrors.category = "Please specify category";
    if (!formData.location) newErrors.location = "Location is required";
    if (formData.location === "Other" && !formData.location_other) newErrors.location = "Please specify location";
    if (!formData.image) newErrors.image = "Image is required";
    setErrors(newErrors);
  }, [formData]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      const file = files[0];
      setFormData((prev) => ({ ...prev, image: file }));
      if (file) setPreviewUrl(URL.createObjectURL(file));
      return;
    }
    if (["title", "color", "category_other", "location_other"].includes(name)) {
      const containsNumber = /\d/.test(value);
      if (containsNumber) {
        setErrors(prev => ({ ...prev, [name]: "Numbers are not allowed in this field" }));
        return; 
      }
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.keys(errors).length > 0) return;
    setLoading(true);
    setSuccess("");
    setSubmitError("");

    try {
      let imageUrl = "";
      if (formData.image) imageUrl = await uploadMediaToSupabase(formData.image);
      const user = JSON.parse(localStorage.getItem("user"));
      const payload = {
        ...formData,
        user_id: user?.userId,
        category: formData.category === "Other" ? formData.category_other : formData.category,
        location: formData.location === "Other" ? formData.location_other : formData.location,
        status: activeTab,
        image_url: imageUrl,
      };
      await api.post("/items", payload);
      setSuccess(`Your report is submitted! It will appear on the feed after Admin approval.`);
      setFormData({ title: "", description: "", category: "", color: "", location: "", image: null, category_other: "", location_other: "" });
      setPreviewUrl(null);
    } catch (err) {
      setSubmitError(err.response?.data?.message || "Submission failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20 relative overflow-x-hidden">
      {/* Background Decorative Gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute -top-[10%] -right-[10%] w-[40%] h-[40%] rounded-full blur-[120px] opacity-20 transition-colors duration-1000 ${activeTab === 'lost' ? 'bg-blue-400' : 'bg-emerald-400'}`}></div>
        <div className={`absolute -bottom-[10%] -left-[10%] w-[40%] h-[40%] rounded-full blur-[120px] opacity-20 transition-colors duration-1000 ${activeTab === 'lost' ? 'bg-indigo-400' : 'bg-teal-400'}`}></div>
      </div>

      <Navbar />

      <div className="pt-28 px-4 max-w-4xl mx-auto relative z-10">
        
        {/* --- NAVBAR BOTTOM ADDITIONS --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 animate-in fade-in slide-in-from-top-4 duration-700">
          {/* Breadcrumbs */}
          <nav className="flex items-center text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
            <span className="hover:text-slate-600 cursor-pointer transition-colors">Home</span>
            <ChevronRight size={12} className="mx-2" />
            <span className={activeTab === 'lost' ? 'text-blue-600' : 'text-emerald-600'}>Report {activeTab} Item</span>
          </nav>

          {/* Status Badge */}
          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full border backdrop-blur-md transition-all duration-500 ${activeTab === 'lost' ? 'bg-blue-50/50 border-blue-100 text-blue-600' : 'bg-emerald-50/50 border-emerald-100 text-emerald-600'}`}>
              <span className={`w-2 h-2 rounded-full animate-pulse ${activeTab === 'lost' ? 'bg-blue-500' : 'bg-emerald-500'}`}></span>
              <span className="text-[10px] font-black uppercase tracking-widest">System Active</span>
            </div>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="mb-10 group">
          <div className="flex justify-between items-end mb-2 ml-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Report Completion</span>
            <span className={`text-[10px] font-black ${activeTab === 'lost' ? 'text-blue-600' : 'text-emerald-600'}`}>{Math.round(progressPercentage)}%</span>
          </div>
          <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden shadow-inner">
            <div 
              className={`h-full transition-all duration-700 ease-out ${activeTab === 'lost' ? 'bg-blue-600' : 'bg-emerald-600'}`}
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
        {/* --- END OF NAVBAR BOTTOM ADDITIONS --- */}

        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-2 tracking-tight">Report an Item</h1>
          <p className="text-slate-500 italic">Provide accurate details to speed up the recovery process.</p>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/60 overflow-hidden border border-slate-100 flex flex-col md:flex-row transition-all duration-500 hover:shadow-slate-300/50">
          {/* Left Side Info */}
          <div className={`md:w-1/3 p-10 text-white flex flex-col justify-center transition-colors duration-700 relative overflow-hidden ${activeTab === 'lost' ? 'bg-blue-600' : 'bg-emerald-600'}`}>
            <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-4 capitalize italic">{activeTab} Info</h2>
              <p className="text-white/80 text-sm leading-relaxed mb-10">
                Our system matches items based on title, category, and especially <b>color</b>. Please be specific.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3 bg-white/10 p-4 rounded-2xl backdrop-blur-md border border-white/10 hover:bg-white/20 transition-colors">
                  <CheckCircle2 size={20} />
                  <span className="text-sm font-semibold italic tracking-wide">Verified Community</span>
                </div>
                <div className="flex items-center gap-3 bg-white/10 p-4 rounded-2xl backdrop-blur-md border border-white/10 hover:bg-white/20 transition-colors">
                  <AlertCircle size={20} />
                  <span className="text-sm font-semibold italic tracking-wide">Quick Matching</span>
                </div>
              </div>
            </div>
            {/* Background pattern */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
          </div>

          {/* Right Side Form */}
          <div className="md:w-2/3 p-8 md:p-12">
            <div className="flex p-1 bg-slate-100 rounded-2xl mb-8 w-fit shadow-inner">
              {["lost", "found"].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`px-8 py-2.5 rounded-xl text-sm font-bold transition-all capitalize ${activeTab === tab ? "bg-white text-slate-900 shadow-md scale-[1.02]" : "text-slate-500 hover:text-slate-700"}`}
                >
                  {tab} Item
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Item Title */}
              <div className="relative group">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2 block ml-1 group-focus-within:text-blue-500 transition-colors">Item Title *</label>
                <div className="relative">
                  <Type className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${errors.title ? 'text-red-400' : 'text-slate-400'}`} size={18} />
                  <input
                    type="text" name="title" value={formData.title} onChange={handleChange}
                    placeholder="e.g. Blue Nike Backpack"
                    className={`w-full pl-12 pr-4 py-4 bg-slate-50 border rounded-2xl outline-none transition-all duration-300 focus:scale-[1.01] ${errors.title ? 'border-red-300 focus:ring-4 focus:ring-red-50' : 'border-slate-200 focus:ring-4 focus:ring-blue-50 focus:border-blue-500'}`}
                  />
                </div>
                {errors.title && <p className="text-[10px] text-red-500 font-bold mt-1 ml-2 italic animate-in fade-in slide-in-from-top-1">{errors.title}</p>}
              </div>

              {/* Color Selection Section */}
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2 block ml-1">Select Item Color</label>
                <div className="flex flex-wrap gap-3">
                  {colorOptions.map((c) => (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => setFormData({ ...formData, color: c.name })}
                      className={`group flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-300 ${formData.color === c.name ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-100 scale-105 shadow-sm' : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'}`}
                    >
                      <span className="w-4 h-4 rounded-full border border-slate-200 shadow-inner" style={{ backgroundColor: c.hex }}></span>
                      <span className={`text-xs font-bold tracking-tight ${formData.color === c.name ? 'text-blue-600' : 'text-slate-500'}`}>{c.name}</span>
                    </button>
                  ))}
                  <input 
                    type="text" name="color" value={formData.color} onChange={handleChange}
                    placeholder="Other..."
                    className="flex-1 min-w-[100px] text-xs font-bold px-4 py-1.5 rounded-full border border-slate-200 bg-slate-50 outline-none focus:border-blue-500 focus:bg-white transition-all shadow-inner"
                  />
                </div>
              </div>

              {/* Category Section */}
              <div className="group">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2 block ml-1 group-focus-within:text-blue-500 transition-colors">
                  Category *
                </label>
                <div className="relative overflow-hidden">
                  <Tag className={`absolute left-4 top-[18px] transition-colors duration-300 ${formData.category ? 'text-blue-500' : 'text-slate-400'}`} size={18} />
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full pl-12 pr-10 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all appearance-none cursor-pointer hover:bg-white shadow-inner"
                  >
                    <option value="">Select Category</option>
                    {categoryOptions.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 4l4 4 4-4"/></svg>
                  </div>
                </div>
                {formData.category === "Other" && (
                  <div className="animate-in slide-in-from-top-2 duration-300">
                    <input
                      type="text"
                      name="category_other"
                      value={formData.category_other}
                      placeholder="Please specify category..."
                      className="mt-3 w-full px-5 py-3 bg-white border-2 border-blue-100 rounded-2xl outline-none focus:border-blue-500 shadow-md placeholder:text-slate-300 transition-all"
                      onChange={handleChange}
                    />
                  </div>
                )}
                {errors.category && <p className="text-[10px] text-red-500 font-bold mt-1 ml-2 italic">{errors.category}</p>}
              </div>

              {/* Location Section */}
              <div className="group mt-6">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2 block ml-1 group-focus-within:text-blue-500 transition-colors">
                  Location *
                </label>
                <div className="relative">
                  <MapPin className={`absolute left-4 top-[18px] transition-colors duration-300 ${formData.location ? 'text-blue-500' : 'text-slate-400'}`} size={18} />
                  <select
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full pl-12 pr-10 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all appearance-none cursor-pointer hover:bg-white shadow-inner"
                  >
                    <option value="">Select Location</option>
                    {locationOptions.map((loc) => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 4l4 4 4-4"/></svg>
                  </div>
                </div>
                {formData.location === "Other" && (
                  <div className="animate-in slide-in-from-top-2 duration-300">
                    <input
                      type="text"
                      name="location_other"
                      value={formData.location_other}
                      placeholder="Enter specific location..."
                      className="mt-3 w-full px-5 py-3 bg-white border-2 border-blue-100 rounded-2xl outline-none focus:border-blue-500 shadow-md placeholder:text-slate-300 transition-all"
                      onChange={handleChange}
                    />
                  </div>
                )}
                {errors.location && <p className="text-[10px] text-red-500 font-bold mt-1 ml-2 italic">{errors.location}</p>}
              </div>

              {/* Description */}
              <div className="space-y-2 group">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2 block ml-1 italic group-focus-within:text-blue-500 transition-colors">Detailed Description</label>
                <div className="relative">
                  <AlignLeft className="absolute left-4 top-4 text-slate-400" size={18} />
                  <textarea
                    name="description" value={formData.description} onChange={handleChange}
                    placeholder="Any specific marks, brand, or content inside?"
                    rows={3} className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-blue-500 focus:bg-white transition-all shadow-inner focus:scale-[1.01]"
                  />
                </div>
              </div>

              {/* Image Upload Area */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2 block ml-1 tracking-widest">Upload Evidence Photo *</label>
                <div className={`relative border-2 border-dashed rounded-[2rem] p-6 transition-all duration-300 flex flex-col items-center justify-center min-h-[180px] ${previewUrl ? 'border-blue-400 bg-blue-50/20' : 'border-slate-200 hover:border-blue-400 hover:bg-slate-50'}`}>
                  {previewUrl ? (
                    <div className="relative w-full h-44 animate-in zoom-in-95 duration-500">
                      <img src={previewUrl} className="w-full h-full object-contain rounded-2xl shadow-lg" alt="preview" />
                      <button 
                        type="button"
                        onClick={() => { setPreviewUrl(null); setFormData(p => ({...p, image: null})) }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white p-2.5 rounded-2xl shadow-xl hover:bg-red-600 hover:scale-110 transition active:scale-95"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  ) : (
                    <div className="text-center group cursor-pointer">
                      <div className="p-5 bg-white rounded-[1.5rem] shadow-sm mb-3 group-hover:scale-110 group-hover:shadow-md transition-all duration-300 inline-block">
                        <Upload className="text-blue-600" size={28} />
                      </div>
                      <p className="text-sm font-bold text-slate-700">Click or drag to upload photo</p>
                      <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest">PNG, JPG up to 2MB</p>
                    </div>
                  )}
                  <input type="file" name="image" accept="image/*" onChange={handleChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>
                {errors.image && <p className="text-[10px] text-red-500 font-bold ml-2 italic">{errors.image}</p>}
              </div>

              {/* Feedback Alerts */}
              {success && (
                <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-100 p-5 rounded-[1.5rem] text-emerald-700 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <CheckCircle2 size={22} className="text-emerald-500" />
                  <p className="text-sm font-bold tracking-tight leading-relaxed">{success}</p>
                </div>
              )}
              {submitError && (
                <div className="flex items-center gap-3 bg-red-50 border border-red-100 p-5 rounded-[1.5rem] text-red-700 font-bold text-sm animate-pulse">
                  <AlertCircle size={20} /> {submitError}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || Object.keys(errors).length > 0}
                className={`w-full py-5 rounded-[1.5rem] text-white font-extrabold text-lg shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3 ${
                  activeTab === "lost" 
                    ? "bg-blue-600 shadow-blue-200 hover:bg-blue-700" 
                    : "bg-emerald-600 shadow-emerald-200 hover:bg-emerald-700"
                } ${loading || Object.keys(errors).length > 0 ? "opacity-50 cursor-not-allowed shadow-none" : "hover:shadow-2xl hover:-translate-y-1.5"}`}
              >
                {loading ? <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" /> : `Submit ${activeTab === "lost" ? "Lost" : "Found"} Report`}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}