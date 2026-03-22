"use client";

import { ArrowRight } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex font-sans">

      {/* LEFT SIDE */}
      <div className="hidden md:flex w-1/2 relative items-center justify-center overflow-hidden bg-linear-to-br from-blue-500 via-indigo-500 to-purple-500">

        {/* Blur blobs */}
        <div className="absolute w-105 h-105 bg-white/20 blur-3xl rounded-full -top-24 -left-24" />
        <div className="absolute w-[320px] h-80 bg-purple-300/30 blur-3xl rounded-full -bottom-20 -right-20" />

        {/* Content */}
        <div className="relative z-10 backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-10 max-w-md shadow-2xl">

          <h1 className="text-4xl font-bold text-white leading-tight">
            Smart platform for <br /> Lost & Found Management
          </h1>

          <p className="text-white/80 mt-4 text-sm leading-relaxed">
            UniFound helps students easily report, search, and recover lost items across campus with a smart and secure system.
          </p>

          {/* Users */}
          <div className="flex items-center mt-6">
            <div className="flex -space-x-3">
              <div className="w-10 h-10 rounded-full bg-white/30 border border-white"></div>
              <div className="w-10 h-10 rounded-full bg-white/30 border border-white"></div>
              <div className="w-10 h-10 rounded-full bg-white/30 border border-white"></div>
            </div>
            <span className="text-white ml-4 text-sm font-medium">
              +1K Students
            </span>
          </div>

        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-gray-50 px-6">

        <div className="w-full max-w-md space-y-8">

          {/* Logo */}
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
            UniFound
          </h2>

          {/* Heading */}
          <div>
            <h3 className="text-2xl font-semibold text-gray-900">
              Welcome back 👋
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Login to manage lost & found items on campus
            </p>
          </div>

          {/* FORM */}
          <form className="space-y-5">

            {/* Email */}
            <div>
              <label className="text-sm font-medium text-gray-600">
                Email
              </label>
              <input
                type="email"
                placeholder="you@university.com"
                className="w-full mt-1 px-4 py-3 rounded-xl border border-gray-200 bg-white 
                focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between text-sm">
                <label className="font-medium text-gray-600">
                  Password
                </label>
                <span className="text-blue-600 cursor-pointer hover:underline">
                  Forgot?
                </span>
              </div>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full mt-1 px-4 py-3 rounded-xl border border-gray-200 bg-white 
                focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              />
            </div>

            {/* Remember */}
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <input
                type="checkbox"
                className="accent-blue-600"
              />
              Remember me
            </div>

            {/* Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl 
              flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all shadow-md"
            >
              Login
              <ArrowRight size={16} />
            </button>

          </form>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400 font-medium">OR</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Google */}
          <button className="w-full border border-gray-200 py-3 rounded-xl flex justify-center items-center gap-2 hover:bg-gray-100 transition">
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              className="w-5 h-5"
            />
            Sign in with Google
          </button>

          {/* Signup */}
          <p className="text-sm text-center text-gray-500">
            Don’t have an account?{" "}
            <span className="text-blue-600 cursor-pointer font-medium hover:underline">
              Sign up
            </span>
          </p>

        </div>
      </div>
    </div>
  );
}