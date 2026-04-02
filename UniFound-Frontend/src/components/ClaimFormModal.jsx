import React, { useState, useEffect } from "react";
import axios from "axios";
import { X, Info, Phone, MapPin, FileText, UploadCloud, FilePenLine, CheckCircle, ArrowLeft, PartyPopper } from "lucide-react";
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
  const [userData, setUserData] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  
  // New State for Live Validations
  const [formErrors, setFormErrors] = useState({});
  const [submittedSuccessfully, setSubmittedSuccessfully] = useState(false);

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
    setFormErrors(errors);
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // 1. Contact Number ekata numbers witharakma gahanna denna
    if (name === "contactNumber") {
      if (value !== "" && !/^\d+$/.test(value)) return; // Block non-numeric characters
      if (value.length > 10) return; // Block more than 10 digits
    }

    // 2. Meeting Location saha Evidence Note walata numbers block kirima
    if (name === "meetingLocation" || name === "evidenceText") {
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
    // Final check before preview
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
        ...formData,
        evidenceImage: imageUrl, 
        itemId: item._id, 
        userId: userData?.userId || userData?._id,
        email: userData?.email || "user@example.com",
      };

      const response = await axios.post("http://localhost:5000/api/claims", payload);
      
      if (response.status === 201 || response.status === 200) {
        setFormData({
            description: "",
            evidenceText: "",
            contactNumber: "",
            meetingLocation: "",
            meetingTime: "",
        });
        setSelectedFile(null);
        setPreviewUrl(null);
        setSubmittedSuccessfully(true);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to submit claim.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Helper to check if form is valid
  const isFormInvalid = !formData.description || !formData.contactNumber || !formData.meetingLocation || !formData.evidenceText || Object.keys(formErrors).length > 0;

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
                        <p className="text-xs text-blue-600 font-medium">Claiming Item: {item.itemId}</p>
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
            <button 
              onClick={onClose}
              className="w-full py-4 bg-gray-900 hover:bg-black text-white rounded-2xl font-bold shadow-lg transition-all active:scale-95"
            >
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Contact Number *</label>
                <input type="text" name="contactNumber" required placeholder="07XXXXXXXX" className={`w-full p-3 bg-gray-50 border rounded-xl text-sm outline-none ${formErrors.contactNumber ? 'border-red-300' : 'border-gray-200 focus:border-blue-500'}`} onChange={handleChange} value={formData.contactNumber} />
                {formErrors.contactNumber && <p className="text-[10px] text-red-500 font-bold italic">{formErrors.contactNumber}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Meeting Location *</label>
                <input type="text" name="meetingLocation" required placeholder="e.g. Library" className={`w-full p-3 bg-gray-50 border rounded-xl text-sm outline-none ${formErrors.meetingLocation ? 'border-red-300' : 'border-gray-200 focus:border-blue-500'}`} onChange={handleChange} value={formData.meetingLocation} />
                {formErrors.meetingLocation && <p className="text-[10px] text-red-500 font-bold italic">{formErrors.meetingLocation}</p>}
              </div>
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

            <button 
              type="submit" 
              disabled={isFormInvalid}
              className={`w-full py-4 rounded-2xl font-bold text-white shadow-lg transition-all active:scale-95 ${isFormInvalid ? 'bg-gray-300 cursor-not-allowed shadow-none' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              Review Claim Details
            </button>
          </form>
        ) : (
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
                <div className="grid grid-cols-2 gap-4 text-sm font-medium">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-gray-400 block">Contact</span>
                    {formData.contactNumber}
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-gray-400 block">Location</span>
                    {formData.meetingLocation}
                  </div>
                </div>
                {previewUrl && (
                  <img src={previewUrl} className="w-full h-32 object-cover rounded-xl border" alt="Preview" />
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <button onClick={() => setShowPreview(false)} disabled={loading} className="flex-1 py-3 rounded-xl font-bold text-gray-600 border hover:bg-gray-50 flex items-center justify-center gap-2">
                  <ArrowLeft size={18} /> Edit
                </button>
                <button 
                  onClick={handleFinalSubmit}
                  disabled={loading}
                  className={`flex-[2] py-3 rounded-xl font-bold text-white shadow-lg flex items-center justify-center gap-2 ${
                    loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700 active:scale-95"
                  }`}
                >
                  {loading ? "Submitting..." : <><CheckCircle size={18} /> Confirm & Submit</>}
                </button>
              </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClaimFormModal;