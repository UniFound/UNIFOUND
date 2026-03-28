"use client";

import { useState, useEffect } from "react";
import { ArrowRight, Mail, Lock, CheckCircle2, AlertCircle } from "lucide-react";
import api from "../api/axios.js";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  
  // Live Validation States
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [isFormValid, setIsFormValid] = useState(false);

  // Live Validation Logic
  useEffect(() => {
    const validateForm = () => {
      let emailErr = "";
      let passErr = "";

      // Email Validation
      if (email.length > 0) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          emailErr = "Please enter a valid email address.";
        }
      }

      // Password Validation
      if (password.length > 0 && password.length < 6) {
        passErr = "Password must be at least 6 characters.";
      }

      setErrors({ email: emailErr, password: passErr });
      setIsFormValid(email.length > 0 && password.length >= 6 && !emailErr && !passErr);
    };

    validateForm();
  }, [email, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    setLoading(true);
    setServerError("");

    try {
      const res = await api.post("/users/login", { email, password });
      const user = res.data.user;
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(user));

      if (user.type?.toLowerCase() === "admin" || user.role?.toLowerCase() === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      setServerError(err.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8faff] font-sans relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-3xl" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-indigo-50/50 rounded-full blur-3xl" />

      <div className="container max-w-5xl mx-auto flex flex-col md:flex-row shadow-2xl shadow-blue-100 rounded-[32px] overflow-hidden bg-white border border-white relative z-10 m-4">
        
        {/* LEFT SIDE: Visual Content */}
        <div className="hidden md:flex w-1/2 bg-gradient-to-br from-blue-600 to-indigo-700 p-12 text-white flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-2xl" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-12">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-blue-600 font-black text-xl">U</span>
              </div>
              <span className="text-2xl font-bold tracking-tight">UniFound</span>
            </div>

            <h1 className="text-5xl font-extrabold leading-tight mb-6">
              Find what you <br /> 
              <span className="text-blue-200">lost</span> on campus.
            </h1>
            <p className="text-blue-50/80 text-lg leading-relaxed max-w-sm">
              The official smart platform for students to report and recover lost items quickly and securely.
            </p>
          </div>

          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-3 bg-white/10 w-fit px-4 py-2 rounded-lg backdrop-blur-md border border-white/20">
              <CheckCircle2 size={18} className="text-blue-200" />
              <span className="text-sm font-medium">98% Recovery Rate</span>
            </div>
            <p className="text-xs text-blue-200/60">© 2026 UniFound Management System</p>
          </div>
        </div>

        {/* RIGHT SIDE: Login Form */}
        <div className="w-full md:w-1/2 p-8 md:p-16 bg-white flex flex-col justify-center">
          <div className="mb-10 text-center md:text-left">
            <h2 className="text-3xl font-black text-gray-900 mb-2">Welcome Back 👋</h2>
            <p className="text-gray-500 font-medium">Please enter your details to sign in.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {serverError && (
              <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded-r-xl flex items-center gap-2 animate-in fade-in duration-300">
                <AlertCircle size={18} />
                {serverError}
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-gray-700 ml-1">Email Address</label>
              <div className="relative group">
                <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${errors.email ? 'text-red-400' : 'text-gray-400 group-focus-within:text-blue-600'}`} size={20} />
                <input
                  type="email"
                  placeholder="name@university.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full pl-12 pr-4 py-4 rounded-2xl outline-none transition-all border ${
                    errors.email 
                      ? 'border-red-200 bg-red-50/30 focus:border-red-500 focus:ring-4 focus:ring-red-500/5' 
                      : 'border-gray-100 bg-gray-50 focus:ring-4 focus:ring-blue-500/10 focus:bg-white focus:border-blue-500'
                  }`}
                  required
                />
              </div>
              {errors.email && <p className="text-[12px] text-red-500 font-medium ml-1 flex items-center gap-1 mt-1"><AlertCircle size={12}/> {errors.email}</p>}
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-bold text-gray-700">Password</label>
                <button type="button" className="text-xs font-bold text-blue-600 hover:underline">Forgot Password?</button>
              </div>
              <div className="relative group">
                <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${errors.password ? 'text-red-400' : 'text-gray-400 group-focus-within:text-blue-600'}`} size={20} />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full pl-12 pr-4 py-4 rounded-2xl outline-none transition-all border ${
                    errors.password 
                      ? 'border-red-200 bg-red-50/30 focus:border-red-500 focus:ring-4 focus:ring-red-500/5' 
                      : 'border-gray-100 bg-gray-50 focus:ring-4 focus:ring-blue-500/10 focus:bg-white focus:border-blue-500'
                  }`}
                  required
                />
              </div>
              {errors.password && <p className="text-[12px] text-red-500 font-medium ml-1 flex items-center gap-1 mt-1"><AlertCircle size={12}/> {errors.password}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !isFormValid}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-200 flex items-center justify-center gap-2 transform transition-all active:scale-[0.98] disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-gray-500 font-medium">
              Don’t have an account?{" "}
              <button 
                onClick={() => navigate("/signup")}
                className="text-blue-600 font-bold hover:underline ml-1"
              >
                Create Account
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}