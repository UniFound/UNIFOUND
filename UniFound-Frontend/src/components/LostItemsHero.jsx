"use client";

import { ArrowRight } from "lucide-react";
import Navbar from "../components/Navbar.jsx";

export default function LostItemsHero() {
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
            🔗 Smart Campus Integration
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
            Lost Something? <br />
            <span className="text-transparent bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text">
              Recover It Quickly
            </span>
          </h1>

          {/* Description */}
          <p className="mt-6 text-gray-600 text-base md:text-lg max-w-lg">
            Browse reported lost items across campus or report a new lost item 
            to help reunite it with its owner faster using our smart 
            and secure lost & found system.
          </p>

          {/* Buttons */}
          <div className="mt-8 flex gap-4 flex-wrap">

            <button className="bg-gradient-to-r from-blue-600 to-blue-500 
            text-white px-7 py-3.5 rounded-full shadow-xl 
            hover:scale-105 transition-all duration-300 
            flex items-center gap-2 font-medium">

              Report Lost Item
              <ArrowRight size={17} />
            </button>

            <button className="bg-white/80 backdrop-blur 
            text-blue-700 px-7 py-3.5 rounded-full 
            border border-blue-200 
            hover:bg-white transition">

              Browse Found Items
            </button>

          </div>

          {/* Mini Stats */}
          <div className="mt-10 flex gap-8 text-sm text-gray-600">

            <div>
              <span className="block text-2xl font-bold text-blue-600">
                500+
              </span>
              Items Reported
            </div>

            <div>
              <span className="block text-2xl font-bold text-blue-600">
                320+
              </span>
              Items Recovered
            </div>

            <div>
              <span className="block text-2xl font-bold text-blue-600">
                98%
              </span>
              Success Rate
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
              src="https://ytzzomqohkjpftxnrzjd.supabase.co/storage/v1/object/public/unifound-images/heroo.jpg"
              alt="Lost Items"
              className="rounded-2xl w-full max-w-[520px]"
            />

            {/* Floating Card */}
            <div className="absolute -top-6 -left-6 bg-white 
            shadow-xl rounded-2xl p-4 w-40">

              <p className="text-xs text-gray-400">
                New Match
              </p>

              <h3 className="text-sm font-semibold text-gray-800">
                Wallet Found
              </h3>

              <span className="text-xs text-green-600 font-medium">
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
                98%
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