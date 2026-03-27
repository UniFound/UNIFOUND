import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ClaimFormModal from "./ClaimFormModal";

export default function ItemCard({ item }) {
  const navigate = useNavigate();
  const [showClaimModal, setShowClaimModal] = useState(false);

  if (!item) return null; // safe check

  return (
    <>
      <div className="bg-white/70 backdrop-blur-md p-4 rounded-3xl shadow-lg border border-gray-100 hover:scale-105 transition-transform duration-300 relative flex flex-col">
        {/* Image */}
        {item.image_url ? (
          <div className="w-full h-52 overflow-hidden rounded-2xl mb-4">
            <img
              src={item.image_url}
              alt={item.title || "Item"}
              className="w-full h-full object-cover object-center transition-transform duration-300 hover:scale-110"
            />
          </div>
        ) : (
          <div className="w-full h-52 flex items-center justify-center bg-gray-100 rounded-2xl mb-4 text-gray-400 text-sm">
            No Image Available
          </div>
        )}

        {/* Title & Status */}
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-gray-800 font-bold text-lg truncate">{item.title || "Item"}</h2>
          <span
            className={`text-xs font-semibold px-3 py-1 rounded-full ${
              item.status === "lost"
                ? "text-yellow-700 bg-yellow-100"
                : "text-green-700 bg-green-100"
            }`}
          >
            {item.status ? item.status.charAt(0).toUpperCase() + item.status.slice(1) : "N/A"}
          </span>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
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
            onClick={() => navigate(`/item/${item._id}`)}
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
      {showClaimModal && (
        <ClaimFormModal item={item} onClose={() => setShowClaimModal(false)} />
      )}
    </>
  );
}