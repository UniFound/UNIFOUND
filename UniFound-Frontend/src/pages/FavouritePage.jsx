"use client";

import React, { useState, useEffect } from "react";
import { Heart, ArrowLeft, Sparkles, Trash2, Search, Share2, MessageCircle, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import LostItemCard from "../components/LostItemCard";
import ItemCard from "../components/ItemCard";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

export default function FavouritesPage() {
  const [favItems, setFavItems] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [copySuccess, setCopySuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem("favouriteItems") || "[]");
    setFavItems(items);
  }, []);

  const handleClearAll = () => {
    if (window.confirm("Are you sure you want to clear your entire saved collection?")) {
      localStorage.removeItem("favouriteItems");
      setFavItems([]);
    }
  };

  const handleRemoveItem = (id) => {
    const updatedItems = favItems.filter(item => item._id !== id);
    setFavItems(updatedItems);
    localStorage.setItem("favouriteItems", JSON.stringify(updatedItems));
  };

  const handleShare = () => {
    const shareUrl = window.location.href;
    navigator.clipboard.writeText(shareUrl);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const filteredItems = favItems.filter((item) => {
    const matchesTab = activeTab === "all" || item.status === activeTab;
    const matchesSearch = item.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#fbfcfd] flex flex-col">
      <Navbar />

      {/* Header Section */}
      <div className="w-full bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-[64px] z-40 pt-10 pb-6 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <button 
              onClick={() => navigate(-1)} 
              className="group flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-all"
            >
              <div className="p-2 rounded-full group-hover:bg-blue-50 transition-colors">
                <ArrowLeft size={18} />
              </div>
              <span className="font-bold text-xs tracking-widest uppercase">Back to Feed</span>
            </button>

            <div className="flex items-center gap-3">
              {favItems.length > 0 && (
                <>
                  <button onClick={handleShare} className="flex items-center gap-2 px-4 py-2.5 bg-blue-50 text-blue-600 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                    <Share2 size={14} />
                    {copySuccess ? "Copied!" : "Share List"}
                  </button>
                  <button onClick={handleClearAll} className="flex items-center gap-2 px-4 py-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all text-xs font-bold uppercase tracking-widest">
                    <Trash2 size={14} />
                    Clear All
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="relative">
                <div className="absolute inset-0 bg-red-200 rounded-2xl blur-lg opacity-40"></div>
                <div className="relative w-14 h-14 bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-red-200">
                  <Heart size={24} fill="currentColor" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                  Saved Collection <Sparkles size={18} className="text-amber-400" />
                </h1>
                <p className="text-sm font-medium text-gray-400">
                  {favItems.length} curated {favItems.length === 1 ? 'item' : 'items'} in your wishlist
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={16} />
                <input 
                  type="text" 
                  placeholder="Search saved items..." 
                  value={searchQuery} 
                  onChange={(e) => setSearchQuery(e.target.value)} 
                  className="pl-10 pr-4 py-2.5 bg-gray-100/80 border border-gray-200/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all w-full md:w-64"
                />
              </div>

              <div className="flex bg-gray-100/80 p-1 rounded-xl border border-gray-200/50 shadow-inner">
                {["all", "lost", "found"].map((tab) => (
                  <button key={tab} onClick={() => setActiveTab(tab)} className={`px-5 py-2 text-xs font-bold rounded-lg transition-all duration-300 capitalize ${activeTab === tab ? "bg-white text-blue-600 shadow-sm ring-1 ring-black/5" : "text-gray-500 hover:text-gray-900"}`}>
                    {tab}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Content */}
      <div className="max-w-7xl mx-auto px-6 mt-16 mb-20 flex-grow w-full relative z-10">
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
            {filteredItems.map((item) => (
              <div key={item._id} className="relative group">
                
                {/* Floating Action Buttons Layer - Z-50 makes it stay on top of everything */}
                <div className="absolute -top-4 -right-2 z-50 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveItem(item._id);
                    }}
                    title="Remove from Favourites"
                    className="p-3 bg-white text-red-500 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:bg-red-500 hover:text-white transition-all border border-gray-50 active:scale-95"
                  >
                    <X size={20} strokeWidth={3} />
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/item-details/${item._id}`);
                    }}
                    title="View Details"
                    className="p-3 bg-white text-blue-600 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:bg-blue-600 hover:text-white transition-all border border-gray-50 active:scale-95"
                  >
                    <MessageCircle size={20} strokeWidth={3} />
                  </button>
                </div>

                {/* The card itself with hover lift effect */}
                <div className="transition-transform duration-300 group-hover:-translate-y-1">
                  {item.status === "lost" ? (
                    <LostItemCard item={item} />
                  ) : (
                    <ItemCard item={item} />
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="max-w-md mx-auto mt-20 p-12 bg-white rounded-[3rem] text-center border border-gray-100 shadow-xl">
              <div className="bg-gray-50 p-6 rounded-full inline-block mb-6">
                <Heart size={48} className="text-gray-200" />
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-3">Empty Collection</h3>
              <p className="text-gray-400 mb-8 text-sm">You haven't saved any items yet. Start exploring the feed!</p>
              <button onClick={() => navigate("/lostitem")} className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-black transition-colors">Go to Feed</button>
          </div>
        )}
      </div>
      <Footer/>
    </div>
  );
}