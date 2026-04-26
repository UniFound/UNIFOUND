import { Activity, Search, MapPin } from "lucide-react";

export default function SystemPreview() {
  return (
    <section className="relative py-28 overflow-hidden">

      {/* TOP FADE */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-transparent to-white/60 backdrop-blur-sm z-0" />

      {/* BACKGROUND (kept same) */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-blue-100 -z-10" />

      {/* Dot Pattern (kept same) */}
      <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle,_#3b82f6_1px,_transparent_1px)] [background-size:22px_22px]" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* HEADER */}
        <div className="text-center max-w-2xl mx-auto mb-20">

          <div className="flex justify-center mb-5">
            <span className="px-4 py-1.5 bg-blue-50 text-blue-600 text-[11px] font-semibold uppercase tracking-[0.2em] rounded-md border border-blue-100">
              System Overview
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight leading-tight">
            See How <span className="text-blue-600">UniFound</span> Works
          </h2>

          <p className="mt-5 text-gray-500 text-lg">
            A real-time preview of how students report, match and recover lost items across campus.
          </p>

        </div>

        {/* MAIN UI */}
        <div className="relative flex justify-center items-center">

          {/* DASHBOARD */}
          <div className="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-3xl shadow-xl p-8 w-[360px] md:w-[420px] relative z-20">

            {/* Top */}
            <div className="flex justify-between items-center mb-6">

              <h3 className="text-lg font-semibold text-gray-900">
                Live Reports
              </h3>

              <div className="flex items-center gap-2 bg-blue-50 text-blue-600 px-3 py-1 rounded-full">
                <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                <span className="text-[10px] font-semibold uppercase tracking-wider">
                  Live
                </span>
              </div>

            </div>

            {/* Reports */}
            <div className="space-y-3">

              {/* Item */}
              <div className="flex justify-between items-center bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 hover:shadow-sm transition">

                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"/>
                  <span className="text-sm font-medium text-gray-700">
                    ID Card
                  </span>
                </div>

                <span className="text-blue-600 text-xs font-semibold">
                  Matched
                </span>

              </div>

              <div className="flex justify-between items-center bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 hover:shadow-sm transition">

                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"/>
                  <span className="text-sm font-medium text-gray-700">
                    Laptop
                  </span>
                </div>

                <span className="text-green-600 text-xs font-semibold">
                  Found
                </span>

              </div>

              <div className="flex justify-between items-center bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 hover:shadow-sm transition">

                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-amber-500 rounded-full"/>
                  <span className="text-sm font-medium text-gray-700">
                    Headphones
                  </span>
                </div>

                <span className="text-amber-600 text-xs font-semibold">
                  Pending
                </span>

              </div>

            </div>

            {/* Bottom Stats */}
            <div className="grid grid-cols-2 gap-6 mt-8 pt-6 border-t border-gray-100">

              <div className="text-center">
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
                  Recovered
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  +120
                </p>
              </div>

              <div className="text-center border-l border-gray-100">
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
                  Accuracy
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  98%
                </p>
              </div>

            </div>

          </div>

          {/* LEFT FLOAT CARD */}
          <div className="absolute -left-12 top-10 bg-white p-5 rounded-xl shadow-lg border border-gray-100 w-44 hidden lg:flex flex-col gap-2">

            <Search className="text-blue-600" strokeWidth={2} />

            <p className="text-sm font-semibold text-gray-800">
              Smart Matching
            </p>

          </div>

          {/* RIGHT FLOAT CARD */}
          <div className="absolute -right-12 bottom-10 bg-white p-5 rounded-xl shadow-lg border border-gray-100 w-44 hidden lg:flex flex-col gap-2">

            <MapPin className="text-blue-600" strokeWidth={2} />

            <p className="text-sm font-semibold text-gray-800">
              Location Tracking
            </p>

          </div>

          {/* SYSTEM ACTIVE */}
          <div className="absolute -top-6 bg-gray-900 text-white px-5 py-2 rounded-lg shadow-lg hidden md:flex items-center gap-3">

            <Activity size={16} className="text-blue-400" />

            <span className="text-xs font-semibold uppercase tracking-wider">
              System Active
            </span>

          </div>

        </div>
      </div>
    </section>
  );
}