"use client";

import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Bell } from "lucide-react"; // Add bell icon

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Load user from localStorage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser && storedUser.email) setUser(storedUser);
  }, []);

  const navItems = ["Home", "Lost Items", "Found Items", "Report Item", "About Us"];

  const getActive = (item) => {
    switch (item) {
      case "Home": return location.pathname === "/";
      case "Lost Items": return location.pathname === "/lostitem";
      case "Found Items": return location.pathname === "/founditem";
      case "Report Item": return location.pathname === "/report";
      case "About Us": return location.pathname === "/about";
      default: return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setDropdownOpen(false);
    navigate("/");
  };

  return (
    <div className="w-full flex justify-center fixed top-4 z-50">
      <div className="w-[92%] max-w-7xl flex items-center justify-between px-6 py-3
        bg-white/70 backdrop-blur-xl border border-white/40
        rounded-full shadow-lg">

        {/* Logo */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">U</div>
          <span className="font-semibold text-gray-800">UniFound</span>
        </div>

        {/* Nav Links */}
        <div className="hidden lg:flex items-center gap-6 text-sm text-gray-600">
          {navItems.map((item) => (
            <button
              key={item}
              onClick={() => {
                const paths = {
                  "Home": "/",
                  "Lost Items": "/lostitem",
                  "Found Items": "/founditem",
                  "Report Item": "/report",
                  "About Us": "/about"
                };
                navigate(paths[item]);
              }}
              className={`transition ${getActive(item) ? "text-blue-600 font-medium" : "hover:text-blue-600"}`}
            >
              {item}
            </button>
          ))}
        </div>

        {/* Right Side Buttons / Avatar */}
        <div className="flex items-center gap-3 relative">
          {!user ? (
            <>
              <button
                onClick={() => navigate("/login")}
                className="text-sm text-gray-600 hover:text-blue-600 transition"
              >
                Sign In
              </button>
              <button
                onClick={() => navigate("/signup")}
                className="bg-blue-600 text-white px-4 py-1.5 rounded-full text-sm shadow hover:bg-blue-700 transition"
              >
                Get Started →
              </button>
            </>
          ) : (
            <>
              {/* Bell Icon */}
              <button
                className="p-2 rounded-full hover:bg-gray-100 transition relative"
                onClick={() => alert("Notifications clicked!")} // You can replace with your notifications logic
              >
                <Bell className="w-6 h-6 text-gray-600" />
                {/* Optional: Notification badge */}
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* User Avatar */}
              <div className="relative">
                <img
                  src={user.profilePicture || "/default-avatar.png"}
                  alt="User Avatar"
                  className="w-10 h-10 rounded-full cursor-pointer"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                />
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg flex flex-col py-1">
                    <button
                      onClick={() => { navigate("/profile"); setDropdownOpen(false); }}
                      className="text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Profile
                    </button>
                    <button
                      onClick={logout}
                      className="text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}