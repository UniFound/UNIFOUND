import { Search, Bell, ChevronDown, Command } from "lucide-react";

export default function Header() {
  return (
    <header className="h-20 bg-white/70 backdrop-blur-xl sticky top-0 z-50 px-10 flex items-center justify-between border-b border-slate-100/50">
      
      {/* SEARCH SECTION */}
      <div className="relative group w-[420px]">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
          <Search className="text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
        </div>
        
        <input 
          type="text" 
          placeholder="Search reports, items or users..." 
          className="w-full pl-12 pr-16 py-3 bg-slate-100/50 border border-transparent rounded-[18px] text-sm font-medium placeholder:text-slate-400 focus:bg-white focus:border-blue-200 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all duration-300"
        />

        {/* Keyboard Shortcut Hint */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-1 px-2 py-1 bg-white border border-slate-200 rounded-lg shadow-sm">
          <Command size={10} className="text-slate-400" />
          <span className="text-[10px] font-bold text-slate-400">K</span>
        </div>
      </div>

      {/* RIGHT SIDE ACTIONS */}
      <div className="flex items-center gap-4">
        
        {/* Notifications */}
        <button className="relative p-3 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all duration-200 group">
          <Bell size={20} className="group-hover:rotate-12 transition-transform" />
          <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-blue-600 rounded-full border-2 border-white animate-pulse"></span>
        </button>

        <div className="h-8 w-[1px] bg-slate-200 mx-2"></div>

        {/* User Profile Section */}
        <div className="flex items-center gap-4 pl-2 group cursor-pointer">
          <div className="text-right hidden md:block">
            <p className="text-sm font-black text-slate-900 leading-tight group-hover:text-blue-600 transition-colors">
              Nadeesha Perera
            </p>
            <div className="flex items-center justify-end gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">Admin Status</p>
            </div>
          </div>

          <div className="relative">
            <div className="w-11 h-11 rounded-[16px] bg-gradient-to-tr from-blue-600 to-blue-400 p-[2px] shadow-lg shadow-blue-100 group-hover:scale-105 transition-transform">
              <div className="w-full h-full rounded-[14px] bg-white p-[2px]">
                <img 
                  src="https://i.pravatar.cc/150?u=nadeesha" 
                  alt="avatar" 
                  className="w-full h-full rounded-[12px] object-cover shadow-inner"
                />
              </div>
            </div>
            {/* Status Dot */}
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center shadow-sm">
               <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
            </div>
          </div>
          
          <ChevronDown size={16} className="text-slate-400 group-hover:text-slate-600 group-hover:translate-y-0.5 transition-all" />
        </div>

      </div>
    </header>
  );
}