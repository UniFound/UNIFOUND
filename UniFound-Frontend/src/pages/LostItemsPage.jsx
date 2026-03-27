"use client";

import { useEffect, useState } from "react";
import api from "../api/axios.js";
import LostItemCard from "../components/LostItemCard";
import LostItemsHero from "../components/LostItemsHero.jsx";
import Footer from "../components/Footer.jsx";

export default function LostItemsPage() {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [dateRange, setDateRange] = useState("");
  const [proximity, setProximity] = useState(27);

  // Fetch lost items
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await api.get("/items");
        const lostItems = res.data.data.filter(item => item.status === "lost");
        setItems(lostItems);
        setFilteredItems(lostItems);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  // Filter logic
  useEffect(() => {
    let updated = [...items];

    // Search filter
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      updated = updated.filter(
        item =>
          item.title?.toLowerCase().includes(query) ||
          item.description?.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (selectedCategories.length > 0) {
      updated = updated.filter(item => selectedCategories.includes(item.category));
    }

    // Date range filter
    if (dateRange) {
      const now = new Date();
      updated = updated.filter(item => {
        const itemDate = new Date(item.createdAt);
        if (dateRange === "24h") return now - itemDate <= 24 * 60 * 60 * 1000;
        if (dateRange === "7d") return now - itemDate <= 7 * 24 * 60 * 60 * 1000;
        if (dateRange === "30d") return now - itemDate <= 30 * 24 * 60 * 60 * 1000;
        return true;
      });
    }

    // TODO: Proximity filter if you want to implement geolocation filtering

    setFilteredItems(updated);
  }, [searchQuery, selectedCategories, dateRange, proximity, items]);

  // Toggle category selection
  const toggleCategory = (cat) => {
    setSelectedCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  return (
    <div className="w-full min-h-screen bg-blue-50 flex flex-col">

      {/* Hero Section */}
      <LostItemsHero />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 mt-8 flex gap-8 flex-1">

        {/* Sidebar Filters */}
        <aside className="w-64 bg-white p-6 rounded-2xl shadow flex flex-col gap-6 max-h-[calc(100vh-150px)] overflow-y-auto sticky top-24">
          
          {/* Search */}
          <div>
            <label className="block text-sm font-medium mb-1">Search Items</label>
            <input
              type="text"
              placeholder="Search by title or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Categories */}
          <div>
            <p className="font-medium mb-2">Category</p>
            <div className="flex flex-col gap-1 text-sm">
              {["Electronics","Pets","Wallet","Keys","Jewelry","Documents","Bags","Clothing"].map(cat => (
                <label key={cat} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(cat)}
                    onChange={() => toggleCategory(cat)}
                    className="w-4 h-4"
                  />
                  {cat}
                </label>
              ))}
            </div>
          </div>

          {/* Date Range */}
          <div>
            <p className="font-medium mb-2">Date Range</p>
            <div className="flex flex-col gap-1">
              {["24h","7d","30d"].map(range => (
                <button
                  key={range}
                  onClick={() => setDateRange(range)}
                  className={`w-full text-left px-3 py-1 rounded text-sm ${
                    dateRange === range ? "bg-blue-100 text-blue-600" : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  {range === "24h" ? "Last 24 hours" : range === "7d" ? "Last 7 days" : "Last 30 days"}
                </button>
              ))}
            </div>
          </div>

          {/* Proximity */}
          <div>
            <p className="font-medium mb-2">Proximity (miles)</p>
            <input
              type="range"
              min="1"
              max="50"
              value={proximity}
              onChange={(e) => setProximity(Number(e.target.value))}
              className="w-full"
            />
            <p className="text-sm text-gray-500">{proximity} miles</p>
          </div>

        </aside>

        {/* Items Grid */}
        <main className="flex-1 grid sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-min">
          {loading && <p className="text-gray-600 col-span-full">Loading items...</p>}
          {error && <p className="text-red-500 col-span-full">{error}</p>}

          {filteredItems.length > 0
            ? filteredItems.map(item => <LostItemCard key={item._id} item={item} />)
            : !loading && <p className="text-gray-600 col-span-full text-center">No lost items found for selected filters.</p>}
        </main>

      </div>

      {/* Footer */}
      <div className="mt-16">
        <Footer />
      </div>

    </div>
  );
}