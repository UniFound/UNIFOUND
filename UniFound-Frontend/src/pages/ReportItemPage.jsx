"use client";

import { useState, useEffect } from "react";
import Navbar from "../components/Navbar.jsx";
import uploadMediaToSupabase from "../supabaseClient.js";
import api from "../api/axios.js";
import { Upload, MapPin, Tag, Palette, Type, AlignLeft, CheckCircle2, AlertCircle, X } from "lucide-react";

const API_BASE_URL = 'http://localhost:5000/api';

export default function ReportItemPage() {
  const [activeTab, setActiveTab] = useState("lost");
  const [categories, setCategories] = useState([]);
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

  const locationOptions = ["Basement", "Canteen", "New Building", "Main Building", "Near the Beach", "Library", "Anohana Canteen", "Office Area", "Other"];

  // Fetch categories from backend
  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/categories/active`);
      const data = await response.json();
      setCategories(data.data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  // Load categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // --- Live Validation Logic ---
  useEffect(() => {
    const newErrors = {};
    
    // Title Validation
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

    // --- Block Numbers Logic ---
    // Title, Color, saha "Other" fields walata numbers gahanna bari wenna block karanawa
    if (["title", "color", "category_other", "location_other"].includes(name)) {
      const containsNumber = /\d/.test(value);
      if (containsNumber) {
        // Numbers thiyenawa nam state eka update karanne na (block karanawa)
        // User ta message ekak pennanna ona nam mehema karanna puluwan:
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

      const payload = {
        ...formData,
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
                  type="button"
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
                  <Type className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${errors.title ? 'text-red-400' : 'text-slate-400'}`} size={18} />
                  <input
                    type="text" name="title" value={formData.title} onChange={handleChange}
                    placeholder="e.g. Blue Nike Backpack"
                    className={`w-full pl-12 pr-4 py-4 bg-slate-50 border rounded-2xl outline-none transition focus:ring-4 ${errors.title ? 'border-red-300 focus:ring-red-50 focus:border-red-400' : 'border-slate-200 focus:ring-blue-50 focus:border-blue-500'}`}
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
                      className={`group flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all ${formData.color === c.name ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-100' : 'border-slate-200 hover:border-slate-300'}`}
                    >
                      <span className="w-4 h-4 rounded-full border border-slate-200 shadow-inner" style={{ backgroundColor: c.hex }}></span>
                      <span className={`text-xs font-bold tracking-tight ${formData.color === c.name ? 'text-blue-600' : 'text-slate-500'}`}>{c.name}</span>
                    </button>
                  ))}
                  <input 
                    type="text" name="color" value={formData.color} onChange={handleChange}
                    placeholder="Other..."
                    className="flex-1 min-w-[100px] text-xs font-bold px-4 py-1.5 rounded-full border border-slate-200 bg-slate-50 outline-none focus:border-blue-500"
                  />
                </div>
                {errors.color && <p className="text-[10px] text-red-500 font-bold italic">{errors.color}</p>}
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
                    className="w-full pl-12 pr-10 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all appearance-none cursor-pointer hover:bg-white"
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat.name}>{cat.name}</option>
                    ))}
                    <option value="Other">Other</option>
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
                      className="mt-3 w-full px-5 py-3 bg-white border-2 border-blue-100 rounded-2xl outline-none focus:border-blue-500 shadow-sm placeholder:text-slate-300 transition-all"
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
                    className="w-full pl-12 pr-10 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all appearance-none cursor-pointer hover:bg-white"
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
                      className="mt-3 w-full px-5 py-3 bg-white border-2 border-blue-100 rounded-2xl outline-none focus:border-blue-500 shadow-sm placeholder:text-slate-300 transition-all"
                      onChange={handleChange}
                    />
                  </div>
                )}
                {errors.location && <p className="text-[10px] text-red-500 font-bold mt-1 ml-2 italic">{errors.location}</p>}
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
                {errors.image && <p className="text-[10px] text-red-500 font-bold ml-2 italic">{errors.image}</p>}
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