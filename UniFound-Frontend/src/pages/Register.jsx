"use client";

import { useState, useEffect } from "react";
import { ArrowRight, Mail, Lock, User, ShieldCheck, CheckCircle2, AlertCircle } from "lucide-react";
import api from "../api/axios.js";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    type: "customer",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({}); // Live errors store කිරීමට
  const [serverError, setServerError] = useState("");

  // Live Validation logic using useEffect
  useEffect(() => {
    const newErrors = {};
    const nameRegex = /^[A-Za-z\s]*$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // First Name validation
    if (formData.firstName && !nameRegex.test(formData.firstName)) {
      newErrors.firstName = "Names can only contain letters.";
    }

    // Last Name validation
    if (formData.lastName && !nameRegex.test(formData.lastName)) {
      newErrors.lastName = "Names can only contain letters.";
    }

    // Email validation
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    // Password validation
    if (formData.password && formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }

    // Confirm Password validation
    if (formData.confirmPassword && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    // Admin Restriction validation
    if (formData.type === "admin") {
      newErrors.type = "Admin accounts cannot be created directly.";
    }

    setErrors(newErrors);
  }, [formData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    // Submit කරන විට අවසාන වරට error පරීක්ෂාව
    if (Object.keys(errors).length > 0) {
      setServerError("Please fix the errors in the form before submitting.");
      return;
    }

    setLoading(true);
    try {
      const { confirmPassword, ...submitData } = formData;
      await api.post("/users/register", submitData);
      navigate("/login");
    } catch (err) {
      setServerError(err.response?.data?.message || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8faff] font-sans relative overflow-hidden p-4">
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-3xl" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] bg-indigo-50/50 rounded-full blur-3xl" />

      <div className="container max-w-5xl mx-auto flex flex-col md:flex-row-reverse shadow-2xl shadow-blue-100 rounded-[32px] overflow-hidden bg-white border border-white relative z-10">
        
        {/* RIGHT SIDE: Branding */}
        <div className="hidden md:flex w-1/2 bg-gradient-to-br from-indigo-700 to-blue-600 p-12 text-white flex-col justify-between relative overflow-hidden">
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full -ml-20 -mb-20 blur-2xl" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-12">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-blue-600 font-black text-xl">U</span>
              </div>
              <span className="text-2xl font-bold tracking-tight">UniFound</span>
            </div>
            <h1 className="text-5xl font-extrabold leading-tight mb-6">Join the <br /> <span className="text-blue-200">Community.</span></h1>
            <p className="text-blue-50/80 text-lg leading-relaxed max-w-sm">Create an account to report and recover lost items securely within the campus.</p>
          </div>
          <p className="text-xs text-blue-200/60 relative z-10">© 2026 UniFound Management System</p>
        </div>

        {/* LEFT SIDE: Register Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 bg-white flex flex-col justify-center">
          <div className="mb-8">
            <h2 className="text-3xl font-black text-gray-900 mb-2">Create Account 🚀</h2>
            <p className="text-gray-500 font-medium text-sm">Fill in the details to get started.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Server side error display */}
            {serverError && (
              <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded-r-xl flex items-start gap-2 animate-in fade-in zoom-in duration-200">
                <AlertCircle size={18} className="shrink-0 mt-0.5" />
                <span>{serverError}</span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 ml-1 uppercase">First Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input type="text" name="firstName" placeholder="John" value={formData.firstName} onChange={handleChange} className={`w-full pl-11 pr-4 py-3 bg-gray-50 border ${errors.firstName ? 'border-red-400' : 'border-gray-100'} rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-sm`} required />
                </div>
                {errors.firstName && <p className="text-[10px] text-red-500 ml-2 font-semibold animate-in slide-in-from-top-1">{errors.firstName}</p>}
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 ml-1 uppercase">Last Name</label>
                <input type="text" name="lastName" placeholder="Doe" value={formData.lastName} onChange={handleChange} className={`w-full px-4 py-3 bg-gray-50 border ${errors.lastName ? 'border-red-400' : 'border-gray-100'} rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-sm`} required />
                {errors.lastName && <p className="text-[10px] text-red-500 ml-2 font-semibold animate-in slide-in-from-top-1">{errors.lastName}</p>}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 ml-1 uppercase">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input type="email" name="email" placeholder="name@university.com" value={formData.email} onChange={handleChange} className={`w-full pl-11 pr-4 py-3 bg-gray-50 border ${errors.email ? 'border-red-400' : 'border-gray-100'} rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-sm`} required />
              </div>
              {errors.email && <p className="text-[10px] text-red-500 ml-2 font-semibold animate-in slide-in-from-top-1">{errors.email}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 ml-1 uppercase">Account Type</label>
              <div className="relative">
                <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <select name="type" value={formData.type} onChange={handleChange} className={`w-full pl-11 pr-4 py-3 bg-gray-50 border rounded-2xl focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-sm appearance-none cursor-pointer ${formData.type === 'admin' ? 'border-amber-400 bg-amber-50' : 'border-gray-100'}`}>
                  <option value="customer">Student / Standard User</option>
                  <option value="admin">Administrator (Restricted)</option>
                </select>
              </div>
              {errors.type && <p className="text-[10px] text-amber-600 ml-2 font-semibold animate-in slide-in-from-top-1">{errors.type}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 ml-1 uppercase">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input type="password" name="password" placeholder="••••••••" value={formData.password} onChange={handleChange} className={`w-full pl-11 pr-4 py-3 bg-gray-50 border ${errors.password ? 'border-red-400' : 'border-gray-100'} rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-sm`} required />
                </div>
                {errors.password && <p className="text-[10px] text-red-500 ml-2 font-semibold animate-in slide-in-from-top-1">{errors.password}</p>}
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 ml-1 uppercase">Confirm</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input type="password" name="confirmPassword" placeholder="••••••••" value={formData.confirmPassword} onChange={handleChange} className={`w-full pl-11 pr-4 py-3 bg-gray-50 border ${errors.confirmPassword ? 'border-red-400' : 'border-gray-100'} rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-sm`} required />
                </div>
                {errors.confirmPassword && <p className="text-[10px] text-red-500 ml-2 font-semibold animate-in slide-in-from-top-1">{errors.confirmPassword}</p>}
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading || Object.keys(errors).length > 0} 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl shadow-lg shadow-blue-200 flex items-center justify-center gap-2 transform transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed mt-4"
            >
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><span>Create Account</span><ArrowRight size={18} /></>}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-500 text-sm font-medium">Already have an account? <button onClick={() => navigate("/login")} className="text-blue-600 font-bold hover:underline ml-1">Sign In</button></p>
          </div>
        </div>
      </div>
    </div>
  );
}