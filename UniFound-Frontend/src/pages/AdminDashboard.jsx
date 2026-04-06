import AdminLayout from "../pages/AdminLayout";
import { TrendingUp, Users, Box, ShieldCheck, LifeBuoy, ArrowUpRight, ArrowDownRight, MoreHorizontal, FileText, FolderOpen, BarChart3 } from "lucide-react";

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* REFINED STATS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            icon={<Users size={20} />} 
            color="blue"
            label="Total Users" 
            value="12,423" 
            trend="+12%" 
            isPositive={true}
          />
          <StatCard 
            icon={<Box size={20} />} 
            color="emerald"
            label="Found Items" 
            value="1,221" 
            trend="+5.4%" 
            isPositive={true}
          />
          <StatCard 
            icon={<ShieldCheck size={20} />} 
            color="orange"
            label="Active Claims" 
            value="423" 
            trend="+2.1%" 
            isPositive={true}
          />
          <StatCard 
            icon={<LifeBuoy size={20} />} 
            color="rose"
            label="Open Tickets" 
            value="18" 
            trend="-2%" 
            isPositive={false}
          />
        </div>

        {/* KEY MANAGEMENT CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <KeyCard 
            icon={<FileText size={20} />} 
            color="violet"
            label="AUDIT LOGS" 
            description="View system activities and logs"
            link="/admin/audit"
          />
          <KeyCard 
            icon={<FolderOpen size={20} />} 
            color="amber"
            label="CATEGORIES" 
            description="Manage item categories"
            link="/admin/categories"
          />
          <KeyCard 
            icon={<BarChart3 size={20} />} 
            color="cyan"
            label="REPORTS" 
            description="Generate and view reports"
            link="/admin/reports"
          />
        </div>

        {/* BOTTOM SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-[32px] p-8 shadow-sm border border-slate-100/50 relative overflow-hidden">
             {/* Subtle pattern background for the chart area */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full blur-3xl opacity-50 -mr-16 -mt-16"></div>
            
            <div className="flex items-center justify-between mb-10 relative z-10">
              <div>
                <h3 className="font-black text-slate-900 text-lg tracking-tight">Platform Analytics</h3>
                <p className="text-[10px] font-black text-slate-400 mt-1 uppercase tracking-[0.2em]">Activity Overview</p>
              </div>
              <button className="p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors">
                <MoreHorizontal size={20} className="text-slate-400" />
              </button>
            </div>
            
            <div className="h-[340px] bg-slate-50/50 rounded-[24px] border border-slate-100 flex items-center justify-center">
               <p className="text-slate-300 font-black italic text-sm tracking-widest opacity-50 underline decoration-blue-500/30 decoration-4 underline-offset-8">Visual Data Stream</p>
            </div>
          </div>

          {/* SIDE PROMO CARD */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-[35px] p-10 text-white relative overflow-hidden flex flex-col justify-end shadow-xl shadow-blue-200">
            <div className="absolute top-10 right-10 opacity-10 rotate-12"><ShieldCheck size={120} /></div>
            <h2 className="text-2xl font-black mb-4 leading-tight tracking-tight">Ready to verify new claims?</h2>
            <p className="text-blue-100/80 text-sm font-bold mb-8 leading-relaxed">Check the latest item ownership proofs submitted by users today.</p>
            <button className="bg-white text-blue-600 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-50 transition-colors shadow-lg shadow-blue-900/20">
              Review Now
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

function StatCard({ icon, color, label, value, trend, isPositive }) {
  // Color configuration to remove excessive whiteness
  const theme = {
    blue: "bg-blue-50/50 border-blue-100 text-blue-600 hover:border-blue-300",
    emerald: "bg-emerald-50/50 border-emerald-100 text-emerald-600 hover:border-emerald-300",
    orange: "bg-orange-50/50 border-orange-100 text-orange-600 hover:border-orange-300",
    rose: "bg-rose-50/50 border-rose-100 text-rose-600 hover:border-rose-300",
  }[color];

  return (
    <div className={`p-6 rounded-[30px] border transition-all duration-300 group ${theme}`}>
      <div className="flex items-center justify-between mb-5">
        <div className={`p-3 rounded-2xl bg-white shadow-sm group-hover:scale-110 transition-transform`}>
          {icon}
        </div>
        <div className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-black text-[10px] bg-white shadow-sm ${
          isPositive ? 'text-emerald-600' : 'text-rose-600'
        }`}>
          {isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
          {trend}
        </div>
      </div>
      <div>
        <p className="text-[10px] font-black opacity-60 uppercase tracking-[0.15em] mb-1">{label}</p>
        <p className="text-2xl font-black text-slate-900 tracking-tighter">{value}</p>
      </div>
    </div>
  );
}

function KeyCard({ icon, color, label, description, link }) {
  // Color configuration for key cards - darker colors
  const theme = {
    violet: "bg-violet-100 border-violet-300 text-violet-800 hover:bg-violet-200 hover:border-violet-400",
    amber: "bg-amber-100 border-amber-300 text-amber-800 hover:bg-amber-200 hover:border-amber-400",
    cyan: "bg-cyan-100 border-cyan-300 text-cyan-800 hover:bg-cyan-200 hover:border-cyan-400",
  }[color];

  return (
    <div 
      className={`p-6 rounded-[30px] border transition-all duration-300 cursor-pointer group ${theme}`}
      onClick={() => window.location.href = link}
    >
      <div className="flex items-center justify-center mb-4">
        <div className={`p-4 rounded-2xl bg-white shadow-sm group-hover:scale-110 transition-transform`}>
          {icon}
        </div>
      </div>
      <div className="text-center">
        <p className="text-sm font-black text-slate-900 tracking-tight mb-2">{label}</p>
        <p className="text-[10px] font-medium text-slate-600 leading-tight">{description}</p>
      </div>
    </div>
  );
}