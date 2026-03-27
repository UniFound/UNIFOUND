"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ClaimFormModal from "./ClaimFormModal";

export default function LostItemCard({ item }) {
  const navigate = useNavigate();
  const [showClaimModal, setShowClaimModal] = useState(false);

  if (!item) return null;

  // Map item.status to proper colors
  const statusColors = {
    lost: { bg: "bg-blue-600", text: "text-white" },
    found: { bg: "bg-green-600", text: "text-white" },
    pending: { bg: "bg-orange-100", text: "text-orange-700" },
    resolved: { bg: "bg-green-100", text: "text-green-700" },
  };

  const status = statusColors[item.status] || statusColors.lost;

  return (
    <>
      <div className="bg-white/70 backdrop-blur-md p-4 rounded-3xl shadow-lg border border-gray-100 hover:scale-105 transition-transform duration-300 relative flex flex-col">
        
        {/* Image */}
        {item.image_url ? (
          <div className="w-full h-52 overflow-hidden rounded-2xl mb-4 relative">
            <img
              src={item.image_url}
              alt={item.title || "Item"}
              className="w-full h-full object-cover object-center transition-transform duration-300 hover:scale-110"
            />
            {/* Status badge */}
            <span
              className={`absolute top-2 right-2 px-3 py-1 rounded-full font-semibold text-xs sm:text-sm ${status.bg} ${status.text}`}
            >
              {item.status ? item.status.charAt(0).toUpperCase() + item.status.slice(1) : "N/A"}
            </span>
          </div>
        ) : (
          <div className="w-full h-52 flex items-center justify-center bg-gray-100 rounded-2xl mb-4 text-gray-400 text-sm">
            No Image Available
          </div>
        )}
          {/* Title & Description */}
          <h2 className="text-black font-bold text-lg truncate mb-2">
            {item.title || "Item"}
          </h2>
          <p className="text-gray-700 text-sm mb-4 line-clamp-3">
            {item.description || "No description provided."}
          </p>

        {/* Footer info */}
        <div className="flex justify-between items-center text-xs text-gray-500 mb-4">
          <span>Reported: {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "N/A"}</span>
          <span>ID: {item.itemId || "N/A"}</span>
        </div>

        {/* Buttons */}
        <div className="flex gap-2 mt-auto">
  <button
  onClick={() => navigate(`/items/${item.itemId}`)} // use itemId
  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 rounded-xl transition"
>
  View Item
      </button>
          <button
            onClick={() => setShowClaimModal(true)}
            className="flex-1 border border-blue-600 text-blue-600 hover:bg-blue-50 text-sm font-medium py-2 rounded-xl transition"
          >
            This is Mine
          </button>
        </div>
      </div>

      {/* Claim Modal */}
      {showClaimModal && <ClaimFormModal item={item} onClose={() => setShowClaimModal(false)} />}
    </>
  );
}