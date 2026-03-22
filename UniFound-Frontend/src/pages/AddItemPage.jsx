import React, { useState, useEffect } from "react";
import axios from "axios";
import { supabase } from "../supabaseClient";

const AddItemPage = () => {
  const [user, setUser] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    color: "",
    status: "lost",
    location: "",
  });

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    getUser();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) setPreview(URL.createObjectURL(file));
  };

  const uploadImage = async () => {
    if (!imageFile) return "";
    const fileName = `${Date.now()}-${imageFile.name}`;
    const { error } = await supabase.storage.from("items").upload(fileName, imageFile);
    if (error) { alert("Image upload failed"); return ""; }
    const { data } = supabase.storage.from("items").getPublicUrl(fileName);
    return data.publicUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ❌ LOGIN CHECK TEMPORARILY DISABLED
    // if (!user) {
    //   alert("Please login first");
    //   return;
    // }

    setLoading(true);
    try {
      const imageUrl = await uploadImage();

      await axios.post("http://localhost:5000/api/items", {
        ...formData,
        image_url: imageUrl,
        user_email: user?.email || "guest", // fallback
      });

      alert("✅ Item Added Successfully");

      setFormData({
        title: "",
        description: "",
        category: "",
        color: "",
        status: "lost",
        location: "",
      });

      setPreview("");
      setImageFile(null);

    } catch (err) {
      alert("❌ Error adding item");
    } finally {
      setLoading(false);
    }
  };

  // ICON
  const IconLocation = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6 font-sans">

      {/* Blur BG */}
      <div className="fixed -top-24 -left-24 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-60"></div>
      <div className="fixed -bottom-24 -right-24 w-96 h-96 bg-indigo-100 rounded-full blur-3xl opacity-60"></div>

      <div className="relative z-10 w-full max-w-6xl bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.05)] border border-white overflow-hidden grid md:grid-cols-2">
        
        {/* LEFT */}
        <div className="p-8 md:p-14">
          <div className="mb-10">
            <span className="bg-blue-600/10 text-blue-600 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest">
              Smart Campus Solution
            </span>
            <h2 className="text-4xl font-extrabold text-slate-900 mt-5">Add New Item</h2>
            <p className="text-slate-500 mt-2 font-medium">Create a post to find or return an item.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* TITLE */}
            <div>
              <label className="text-sm font-bold text-slate-700 mb-2 block">Item Name</label>
              <input
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                placeholder="e.g. Silver Macbook Air"
              />
            </div>

            {/* CATEGORY + COLOR */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-bold text-slate-700 mb-2 block">Category</label>
                <input
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4"
                  placeholder="Electronics"
                />
              </div>

              <div>
                <label className="text-sm font-bold text-slate-700 mb-2 block">Color</label>
                <input
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4"
                  placeholder="Optional"
                />
              </div>
            </div>

            {/* LOCATION + STATUS */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-bold text-slate-700 mb-2 block">Location</label>
                <input
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4"
                  placeholder="Where?"
                />
              </div>

              <div>
                <label className="text-sm font-bold text-slate-700 mb-2 block">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4"
                >
                  <option value="lost">🔴 Lost</option>
                  <option value="found">🟢 Found</option>
                </select>
              </div>
            </div>

            {/* ✅ DESCRIPTION FIELD */}
            <div>
              <label className="text-sm font-bold text-slate-700 mb-2 block">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 resize-none"
                placeholder="Add more details about the item..."
              />
            </div>

            {/* IMAGE */}
            <div>
              <label className="text-sm font-bold text-slate-700 mb-2 block">Upload Photo</label>
              <div className="relative border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center">
                <input type="file" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                <p className="text-slate-400">Click to select file</p>
              </div>
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold text-lg"
            >
              {loading ? "Processing..." : "Submit Report"}
            </button>

          </form>
        </div>

        {/* RIGHT PREVIEW */}
        <div className="hidden md:flex bg-gradient-to-br from-[#EEF2FF] to-[#E0E7FF] items-center justify-center p-10">

          <div className="w-full max-w-[320px] bg-white rounded-[2rem] shadow-2xl p-6">

            <div className="w-full h-52 bg-slate-50 rounded-2xl mb-5 flex items-center justify-center">
              {preview ? (
                <img src={preview} className="w-full h-full object-cover rounded-2xl" />
              ) : (
                <span className="text-slate-300">Preview Image</span>
              )}
            </div>

            <h3 className="font-bold text-xl">{formData.title || "Your Item Title"}</h3>

            <p className="text-sm text-gray-400 mt-2">
              {formData.description || "Item description will appear here..."}
            </p>

            <div className="flex justify-between mt-4 text-sm text-gray-500">
              <span className="flex items-center">
                <IconLocation /> {formData.location || "Location"}
              </span>
              <span>{formData.status}</span>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default AddItemPage;