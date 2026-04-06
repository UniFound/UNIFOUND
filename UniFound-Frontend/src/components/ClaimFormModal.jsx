import React, { useState, useEffect } from "react";
import axios from "axios";
import { X, Info, Clock, MapPin, UploadCloud, FilePenLine, ArrowLeft, PartyPopper, Tag, Palette } from "lucide-react";
import { supabase } from "../supabaseClient.js"; 

const ClaimFormModal = ({ item, onClose }) => {
  const [formData, setFormData] = useState({
    description: "",
    evidenceText: "",
    contactNumber: "",
    meetingLocation: "",
    location_other: "", // 👈 "Other" location එකක් දැම්මොත් save වෙන්න
    meetingTime: "", 
    category: "", 
    color: "",    
  });
  
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userData, setUserData] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  
  const [formErrors, setFormErrors] = useState({});
  const [submittedSuccessfully, setSubmittedSuccessfully] = useState(false);

  // Colors & Categories (Report form එකේ ඒවාමයි)
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
  
  // Report form එකේ තියෙන locations ටිකම මෙතනටත් දැම්මා
  const locationOptions = ["Basement", "Canteen", "New Building", "Main Building", "Near the Beach", "Library", "Anohana Canteen", "Office Area", "Other"];

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userObj = JSON.parse(storedUser);
      setUserData(userObj);
    }
  }, []);

  // --- Live Validation Logic ---
  useEffect(() => {
    const errors = {};
    if (formData.description && formData.description.length < 10) {
      errors.description = "Please provide a bit more detail (min 10 chars).";
    }
    if (formData.contactNumber && formData.contactNumber.length !== 10) {
      errors.contactNumber = "Phone number must be exactly 10 digits.";
    }
    if (formData.evidenceText && formData.evidenceText.length < 5) {
      errors.evidenceText = "Evidence note is too short.";
    }
    if (formData.meetingLocation === "Other" && !formData.location_other) {
      errors.meetingLocation = "Please specify location";
    }
    setFormErrors(errors);
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "contactNumber") {
      if (value !== "" && !/^\d+$/.test(value)) return; 
      if (value.length > 10) return; 
    }

    if (name === "evidenceText" || name === "location_other") {
      if (/\d/.test(value)) {
        setFormErrors(prev => ({ ...prev, [name]: "Numbers are not allowed here." }));
        return; 
      }
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const uploadImageToSupabase = async (file) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}-${Date.now()}.${fileExt}`;
      const filePath = `evidence/${fileName}`;
      const { data, error: uploadError } = await supabase.storage
        .from('unifound-images') 
        .upload(filePath, file);
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage
        .from('unifound-images')
        .getPublicUrl(filePath);
      return publicUrl;
    } catch (err) {
      console.error("Supabase upload error:", err);
      throw new Error("Image upload failed");
    }
  };

  const handleProceedToPreview = (e) => {
    e.preventDefault();
    if (Object.keys(formErrors).length === 0 && formData.description && formData.contactNumber) {
      setShowPreview(true);
    }
  };

  const handleFinalSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      let imageUrl = null;
      if (selectedFile) {
        imageUrl = await uploadImageToSupabase(selectedFile);
      }

      const payload = {
        itemId: item._id || item.id, 
        userId: userData?.userId || userData?._id, 
        lostItemId: null, 
        description: formData.description,
        evidenceText: formData.evidenceText,
        evidenceImage: imageUrl, 
        contactNumber: formData.contactNumber,
        email: userData?.email || "user@example.com",
        meetingLocation: formData.meetingLocation === "Other" ? formData.location_other : formData.meetingLocation,
        meetingTime: formData.meetingTime,
        category: formData.category, 
        color: formData.color,       
      };

      console.log("🚀 [Frontend] Sending Payload:", payload);
      const response = await axios.post("http://localhost:5000/api/claims", payload);

      if (response.status === 201 || response.status === 200) {
        setFormData({
            description: "",
            evidenceText: "",
            contactNumber: "",
            meetingLocation: "",
            location_other: "",
            meetingTime: "",
            category: "",
            color: "",
        });
        setSelectedFile(null);
        setPreviewUrl(null);
        setSubmittedSuccessfully(true); 
      }
    } catch (err) {
      console.error("🔥 Axios Error:", err);
      setError(err.response?.data?.message || "Failed to submit claim.");
    } finally {
      setLoading(false);
    }
  };

  const isFormInvalid = !formData.description || !formData.contactNumber || !formData.meetingLocation || !formData.evidenceText || !formData.meetingTime || !formData.category || !formData.color || Object.keys(formErrors).length > 0;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-md bg-black/40">
      <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
        
        {/* Header */}
        {!submittedSuccessfully && (
            <div className="p-6 border-b bg-blue-50 flex justify-between items-center relative">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-white shadow-sm">
                        <img src={item.image_url} alt="item" className="w-full h-full object-cover" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">{item.title}</h2>
                        <p className="text-xs text-blue-600 font-medium">Claiming Item: {item.itemId || "N/A"}</p>
                    </div>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors">
                    <X size={20} className="text-gray-400" />
                </button>
            </div>
        )}

        {/* UI Logic */}
        {submittedSuccessfully ? (
          <div className="p-10 flex flex-col items-center text-center space-y-6 animate-in fade-in zoom-in duration-300">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 shadow-inner">
              <PartyPopper size={40} />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-gray-900">Success!</h2>
              <p className="text-gray-500 text-sm leading-relaxed">
                You have submitted the claim successfully.<br />
                Our team will review your evidence and get back to you soon.
              </p>
            </div>
            <button onClick={onClose} className="w-full py-4 bg-gray-900 hover:bg-black text-white rounded-2xl font-bold shadow-lg transition-all active:scale-95">
              Close and Continue
            </button>
          </div>

        ) : !showPreview ? (
          <form onSubmit={handleProceedToPreview} className="p-6 overflow-y-auto space-y-5 custom-scrollbar text-left">
            {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 italic">⚠️ {error}</div>}

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                <FilePenLine size={16} className="text-blue-500" /> Why is this yours? *
              </label>
              <textarea name="description" required placeholder="Describe marks, scratches, or contents inside..." className={`w-full p-4 bg-gray-50 border rounded-2xl text-sm outline-none transition-all ${formErrors.description ? 'border-red-300 ring-2 ring-red-50' : 'border-gray-200 focus:ring-2 focus:ring-blue-500/20'}`} onChange={handleChange} value={formData.description} />
              {formErrors.description && <p className="text-[10px] text-red-500 font-bold italic ml-2">{formErrors.description}</p>}
            </div>

            {/* Category Selection */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 flex items-center gap-1">
                <Tag size={14} className="text-gray-500" /> Category *
              </label>
              <select name="category" value={formData.category} onChange={handleChange} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500">
                <option value="">Select Category</option>
                {categoryOptions.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Color Selection */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 flex items-center gap-1">
                <Palette size={14} className="text-gray-500" /> Item Color *
              </label>
              <div className="flex flex-wrap gap-2">
                {colorOptions.map((c) => (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => setFormData({ ...formData, color: c.name })}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold transition-all ${formData.color === c.name ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                  >
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: c.hex }}></span>
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Contact Number *</label>
                <input type="text" name="contactNumber" required placeholder="07XXXXXXXX" className={`w-full p-3 bg-gray-50 border rounded-xl text-sm outline-none ${formErrors.contactNumber ? 'border-red-300' : 'border-gray-200 focus:border-blue-500'}`} onChange={handleChange} value={formData.contactNumber} />
                {formErrors.contactNumber && <p className="text-[10px] text-red-500 font-bold italic">{formErrors.contactNumber}</p>}
              </div>
              
              {/* Meeting Location Dropdown */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 flex items-center gap-1">
                   <MapPin size={14} className="text-gray-500" /> Meeting Location *
                </label>
                <select name="meetingLocation" value={formData.meetingLocation} onChange={handleChange} className={`w-full p-3 bg-gray-50 border rounded-xl text-sm outline-none focus:border-blue-500 ${formErrors.meetingLocation ? 'border-red-300' : 'border-gray-200'}`}>
                  <option value="">Select Location</option>
                  {locationOptions.map((loc) => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
                
                {formData.meetingLocation === "Other" && (
                  <input type="text" name="location_other" required placeholder="Specify location..." className="mt-2 w-full p-3 bg-white border border-blue-200 rounded-xl text-sm outline-none focus:border-blue-500 shadow-sm" onChange={handleChange} value={formData.location_other} />
                )}
                {formErrors.meetingLocation && <p className="text-[10px] text-red-500 font-bold italic">{formErrors.meetingLocation}</p>}
              </div>
            </div>

            {/* DateTime Picker Input */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 flex items-center gap-1">
                <Clock size={14} className="text-gray-500" /> Preferred Meeting Date & Time *
              </label>
              <input 
                type="datetime-local" 
                name="meetingTime" 
                required 
                className="w-full p-3 bg-gray-50 border border-gray-200 focus:border-blue-500 rounded-xl text-sm outline-none cursor-pointer" 
                onChange={handleChange} 
                value={formData.meetingTime} 
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Evidence Note *</label>
              <input type="text" name="evidenceText" required placeholder="e.g. My ID card is inside the second pocket" className={`w-full p-3 bg-gray-50 border rounded-xl text-sm outline-none ${formErrors.evidenceText ? 'border-red-300' : 'border-gray-200 focus:border-blue-500'}`} onChange={handleChange} value={formData.evidenceText} />
              {formErrors.evidenceText && <p className="text-[10px] text-red-500 font-bold italic">{formErrors.evidenceText}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                <UploadCloud size={16} className="text-blue-500" /> Proof Image (Receipt/Photo)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-2xl p-4 bg-gray-50 hover:bg-blue-50 transition-all flex flex-col items-center justify-center relative min-h-[140px]">
                {previewUrl ? (
                  <img src={previewUrl} className="max-h-32 rounded-lg" alt="Preview" />
                ) : (
                  <>
                    <UploadCloud className="w-8 h-8 text-gray-400 mb-2" />
                    <p className="text-[10px] text-gray-500">Click to upload from your computer</p>
                  </>
                )}
                <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileChange} />
              </div>
            </div>

            <button type="submit" disabled={isFormInvalid} className={`w-full py-4 rounded-2xl font-bold text-white shadow-lg transition-all active:scale-95 ${isFormInvalid ? 'bg-gray-300 cursor-not-allowed shadow-none' : 'bg-blue-600 hover:bg-blue-700'}`}>
              Review Claim Details
            </button>
          </form>
        ) : (
          /* Preview Section */
          <div className="p-8 overflow-y-auto space-y-6 custom-scrollbar text-left">
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-xl">
                <h3 className="text-sm font-bold text-yellow-800 flex items-center gap-2">
                  <Info size={18} /> Confirm Your Details
                </h3>
                <p className="text-xs text-yellow-700 mt-1">Please review before final submission.</p>
              </div>

              <div className="space-y-4">
                <div className="flex flex-col gap-1">
                   <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400">Explanation</span>
                   <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-xl border">{formData.description}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400">Category</span>
                    <p className="font-medium text-gray-800">{formData.category}</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400">Color</span>
                    <p className="font-medium text-gray-800">{formData.color}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400">Contact</span>
                    <p className="font-medium text-gray-800">{formData.contactNumber}</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400">Location</span>
                    <p className="font-medium text-gray-800">
                      {formData.meetingLocation === "Other" ? formData.location_other : formData.meetingLocation}
                    </p>
                  </div>
                </div>

                <div>
                   <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400">Meeting Date & Time</span>
                   <p className="text-sm font-medium text-gray-800 bg-gray-50 p-3 rounded-xl border">
                     {new Date(formData.meetingTime).toLocaleString()}
                   </p>
                </div>
              </div>

              <div className="flex gap-4">
                <button onClick={() => setShowPreview(false)} className="w-1/3 py-3 border border-gray-300 rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
                  <ArrowLeft size={16} /> Back
                </button>
                <button onClick={handleFinalSubmit} disabled={loading} className="w-2/3 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-100 transition-all flex items-center justify-center">
                  {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Submit Claim"}
                </button>
              </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClaimFormModal;