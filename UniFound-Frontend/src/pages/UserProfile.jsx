"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) setUser(storedUser);
  }, []);

  if (!user) return <p className="p-6 text-gray-600">No user logged in.</p>;

  const pages = [
    { name: "Overview", path: "/profile/overview" },
    { name: "Leaderboard", path: "/profile/leaderboard" },
    { name: "Tickets", path: "/profile/tickets" },
    { name: "Activity", path: "/profile/activity" },
    { name: "Analytics", path: "/profile/analytics" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-6"
      >
        <ArrowLeft size={16} /> Back
      </button>

      {/* Profile Info */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
        <img
          src={user.profilePicture || "/default-avatar.png"}
          alt="Profile"
          className="w-32 h-32 rounded-full"
        />
        <div>
          <h1 className="text-2xl font-bold">{user.name}</h1>
          <p className="text-gray-600">{user.role || "User"}</p>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {pages.map((page) => (
          <button
            key={page.name}
            onClick={() => navigate(page.path)}
            className="bg-white shadow-lg rounded-xl p-6 hover:scale-105 transition flex flex-col items-center justify-center gap-2 text-gray-700 font-semibold"
          >
            {page.name}
          </button>
        ))}
      </div>
    </div>
  );
}