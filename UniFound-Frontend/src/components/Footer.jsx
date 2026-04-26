"use client";

import { Facebook, Twitter, Instagram, Mail, Heart } from "lucide-react";

export default function Footer() {
  return (
    // මෙතනදී අපි ගොඩක් Dark Blue වෙනුවට Rich Muted Blue-Gray එකක් (`bg-[#1E293B]`) පාවිච්චි කරලා තියෙනවා. 
    // මේක Modern, ඒ වගේම ඇහැට හරිම සනීප පාටක්.
    <footer className="bg-[#1E293B] text-white mt-auto">
      
      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

        {/* 1. Brand Section */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            {/* ඔයාගේ Main Bright Blue එක (Dashboard එකේ තියෙන පාට) මෙතනට දැම්මා */}
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-600/20">
              U
            </div>
            <h3 className="text-lg font-bold text-white">
              UniFound
            </h3>
          </div>

          <p className="text-sm text-slate-300 leading-relaxed max-w-xs">
            Helping students reconnect with their lost belongings quickly,
            securely, and efficiently within the university community.
          </p>

          {/* Social Icons with custom backgrounds and hover */}
          <div className="flex gap-3 mt-5">
            {[
              { icon: <Facebook className="w-4 h-4" />, href: "#" },
              { icon: <Twitter className="w-4 h-4" />, href: "#" },
              { icon: <Instagram className="w-4 h-4" />, href: "#" }
            ].map((social, idx) => (
              <a
                key={idx}
                href={social.href}
                className="w-9 h-9 flex items-center justify-center rounded-lg bg-[#334155] border border-[#475569] text-slate-300 hover:text-white hover:bg-blue-600 hover:border-blue-600 transition-all duration-200"
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>

        {/* 2. Product */}
        <div>
          <h4 className="text-sm font-bold text-blue-400 mb-5 uppercase tracking-wide">
            Product
          </h4>
          <ul className="space-y-3 text-sm text-slate-300">
            <li><a href="#" className="hover:text-white transition-colors duration-200">Browse Items</a></li>
            <li><a href="#" className="hover:text-white transition-colors duration-200">Report Lost</a></li>
            <li><a href="#" className="hover:text-white transition-colors duration-200">Report Found</a></li>
          </ul>
        </div>

        {/* 3. Resources */}
        <div>
          <h4 className="text-sm font-bold text-blue-400 mb-5 uppercase tracking-wide">
            Resources
          </h4>
          <ul className="space-y-3 text-sm text-slate-300">
            <li><a href="#" className="hover:text-white transition-colors duration-200">How It Works</a></li>
            <li><a href="#" className="hover:text-white transition-colors duration-200">Support Center</a></li>
            <li><a href="#" className="hover:text-white transition-colors duration-200">Community Rules</a></li>
          </ul>
        </div>

        {/* 4. Contact with a nice bordered card */}
        <div className="bg-[#334155] p-5 rounded-xl border border-[#475569] h-fit">
          <div className="flex items-center gap-2 mb-3">
            <Mail size={16} className="text-blue-400" />
            <h4 className="text-sm font-bold text-white">Contact Us</h4>
          </div>
          
          <p className="text-xs text-slate-300 leading-relaxed mb-3">
            For official claims or technical support on campus.
          </p>
          
          <p className="text-sm font-medium text-white mb-4">
            support@unifound.com
          </p>

          {/* Button styled exactly to match your dashboard buttons */}
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-sm font-bold transition-colors duration-200 shadow-md shadow-blue-600/10">
            Contact Support
          </button>
        </div>
      </div>

      {/* Bottom Area - මෙතන තව ටිකක් වෙනස් පාටක් දැම්මා වෙන් වෙලා පේන්න */}
      <div className="border-t border-[#334155] bg-[#0F172A]">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs font-medium text-slate-400">
          <div className="flex items-center gap-1">
            <span>© 2026 UniFound. Built with</span>
            <Heart size={10} className="text-red-500 fill-red-500 mx-0.5" />
            <span>for students.</span>
          </div>
          
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Use</a>
          </div>
        </div>
      </div>
    </footer>
  );
}