export default function Stats() {
  return (
    <section className="relative py-20">

      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50/40 via-white to-blue-50/40 -z-10"></div>

      <div className="max-w-6xl mx-auto px-6">

        {/* Glass Container */}
        <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-3xl shadow-xl p-8 md:p-10">

          {/* Heading */}
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Trusted by Students Across Campuses
            </h2>
            <p className="text-gray-600 mt-3">
              Thousands of successful recoveries powered by UniFound.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">

            <div>
              <h3 className="text-3xl md:text-4xl font-bold text-blue-600">
                500+
              </h3>
              <p className="text-sm text-gray-500 mt-2">Items Found</p>
            </div>

            <div>
              <h3 className="text-3xl md:text-4xl font-bold text-blue-600">
                1K+
              </h3>
              <p className="text-sm text-gray-500 mt-2">Active Students</p>
            </div>

            <div>
              <h3 className="text-3xl md:text-4xl font-bold text-blue-600">
                50+
              </h3>
              <p className="text-sm text-gray-500 mt-2">Campuses</p>
            </div>

            <div>
              <h3 className="text-3xl md:text-4xl font-bold text-blue-600">
                98%
              </h3>
              <p className="text-sm text-gray-500 mt-2">Match Accuracy</p>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}