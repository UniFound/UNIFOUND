import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  ArrowLeft, CheckCircle, XCircle, Clock, MapPin, 
  Tag, Phone, Mail, User, ShieldCheck, 
  Image, ClipboardCheck, Palette,
  Zap, ChevronRight, Fingerprint, BarChart3, ExternalLink
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
        setError("Failed to load claim details.");
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
      alert("Failed to update status.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
      <div className="relative flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
        <div className="absolute text-[10px] font-bold text-blue-600 animate-pulse">FIX</div>
      </div>
    </div>
  );

  if (error || !claim) return <div className="min-h-screen flex items-center justify-center text-red-500 font-semibold">{error}</div>;

  const { itemData, userName, autoMatches = [] } = claim;

  const calculateMatchScore = () => {
    let score = 0;
    if (itemData?.category === claim.category) score += 50;
    if (itemData?.color?.toLowerCase() === claim.color?.toLowerCase()) score += 25;
    if (itemData?.location === claim.meetingLocation) score += 15;
    return score;
  };

  const matchScore = calculateMatchScore();

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 lg:p-10 font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-700">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* --- Top Navigation & Actions --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <button 
              onClick={() => navigate(-1)} 
              className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-semibold text-xs transition-all mb-2 uppercase tracking-widest group"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
            </button>
            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
                Claim <span className="text-blue-600">Intelligence</span>
              </h1>
              <div className={`px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider border shadow-sm ${
                claim.status === "Pending" ? "bg-amber-50 border-amber-200 text-amber-600" :
                claim.status === "Approved" ? "bg-emerald-50 border-emerald-200 text-emerald-600" : "bg-rose-50 border-rose-200 text-rose-600"
              }`}>
                {claim.status}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm">
            <button 
              onClick={() => handleStatusUpdate("Rejected")} 
              className="px-6 py-3 rounded-xl font-bold text-sm text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-all flex items-center gap-2"
            >
              <XCircle size={18} /> Reject
            </button>
            <button 
              onClick={() => handleStatusUpdate("Approved")} 
              className="px-8 py-3 rounded-xl font-bold text-sm bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95 flex items-center gap-2"
            >
              <CheckCircle size={18} /> Approve Claim
            </button>
          </div>
        </div>

        {/* --- Hero Stats Section --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Score Card */}
          <div className="lg:col-span-4 bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />
            <div className="relative z-10 space-y-6">
              <div className="flex items-center gap-2 text-blue-600">
                <Fingerprint size={20} />
                <span className="text-xs font-black uppercase tracking-widest">Confidence Score</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-7xl font-black tracking-tighter text-slate-900">{matchScore}%</span>
                <span className="text-sm font-bold text-slate-400">Match</span>
              </div>
              <div className="space-y-2">
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full transition-all duration-1000 ease-out" style={{ width: `${matchScore}%` }} />
                </div>
                <p className="text-[11px] font-medium text-slate-400 leading-relaxed">
                  System analysis based on category, color, and location proximity.
                </p>
              </div>
            </div>
          </div>

          {/* User Detail Card */}
          <div className="lg:col-span-8 bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm flex flex-col md:flex-row items-center gap-8">
            <div className="w-24 h-24 bg-slate-50 rounded-3xl flex items-center justify-center text-blue-600 border border-slate-100 shadow-inner">
              <User size={40} />
            </div>
            <div className="flex-grow space-y-4 text-center md:text-left">
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">{userName}</h2>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Claimant Identity</p>
              </div>
              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full text-xs font-bold text-slate-600 border border-slate-100">
                  <Phone size={14} className="text-blue-500" /> {claim.contactNumber}
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full text-xs font-bold text-slate-600 border border-slate-100">
                  <Mail size={14} className="text-blue-500" /> {claim.email}
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full text-xs font-bold text-blue-600 border border-blue-100">
                  <ShieldCheck size={14} /> ID Verified
                </div>
              </div>
            </div>
            <div className="hidden lg:block w-px h-16 bg-slate-100" />
            <div className="text-center md:text-right space-y-1">
              <p className="text-[10px] font-black text-slate-300 uppercase">Submitted At</p>
              <p className="text-sm font-bold text-slate-700">{new Date(claim.createdAt).toLocaleDateString()}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">#{claim.claimId}</p>
            </div>
          </div>
        </div>

        {/* --- Side-by-Side Verification --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Original Record */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 px-2 text-slate-400">
              <Zap size={16} className="text-amber-500" />
              <h3 className="text-[11px] font-black uppercase tracking-[0.2em]">Master Database Record</h3>
            </div>
            <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
              <div className="aspect-[16/10] bg-slate-100 overflow-hidden">
                <img src={itemData?.image_url} alt="Master" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-8 space-y-6">
                <div>
                  <h4 className="text-xl font-extrabold text-slate-900 tracking-tight uppercase italic">{itemData?.title}</h4>
                  <p className="text-sm text-slate-500 mt-2 leading-relaxed font-medium">{itemData?.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <Tag size={16} className="text-blue-500" />
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase">Category</p>
                      <p className="text-xs font-bold text-slate-700">{itemData?.category}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <Palette size={16} className="text-blue-500" />
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase">Color</p>
                      <p className="text-xs font-bold text-slate-700 capitalize">{itemData?.color}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* User Evidence */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 px-2 text-slate-400">
              <ClipboardCheck size={16} className="text-blue-600" />
              <h3 className="text-[11px] font-black uppercase tracking-[0.2em]">Submitted Evidence</h3>
            </div>
            <div className="bg-white rounded-[2.5rem] border border-blue-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
              <div className="aspect-[16/10] bg-blue-50 flex items-center justify-center overflow-hidden">
                {claim.evidenceImage ? (
                  <img src={claim.evidenceImage} alt="User Proof" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Image size={24} className="text-blue-600" />
                    </div>
                    <p className="text-[11px] font-black text-blue-400 uppercase tracking-widest">No visual evidence</p>
                  </div>
                )}
              </div>
              <div className="p-8 space-y-6">
                <div className="space-y-4">
                  <div className="p-5 bg-blue-50/50 rounded-2xl border border-blue-100/50 relative">
                    <span className="absolute -top-2 left-4 px-2 bg-white text-[9px] font-black text-blue-600 uppercase border border-blue-100 rounded">Verification Note</span>
                    <p className="text-sm font-bold text-blue-900 leading-relaxed italic">"{claim.evidenceText || 'No specific text evidence provided.'}"</p>
                  </div>
                  <p className="text-sm font-medium text-slate-500 px-2 line-clamp-2">"{claim.description}"</p>
                </div>
                <div className="pt-6 border-t border-slate-50 flex flex-wrap gap-6">
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-slate-300" />
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-tighter">{claim.meetingLocation}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-slate-300" />
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-tighter">{new Date(claim.meetingTime).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- AI Suggestions Section --- */}
        {autoMatches.length > 0 && (
          <div className="pt-10 border-t border-slate-100">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100">
                  <BarChart3 size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-slate-900 tracking-tight italic">Alternative Matches</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Cross-referenced with {autoMatches.length} database items</p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {autoMatches.map((match, idx) => (
                <div key={idx} className="group bg-white p-4 rounded-3xl border border-slate-100 flex items-center gap-4 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-50 transition-all cursor-pointer">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 flex-shrink-0">
                    <img src={match.item.image_url} alt="Match" className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="flex-grow min-w-0">
                    <h5 className="text-xs font-black text-slate-800 uppercase truncate tracking-tight">{match.item.title}</h5>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex-grow h-1 bg-slate-50 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${match.matchPercentage}%` }} />
                      </div>
                      <span className="text-[10px] font-black text-indigo-600">{match.matchPercentage}%</span>
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <ChevronRight size={16} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ClaimDetailsPage;