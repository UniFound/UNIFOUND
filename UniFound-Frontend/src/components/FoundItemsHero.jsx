"use client";

import { ArrowRight } from "lucide-react";
import Navbar from "../components/Navbar.jsx";

export default function FoundItemsHero() {
  return (
    <div className="w-full relative overflow-hidden pt-28 pb-24 bg-gradient-to-br from-blue-50 via-white to-blue-100">

      {/* Navbar */}
      <Navbar />

      {/* Background Glow */}
      <div className="absolute top-[-120px] left-[-120px] w-[400px] h-[400px] bg-blue-400/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-120px] right-[-120px] w-[400px] h-[400px] bg-blue-400/20 rounded-full blur-3xl"></div>

      {/* Hero Container */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid md:grid-cols-2 gap-12 items-center">

        {/* LEFT SIDE */}
        <div className="relative z-10">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 text-xs font-semibold 
          bg-blue-100 text-blue-700 rounded-full mb-5 shadow-sm">
            ✅ Campus Recovery Updates
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
            Found Something? <br />
            <span className="text-transparent bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text">
              Claim It Quickly
            </span>
          </h1>

          {/* Description */}
          <p className="mt-6 text-gray-600 text-base md:text-lg max-w-lg">
            Check all the items that have been found around campus. If you lost something, you may be able to recover it easily using our secure system.
          </p>

          {/* Buttons */}
          <div className="mt-8 flex gap-4 flex-wrap">

            <button className="bg-gradient-to-r from-blue-600 to-blue-500 
            text-white px-7 py-3.5 rounded-full shadow-xl 
            hover:scale-105 transition-all duration-300 
            flex items-center gap-2 font-medium">

              Report a Found Item
              <ArrowRight size={17} />
            </button>

            <button className="bg-white/80 backdrop-blur 
            text-blue-700 px-7 py-3.5 rounded-full 
            border border-blue-200 
            hover:bg-white transition">

              Browse Lost Items
            </button>

          </div>

          {/* Mini Stats */}
          <div className="mt-10 flex gap-8 text-sm text-gray-600">

            <div>
              <span className="block text-2xl font-bold text-blue-600">
                420+
              </span>
              Items Found
            </div>

            <div>
              <span className="block text-2xl font-bold text-blue-600">
                380+
              </span>
              Items Claimed
            </div>

            <div>
              <span className="block text-2xl font-bold text-blue-600">
                95%
              </span>
              Recovery Rate
            </div>

          </div>

        </div>

        {/* RIGHT SIDE */}
        <div className="relative flex justify-center">

          {/* Main Image Card */}
          <div className="relative bg-white/40 backdrop-blur-xl 
          border border-white/40 
          rounded-3xl shadow-2xl p-4">

            <img
              src="https://ytzzomqohkjpftxnrzjd.supabase.co/storage/v1/object/public/unifound-images/Minuri/foundHero.jpg"
              alt="Found Items"
              className="rounded-2xl w-full max-w-[520px]"
            />

            {/* Floating Card */}
            <div className="absolute -top-6 -left-6 bg-white 
            shadow-xl rounded-2xl p-4 w-40">

              <p className="text-xs text-gray-400">
                New Recovery
              </p>

              <h3 className="text-sm font-semibold text-gray-800">
                Wallet Claimed
              </h3>

              <span className="text-xs text-blue-600 font-medium">
                Just Now
              </span>

            </div>

            {/* Floating Card 2 */}
            <div className="absolute -bottom-6 -right-6 bg-white 
            shadow-xl rounded-2xl p-4 w-40">

              <p className="text-xs text-gray-400">
                Recovery Rate
              </p>

              <h3 className="text-lg font-bold text-blue-600">
                95%
              </h3>

            </div>

          </div>

          {/* Blur Decoration */}
          <div className="absolute -bottom-8 -right-8 w-40 h-40 
          bg-gradient-to-br from-blue-400 to-blue-500 
          rounded-full blur-3xl opacity-30"></div>

        </div>

      </div>

    </div>
  );
}