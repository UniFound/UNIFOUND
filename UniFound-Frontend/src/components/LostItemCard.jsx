"use client";

import { useNavigate } from "react-router-dom";
import { MapPin, ArrowRight, Eye, Heart } from "lucide-react";
import { useState, useEffect } from "react"; 

export default function LostItemCard({ item }) {
  const navigate = useNavigate();
  const [isFavourite, setIsFavourite] = useState(false);

  
  useEffect(() => {
    const savedFavs = JSON.parse(localStorage.getItem("favouriteItems") || "[]");
    const isExist = savedFavs.some((fav) => fav._id === item?._id);
    setIsFavourite(isExist);
  }, [item?._id]);

  if (!item) return null;

  
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
    <div className="bg-white rounded-lg border border-gray-100 hover:shadow-lg hover:border-gray-200 transition-all duration-300 flex flex-col overflow-hidden group cursor-pointer"
         onClick={() => navigate(`/items/${item._id}`)}>
      
      {/* Image Area */}
      <div className="w-full h-40 overflow-hidden relative bg-gray-50">
        {item.image_url ? (
          <img
            src={item.image_url}
            alt={item.title || "Item"}
            className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
            <svg className="w-6 h-6 mb-1 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
            <span className="text-[10px] font-bold uppercase tracking-wider">No Photo</span>
          </div>
        )}
        
        {/* Status Tag */}
        <div className="absolute top-2.5 left-2.5 bg-blue-600 text-white font-bold text-[10px] uppercase tracking-wider px-2 py-0.5 rounded shadow-sm">
          Lost
        </div>

        {/* Wishlist Icon - Logic added here */}
        <button 
          onClick={toggleFavourite}
          className={`absolute top-2.5 right-2.5 p-1.5 backdrop-blur-sm rounded-full transition-all shadow-sm ${
            isFavourite ? "bg-red-50 text-red-500" : "bg-white/80 text-gray-400 hover:text-red-500 hover:bg-white"
          }`}>
          <Heart size={14} fill={isFavourite ? "currentColor" : "none"} />
        </button>
      </div>

      {/* Content Area */}
      <div className="p-4 flex flex-col flex-1">
        
        {/* Category */}
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
          COLLECTION: {item.category || "General"}
        </span>

        {/* Title */}
        <h2 className="text-gray-900 font-bold text-sm truncate group-hover:text-blue-600 transition-colors mb-1.5">
          {item.title || "Untitled Item"}
        </h2>

        {/* Location */}
        <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
          <MapPin size={12} className="text-blue-500" />
          <span className="truncate">Reported at Library Area</span>
        </div>

        {/* Social Proof */}
        <div className="flex items-center gap-1.5 text-[11px] text-gray-400 mt-auto mb-3 border-t border-gray-50 pt-2.5">
          <Eye size={12} className="text-blue-500" />
          <span className="font-medium">{Math.floor(Math.random() * 50) + 10} people viewing now</span>
        </div>

        {/* Action Bottom Row */}
        <div className="flex justify-between items-center mt-auto">
          <div>
            <span className="text-[10px] font-bold text-gray-400 block uppercase">Status</span>
            <span className="text-xs font-bold text-blue-600">Awaiting Claim</span>
          </div>
          
          <div className="flex items-center gap-1 font-bold text-xs text-blue-600 group-hover:gap-1.5 transition-all">
            View Details
            <ArrowRight size={14} />
          </div>
        </div>
      </div>
    </div>
  );
}