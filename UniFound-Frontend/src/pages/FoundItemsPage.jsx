"use client";

import { useEffect, useState } from "react";
import api from "../api/axios.js";
import ItemCard from "../components/ItemCard";
import FoundItemsHero from "../components/FoundItemsHero.jsx";
import Footer from "../components/Footer.jsx";
import { Search, SlidersHorizontal, Grid, BarChart3, HelpCircle, ChevronDown, CheckCircle2, ShieldCheck } from "lucide-react";

export default function FoundItemsPage() {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [dateRange, setDateRange] = useState(""); 
  const [proximity, setProximity] = useState(27); 

  // Fetch found items
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await api.get("/items");
        // මෙතනදී 'found' items විතරක් filter වෙනවා
        const foundItems = res.data.data.filter(item => item.status === "found");
        setItems(foundItems);
        setFilteredItems(foundItems);
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
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      updated = updated.filter(item =>
        (item.title?.toLowerCase().includes(query)) ||
        (item.description?.toLowerCase().includes(query))
      );
    }
    if (selectedCategories.length > 0) {
      updated = updated.filter(item => selectedCategories.includes(item.category));
    }
    
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
    
    setFilteredItems(updated);
  }, [searchQuery, selectedCategories, dateRange, proximity, items]);

  const toggleCategory = (cat) => {
    setSelectedCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const categories = ["Electronics", "Pets", "Wallet", "Keys", "Jewelry", "Documents", "Bags", "Clothing"];

  return (
    <div className="w-full min-h-screen bg-[#FDFDFD] flex flex-col font-sans">
      
      {/* Hero Section */}
      <FoundItemsHero />

      {/* Main Content: 2-Column Layout (Sidebar + Grid) */}
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 mt-6 mb-16 flex-1 flex flex-col lg:flex-row gap-6">
        
        {/* LEFT SIDEBAR - Separated Cards for Found Items */}
        <div className="w-full lg:w-[25%] flex flex-col gap-4 border-r border-gray-100 pr-5">
          
          {/* Card 1: Search */}
          <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
            <div className="relative">
              <input
                type="text"
                placeholder="Search found items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border border-gray-200 bg-white rounded-lg px-4 py-3 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all pl-10 text-sm text-gray-700"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          {/* Card 2: Advanced FILTERS & Date */}
          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col gap-4">
            <div className="flex justify-between items-center pb-2 border-b border-gray-50">
              <div className="flex items-center gap-1.5">
                <SlidersHorizontal size={15} className="text-blue-600" />
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wide">FILTERS</h3>
              </div>
              <button 
                onClick={() => { setSearchQuery(""); setSelectedCategories([]); setDateRange(""); setProximity(27); }}
                className="text-xs font-bold text-gray-400 hover:text-blue-600 transition-colors"
              >
                Reset
              </button>
            </div>

            {/* Proximity Slider */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-bold text-gray-600">Proximity</span>
                <span className="text-xs text-blue-600 font-bold">{proximity} miles</span>
              </div>
              <input
                type="range"
                min="1"
                max="50"
                value={proximity}
                onChange={(e) => setProximity(Number(e.target.value))}
                className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            {/* DATE REPORTED */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs font-bold text-gray-600 uppercase">Date Found</span>
                <ChevronDown size={14} className="text-gray-400" />
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { key: "", label: "All Time" },
                  { key: "24h", label: "Last 24h" },
                  { key: "7d", label: "7 Days" },
                  { key: "30d", label: "30 Days" }
                ].map(range => (
                  <button
                    key={range.key}
                    onClick={() => setDateRange(range.key)}
                    className={`px-2 py-2 rounded-md text-xs font-bold transition-all border ${
                      dateRange === range.key
                        ? "bg-blue-50 border-blue-600 text-blue-600"
                        : "bg-white border-gray-100 text-gray-600 hover:border-gray-300"
                    }`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Card 3: Categories */}
          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center pb-2 border-b border-gray-50 mb-3">
              <div className="flex items-center gap-1.5">
                <Grid size={15} className="text-blue-600" />
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wide">Categories</h3>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => toggleCategory(cat)}
                  className={`px-2.5 py-1.5 rounded-md text-[11px] font-bold transition-all border ${
                    selectedCategories.includes(cat)
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white border-gray-100 text-gray-600 hover:border-gray-300"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Card 4: Platform Stats */}
          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-1.5 pb-2 border-b border-gray-50 mb-3">
              <BarChart3 size={15} className="text-blue-600" />
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Platform Stats</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs font-medium">
                <span className="text-gray-500">Total Found Items</span>
                <span className="font-bold text-gray-800">{items.length}</span>
              </div>
              <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="bg-blue-600 h-full rounded-full" style={{ width: `${Math.min((items.length/50)*100, 100)}%` }}></div>
              </div>
              <div className="flex justify-between items-center text-xs font-medium">
                <span className="text-gray-500">Claim Success Rate</span>
                <span className="font-bold text-green-600">64%</span>
              </div>
            </div>
          </div>

          {/* Card 5: Safe Claiming Card (Found items වලට විශේෂයි) */}
          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col gap-2">
            <div className="flex items-center gap-1.5 pb-2 border-b border-gray-50">
              <ShieldCheck size={15} className="text-blue-600" />
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wide">Safe Claiming</h3>
            </div>
            <p className="text-[11px] text-gray-500 leading-relaxed">
              If you found something, make sure to ask the claimant for unique identifiers or specific item details before handing it over.
            </p>
          </div>

          {/* Card 6: Need Help? */}
          <div className="bg-[#F8FAFC] border border-gray-100 p-5 rounded-xl flex flex-col gap-2.5">
            <div className="flex items-center gap-1.5">
              <HelpCircle size={15} className="text-blue-600" />
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Need Help?</h3>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              Not sure how to verify the owner of an item? Reach out to the campus admin.
            </p>
            <button className="w-full bg-blue-600 text-white hover:bg-blue-700 py-2.5 rounded-lg text-xs font-bold transition-colors shadow-sm">
              Contact Admin
            </button>
          </div>

        </div>

        {/* RIGHT SIDEBAR (Grid Area) */}
        <div className="w-full lg:w-[75%]">
          
          {/* Sub-Header */}
          <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-100">
            <div>
              <span className="text-sm font-bold text-gray-900">{filteredItems.length} Found Reports</span>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="text-gray-500 font-medium">SORT BY:</span>
              <button className="flex items-center gap-1 font-bold text-blue-600">
                Relevance <ChevronDown size={12} />
              </button>
            </div>
          </div>

          {/* Grid Layout (3 cards for large screens to look wider and cleaner) */}
          <main className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 auto-rows-min">
            {loading && (
              <div className="col-span-full text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3"></div>
                <p className="text-gray-500 text-sm font-medium">Loading found items...</p>
              </div>
            )}
            
            {error && <p className="text-red-500 col-span-full text-center py-10 text-sm font-medium">{error}</p>}

            {!loading && !error && filteredItems.length > 0 ? (
              filteredItems.map(item => <ItemCard key={item._id} item={item} />)
            ) : (
              !loading && !error && (
                <div className="col-span-full text-center py-12 bg-white rounded-lg border border-gray-100">
                  <p className="text-gray-400 text-sm font-medium">No items match your filters.</p>
                </div>
              )
            )}
          </main>
        </div>

      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}