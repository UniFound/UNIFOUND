import Header from "../components/Header";
import Sidebar from "../components/Sidebar";


export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-[#F8FAFF] font-sans text-[#1E293B]">
      {/* Sidebar */}
      <Sidebar/>
      
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <Header />
        
        {/* Page Content */}
        <main className="p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}