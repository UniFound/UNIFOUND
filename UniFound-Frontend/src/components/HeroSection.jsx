import { ArrowRight } from "lucide-react";

export default function HeroSection() {
  return (
    <div className="relative w-full pt-28 pb-24 overflow-hidden">

      {/* 🔥 BACKGROUND */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-blue-100 -z-10" />

      {/* Glow layers */}
      <div className="absolute w-[500px] h-[500px] bg-blue-400/20 rounded-full blur-3xl top-[-150px] left-[-150px]" />
      <div className="absolute w-[400px] h-[400px] bg-blue-300/20 rounded-full blur-3xl bottom-[-100px] right-[20%]" />

      {/* grid */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle,_#3b82f6_1px,_transparent_1px)] [background-size:24px_24px]" />

      <div className="w-full max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">

        {/* LEFT */}
        <div className="max-w-xl relative z-10">

          {/* Badge */}
          <div className="inline-block px-4 py-1 text-xs bg-white/80 backdrop-blur border border-blue-100 rounded-full text-blue-600 mb-6 shadow-sm">
            🎓 Smart Campus Solution
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight tracking-tight">
            Find & Recover Lost Items <br />
            <span className="text-transparent bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text">
              Faster and Smarter
            </span>
          </h1>

          {/* Description */}
          <p className="mt-5 text-gray-600 text-sm md:text-base max-w-md leading-relaxed">
            UniFound helps students easily report, search, and recover lost items 
            across campus using a smart, secure, and AI-powered platform.
          </p>

          {/* Buttons */}
          <div className="mt-7 flex gap-4">

            <button className="bg-gradient-to-r from-blue-600 to-blue-500 
            text-white px-6 py-2.5 rounded-full shadow-lg 
            hover:shadow-xl hover:scale-105 transition-all duration-300 
            flex items-center gap-2 font-medium">

              Get Started
              <ArrowRight size={16} />
            </button>

            <button className="bg-blue-50 backdrop-blur border border-blue-200 
            px-6 py-2.5 rounded-full text-blue-700 
            hover:bg-blue-100 transition shadow-sm">

              Explore Features
            </button>

          </div>

          {/* Stats */}
          <div className="mt-7 flex gap-8 text-sm text-gray-600">

            <div>
              <span className="block font-bold text-lg text-blue-600">
                500+
              </span>
              Items Found
            </div>

            <div>
              <span className="block font-bold text-lg text-blue-600">
                1K+
              </span>
              Students
            </div>

          </div>

        </div>

        {/* RIGHT SIDE */}
        <div className="relative flex justify-center items-center">

          {/* Glass Card */}
          <div className="bg-white/60 backdrop-blur-2xl border border-white/40 
          rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.08)] 
          p-5 w-[340px] relative overflow-hidden">

            {/* overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-100/40 via-transparent to-blue-100/20 pointer-events-none" />

            <div className="relative">

              {/* Header */}
              <div className="flex justify-between items-center mb-4">
                <p className="text-sm font-semibold text-gray-700">
                  Recent Activity
                </p>
                <span className="text-xs text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">
                  Live
                </span>
              </div>

              {/* List */}
              <div className="space-y-3">

                <div className="flex items-center justify-between bg-white/80 
                backdrop-blur-md p-3 rounded-xl shadow-sm border 
                hover:scale-[1.03] hover:shadow-md transition">

                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-gray-700">ID Card</span>
                  </div>

                  <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">
                    Matched
                  </span>
                </div>

                <div className="flex items-center justify-between bg-white/80 
                backdrop-blur-md p-3 rounded-xl shadow-sm border 
                hover:scale-[1.03] hover:shadow-md transition">

                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-gray-700">Laptop</span>
                  </div>

                  <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                    Found
                  </span>
                </div>

                <div className="flex items-center justify-between bg-white/80 
                backdrop-blur-md p-3 rounded-xl shadow-sm border 
                hover:scale-[1.03] hover:shadow-md transition">

                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-gray-700">Headphones</span>
                  </div>

                  <span className="text-xs font-medium text-yellow-600 bg-yellow-100 px-2 py-0.5 rounded-full">
                    Pending
                  </span>
                </div>

              </div>

              {/* Stats */}
              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="bg-white/80 p-3 rounded-xl text-center border">
                  <p className="text-xs text-gray-400">Recovered</p>
                  <h3 className="text-lg font-bold text-gray-800">+120</h3>
                </div>

                <div className="bg-white/80 p-3 rounded-xl text-center border">
                  <p className="text-xs text-gray-400">Accuracy</p>
                  <h3 className="text-lg font-bold text-blue-600">98%</h3>
                </div>
              </div>

            </div>
          </div>

          {/* Glow */}
          <div className="absolute -bottom-8 -right-8 w-44 h-44 
          bg-gradient-to-br from-blue-400 to-blue-500 
          rounded-3xl blur-3xl opacity-30"></div>

        </div>

      </div>
    </div>
  );
}