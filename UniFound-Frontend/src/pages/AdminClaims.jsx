import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom"; // 🔗 Link එක පාවිච්චි කරන්න මේක එකතු කරා
import { 
  CheckCircle2, 
  XCircle, 
  Eye, 
  Search, 
  Filter, 
  Calendar, 
  Package, 
  ArrowUpRight, 
  ShieldCheck,
  RefreshCw,
  Trash2, 
  ExternalLink 
} from "lucide-react";

export default function AdminClaims() {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // 1. Fetch Claims from Backend
  const fetchClaims = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/api/claims");
      setClaims(response.data);
    } catch (err) {
      console.error("🔥 Error fetching claims:", err);
      setError("Failed to load claims. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClaims();
  }, []);

  // 2. Approve or Reject Claim
  const handleUpdateStatus = async (claimId, newStatus) => {
    try {
      // 💡 මෙතන URL එකට Base URL එක එකතු කරා request එක හරියට යන්න
      await axios.patch(`http://localhost:5000/api/claims/${claimId}/status`, {
        status: newStatus
      });
      
      setClaims(prevClaims => 
        prevClaims.map(claim => 
          claim._id === claimId ? { ...claim, status: newStatus } : claim
        )
      );
    } catch (err) {
      console.error(`🔥 Error updating claim to ${newStatus}:`, err);
      alert(`Failed to update status to ${newStatus}`);
    }
  };

  // 🗑️ 3. Delete Claim Function
  const handleDeleteClaim = async (claimId) => {
    if (!window.confirm("Are you sure you want to permanently delete this claim?")) {
      return;
    }
    try {
      await axios.delete(`http://localhost:5000/api/claims/${claimId}`);
      
      // UI එකෙන් අදාල claim එක අයින් කරනවා
      setClaims(prevClaims => prevClaims.filter(claim => claim._id !== claimId));
      alert("Claim deleted successfully!");
    } catch (err) {
      console.error("🔥 Error deleting claim:", err);
      alert("Failed to delete claim.");
    }
  };

  // 4. Search Filter Logic
  const filteredClaims = claims.filter(claim => 
    claim.claimId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    claim.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Status Styles
  const getStatusStyle = (status) => {
    switch (status) {
      case "Verified":
      case "Approved": return "bg-green-50 text-green-600 border-green-100";
      case "Pending": return "bg-blue-50 text-blue-600 border-blue-100";
      case "Rejected": return "bg-rose-50 text-rose-600 border-rose-100";
      default: return "bg-slate-50 text-slate-600 border-slate-100";
    }
  };

  const totalClaims = claims.length;
  const pendingClaims = claims.filter(c => c.status === "Pending").length;
  const verifiedClaims = claims.filter(c => c.status === "Verified" || c.status === "Approved").length;

  return (
    <div className="flex-1 bg-[#F8FAFF] min-h-screen p-8 lg:p-12 overflow-y-auto font-['Inter',_-apple-system,_.SFNSText-Regular,'Segoe_UI','Helvetica_Neue',sans-serif]">
      
      {/* --- HEADER SECTION --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Claim Verification</h1>
          <p className="text-slate-500 font-bold text-xs mt-1 uppercase tracking-widest">
            Manage and verify lost item ownership claims
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-blue-600" size={18} />
            <input 
              type="text" 
              placeholder="Search by Claim ID..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-6 py-3.5 bg-white border border-slate-100 rounded-2xl text-sm font-medium text-slate-700 w-full md:w-80 shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-200 transition-all"
            />
          </div>
          <button 
            onClick={fetchClaims}
            className="p-3.5 bg-white border border-slate-100 rounded-2xl text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-all shadow-sm group"
            title="Refresh Data"
          >
            <RefreshCw size={20} className={`${loading ? "animate-spin" : "group-hover:rotate-180 transition-transform duration-500"}`} />
          </button>
        </div>
      </div>

      {/* --- STATS ROW --- */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
        {[
          { label: "Total Claims", value: totalClaims, icon: <Package size={20}/>, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Pending", value: pendingClaims, icon: <ArrowUpRight size={20}/>, color: "text-amber-600", bg: "bg-amber-50" },
          { label: "Verified Claims", value: verifiedClaims, icon: <ShieldCheck size={20}/>, color: "text-green-600", bg: "bg-green-50" }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center gap-5 transition-transform hover:-translate-y-1">
            <div className={`${stat.bg} ${stat.color} p-4 rounded-2xl`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* --- CLAIMS TABLE SECTION --- */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/20 overflow-hidden">
        
        {error && (
          <div className="p-4 bg-red-50 text-red-600 text-sm font-medium border-b border-red-100">
              ⚠️ {error}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-50 bg-slate-50/50">
                <th className="px-8 py-6 text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">User Name</th>
                <th className="px-8 py-6 text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Claim Details</th>
                <th className="px-8 py-6 text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Date Filed</th>
                <th className="px-8 py-6 text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Status</th>
                <th className="px-8 py-6 text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center py-10 text-slate-400 font-medium text-sm">
                    Loading claims data...
                  </td>
                </tr>
              ) : filteredClaims.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-10 text-slate-400 font-medium text-sm">
                    No claims found.
                  </td>
                </tr>
              ) : (
                filteredClaims.map((claim) => (
                  <tr key={claim._id} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 overflow-hidden border-2 border-white shadow-sm font-bold text-xs">
                          {claim.userName?.charAt(0).toUpperCase() || "U"}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-900">{claim.userName || "Unknown User"}</span>
                          <span className="text-[11px] font-medium text-slate-400">{claim.email || "No Email"}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        {claim.evidenceImage ? (
                          <img src={claim.evidenceImage} className="w-10 h-10 rounded-xl object-cover border border-slate-200" alt="Proof" />
                        ) : (
                          <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 text-xs">No Img</div>
                        )}
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-700 truncate max-w-[150px]">{claim.description || "No description"}</span>
                          <span className="text-[10px] font-bold text-blue-600 uppercase tracking-tighter">{claim.claimId}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 text-slate-500">
                        <Calendar size={14} className="text-slate-400" />
                        <span className="text-sm font-medium">
                          {claim.createdAt ? new Date(claim.createdAt).toLocaleDateString() : "N/A"}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border ${getStatusStyle(claim.status)}`}>
                        {claim.status}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center justify-end gap-2">

                        {/* 👁️ 1. View Proof Button - මම මේක Link එකක් කරා */}
                        <Link 
                          to={`/admin/claims/${claim.claimId}`}
                          className="p-2.5 text-blue-600 hover:bg-blue-100 rounded-xl transition-all shadow-sm bg-white border border-blue-50" 
                          title="View Proof Details"
                        >
                          <Eye size={18} />
                        </Link>

                        {/* ✅ 2. Approve Button */}
                        <button 
                          onClick={() => handleUpdateStatus(claim._id, "Verified")} 
                          disabled={claim.status === "Verified" || claim.status === "Approved"}
                          className={`p-2.5 rounded-xl transition-all shadow-sm bg-white border ${
                            claim.status === "Verified" || claim.status === "Approved" 
                              ? "text-gray-300 border-gray-100 cursor-not-allowed" 
                              : "text-green-600 hover:bg-green-100 border-green-50"
                          }`} 
                          title="Approve"
                        >
                          <CheckCircle2 size={18} />
                        </button>

                        {/* ❌ 3. Reject Button */}
                        <button 
                          onClick={() => handleUpdateStatus(claim._id, "Rejected")} 
                          disabled={claim.status === "Rejected"}
                          className={`p-2.5 rounded-xl transition-all shadow-sm bg-white border ${
                            claim.status === "Rejected" 
                              ? "text-gray-300 border-gray-100 cursor-not-allowed" 
                              : "text-rose-600 hover:bg-rose-100 border-rose-50"
                          }`} 
                          title="Reject"
                        >
                          <XCircle size={18} />
                        </button>

                        {/* 🗑️ 4. Delete Button */}
                        <button 
                          onClick={() => handleDeleteClaim(claim._id)} 
                          className="p-2.5 text-slate-500 hover:text-white hover:bg-red-500 rounded-xl transition-all shadow-sm bg-white border border-slate-200" 
                          title="Delete Claim"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* --- PAGINATION --- */}
        <div className="p-8 border-t border-slate-50 flex justify-between items-center bg-slate-50/30">
          <p className="text-xs font-bold text-slate-400 tracking-wide uppercase">Showing {filteredClaims.length} of {totalClaims} claims</p>
          <div className="flex gap-2">
            <button className="px-5 py-2.5 text-xs font-bold bg-white border border-slate-200 text-slate-400 rounded-xl hover:bg-slate-50 transition-all">Previous</button>
            <button className="px-5 py-2.5 text-xs font-bold bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all">Next Page</button>
          </div>
        </div>
      </div>
    </div>
  );
}