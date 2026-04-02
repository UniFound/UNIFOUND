import { useNavigate, useLocation } from "react-router-dom"; 
import { 
  LayoutDashboard, 
  Users, 
  Box, 
  ShieldCheck, 
  LifeBuoy, 
  Settings, 
  LogOut 
} from "lucide-react";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    navigate("/login");
  };

  const menuItems = [
    { 
      icon: <LayoutDashboard size={20} />, 
      label: "Dashboard", 
      path: "/admin" 
    },
    { 
      icon: <Users size={20} />, 
      label: "Users", 
      path: "/admin/users" 
    },
    { 
      icon: <Box size={20} />, 
      label: "Items", 
      path: "/admin/items" 
    },
    { 
      icon: <ShieldCheck size={20} />, 
      label: "Claims", 
      path: "/admin/claims" 
    },
    { 
      icon: <LifeBuoy size={20} />, 
      label: "Tickets", 
      path: "/admin/tickets", 
      badge: "2" 
    },
    { 
      icon: <Settings size={20} />, 
      label: "Settings", 
      path: "/admin/settings" 
    },
  ];

  return (
    /* Font එක Inter, Segoe UI, සහ sans-serif ලෙස ඉතා පැහැදිලි එකකට වෙනස් කර ඇත */
    <aside className="w-72 bg-white border-r border-slate-100 flex flex-col p-7 sticky top-0 h-screen overflow-hidden font-['Inter',_-apple-system,_.SFNSText-Regular,'Segoe_UI','Helvetica_Neue',sans-serif]">
      
      {/* LOGO SECTION */}
      <div className="flex items-center gap-3.5 mb-14 px-3">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-100/50 transform -rotate-3 group cursor-pointer hover:rotate-0 transition-transform">
          <Box size={22} strokeWidth={2.5} />
        </div>
        <div className="flex flex-col">
          <span className="text-xl font-bold tracking-tight text-slate-900 leading-none">UniFound</span>
          <span className="text-[10px] font-bold text-blue-600 uppercase tracking-[0.2em] mt-1">Admin Portal</span>
        </div>
      </div>

      {/* NAVIGATION SECTION */}
      <nav className="flex-1 space-y-1.5 overflow-y-auto pr-2 custom-scrollbar">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4 px-4">Main Menu</p>
        
        {menuItems.map((item, idx) => {
          const isActive = location.pathname === item.path;

          return (
            <button
              key={idx}
              onClick={() => navigate(item.path)} 
              className={`w-full group flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-300 ${
                isActive 
                  ? "bg-blue-600 text-white shadow-[0_10px_25px_-5px_rgba(37,99,235,0.35)]" 
                  : "text-slate-400 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <div className="flex items-center gap-4">
                <span className={`${isActive ? "text-white" : "text-slate-400 group-hover:text-blue-600"} transition-colors`}>
                  {item.icon}
                </span>
                <span className={`text-[13px] font-bold tracking-wide ${isActive ? "text-white" : "text-slate-600 group-hover:text-slate-900"}`}>
                  {item.label}
                </span>
              </div>
              
              {item.badge && (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg ${
                  isActive ? "bg-white/20 text-white" : "bg-blue-50 text-blue-600"
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* FOOTER SECTION */}
      <div className="mt-auto pt-6 border-t border-slate-50 space-y-2">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-4 px-4 py-4 text-slate-400 font-bold text-sm hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all group"
        >
          <div className="p-2 bg-transparent group-hover:bg-rose-100/50 rounded-xl transition-colors">
            <LogOut size={20} />
          </div>
          Logout Account
        </button>
        
        {/* Support Card UI */}
        <div className="bg-slate-50 rounded-2xl p-4 mt-4 border border-slate-100/50">
          <p className="text-[10px] font-bold text-slate-800 uppercase tracking-widest mb-1">Help Center</p>
          <p className="text-[10px] font-medium text-slate-400 leading-tight">Need help with dashboard?</p>
          <button className="mt-3 text-[10px] font-bold text-blue-600 uppercase tracking-tighter hover:underline">Contact Support</button>
        </div>
      </div>
    </aside>
  );
}