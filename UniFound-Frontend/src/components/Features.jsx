import { Search, ShieldCheck, Bell, Zap } from "lucide-react";

export default function Features() {
  return (
    <section className="relative py-20 overflow-hidden">

      {/* subtle background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-50/40 to-transparent -z-10" />

      <div className="max-w-7xl mx-auto px-6">

        {/* heading */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Powerful Features for Smart Recovery
          </h2>

          <p className="mt-4 text-gray-600 text-sm md:text-base">
            Everything you need to report, track, and recover lost items faster.
          </p>
        </div>

        {/* cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

          {/* card */}
          <div className="bg-white/70 backdrop-blur-xl border border-white/40 p-6 rounded-2xl shadow-lg hover:shadow-xl transition">
            <Search className="text-blue-600 mb-4" />
            <h3 className="font-semibold text-gray-900">Smart Search</h3>
            <p className="text-sm text-gray-500 mt-2">
              Quickly find lost items using intelligent filters and matching.
            </p>
          </div>

          <div className="bg-white/70 backdrop-blur-xl border border-white/40 p-6 rounded-2xl shadow-lg hover:shadow-xl transition">
            <ShieldCheck className="text-blue-600 mb-4" />
            <h3 className="font-semibold text-gray-900">Secure System</h3>
            <p className="text-sm text-gray-500 mt-2">
              Your data is protected with a secure and trusted platform.
            </p>
          </div>

          <div className="bg-white/70 backdrop-blur-xl border border-white/40 p-6 rounded-2xl shadow-lg hover:shadow-xl transition">
            <Bell className="text-blue-600 mb-4" />
            <h3 className="font-semibold text-gray-900">Instant Alerts</h3>
            <p className="text-sm text-gray-500 mt-2">
              Get notified when your lost item is matched instantly.
            </p>
          </div>

          <div className="bg-white/70 backdrop-blur-xl border border-white/40 p-6 rounded-2xl shadow-lg hover:shadow-xl transition">
            <Zap className="text-blue-600 mb-4" />
            <h3 className="font-semibold text-gray-900">Fast Recovery</h3>
            <p className="text-sm text-gray-500 mt-2">
              Reduce time to recover items with AI-powered matching.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}