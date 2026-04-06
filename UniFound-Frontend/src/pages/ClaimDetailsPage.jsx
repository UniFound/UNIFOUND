import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  ArrowLeft, CheckCircle, XCircle, Clock, MapPin, 
  Tag, Calendar, Phone, Mail, User, ShieldCheck, 
  AlertTriangle, FileText, Image, ClipboardCheck, Palette
} from "lucide-react";

const ClaimDetailsPage = () => {
  const { claimId } = useParams();
  const navigate = useNavigate();
  
  const [claim, setClaim] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchClaimDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/api/claims/${claimId}`);
        setClaim(response.data);
      } catch (err) {
        console.error("Error fetching claim details:", err);
        setError("Failed to load claim details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchClaimDetails();
  }, [claimId]);

  const handleStatusUpdate = async (newStatus) => {
    try {
      setUpdating(true);
      const targetId = claim._id || claimId;

      const storedUser = localStorage.getItem("user");
      const adminUser = storedUser ? JSON.parse(storedUser) : null;
      
      await axios.put(`http://localhost:5000/api/claims/${targetId}`, {
        status: newStatus,
        updatedBy: adminUser?.userId || "Admin",
        adminNote: `Status updated to ${newStatus} by Admin`
      });
      
      setClaim(prev => ({ ...prev, status: newStatus }));
      alert(`Claim successfully ${newStatus}!`);
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Failed to update status.");
    } finally {
      setUpdating(false);
    }
  };

  const formatDateTime = (dateTimeStr) => {
    if (!dateTimeStr) return "N/A";
    try {
      const dateObj = new Date(dateTimeStr);
      return dateObj.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch (e) {
      return dateTimeStr;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA]">
        <div className="text-center">
          <div className="w-14 h-14 border-4 border-t-blue-600 border-gray-200 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500 font-bold text-sm">Loading Claim Details...</p>
        </div>
      </div>
    );
  }

  if (error || !claim) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA]">
        <div className="text-center bg-white p-10 rounded-[2.5rem] border shadow-sm max-w-md">
          <AlertTriangle size={48} className="text-red-500 mx-auto mb-4" />
          <p className="text-gray-800 font-black text-lg mb-2">Oops! Something went wrong</p>
          <p className="text-gray-500 text-sm mb-6">{error || "Claim not found."}</p>
          <button 
            onClick={() => navigate(-1)} 
            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const { itemData, userName, directMatchPercentage } = claim;

  const colorMap = {
    "black": "#000000",
    "white": "#FFFFFF",
    "red": "#EF4444",
    "blue": "#3B82F6",
    "green": "#10B981",
    "silver": "#94A3B8",
    "gold": "#F59E0B"
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] p-6 lg:p-10">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Navigation & Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center gap-2 text-gray-500 hover:text-black font-bold text-sm transition-colors"
          >
            <ArrowLeft size={16} /> Back to Claims
          </button>
          
          <div className="flex items-center gap-3">
            <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm ${
              claim.status === "Pending" ? "bg-amber-100 text-amber-700" :
              claim.status === "Approved" ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
            }`}>
              {claim.status}
            </span>
            <span className="text-xs text-gray-400 font-bold uppercase">REF: {claim.claimId}</span>
          </div>
        </div>

        {/* User Banner & Actions */}
        <div className="bg-white rounded-[2rem] p-6 border shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl flex items-center justify-center text-blue-600 border border-blue-50">
              <User size={26} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Claim Submitter</p>
              <h1 className="text-xl font-black text-gray-900">{userName || "Unknown User"}</h1>
              <div className="flex items-center gap-4 text-xs font-bold text-gray-500 mt-0.5">
                <span className="flex items-center gap-1 hover:text-blue-600 transition-colors cursor-pointer"><Phone size={12} /> {claim.contactNumber}</span>
                <span className="flex items-center gap-1 hover:text-blue-600 transition-colors cursor-pointer"><Mail size={12} /> {claim.email}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <button 
              onClick={() => handleStatusUpdate("Rejected")}
              disabled={updating || claim.status === "Rejected"}
              className="flex-1 md:flex-none px-6 py-3.5 border-2 border-rose-50 text-rose-600 rounded-xl font-bold text-sm hover:bg-rose-50 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
            >
              <XCircle size={16} /> Reject Claim
            </button>
            <button 
              onClick={() => handleStatusUpdate("Approved")}
              disabled={updating || claim.status === "Approved"}
              className="flex-1 md:flex-none px-6 py-3.5 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
            >
              <CheckCircle size={16} /> Approve Claim
            </button>
          </div>
        </div>

        {/* 🛠️ [FIXED] Equal height grids structure */}
        <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          
          {/* Floating Match Score Badge */}
          <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex-col items-center justify-center bg-white border shadow-lg w-20 h-20 rounded-full border-blue-100">
            <ShieldCheck size={18} className="text-blue-600 mb-0.5" />
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Match</span>
            <div className="text-lg font-black text-blue-600 leading-none">
              {directMatchPercentage || 0}%
            </div>
          </div>

          {/* Column 1: Found Item Details */}
          <div className="bg-white rounded-[2rem] border shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow">
            <div className="p-6 border-b flex justify-between items-center bg-gray-50/50">
              <div>
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">System Reference</span>
                <h3 className="text-lg font-bold text-gray-900">Original Found Item</h3>
              </div>
              <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold uppercase">{itemData?.itemId}</span>
            </div>
            
            <div className="p-6 space-y-4 flex-grow flex flex-col justify-between">
              <div>
                <div className="w-full h-52 rounded-2xl overflow-hidden border bg-gray-50 shadow-inner group mb-4">
                  <img 
                    src={itemData?.image_url || "https://via.placeholder.com/400x300?text=No+Image"} 
                    alt="Found item" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-bold text-gray-800 text-base">{itemData?.title}</h4>
                  <p className="text-sm text-gray-500 bg-gray-50 p-3 rounded-xl border border-gray-100">{itemData?.description}</p>
                </div>
              </div>
              
              <div className="pt-4 border-t border-dashed mt-auto">
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <span className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1"><Tag size={12} /> Category</span>
                    <p className="font-bold text-gray-700 mt-0.5">{itemData?.category || "N/A"}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <span className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1"><MapPin size={12} /> Location</span>
                    <p className="font-bold text-gray-700 mt-0.5">{itemData?.location || "N/A"}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <span className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1"><Palette size={12} /> Color</span>
                    <p className="font-bold text-gray-700 mt-0.5 capitalize">{itemData?.color || "N/A"}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <span className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1"><Calendar size={12} /> Date Filed</span>
                    <p className="font-bold text-gray-700 mt-0.5">
                      {itemData?.createdAt ? new Date(itemData.createdAt).toLocaleDateString() : "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: User Evidence & Input */}
          <div className="bg-white rounded-[2rem] border shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow">
            <div className="p-6 border-b flex justify-between items-center bg-gray-50/50">
              <div>
                <span className="text-[10px] font-bold text-purple-600 uppercase tracking-wider">User Input</span>
                <h3 className="text-lg font-bold text-gray-900">Claim Evidence & Details</h3>
              </div>
              
              <div className="flex lg:hidden items-center gap-1 bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold">
                <ShieldCheck size={12} /> Score: {directMatchPercentage || 0}%
              </div>
            </div>
            
            <div className="p-6 space-y-4 flex-grow flex flex-col justify-between">
              <div>
                <div className="w-full h-52 rounded-2xl overflow-hidden border bg-gray-50 shadow-inner group mb-4">
                  {claim.evidenceImage ? (
                    <img 
                      src={claim.evidenceImage} 
                      alt="User proof" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                      <Image size={32} className="mb-2 opacity-50" />
                      <p className="text-xs font-bold">No Evidence Image Uploaded</p>
                    </div>
                  )}
                </div>
                
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-purple-50/50 p-3 rounded-xl border border-purple-100">
                      <span className="text-[10px] font-bold text-purple-500 uppercase flex items-center gap-1"><Tag size={12} /> Claimed Category</span>
                      <p className="font-bold text-gray-800 mt-0.5">{claim.category || "N/A"}</p>
                    </div>
                    <div className="bg-purple-50/50 p-3 rounded-xl border border-purple-100">
                      <span className="text-[10px] font-bold text-purple-500 uppercase flex items-center gap-1"><Palette size={12} /> Claimed Color</span>
                      <div className="flex items-center gap-2 mt-0.5">
                        {claim.color && (
                          <div 
                            className="w-3.5 h-3.5 rounded-full border border-gray-300" 
                            style={{ backgroundColor: colorMap[claim.color.toLowerCase()] || '#E5E7EB' }}
                          ></div>
                        )}
                        <p className="font-bold text-gray-800 capitalize">{claim.color || "N/A"}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1 mb-1">
                      <FileText size={12} /> Why is this yours?
                    </span>
                    <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-xl border border-gray-100">
                      "{claim.description || "No description provided."}"
                    </p>
                  </div>
                  
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1 mb-1">
                      <ClipboardCheck size={12} /> Evidence Note
                    </span>
                    <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-xl border border-gray-100">
                      "{claim.evidenceText || "No evidence note provided."}"
                    </p>
                  </div>
                </div>
              </div>
                
              <div className="pt-4 border-t border-dashed mt-auto">
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <span className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1"><MapPin size={12} /> Suggested Venue</span>
                    <p className="font-bold text-gray-700 mt-0.5">{claim.meetingLocation || "N/A"}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <span className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1"><Clock size={12} /> Suggested Date & Time</span>
                    <p className="font-bold text-gray-700 mt-0.5">{formatDateTime(claim.meetingTime)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default ClaimDetailsPage;