"use client";

import { useState, useEffect } from "react";
import Navbar from "../components/Navbar.jsx";
import uploadMediaToSupabase from "../supabaseClient.js";
import api from "../api/axios.js";
import { Upload, MapPin, Tag, Palette, Type, AlignLeft, CheckCircle2, AlertCircle, X } from "lucide-react";

export default function ReportItemPage() {
  const [activeTab, setActiveTab] = useState("lost");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    color: "",
    location: "",
    image: null,
  });

  // Color options (Buttons ලෙස පාවිච්චි කිරීමට)
  const colorOptions = [
    { name: "Black", hex: "#000000" },
    { name: "White", hex: "#FFFFFF" },
    { name: "Red", hex: "#EF4444" },
    { name: "Blue", hex: "#3B82F6" },
    { name: "Green", hex: "#10B981" },
    { name: "Silver", hex: "#94A3B8" },
    { name: "Gold", hex: "#F59E0B" },
  ];

  const [previewUrl, setPreviewUrl] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    const newErrors = {};
    if (!formData.title) newErrors.title = "Title is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.location) newErrors.location = "Location is required";
    if (!formData.image) newErrors.image = "Image is required";
    setErrors(newErrors);
  }, [formData]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      const file = files[0];
      setFormData((prev) => ({ ...prev, image: file }));
      if (file) setPreviewUrl(URL.createObjectURL(file));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
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

      await api.post("/items", {
        ...formData,
        status: activeTab,
        image_url: imageUrl,
      });

      setSuccess(`The ${activeTab} item has been reported successfully!`);
      setFormData({ title: "", description: "", category: "", color: "", location: "", image: null });
      setPreviewUrl(null);
    } catch (err) {
      setSubmitError(err.response?.data?.message || "Submission failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      <Navbar />
      <div className="pt-32 px-4 max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-2 tracking-tight">Report an Item</h1>
          <p className="text-slate-500 italic">Provide accurate details to speed up the recovery process.</p>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/60 overflow-hidden border border-slate-100 flex flex-col md:flex-row">
          {/* Left Side Info */}
          <div className={`md:w-1/3 p-10 text-white flex flex-col justify-center transition-colors duration-700 ${activeTab === 'lost' ? 'bg-blue-600' : 'bg-emerald-600'}`}>
            <h2 className="text-3xl font-bold mb-4 capitalize italic">{activeTab} Info</h2>
            <p className="text-white/80 text-sm leading-relaxed mb-10">
              Our system matches items based on title, category, and especially <b>color</b>. Please be specific.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-3 bg-white/10 p-4 rounded-2xl backdrop-blur-md border border-white/10">
                <CheckCircle2 size={20} />
                <span className="text-sm font-semibold italic tracking-wide">Verified Community</span>
              </div>
              <div className="flex items-center gap-3 bg-white/10 p-4 rounded-2xl backdrop-blur-md border border-white/10">
                <AlertCircle size={20} />
                <span className="text-sm font-semibold italic tracking-wide">Quick Matching</span>
              </div>
            </div>
          </div>

          {/* Right Side Form */}
          <div className="md:w-2/3 p-8 md:p-12">
            <div className="flex p-1 bg-slate-100 rounded-2xl mb-8 w-fit">
              {["lost", "found"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-8 py-2.5 rounded-xl text-sm font-bold transition-all capitalize ${activeTab === tab ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                >
                  {tab} Item
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Item Title */}
              <div className="relative">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2 block ml-1">Item Title *</label>
                <div className="relative">
                  <Type className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="text" name="title" value={formData.title} onChange={handleChange}
                    placeholder="e.g. Blue Nike Backpack"
                    className={`w-full pl-12 pr-4 py-4 bg-slate-50 border rounded-2xl outline-none transition focus:ring-4 ${errors.title ? 'border-red-300 focus:ring-red-50' : 'border-slate-200 focus:ring-blue-50 focus:border-blue-500'}`}
                  />
                </div>
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
                      className={`group flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all ${formData.color === c.name ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-100' : 'border-slate-200 hover:border-slate-300'}`}
                    >
                      <span className="w-4 h-4 rounded-full border border-slate-200 shadow-inner" style={{ backgroundColor: c.hex }}></span>
                      <span className={`text-xs font-bold tracking-tight ${formData.color === c.name ? 'text-blue-600' : 'text-slate-500'}`}>{c.name}</span>
                    </button>
                  ))}
                  {/* Custom color option */}
                  <input 
                    type="text" name="color" value={formData.color} onChange={handleChange}
                    placeholder="Other..."
                    className="flex-1 min-w-[100px] text-xs font-bold px-4 py-1.5 rounded-full border border-slate-200 bg-slate-50 outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Category & Location Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2 block ml-1">Category *</label>
                  <div className="relative">
                    <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input type="text" name="category" value={formData.category} onChange={handleChange} placeholder="Electronics" className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition"/>
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2 block ml-1">Location *</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="Main Library" className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition"/>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2 block ml-1 italic">Detailed Description</label>
                <div className="relative">
                  <AlignLeft className="absolute left-4 top-4 text-slate-400" size={18} />
                  <textarea
                    name="description" value={formData.description} onChange={handleChange}
                    placeholder="Any specific marks, brand, or content inside?"
                    rows={3} className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-blue-500 transition shadow-sm"
                  />
                </div>
              </div>

              {/* Image Upload Area */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2 block ml-1 tracking-widest">Upload Evidence Photo *</label>
                <div className={`relative border-2 border-dashed rounded-[2rem] p-6 transition-all flex flex-col items-center justify-center min-h-[160px] ${previewUrl ? 'border-blue-400 bg-blue-50/20' : 'border-slate-200 hover:border-blue-400 hover:bg-slate-50'}`}>
                  {previewUrl ? (
                    <div className="relative w-full h-40">
                      <img src={previewUrl} className="w-full h-full object-contain rounded-2xl" alt="preview" />
                      <button 
                        type="button"
                        onClick={() => { setPreviewUrl(null); setFormData(p => ({...p, image: null})) }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white p-2 rounded-xl shadow-lg hover:bg-red-600 transition"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="text-center group">
                      <div className="p-4 bg-white rounded-2xl shadow-sm mb-3 group-hover:scale-110 transition-transform inline-block">
                        <Upload className="text-blue-600" size={24} />
                      </div>
                      <p className="text-sm font-bold text-slate-700">Click to upload photo</p>
                      <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest">PNG, JPG up to 2MB</p>
                    </div>
                  )}
                  <input type="file" name="image" accept="image/*" onChange={handleChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>
              </div>

              {/* Feedback Alerts */}
              {success && (
                <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-100 p-5 rounded-2xl text-emerald-700 animate-in fade-in slide-in-from-bottom-2">
                  <CheckCircle2 size={18} />
                  <p className="text-sm font-bold">{success}</p>
                </div>
              )}
              {submitError && (
                <div className="flex items-center gap-3 bg-red-50 border border-red-100 p-5 rounded-2xl text-red-700 font-bold text-sm animate-pulse">
                  <AlertCircle size={18} /> {submitError}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || Object.keys(errors).length > 0}
                className={`w-full py-4 rounded-2xl text-white font-extrabold text-lg shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 ${
                  activeTab === "lost" 
                    ? "bg-blue-600 shadow-blue-200" 
                    : "bg-emerald-600 shadow-emerald-200"
                } ${loading || Object.keys(errors).length > 0 ? "opacity-50 cursor-not-allowed shadow-none" : "hover:shadow-xl hover:-translate-y-1"}`}
              >
                {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : `Submit ${activeTab === "lost" ? "Lost" : "Found"} Report`}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}