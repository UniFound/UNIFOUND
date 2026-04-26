"use client";

import { useState, useEffect } from "react"; 
import { useNavigate } from "react-router-dom";
import ClaimFormModal from "./ClaimFormModal";
import { Calendar, Tag, ArrowRight, ShieldCheck, Heart } from "lucide-react";

export default function ItemCard({ item }) {
  const navigate = useNavigate();
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [isFavourite, setIsFavourite] = useState(false); 

  
  useEffect(() => {
    const savedFavs = JSON.parse(localStorage.getItem("favouriteItems") || "[]");
    const isExist = savedFavs.some((fav) => fav._id === item?._id);
    setIsFavourite(isExist);
  }, [item?._id]);

  if (!item) return null; // Safe check

  
  const toggleFavourite = (e) => {
    e.stopPropagation(); 
    
    let savedFavs = JSON.parse(localStorage.getItem("favouriteItems") || "[]");

    if (isFavourite) {
      savedFavs = savedFavs.filter((fav) => fav._id !== item._id);
      setIsFavourite(false);
    } else {
      savedFavs.push(item);
      setIsFavourite(true);
    }

    localStorage.setItem("favouriteItems", JSON.stringify(savedFavs));
  };

  return (
    <>
      <div 
        className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-100 transition-all duration-300 relative flex flex-col group cursor-pointer min-h-[380px]"
        onClick={() => navigate(`/items/${item._id}`)}
      >
        
        {/* Image Area */}
        <div className="relative w-full h-44 overflow-hidden rounded-lg mb-4 bg-gray-50">
          {item.image_url ? (
            <img
              src={item.image_url}
              alt={item.title || "Found Item"}
              className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 gap-1">
              <Tag size={20} className="text-gray-300" />
              <span className="text-xs font-medium">No Image Available</span>
            </div>
          )}

          {/* Favourite Button - Logic added here */}
          <button 
            onClick={toggleFavourite}
            className={`absolute top-2 right-2 p-1.5 backdrop-blur-sm rounded-full transition-all shadow-sm ${
              isFavourite ? "bg-red-50 text-red-500" : "bg-white/80 text-gray-400 hover:text-red-500 hover:bg-white"
            }`}
          >
            <Heart size={14} fill={isFavourite ? "currentColor" : "none"} />
          </button>
        </div>

        {/* Title & Status */}
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-gray-900 font-bold text-sm truncate max-w-[70%] group-hover:text-blue-600 transition-colors">
            {item.title || "Untitled Item"}
          </h2>
          
          {/* Status Badge */}
          <span className="text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1 bg-green-50 text-green-600 border border-green-100">
            <ShieldCheck size={10} className="fill-green-600/10" />
            FOUND
          </span>
        </div>

        {/* Description */}
        <p className="text-xs text-gray-500 mb-3 line-clamp-2 leading-relaxed h-8">
          {item.description || "No description provided for this found item."}
        </p>

        {/* Metadata Grid */}
        <div className="grid grid-cols-2 gap-2 text-[10px] font-bold text-gray-400 mb-4 pt-3 border-t border-gray-50 mt-auto">
          <div className="flex items-center gap-1">
            <Calendar size={12} className="text-gray-400" />
            <span>{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "N/A"}</span>
          </div>
          <div className="text-right">
            <span>ID: {item.itemId || "N/A"}</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation(); 
              navigate(`/items/${item._id}`);
            }}
            className="flex-1 bg-white border border-gray-200 hover:border-blue-600 hover:text-blue-600 text-gray-700 text-xs font-bold py-2.5 rounded-lg transition-all flex items-center justify-center gap-1.5"
          >
            View Details
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation(); 
              setShowClaimModal(true);
            }}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm shadow-blue-600/10"
          >
            Claim Item
            <ArrowRight size={12} />
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