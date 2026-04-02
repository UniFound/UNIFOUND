import React from "react";
import { Search, ShieldCheck, Bell, Zap, ArrowRight } from "lucide-react";

export default function Features() {

  const features = [
    {
      icon: <Search size={28} />,
      title: "Smart Search",
      description:
        "Quickly find lost items using intelligent filtering and powerful keyword matching."
    },
    {
      icon: <ShieldCheck size={28} />,
      title: "Secure Claims",
      description:
        "Every claim goes through identity verification to ensure the rightful owner receives the item."
    },
    {
      icon: <Bell size={28} />,
      title: "Instant Alerts",
      description:
        "Get notified immediately when an item matching your report is found."
    },
    {
      icon: <Zap size={28} />,
      title: "Fast Recovery",
      description:
        "Our matching engine connects lost items with owners faster than traditional systems."
    }
  ];

  return (
    <section className="py-28 bg-blue-50">
      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900">
            Everything you need to{" "}
            <span className="text-blue-600">find your lost items</span>
          </h2>

          <p className="mt-6 text-gray-500 text-lg">
            UniFound simplifies campus lost-and-found management with modern technology.
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-gray-50 hover:bg-white border border-gray-100 hover:border-blue-200 p-8 rounded-2xl transition-all duration-300 hover:shadow-xl"
            >

              {/* Icon */}
              <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-blue-100 text-blue-600 mb-6 group-hover:bg-blue-600 group-hover:text-white transition">
                {feature.icon}
              </div>

              {/* Title */}
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-gray-500 text-sm leading-relaxed">
                {feature.description}
              </p>

            </div>
          ))}

        </div>

        {/* CTA */}
        <div className="flex justify-center mt-20">
          <button className="flex items-center gap-3 bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-700 transition shadow-lg">
            Explore All Features
            <ArrowRight size={18} />
          </button>
        </div>

      </div>
    </section>
  );
}