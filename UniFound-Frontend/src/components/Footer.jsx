import { Facebook, Twitter, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      
      <div className="max-w-7xl mx-auto px-6 py-14 grid md:grid-cols-4 gap-10">

        {/* Brand */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-linear-to-r from-blue-600 to-indigo-500 flex items-center justify-center text-white font-bold shadow">
              U
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              UniFound
            </h3>
          </div>

          <p className="text-sm text-gray-600 leading-relaxed">
            Helping students reconnect with their lost belongings quickly,
            securely, and efficiently within the university community.
          </p>

          {/* Social */}
          <div className="flex gap-3 mt-4">
            <Facebook className="w-5 h-5 text-gray-500 hover:text-blue-600 cursor-pointer" />
            <Twitter className="w-5 h-5 text-gray-500 hover:text-blue-600 cursor-pointer" />
            <Instagram className="w-5 h-5 text-gray-500 hover:text-blue-600 cursor-pointer" />
          </div>
        </div>

        {/* Product */}
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-4">
            Product
          </h4>
          <ul className="space-y-2 text-sm text-gray-600">
            <li><a href="#" className="hover:text-blue-600">Browse Items</a></li>
            <li><a href="#" className="hover:text-blue-600">Report Lost</a></li>
            <li><a href="#" className="hover:text-blue-600">Report Found</a></li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-4">
            Resources
          </h4>
          <ul className="space-y-2 text-sm text-gray-600">
            <li><a href="#" className="hover:text-blue-600">How It Works</a></li>
            <li><a href="#" className="hover:text-blue-600">Support</a></li>
            <li><a href="#" className="hover:text-blue-600">FAQs</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-4">
            Contact
          </h4>
          <p className="text-sm text-gray-600">
            support@unifound.com
          </p>
          <p className="text-sm text-gray-600 mt-2">
            University Support Team
          </p>

          {/* CTA */}
          <button className="mt-4 bg-blue-600 text-white px-5 py-2 rounded-xl text-sm hover:bg-blue-700 transition shadow">
            Contact Support
          </button>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-gray-200 text-center text-sm text-gray-500 py-4">
        © 2026 UniFound. All rights reserved.
      </div>
    </footer>
  );
}