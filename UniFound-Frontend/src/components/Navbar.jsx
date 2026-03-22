import { useState } from "react";

export default function Navbar() {
  const [active, setActive] = useState("Home");

  const navItems = ["Community", "Platform", "Resources", "Pricing", "Reviews"];

  return (
    <div className="w-full flex justify-center fixed top-4 z-50">
      <div className="w-[92%] max-w-7xl flex items-center justify-between px-6 py-3
        bg-white/70 backdrop-blur-xl border border-white/40
        rounded-full shadow-lg">

        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
            U
          </div>
          <span className="font-semibold text-gray-800">
            UniFound
          </span>
        </div>

        {/* Nav */}
        <div className="hidden lg:flex items-center gap-6 text-sm text-gray-600">
          {navItems.map((item) => (
            <button
              key={item}
              onClick={() => setActive(item)}
              className={`transition ${
                active === item
                  ? "text-blue-600 font-medium"
                  : "hover:text-blue-600"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          <button className="text-sm text-gray-600 hover:text-blue-600">
            Sign in
          </button>

          <button className="bg-blue-600 text-white px-4 py-1.5 rounded-full text-sm shadow hover:bg-blue-700 transition">
            Get Started →
          </button>
        </div>
      </div>
    </div>
  );
}