"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios.js";
import Navbar from "../components/Navbar.jsx";

export default function ItemDetailsPage() {
  const { id } = useParams(); // itemId like "ITEM005"
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const { data } = await api.get(`/items/${id}`);
        setItem(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id]);

  if (loading)
    return <div className="text-center mt-32 text-gray-500 font-medium">Loading...</div>;
  if (!item)
    return <div className="text-center mt-32 text-gray-500 font-medium">Item not found.</div>;

  const statusColors = {
    lost: "bg-blue-600 text-white",
    found: "bg-green-600 text-white",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
        <div className="bg-white shadow-xl rounded-3xl border border-gray-100 overflow-hidden transition-transform hover:scale-[1.01] duration-300">
          
          {/* IMAGE */}
          <div className="relative w-full h-48 sm:h-60 overflow-hidden"> {/* smaller height */}
            <img
              src={item.image_url}
              alt={item.title}
              className="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-105"
            />
            <span
              className={`absolute top-4 right-4 px-3 py-1 rounded-full font-bold text-sm sm:text-base shadow-md ${
                statusColors[item.status] || "bg-gray-500 text-white"
              }`}
            >
              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
            </span>
          </div>

          {/* ITEM INFO */}
          <div className="p-6 sm:p-8 space-y-4">
            <h2 className="text-black font-extrabold text-2xl sm:text-3xl">{item.title}</h2>
            <p className="text-gray-700 text-base sm:text-lg">{item.description || "No description provided."}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-base font-medium">
              <div><span className="font-semibold">Category:</span> {item.category || "N/A"}</div>
              <div><span className="font-semibold">Color:</span> {item.color || "N/A"}</div>
              <div><span className="font-semibold">Location:</span> {item.location || "N/A"}</div>
              <div><span className="font-semibold">Reported:</span> {new Date(item.createdAt).toLocaleDateString()}</div>
              <div><span className="font-semibold">Item ID:</span> {item.itemId}</div>
            </div>

            {/* BUTTONS */}
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <button
                onClick={() => navigate(-1)}
                className="flex-1 bg-gray-100 text-gray-800 py-3 rounded-2xl font-semibold hover:bg-gray-200 transition text-base"
              >
                Back
              </button>
              <button
                onClick={() => alert("Claim request sent!")}
                className="flex-1 bg-blue-600 text-white py-3 rounded-2xl font-semibold hover:bg-blue-700 transition text-base"
              >
                This is Mine
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}      