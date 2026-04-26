"use client";

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, Clock, CheckCircle2, MapPin, 
  MessageSquare, ShieldCheck, Map, CalendarClock, 
  Mail, Phone, AlertCircle, Fingerprint, Sparkles, 
  ChevronRight, Copy, ExternalLink, Send, HelpCircle,
  History
} from "lucide-react";
import Navbar from "../components/Navbar";
import axios from "axios";

const ClaimTracking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [claim, setClaim] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchClaimDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`http://localhost:5000/api/claims/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await response.json();
        if (response.ok) setClaim(data);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchClaimDetails();
  }, [id]);

  const handleAppendEvidence = async () => {
    if (!additionalInfo.trim()) return alert("Please enter your response.");
    
    try {
      setSubmitting(true);
      const token = localStorage.getItem("token");
      await axios.patch(`http://localhost:5000/api/claims/${id}/append-evidence`, 
        { additionalInfo },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      alert("Evidence submitted successfully! Admin will review it shortly.");
      window.location.reload(); 
    } catch (error) {
      console.error("Submission failed:", error);
      alert("Failed to submit evidence.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-[#F8FAFC]">
      <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Loading Data...</p>
    </div>
  );

  const status = claim?.status?.toLowerCase() || "pending";

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-blue-100">
      <Navbar />
      
      <div className="max-w-[1400px] mx-auto pt-24 pb-12 px-6">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 p-6 bg-white border border-slate-100 rounded-[2rem] shadow-sm">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl transition-all border border-slate-100 text-slate-500">
              <ArrowLeft size={18} />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Tracking Portal</span>
                <div className="h-1 w-1 bg-slate-300 rounded-full" />
                <span className="text-[10px] font-bold text-slate-400">ID: {id}</span>
              </div>
              <h1 className="text-2xl font-black tracking-tight">Claim Verification <span className="text-blue-600">Status</span></h1>
            </div>
          </div>

          <div className="flex items-center gap-3 mt-4 md:mt-0">
              {(status === "verified" || status === "approved") && (
                <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all">
                  <MessageSquare size={14} /> Contact Finder
                </button>
              )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          <div className="lg:col-span-8 space-y-6">
            
            {/* --- Action Required Box --- */}
            {status === "under review" && (
              <div className="bg-white border-2 border-amber-400/20 rounded-[2.5rem] p-8 shadow-xl shadow-amber-50 animate-in fade-in slide-in-from-top-4">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-amber-500 text-white rounded-xl flex items-center justify-center">
                    <HelpCircle size={20} />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">Action Required: Verification Challenge</h3>
                    <p className="text-[11px] text-amber-600 font-bold uppercase tracking-widest">The admin needs more information</p>
                  </div>
                </div>

                <div className="bg-amber-50/50 p-6 rounded-3xl mb-6 border border-amber-100">
                   <p className="text-[10px] font-black text-amber-700 uppercase tracking-widest mb-2 opacity-60">Admin's Question:</p>
                   <p className="text-sm font-bold text-slate-800 italic">"{claim.adminNote}"</p>
                </div>

                <div className="relative">
                  <textarea 
                    className="w-full p-6 bg-slate-50 border-none rounded-[2rem] text-sm font-medium focus:ring-2 focus:ring-amber-500 outline-none transition-all"
                    placeholder="Type your detailed answer here..."
                    rows="3"
                    value={additionalInfo}
                    onChange={(e) => setAdditionalInfo(e.target.value)}
                  />
                  <div className="flex justify-end mt-4">
                    <button 
                      onClick={handleAppendEvidence}
                      disabled={submitting}
                      className="flex items-center gap-2 px-10 py-4 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-black transition-all disabled:opacity-50"
                    >
                      {submitting ? "Sending..." : "Submit Response"} <Send size={14} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* --- UPDATED: Conversation History / Evidence Log --- */}
            {claim.adminNote && (
              <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm overflow-hidden">
                <h2 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
                  <History size={16} className="text-blue-500" /> Verification Log
                </h2>
                
                <div className="space-y-6">
                  {/* Admin Question Bubble */}
                  <div className="flex flex-col items-start max-w-[85%]">
                    <div className="bg-slate-100 p-5 rounded-t-[2rem] rounded-br-[2rem] border border-slate-200">
                      <p className="text-[9px] font-black text-blue-600 uppercase mb-2">Campus Admin</p>
                      <p className="text-sm font-medium text-slate-700">{claim.adminNote}</p>
                    </div>
                  </div>

                  {/* Client Reply Bubble (Show only if reply exists) */}
                  {claim.description && claim.description.includes("[Additional Evidence]:") && (
                    <div className="flex flex-col items-end w-full">
                      <div className="max-w-[85%] bg-blue-600 p-5 rounded-t-[2rem] rounded-bl-[2rem] text-white shadow-md shadow-blue-100">
                        <p className="text-[9px] font-black text-blue-100 uppercase mb-2 text-right">You (Claimer)</p>
                        <p className="text-sm font-medium">
                          {claim.description.split("[Additional Evidence]:")[1]}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 mt-2 text-emerald-500">
                        <CheckCircle2 size={12} />
                        <span className="text-[9px] font-black uppercase">Delivered to Admin</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Stepper Card */}
            <div className="bg-white rounded-[2.5rem] p-8 md:p-10 border border-slate-100 shadow-sm relative overflow-hidden">
               <h2 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] mb-12 flex items-center gap-2">
                 <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping" /> Live Progress
               </h2>

               <div className="relative space-y-12">
                  <div className="absolute left-[19px] top-4 bottom-4 w-[2px] bg-slate-50" />
                  
                  <CompactStep 
                    title="Submission Success" 
                    desc="Ownership claim has been logged into the UniFound database." 
                    time={claim.createdAt} 
                    status="completed"
                  />
                  
                  <CompactStep 
                    title="Verification Stage" 
                    desc={status === "under review" ? "Response needed: Admin requested additional details." : "Admin team is reviewing provided images and descriptions."} 
                    status={status === "verified" || status === "approved" ? "completed" : status === "rejected" ? "error" : status === "under review" ? "warning" : "active"}
                  />

                  <CompactStep 
                    title={status === "rejected" ? "Claim Rejected" : "Final Handover"} 
                    desc={status === "verified" || status === "approved" ? "Verification passed! View collection details below." : "Decision pending from campus administration."} 
                    status={status === "verified" || status === "approved" ? "completed" : status === "rejected" ? "error" : "pending"}
                    time={(status === "verified" || status === "approved") ? claim.updatedAt : null}
                  />
               </div>
            </div>

            {/* Handover Bento Boxes */}
            {(status === "verified" || status === "approved") && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden group">
                  <div className="absolute -right-6 -bottom-6 opacity-20"><Map size={100}/></div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Location</p>
                  <h4 className="text-xl font-black tracking-tight mb-4">{claim.meetingLocation || "Main Library"}</h4>
                  <button className="flex items-center gap-2 text-[10px] font-black text-blue-400 uppercase hover:text-blue-300 transition-all">
                    Get Directions <ChevronRight size={12}/>
                  </button>
                </div>

                <div className="bg-blue-600 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
                  <div className="absolute -right-6 -bottom-6 opacity-20"><CalendarClock size={100}/></div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-blue-100 mb-2">Meeting Time</p>
                  <h4 className="text-xl font-black tracking-tight mb-4">
                    {claim.meetingTime ? new Date(claim.meetingTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : "TBD"}
                  </h4>
                  <p className="text-[10px] font-bold opacity-80 uppercase tracking-widest flex items-center gap-2">
                    <Clock size={12}/> {claim.meetingTime ? new Date(claim.meetingTime).toLocaleDateString() : "Pending"}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-[2.5rem] border border-slate-100 p-3 shadow-sm">
               <div className="relative h-56 rounded-[2rem] overflow-hidden">
                  <img src={claim.itemData?.image_url || claim.evidenceImage} className="w-full h-full object-cover" alt="Item" />
                  <div className="absolute top-4 left-4 px-4 py-1.5 bg-black/60 backdrop-blur-md rounded-xl text-[9px] font-black text-white uppercase tracking-widest">
                    {claim.category}
                  </div>
               </div>

               <div className="p-6">
                  <h3 className="text-lg font-black text-slate-900 uppercase tracking-tighter mb-6 leading-none">
                    {claim.itemData?.title}
                  </h3>

                  <div className="space-y-4">
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                       <div className="flex items-center justify-between mb-2">
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Your Evidence</span>
                          <Fingerprint size={14} className="text-slate-300" />
                       </div>
                       <p className="text-[11px] font-bold text-slate-600 italic leading-relaxed">
                          "{claim.evidenceText || (claim.description ? (claim.description.includes("[Additional Evidence]:") ? claim.description.split("[Additional Evidence]:")[0] : claim.description) : "No description provided.")}"
                       </p>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                       <div className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-2xl transition-colors border border-transparent hover:border-slate-100 group">
                          <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-blue-600 transition-colors"><Mail size={16}/></div>
                          <div className="flex-1 overflow-hidden">
                             <p className="text-[8px] font-black text-slate-400 uppercase">Email Contact</p>
                             <p className="text-[10px] font-bold text-slate-700 truncate">{claim.email}</p>
                          </div>
                       </div>
                       <div className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-2xl transition-colors border border-transparent hover:border-slate-100 group">
                          <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-blue-600 transition-colors"><Phone size={16}/></div>
                          <div>
                             <p className="text-[8px] font-black text-slate-400 uppercase">Mobile Identity</p>
                             <p className="text-[10px] font-bold text-slate-700">{claim.contactNumber}</p>
                          </div>
                       </div>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">
                     <div className="flex items-center gap-2 text-emerald-600">
                        <ShieldCheck size={16} />
                        <span className="text-[9px] font-black uppercase">Verified Secure</span>
                     </div>
                     <button className="text-slate-300 hover:text-blue-500 transition-all"><ExternalLink size={14}/></button>
                  </div>
               </div>
            </div>

            <div className="bg-blue-50/50 rounded-[2.5rem] p-8 border border-blue-100/50">
               <h4 className="text-[10px] font-black text-blue-900 uppercase tracking-widest mb-4">Quick Actions</h4>
               <div className="space-y-3">
                  <button className="w-full p-4 bg-white rounded-2xl text-[10px] font-bold text-slate-600 flex items-center justify-between hover:scale-[1.02] transition-transform shadow-sm">
                    Report an Issue <AlertCircle size={14} className="text-rose-400" />
                  </button>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(id);
                      alert("ID Copied!");
                    }}
                    className="w-full p-4 bg-white rounded-2xl text-[10px] font-bold text-slate-600 flex items-center justify-between hover:scale-[1.02] transition-transform shadow-sm"
                  >
                    Copy Claim ID <Copy size={14} className="text-slate-300" />
                  </button>
               </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

const CompactStep = ({ title, desc, status, time }) => {
  const isCompleted = status === "completed";
  const isActive = status === "active";
  const isWarning = status === "warning";
  const isError = status === "error";

  return (
    <div className="relative pl-14 group">
      <div className={`absolute left-0 top-0 w-10 h-10 rounded-2xl border-4 border-white shadow-sm flex items-center justify-center z-10 transition-all duration-500 
        ${isCompleted ? "bg-emerald-500 shadow-emerald-100" : 
          isError ? "bg-rose-500 shadow-rose-100" : 
          isWarning ? "bg-amber-500 shadow-amber-100 animate-pulse" :
          isActive ? "bg-blue-600 animate-pulse shadow-blue-100" : "bg-slate-100"}`}>
        {isCompleted && <CheckCircle2 size={16} className="text-white" />}
        {isError && <AlertCircle size={16} className="text-white" />}
        {isWarning && <HelpCircle size={16} className="text-white" />}
        {isActive && <div className="w-2 h-2 bg-white rounded-full" />}
      </div>

      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
           <h4 className={`text-sm font-black tracking-tight uppercase ${isCompleted ? "text-slate-900" : isWarning ? "text-amber-600" : isActive ? "text-blue-600" : "text-slate-300"}`}>{title}</h4>
           <p className="text-[11px] text-slate-400 font-bold max-w-md mt-1">{desc}</p>
        </div>
        {time && (
          <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100 min-w-fit">
             <Clock size={10} className="text-slate-300" />
             <span className="text-[9px] font-black text-slate-900 uppercase">
                {new Date(time).toLocaleDateString([], {day:'2-digit', month:'short'})}
             </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClaimTracking;