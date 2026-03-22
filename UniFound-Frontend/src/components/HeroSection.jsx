import { ArrowRight } from "lucide-react";

export default function HeroSection() {
  return (
    <div className="relative w-full pt-28 pb-24 overflow-hidden">

  {/* 🔥 ADVANCED BACKGROUND */}
  <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-blue-50 to-gray-100 -z-10" />

  {/* Glow layers */}
  <div className="absolute w-[500px] h-[500px] bg-blue-400/30 rounded-full blur-3xl top-[-150px] left-[-150px]" />
  <div className="absolute w-[400px] h-[400px] bg-indigo-300/20 rounded-full blur-3xl bottom-[-100px] right-[20%]" />

  {/* subtle grid */}
  <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle,_#3b82f6_1px,_transparent_1px)] [background-size:22px_22px]" />

  <div className="w-full max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">

    {/* LEFT */}
    <div className="max-w-xl relative z-10">

      <div className="inline-block px-4 py-1 text-xs bg-white/70 backdrop-blur border border-white/40 rounded-full text-blue-600 mb-6">
        🎓 Smart Campus Solution
      </div>

      <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
        Find & Recover Lost Items <br />
        Faster and Smarter
      </h1>

      <p className="mt-5 text-gray-600 text-sm md:text-base max-w-md">
        UniFound helps students easily report, search, and recover lost items 
        across campus using a smart, secure, and AI-powered platform.
      </p>

      <div className="mt-6 flex gap-3">
        <button className="bg-blue-600 text-white px-6 py-2 rounded-full shadow hover:bg-blue-700 transition flex items-center gap-2">
          Get Started <ArrowRight size={16} />
        </button>

        <button className="bg-white/70 backdrop-blur border border-gray-200 px-6 py-2 rounded-full text-gray-700 hover:bg-white transition">
          Explore Features
        </button>
      </div>

      <div className="mt-6 flex gap-6 text-sm text-gray-600">
        <div>
          <span className="font-bold text-gray-900">500+</span> Items Found
        </div>
        <div>
          <span className="font-bold text-gray-900">1K+</span> Students
        </div>
      </div>

    </div>

{/* 🔥 RIGHT SIDE WOW UI */}
<div className="relative flex justify-center items-center">

  {/* MAIN GLASS DASHBOARD CARD */}
  <div className="bg-white/60 backdrop-blur-2xl border border-white/40 rounded-3xl shadow-2xl p-5 w-[320px] relative overflow-hidden">

    {/* subtle gradient overlay */}
    <div className="absolute inset-0 bg-gradient-to-br from-blue-100/40 via-transparent to-purple-100/30 pointer-events-none" />

    <div className="relative">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm font-semibold text-gray-700">Recent Activity</p>
        <span className="text-xs text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">
          Live
        </span>
      </div>

      {/* LIST */}
      <div className="space-y-3">

        {/* ITEM */}
        <div className="flex items-center justify-between bg-white/80 backdrop-blur-md p-3 rounded-xl shadow-sm border border-gray-100 hover:scale-[1.02] transition">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-700">ID Card</span>
          </div>
          <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">
            Matched
          </span>
        </div>

        <div className="flex items-center justify-between bg-white/80 backdrop-blur-md p-3 rounded-xl shadow-sm border border-gray-100 hover:scale-[1.02] transition">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-700">Laptop</span>
          </div>
          <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
            Found
          </span>
        </div>

        <div className="flex items-center justify-between bg-white/80 backdrop-blur-md p-3 rounded-xl shadow-sm border border-gray-100 hover:scale-[1.02] transition">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-700">Headphones</span>
          </div>
          <span className="text-xs font-medium text-yellow-600 bg-yellow-100 px-2 py-0.5 rounded-full">
            Pending
          </span>
        </div>

      </div>

      {/* FOOTER MINI STATS */}
      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="bg-white/70 p-3 rounded-xl text-center border border-gray-100">
          <p className="text-xs text-gray-400">Recovered</p>
          <h3 className="text-lg font-bold text-gray-800">+120</h3>
        </div>

        <div className="bg-white/70 p-3 rounded-xl text-center border border-gray-100">
          <p className="text-xs text-gray-400">Accuracy</p>
          <h3 className="text-lg font-bold text-blue-600">98%</h3>
        </div>
      </div>

    </div>
  </div>

  {/* FLOATING DECORATION CARD (DEPTH EFFECT) */}
  <div className="absolute -bottom-6 -right-6 w-40 h-40 bg-linear-to-br from-blue-400 to-purple-400 rounded-3xl blur-3xl opacity-30" />

</div>

  </div>
</div>
  );
}