export default function Stats() {
  return (
    <section className="relative py-28">

      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50 via-white to-blue-50 -z-10"></div>

      <div className="max-w-7xl mx-auto px-6">

        {/* Glass Container */}
        <div className="bg-white/80 backdrop-blur-xl border border-white/40 rounded-3xl shadow-xl p-8 md:p-12">

          {/* Heading */}
          <div className="text-center mb-14">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              Trusted by Students Across Campuses
            </h2>
            <p className="mt-5 text-gray-500 text-lg font-medium">
              Thousands of successful recoveries powered by UniFound.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 text-center">

            <div>
              <h3 className="text-4xl md:text-5xl font-extrabold text-blue-600">
                500+
              </h3>
              <p className="text-sm md:text-base text-slate-500 mt-2 font-semibold">
                Items Found
              </p>
            </div>

            <div>
              <h3 className="text-4xl md:text-5xl font-extrabold text-blue-600">
                1K+
              </h3>
              <p className="text-sm md:text-base text-slate-500 mt-2 font-semibold">
                Active Students
              </p>
            </div>

            <div>
              <h3 className="text-4xl md:text-5xl font-extrabold text-blue-600">
                50+
              </h3>
              <p className="text-sm md:text-base text-slate-500 mt-2 font-semibold">
                Campuses
              </p>
            </div>

            <div>
              <h3 className="text-4xl md:text-5xl font-extrabold text-blue-600">
                98%
              </h3>
              <p className="text-sm md:text-base text-slate-500 mt-2 font-semibold">
                Match Accuracy
              </p>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}