import React, { useState, useEffect } from "react";
import axios from "axios";
import { X, Info, Phone, MapPin, FileText, UploadCloud, FilePenLine } from "lucide-react";
import { supabase } from "../supabaseClient.js"; 

const ClaimFormModal = ({ item, onClose }) => {
  const [formData, setFormData] = useState({
    description: "",
    evidenceText: "",
    contactNumber: "",
    meetingLocation: "",
    meetingTime: "",
  });
  
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userObj = JSON.parse(storedUser);
      setCurrentUserId(userObj.userId || userObj._id); 
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // --- Supabase Upload Logic ---
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let imageUrl = null;

      
      if (selectedFile) {
        imageUrl = await uploadImageToSupabase(selectedFile);
      }

      
      const payload = {
        ...formData,
        evidenceImage: imageUrl, 
        itemId: item.itemId,
        userId: currentUserId,
      };

      const response = await axios.post("http://localhost:5000/api/claims", payload);

      if (response.data.success) {
        alert("Claim submitted successfully with evidence!");
        onClose();
      }
    } catch (err) {
      setError(err.message || "Failed to submit claim.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-md bg-black/40">
      <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
        
        {/* Header */}
        <div className="p-6 border-b bg-blue-50 flex justify-between items-center relative">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-white shadow-sm">
              <img src={item.image_url} alt="item" className="w-full h-full object-cover" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{item.title}</h2>
              <p className="text-xs text-blue-600 font-medium">Claiming Item: {item.itemId}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors">
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 custom-scrollbar text-left">
          
          {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 italic">⚠️ {error}</div>}

          {/* Evidence Description */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
              <FilePenLine size={16} className="text-blue-500" /> Why is this yours? *
            </label>
            <textarea
              name="description"
              required
              placeholder="Describe marks, scratches, or contents inside..."
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:ring-2 focus:ring-blue-500/20 outline-none min-h-[90px]"
              onChange={handleChange}
            />
          </div>

          {/* Grid for Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Contact Number *</label>
              <input type="text" name="contactNumber" required placeholder="07XXXXXXXX" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500" onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Meeting Location *</label>
              <input type="text" name="meetingLocation" required placeholder="e.g. Library" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500" onChange={handleChange} />
            </div>
          </div>

          {/* Evidence Text */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Evidence Note *</label>
            <input type="text" name="evidenceText" required placeholder="e.g. My ID card is inside the second pocket" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500" onChange={handleChange} />
          </div>

          {/* Image Upload Box */}
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

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-2xl font-bold text-white shadow-lg transition-all ${
              loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700 active:scale-95"
            }`}
          >
            {loading ? "Uploading & Submitting..." : "Submit Claim Request"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ClaimFormModal;