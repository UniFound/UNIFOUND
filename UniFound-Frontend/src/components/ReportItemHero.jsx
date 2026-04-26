import React from "react";

export default function ReportItemHero({ activeTab = "lost" }) {
  const isLost = activeTab === "lost";

  return (
    <section
      className={`w-full relative overflow-hidden py-28 ${
        isLost ? "bg-gradient-to-r from-blue-100 via-blue-50 to-blue-100" : "bg-gradient-to-r from-green-100 via-green-50 to-green-100"
      }`}
    >
      {/* Background decorative shapes */}
      <div className="absolute top-0 -left-20 w-96 h-96 bg-white/20 rounded-full filter blur-3xl animate-pulse-slow"></div>
      <div className="absolute bottom-0 -right-24 w-96 h-96 bg-white/20 rounded-full filter blur-3xl animate-pulse-slow"></div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center gap-12 relative z-10">
        {/* Text Card */}
        <div className="flex-1 bg-white/40 backdrop-blur-xl p-8 rounded-3xl shadow-2xl hover:shadow-3xl transition-shadow duration-500">
          <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${isLost ? "text-blue-700" : "text-green-700"}`}>
            Report a {isLost ? "Lost" : "Found"} Item
          </h1>
          <p className="text-gray-700 text-lg md:text-xl leading-relaxed">
            Quickly report your {isLost ? "lost" : "found"} items. Fill out the form below so the campus community can help recover them efficiently.
          </p>
        </div>

        {/* Hero Image */}
        <div className="flex-1 relative">
          <div className="rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-shadow duration-500 transform hover:scale-105">
            <img
              src="/report-hero.png"
              alt="Report Item"
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}