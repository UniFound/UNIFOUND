export default function CTA() {
  return (
    <section className="py-28 bg-gradient-to-r from-blue-50 via-white to-blue-50">
      <div className="max-w-3xl mx-auto px-6 text-center">

        {/* Heading */}
        <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-4">
          Ready to <span className="text-blue-600">Find What You Lost?</span>
        </h2>

        {/* Subtext */}
        <p className="text-gray-500 text-lg md:text-xl font-medium mb-10">
          Join UniFound today and start recovering your lost items quickly and safely.
        </p>

        {/* CTA Button */}
        <button className="inline-flex items-center gap-4 px-10 py-5 bg-blue-600 text-white font-semibold text-sm rounded-2xl shadow-xl transition-all hover:bg-blue-700 hover:scale-105 active:scale-95">
          Get Started
        </button>

      </div>
    </section>
  );
}