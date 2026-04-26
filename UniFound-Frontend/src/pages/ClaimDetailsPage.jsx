import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  ArrowLeft, CheckCircle, XCircle, Clock, MapPin, Tag,
  Calendar, Phone, Mail, User, ShieldCheck, AlertTriangle,
  FileText, Image, ClipboardCheck, Palette, MessageCircle,
  Zap, ChevronRight, Fingerprint, BarChart3, HelpCircle, Send,
  History
} from "lucide-react";

const ClaimDetailsPage = () => {
  const { claimId } = useParams();
  const navigate = useNavigate();
  
  const [claim, setClaim] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(false);
  
  const [showQuestionBox, setShowQuestionBox] = useState(false);
  const [adminQuestion, setAdminQuestion] = useState("");

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

  const handleStatusUpdate = async (newStatus, note = "") => {
    try {
      setUpdating(true);
      const targetId = claim._id || claimId;
      const storedUser = localStorage.getItem("user");
      const adminUser = storedUser ? JSON.parse(storedUser) : null;
      
      await axios.put(`http://localhost:5000/api/claims/${targetId}`, {
        status: newStatus,
        updatedBy: adminUser?.userId || "Admin",
        adminNote: note || `Status updated to ${newStatus} by Admin`
      });
      
      setClaim(prev => ({ ...prev, status: newStatus, adminNote: note || prev.adminNote }));
      setShowQuestionBox(false);
      alert(`Claim status changed to: ${newStatus}`);
    } catch (err) {
      alert("Failed to update status.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA]">
        <div className="text-center">
          <div className="w-14 h-14 border-4 border-t-blue-600 border-gray-100 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Analyzing Intelligence...</p>
        </div>
      </div>
    );
  }

  if (error || !claim) return <div className="min-h-screen flex items-center justify-center text-rose-500 font-bold">{error}</div>;

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
    <div className="min-h-screen bg-[#FBFDFF] p-4 lg:p-10 font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-700">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* --- Top Navigation --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <button 
              onClick={() => navigate(-1)} 
              className="flex items-center gap-2 text-slate-400 hover:text-blue-600 font-bold text-[10px] transition-all mb-2 uppercase tracking-[0.2em] group"
            >
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
            </button>
            <div className="flex items-center gap-4">
              <h1 className="text-4xl font-black tracking-tighter text-slate-900">
                Claim <span className="text-blue-600">Verification</span>
              </h1>
              <span className={`px-4 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest border ${
                claim.status === "Pending" ? "bg-amber-50 border-amber-100 text-amber-600" :
                claim.status === "Approved" ? "bg-emerald-50 border-emerald-100 text-emerald-600" : 
                claim.status === "Under Review" ? "bg-purple-50 border-purple-100 text-purple-600" : "bg-rose-50 border-rose-100 text-rose-600"
              }`}>
                {claim.status}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm">
            <button 
              onClick={() => setShowQuestionBox(!showQuestionBox)}
              className="px-5 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-all flex items-center gap-2"
            >
              <HelpCircle size={16} /> Request Info
            </button>
            <button 
              onClick={() => handleStatusUpdate("Rejected")} 
              className="px-5 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest text-rose-500 hover:bg-rose-50 transition-all flex items-center gap-2"
            >
              <XCircle size={16} /> Reject
            </button>
            <button 
              onClick={() => handleStatusUpdate("Approved")} 
              className="px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all active:scale-95 flex items-center gap-2"
            >
              <CheckCircle size={16} /> Approve
            </button>
          </div>
        </div>

        {/* --- Verification Challenge Box --- */}
        {showQuestionBox && (
          <div className="bg-white border-2 border-blue-500/10 rounded-[2rem] p-8 shadow-xl shadow-blue-50 animate-in fade-in slide-in-from-top-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center">
                <MessageCircle size={20} />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900 uppercase">Verification Challenge</h3>
                <p className="text-xs text-slate-400 font-medium">Ask a specific question to verify the claimant's ownership.</p>
              </div>
            </div>
            <textarea 
              className="w-full p-6 bg-slate-50 border-none rounded-3xl text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="Ex: What color is the sticker on the back? / Mention a unique scratch..."
              rows="3"
              value={adminQuestion}
              onChange={(e) => setAdminQuestion(e.target.value)}
            />
            <div className="flex justify-end mt-4">
               <button 
                onClick={() => handleStatusUpdate("Under Review", adminQuestion)}
                className="flex items-center gap-2 px-8 py-3 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-black transition-all"
               >
                 Send Challenge <Send size={14} />
               </button>
            </div>
          </div>
        )}

        {/* --- UPDATED: Verification Log (Mini Chat History) --- */}
        {claim.adminNote && (
          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
            <h2 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
              <History size={16} className="text-blue-500" /> Verification History
            </h2>
            
            <div className="space-y-6">
              {/* Admin's Outgoing Question */}
              <div className="flex flex-col items-start">
                <div className="max-w-[70%] bg-slate-100 p-5 rounded-t-[2rem] rounded-br-[2rem] border border-slate-200">
                  <p className="text-[9px] font-black text-blue-600 uppercase mb-2">You (Admin)</p>
                  <p className="text-sm font-medium text-slate-700 italic">"{claim.adminNote}"</p>
                </div>
              </div>

              {/* Client's Incoming Response */}
              {claim.description && claim.description.includes("[Additional Evidence]:") && (
                <div className="flex flex-col items-end">
                  <div className="max-w-[70%] bg-blue-600 p-5 rounded-t-[2rem] rounded-bl-[2rem] text-white shadow-lg shadow-blue-100">
                    <p className="text-[9px] font-black text-blue-100 uppercase mb-2 text-right">Claimant Response</p>
                    <p className="text-sm font-bold">
                      {claim.description.split("[Additional Evidence]:")[1]}
                    </p>
                  </div>
                  <div className="mt-2 flex items-center gap-2 text-emerald-500">
                    <Zap size={12} className="fill-emerald-500" />
                    <span className="text-[9px] font-black uppercase tracking-widest">New Evidence</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Intelligence Score */}
          <div className="lg:col-span-4 bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm relative overflow-hidden group">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-50 rounded-full opacity-50 group-hover:scale-110 transition-transform" />
            <div className="relative z-10 space-y-8">
              <div className="flex items-center gap-2 text-blue-600">
                <Fingerprint size={18} />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Match Logic</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-8xl font-black tracking-tighter text-slate-900">{matchScore}%</span>
                <span className="text-xs font-black text-slate-300 uppercase tracking-widest">Accurate</span>
              </div>
              <div className="space-y-3">
                <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full transition-all duration-1000" style={{ width: `${matchScore}%` }} />
                </div>
                <p className="text-[10px] font-bold text-slate-400 leading-relaxed uppercase tracking-tight">
                  Cross-referenced item metadata & proximity.
                </p>
              </div>
            </div>
          </div>

          {/* Claimant Profile */}
          <div className="lg:col-span-8 bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm flex flex-col md:flex-row items-center gap-10">
            <div className="w-32 h-32 bg-slate-50 rounded-[2.5rem] flex items-center justify-center text-blue-600 border border-slate-50 shadow-inner">
              <User size={48} strokeWidth={2.5} />
            </div>
            <div className="flex-grow space-y-6 text-center md:text-left">
              <div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">{userName}</h2>
                <div className="flex items-center justify-center md:justify-start gap-2 mt-1">
                   <ShieldCheck size={14} className="text-emerald-500" />
                   <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Verified Campus User</p>
                </div>
              </div>
              <div className="flex flex-wrap justify-center md:justify-start gap-3">
                <div className="flex items-center gap-3 px-5 py-3 bg-slate-50 rounded-2xl text-xs font-bold text-slate-600 border border-slate-100/50">
                  <Phone size={14} className="text-blue-500" /> {claim.contactNumber}
                </div>
                <div className="flex items-center gap-3 px-5 py-3 bg-slate-50 rounded-2xl text-xs font-bold text-slate-600 border border-slate-100/50">
                  <Mail size={14} className="text-blue-500" /> {claim.email}
                </div>
              </div>
            </div>
            <div className="hidden lg:block w-px h-20 bg-slate-50" />
            <div className="text-center md:text-right space-y-1">
              <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Reference ID</p>
              <p className="text-sm font-black text-slate-800 italic uppercase">#{claim.claimId}</p>
            </div>
          </div>
        </div>

        {/* --- Side-by-Side Verification Cards --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          
          {/* Master Record Card */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 px-4">
              <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Database Record</h3>
            </div>
            <div className="bg-white rounded-[3rem] border border-slate-100 overflow-hidden shadow-sm">
              <div className="aspect-video bg-slate-50 relative overflow-hidden">
                <img src={itemData?.image_url} alt="Master" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
              <div className="p-10 space-y-8">
                <div>
                  <h4 className="text-2xl font-black text-slate-900 tracking-tight uppercase italic">{itemData?.title}</h4>
                  <p className="text-sm text-slate-500 mt-3 leading-relaxed font-medium">{itemData?.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-5 bg-slate-50 rounded-[1.5rem] border border-slate-100">
                    <Tag size={16} className="text-blue-500 mb-2" />
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Category</p>
                    <p className="text-xs font-bold text-slate-800">{itemData?.category}</p>
                  </div>
                  <div className="p-5 bg-slate-50 rounded-[1.5rem] border border-slate-100">
                    <Palette size={16} className="text-blue-500 mb-2" />
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Color</p>
                    <p className="text-xs font-bold text-slate-800 capitalize">{itemData?.color}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* User Evidence Card */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 px-4">
              <div className="w-2 h-2 bg-blue-500 rounded-full" />
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Claimant Evidence</h3>
            </div>
            <div className="bg-white rounded-[3rem] border border-blue-100 overflow-hidden shadow-md shadow-blue-50/50">
              <div className="aspect-video bg-blue-50 flex items-center justify-center">
                {claim.evidenceImage ? (
                  <img src={claim.evidenceImage} alt="User Proof" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center opacity-20">
                    <Image size={48} className="mx-auto mb-2" />
                    <p className="text-[10px] font-black uppercase tracking-widest">No Visual Assets</p>
                  </div>
                )}
              </div>
              <div className="p-10 space-y-8">
                
                {/* --- HIGHLIGHTED NEW RESPONSE --- */}
                {claim.description && claim.description.includes("[Additional Evidence]:") && (
                  <div className="p-6 bg-emerald-50 border-2 border-emerald-100 rounded-3xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-2">
                       <Zap size={24} className="text-emerald-200 fill-emerald-100" />
                    </div>
                    <div className="flex items-center gap-2 mb-2 text-emerald-600">
                      <span className="text-[10px] font-black uppercase tracking-widest">User's Direct Answer</span>
                    </div>
                    <p className="text-base font-black text-slate-800 leading-tight">
                      {claim.description.split("[Additional Evidence]:")[1]}
                    </p>
                  </div>
                )}

                <div className="p-6 bg-blue-50/30 rounded-[2rem] border border-blue-100/50 relative">
                  <div className="absolute -top-3 left-6 px-3 py-1 bg-white border border-blue-100 rounded-full text-[9px] font-black text-blue-600 uppercase tracking-widest">
                    Initial Proof Statement
                  </div>
                  <p className="text-sm font-bold text-blue-900 italic leading-relaxed">
                    "{claim.evidenceText || (claim.description ? claim.description.split("[Additional Evidence]:")[0] : 'No detailed evidence provided.')}"
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                      <MapPin size={14} />
                    </div>
                    <div>
                       <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Location Proximity</p>
                       <p className="text-[10px] font-bold text-slate-600 uppercase">{claim.meetingLocation}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                      <Calendar size={14} />
                    </div>
                    <div>
                       <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Date/Time</p>
                       <p className="text-[10px] font-bold text-slate-600 uppercase">{new Date(claim.meetingTime).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Matches */}
        {autoMatches.length > 0 && (
          <div className="pt-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center">
                <BarChart3 size={20} />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase italic">Intelligence Cross-Check</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">System found {autoMatches.length} alternative database matches</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {autoMatches.map((match, idx) => (
                <div key={idx} className="group bg-white p-5 rounded-[2rem] border border-slate-100 flex items-center gap-5 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-50/50 transition-all cursor-pointer">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-50 flex-shrink-0">
                    <img src={match.item.image_url} alt="Match" className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="flex-grow min-w-0">
                    <h5 className="text-[10px] font-black text-slate-800 uppercase truncate tracking-tight mb-2">{match.item.title}</h5>
                    <div className="flex items-center gap-2">
                      <div className="flex-grow h-1 bg-slate-50 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${match.matchPercentage}%` }} />
                      </div>
                      <span className="text-[9px] font-black text-blue-600">{match.matchPercentage}%</span>
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