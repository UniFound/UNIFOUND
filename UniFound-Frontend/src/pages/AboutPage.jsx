"use client";

import Navbar from "../components/Navbar.jsx";
import { Users, ShieldCheck, Zap, Globe, Heart, Target, ChevronRight } from "lucide-react";

export default function AboutPage() {
  const teamMembers = [
    { name: "Rashmini Kavindya", role: "Frontend Developer", img: "https://ytzzomqohkjpftxnrzjd.supabase.co/storage/v1/object/public/unifound-images/Minuri/image_2026-04-07_024238861.png" },
    { name: "Minuri Sewmini", role: "Backend Developer", img: "https://ytzzomqohkjpftxnrzjd.supabase.co/storage/v1/object/public/unifound-images/Minuri/WhatsApp%20Image%202026-04-07%20at%202.33.03%20AM.jpeg" },
    { name: "Rashan Fernando", role: "UI/UX Designer", img: "https://ytzzomqohkjpftxnrzjd.supabase.co/storage/v1/object/public/unifound-images/Minuri/image_2026-04-07_024125548.png" },
    { name: "Supun Perera", role: "Project Manager", img: "https://ytzzomqohkjpftxnrzjd.supabase.co/storage/v1/object/public/unifound-images/Minuri/image_2026-04-07_024426790.png" },
  ];

  const values = [
    { icon: <ShieldCheck className="text-blue-600" />, title: "Trust & Security", desc: "Every report is verified by campus admins to ensure maximum safety." },
    { icon: <Zap className="text-amber-500" />, title: "Fast Recovery", desc: "Our smart matching system connects owners with their items instantly." },
    { icon: <Heart className="text-rose-500" />, title: "Community First", desc: "Built by students, for students, fostering a culture of honesty." }
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-24 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-blue-50/50 to-transparent -z-10"></div>
      <div className="absolute top-20 -right-20 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-20 -left-20 w-96 h-96 bg-emerald-50/40 rounded-full blur-3xl -z-10"></div>

      <Navbar />

      <div className="pt-32 px-6 max-w-7xl mx-auto space-y-24 relative z-10">
        
        {/* --- HERO SECTION --- */}
        <section className="flex flex-col lg:flex-row items-center gap-16 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="flex-1 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
              <span className="text-[10px] font-black uppercase tracking-widest">Our Story</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 leading-[1.1] tracking-tight">
              Revolutionizing <br />
              <span className="text-blue-600 italic">Campus Recovery.</span>
            </h1>
            <p className="text-slate-500 text-lg md:text-xl leading-relaxed max-w-xl italic">
              UniFound isn't just a lost and found system. It’s a smart campus ecosystem 
              designed to bring lost belongings back to their owners with speed, trust, and simplicity.
            </p>
            <div className="flex gap-4 pt-4">
              <button className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold text-sm shadow-xl shadow-slate-200 hover:scale-105 transition-all">
                Learn More
              </button>
              
              {/* මෙතන තමයි වෙනස් කළේ - Array එක map කරලා real images ගත්තා */}
              <div className="flex -space-x-3 items-center ml-4">
                {teamMembers.map((member, i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 shadow-sm overflow-hidden">
                    <img src={member.img} alt={member.name} className="w-full h-full object-cover" />
                  </div>
                ))}
                <span className="pl-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Trusted by 500+ Students</span>
              </div>
            </div>
          </div>

          <div className="flex-1 relative group">
            <div className="absolute inset-0 bg-blue-600 rounded-[3rem] rotate-3 group-hover:rotate-1 transition-transform duration-500 -z-10 opacity-10"></div>
            {/* මෙතන පින්තූරය පෙන්වීමට /about-hero.png වෙනුවට ඔබ කැමති image එකක් දාන්න */}
            <img
              src="https://ytzzomqohkjpftxnrzjd.supabase.co/storage/v1/object/public/unifound-images/Minuri/image_2026-04-07_024833101.png"
              alt="About UniFound"
              className="w-full h-auto rounded-[3rem] shadow-2xl transition-all duration-700 group-hover:-translate-y-2"
            />
            {/* Floating Info Card */}
            <div className="absolute -bottom-6 -left-6 bg-white/80 backdrop-blur-xl p-6 rounded-3xl shadow-2xl border border-white max-w-[200px] animate-bounce-slow">
              <div className="bg-emerald-100 w-10 h-10 rounded-2xl flex items-center justify-center mb-3 text-emerald-600">
                <ShieldCheck size={24} />
              </div>
              <p className="text-[11px] font-black text-slate-900 uppercase mb-1">100% Secured</p>
              <p className="text-[10px] text-slate-500 font-bold italic">End-to-end verified by university admin.</p>
            </div>
          </div>
        </section>

        {/* --- CORE VALUES --- */}
        <section className="grid md:grid-cols-3 gap-8">
          {values.map((v, i) => (
            <div key={i} className="group p-10 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2">
              <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {v.icon}
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-3 italic">{v.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed font-medium">{v.desc}</p>
            </div>
          ))}
        </section>

        {/* --- TEAM SECTION --- */}
        <section className="space-y-16 py-12">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">The Minds Behind <span className="text-blue-600">UniFound.</span></h2>
            <p className="text-slate-500 font-bold italic text-sm">A dedicated group of developers and designers committed to making campus life easier.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member, idx) => (
              <div
                key={idx}
                className="relative group overflow-hidden bg-white p-4 rounded-[2.5rem] border border-slate-100 shadow-sm transition-all duration-500 hover:shadow-2xl"
              >
                <div className="relative w-full aspect-square rounded-[2rem] overflow-hidden mb-6">
                  <img
                    src={member.img}
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-600/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                    <button className="bg-white text-blue-600 w-full py-3 rounded-xl font-bold text-xs shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform">
                      View Profile
                    </button>
                  </div>
                </div>
                <div className="text-center pb-4">
                  <h3 className="text-slate-900 font-black text-lg italic tracking-tight">{member.name}</h3>
                  <p className="text-blue-600 text-[10px] font-black uppercase tracking-[0.2em] mt-1">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

{/* --- MISSION SECTION --- */}
        <section className="relative overflow-hidden bg-white border border-blue-100 p-10 md:p-16 rounded-[2.5rem] shadow-xl shadow-blue-500/5 group max-w-5xl mx-auto">
          {/* Soft Blue Decorative Orbs */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-100/50 rounded-full blur-3xl group-hover:bg-blue-200/50 transition-colors duration-700"></div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-sky-50/50 rounded-full blur-3xl group-hover:bg-sky-100/50 transition-colors duration-700"></div>
          
          <div className="relative z-10 text-center space-y-10">
            {/* Minimal Header */}
            <div className="space-y-3">
              <div className="inline-flex p-3 bg-blue-50 rounded-2xl text-blue-600 mb-2 group-hover:scale-110 transition-transform duration-500">
                  <Target size={28} />
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 italic tracking-tight">Our Mission</h2>
              <p className="text-slate-500 text-base md:text-lg font-medium italic max-w-xl mx-auto leading-relaxed">
                "Empowering students through technology to foster a culture of honesty and reliable campus recovery."
              </p>
            </div>

            {/* Compact Mission Grid */}
            <div className="grid sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
              {[
                { title: "Trust", desc: "Verified networks for safe exchange.", color: "bg-blue-50" },
                { title: "Speed", desc: "Instant matching technology.", color: "bg-sky-50" },
                { title: "Unity", desc: "Strengthening our community.", color: "bg-indigo-50" }
              ].map((item, i) => (
                <div key={i} className={`p-5 rounded-2xl ${item.color} border border-white/50 transition-all duration-300 hover:shadow-md`}>
                  <h4 className="text-blue-700 font-black text-[10px] uppercase tracking-widest mb-1.5">{item.title}</h4>
                  <p className="text-slate-600 text-[11px] font-bold leading-snug">{item.desc}</p>
                </div>
              ))}
            </div>

            {/* Action Button */}
            <div className="pt-2">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-xl font-black text-xs transition-all shadow-lg shadow-blue-200 active:scale-95 flex items-center gap-2 mx-auto uppercase tracking-widest">
                Join our community <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}