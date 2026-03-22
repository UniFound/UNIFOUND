import { Activity, Search, MapPin } from "lucide-react";

export default function SystemPreview() {
  return (
    <section className="relative py-24 overflow-hidden">

      {/* 🔥 TOP FADE (smooth transition from hero) */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-transparent to-white/60 backdrop-blur-sm z-0" />

      {/* 🔵 BACKGROUND CONTINUATION */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-blue-100 -z-10" />

      {/* subtle pattern */}
      <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle,_#3b82f6_1px,_transparent_1px)] [background-size:22px_22px]" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* HEADER */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            See How UniFound Works in Real-Time
          </h2>

          <p className="mt-4 text-gray-600">
            Experience how students report, match, and recover lost items effortlessly.
          </p>
        </div>

        {/* MAIN UI */}
        <div className="relative flex justify-center items-center">

          {/* MAIN DASHBOARD */}
          <div className="bg-white/80 backdrop-blur-xl border border-white/40 rounded-3xl shadow-2xl p-6 w-[360px] md:w-[420px]">

            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-800">Live Reports</h3>
              <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                Live
              </span>
            </div>

            <div className="space-y-3">

              <div className="flex justify-between items-center bg-gray-50 rounded-xl p-3">
                <span>ID Card</span>
                <span className="text-blue-500 text-xs">Matched</span>
              </div>

              <div className="flex justify-between items-center bg-gray-50 rounded-xl p-3">
                <span>Laptop</span>
                <span className="text-green-500 text-xs">Found</span>
              </div>

              <div className="flex justify-between items-center bg-gray-50 rounded-xl p-3">
                <span>Headphones</span>
                <span className="text-yellow-500 text-xs">Pending</span>
              </div>

            </div>

            {/* bottom stats */}
            <div className="grid grid-cols-2 gap-3 mt-5">
              <div className="bg-gray-50 p-3 rounded-xl text-center">
                <p className="text-xs text-gray-400">Recovered</p>
                <p className="font-bold text-gray-900">+120</p>
              </div>

              <div className="bg-gray-50 p-3 rounded-xl text-center">
                <p className="text-xs text-gray-400">Accuracy</p>
                <p className="font-bold text-blue-600">98%</p>
              </div>
            </div>

          </div>

          {/* 🔥 FLOATING LEFT */}
          <div className="absolute -left-10 top-10 bg-white/80 backdrop-blur-md p-4 rounded-xl shadow-lg border border-white/40 w-40 hidden md:block">
            <Search className="text-blue-500 mb-2" />
            <p className="text-xs text-gray-500">Smart Matching</p>
          </div>

          {/* 🔥 FLOATING RIGHT */}
          <div className="absolute -right-10 bottom-10 bg-white/80 backdrop-blur-md p-4 rounded-xl shadow-lg border border-white/40 w-40 hidden md:block">
            <MapPin className="text-blue-500 mb-2" />
            <p className="text-xs text-gray-500">Location Tracking</p>
          </div>

          {/* 🔥 TOP FLOAT */}
          <div className="absolute top-[-20px] bg-white/80 backdrop-blur-md px-4 py-2 rounded-xl shadow border border-white/40 hidden md:flex items-center gap-2">
            <Activity size={14} className="text-green-500" />
            <span className="text-xs text-gray-600">System Active</span>
          </div>

        </div>
      </div>
    </section>
  );
}