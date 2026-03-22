import { UploadCloud, Cpu, CheckCircle } from "lucide-react";

export default function HowItWorks() {
  return (
    <section className="relative py-24 overflow-hidden">

      {/* Background blend */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-blue-50/40 to-white -z-10" />

      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            How UniFound Works
          </h2>
          <p className="mt-4 text-gray-600">
            Recover your lost items in just a few simple steps.
          </p>
        </div>

        {/* Steps */}
        <div className="relative grid md:grid-cols-3 gap-8">

          {/* STEP 1 */}
          <div className="relative bg-white/70 backdrop-blur-xl border border-white/40 rounded-2xl p-6 shadow-lg text-center">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center">
              <UploadCloud className="text-blue-600" />
            </div>

            <h3 className="font-semibold text-gray-900">Report Item</h3>
            <p className="text-sm text-gray-500 mt-2">
              Quickly report lost or found items with details and images.
            </p>

            <span className="absolute top-4 right-4 text-xs text-gray-400">01</span>
          </div>

          {/* STEP 2 */}
          <div className="relative bg-white/70 backdrop-blur-xl border border-white/40 rounded-2xl p-6 shadow-lg text-center">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center">
              <Cpu className="text-blue-600" />
            </div>

            <h3 className="font-semibold text-gray-900">Smart Matching</h3>
            <p className="text-sm text-gray-500 mt-2">
              Our AI system matches lost items with reported findings instantly.
            </p>

            <span className="absolute top-4 right-4 text-xs text-gray-400">02</span>
          </div>

          {/* STEP 3 */}
          <div className="relative bg-white/70 backdrop-blur-xl border border-white/40 rounded-2xl p-6 shadow-lg text-center">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center">
              <CheckCircle className="text-blue-600" />
            </div>

            <h3 className="font-semibold text-gray-900">Recover Item</h3>
            <p className="text-sm text-gray-500 mt-2">
              Connect with the finder and safely recover your lost item.
            </p>

            <span className="absolute top-4 right-4 text-xs text-gray-400">03</span>
          </div>

        </div>

        {/* Optional connecting line (desktop only) */}
        <div className="hidden md:block absolute top-[55%] left-[10%] w-[80%] h-[2px] bg-gradient-to-r from-transparent via-blue-300 to-transparent" />

      </div>
    </section>
  );
}