import React, { useState } from "react";
import { 
  CheckCircle2, 
  XCircle, 
  Eye, 
  Search, 
  Filter, 
  MoreVertical,
  Calendar,
  User,
  Package,
  ArrowUpRight,
  ShieldCheck
} from "lucide-react";

export default function AdminClaims() {
  // Sample Data (පසුව Backend එකෙන් Fetch කළ හැක)
  const [claims, setClaims] = useState([
    {
      id: "CLM-8901",
      itemName: "Blue Wallet",
      claimant: "Amara Perera",
      studentId: "ST12345",
      date: "2024-03-20",
      status: "Pending",
      proofImg: "https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=100&auto=format&fit=crop"
    },
    {
      id: "CLM-8902",
      itemName: "AirPods Pro",
      claimant: "Kasun Jayasanka",
      studentId: "ST99281",
      date: "2024-03-18",
      status: "Verified",
      proofImg: "https://images.unsplash.com/photo-1588423770574-91993ca0a8b8?q=80&w=100&auto=format&fit=crop"
    },
    {
      id: "CLM-8903",
      itemName: "Student ID Card",
      claimant: "Nimesha Silva",
      studentId: "ST44552",
      date: "2024-03-15",
      status: "Rejected",
      proofImg: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=100&auto=format&fit=crop"
    }
  ]);

  const getStatusStyle = (status) => {
    switch (status) {
      case "Verified": return "bg-green-50 text-green-600 border-green-100";
      case "Pending": return "bg-blue-50 text-blue-600 border-blue-100";
      case "Rejected": return "bg-rose-50 text-rose-600 border-rose-100";
      default: return "bg-slate-50 text-slate-600 border-slate-100";
    }
  };

  return (
    <div className="flex-1 bg-[#F8FAFF] min-h-screen p-8 lg:p-12 overflow-y-auto">
      
      {/* --- HEADER SECTION --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Claim Verification</h1>
          <p className="text-slate-500 font-bold text-sm mt-1 uppercase tracking-widest">
            Manage and verify lost item ownership claims
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-blue-600" size={18} />
            <input 
              type="text" 
              placeholder="Search by Claim ID or Item..." 
              className="pl-12 pr-6 py-3.5 bg-white border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 w-full md:w-80 shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-200 transition-all"
            />
          </div>
          <button className="p-3.5 bg-white border border-slate-100 rounded-2xl text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-all shadow-sm group">
            <Filter size={20} className="group-hover:rotate-12 transition-transform" />
          </button>
        </div>
      </div>

      {/* --- STATS ROW --- */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
        {[
          { label: "Total Claims", value: "254", icon: <Package size={20}/>, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Pending", value: "12", icon: <Activity size={20}/>, color: "text-amber-600", bg: "bg-amber-50" },
          { label: "Verified Today", value: "48", icon: <ShieldCheck size={20}/>, color: "text-green-600", bg: "bg-green-50" }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center gap-5 transition-transform hover:-translate-y-1">
            <div className={`${stat.bg} ${stat.color} p-4 rounded-2xl`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
              <p className="text-2xl font-black text-slate-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* --- CLAIMS TABLE SECTION --- */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-50 bg-slate-50/50">
                <th className="px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Claimant Info</th>
                <th className="px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Lost Item</th>
                <th className="px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Date Filed</th>
                <th className="px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                <th className="px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {claims.map((claim) => (
                <tr key={claim.id} className="hover:bg-blue-50/30 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 overflow-hidden border-2 border-white shadow-sm font-black text-xs">
                        {claim.claimant.charAt(0)}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-extrabold text-slate-900">{claim.claimant}</span>
                        <span className="text-[11px] font-bold text-slate-400">{claim.studentId}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <img src={claim.proofImg} className="w-10 h-10 rounded-xl object-cover border border-slate-200" alt="Proof" />
                      <div className="flex flex-col">
                        <span className="text-sm font-extrabold text-slate-700">{claim.itemName}</span>
                        <span className="text-[10px] font-black text-blue-600 uppercase tracking-tighter">{claim.id}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 text-slate-500">
                      <Calendar size={14} className="text-slate-400" />
                      <span className="text-sm font-bold">{claim.date}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(claim.status)}`}>
                      {claim.status}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2.5 text-blue-600 hover:bg-blue-100 rounded-xl transition-all shadow-sm bg-white border border-blue-50" title="View Proof">
                        <Eye size={18} />
                      </button>
                      <button className="p-2.5 text-green-600 hover:bg-green-100 rounded-xl transition-all shadow-sm bg-white border border-green-50" title="Approve">
                        <CheckCircle2 size={18} />
                      </button>
                      <button className="p-2.5 text-rose-600 hover:bg-rose-100 rounded-xl transition-all shadow-sm bg-white border border-rose-50" title="Reject">
                        <XCircle size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* --- PAGINATION --- */}
        <div className="p-8 border-t border-slate-50 flex justify-between items-center bg-slate-50/30">
          <p className="text-xs font-bold text-slate-400 tracking-wide uppercase">Showing 3 of 254 claims</p>
          <div className="flex gap-2">
            <button className="px-5 py-2.5 text-xs font-black bg-white border border-slate-200 text-slate-400 rounded-xl hover:bg-slate-50 transition-all">Previous</button>
            <button className="px-5 py-2.5 text-xs font-black bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all">Next Page</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Dummy Activity Icon for stats
function Activity({ size, className }) {
  return <ArrowUpRight size={size} className={className} />;
}