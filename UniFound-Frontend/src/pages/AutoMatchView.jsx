import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios'; // ඔයාගේ axios setup එක

const AutoMatchView = () => {
    const { itemId } = useParams(); // URL එකෙන් ITEM003 වගේ ID එක ගන්නවා
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMatches = async () => {
            try {
                setLoading(true);
                // අපේ අලුත් Auto Match API එකට Call කරනවා
                const response = await api.get(`/items/auto-match/${itemId}`);
                if (response.data.success) {
                    setMatches(response.data.matches);
                }
            } catch (error) {
                console.error("Error fetching matches:", error);
            } finally {
                setLoading(false);
            }
        };

        if (itemId) {
            fetchMatches();
        }
    }, [itemId]);

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold mb-2 text-gray-800">Auto-Matching System</h2>
            <p className="text-gray-600 mb-6">අපගේ පද්ධතිය මගින් ඔබගේ භාණ්ඩයට සමාන යැයි උපකල්පනය කරන දේවල් මෙන්න:</p>

            {loading ? (
                <div className="text-center text-lg font-semibold">සොයමින් පවතී... 🔍</div>
            ) : matches.length === 0 ? (
                <div className="bg-yellow-50 p-4 rounded-md text-yellow-700">
                    කණගාටුයි! තවමත් මෙයට ගැලපෙන භාණ්ඩයක් පද්ධතියේ නැත.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {matches.map((matchObj, index) => {
                        const { item, matchPercentage } = matchObj;
                        return (
                            <div key={index} className="border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition bg-white flex flex-col justify-between">
                                {/* Image */}
                                <div className="h-48 overflow-hidden bg-gray-100">
                                    <img 
                                        src={item.image_url} 
                                        alt={item.title} 
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                {/* Details */}
                                <div className="p-4 flex-grow">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
                                        {/* Match Percentage Badge */}
                                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                                            matchPercentage >= 80 ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                                        }`}>
                                            {matchPercentage}% Match
                                        </span>
                                    </div>
                                    
                                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>
                                    
                                    <div className="text-sm text-gray-500 space-y-1">
                                        <div>📍 <span className="font-medium">Location:</span> {item.location}</div>
                                        <div>📁 <span className="font-medium">Category:</span> {item.category}</div>
                                        <div>🎨 <span className="font-medium">Color:</span> {item.color || 'N/A'}</div>
                                    </div>
                                </div>

                                {/* Action Button */}
                                <div className="p-4 border-t bg-gray-50">
                                    <button 
                                        onClick={() => alert(`Redirecting to Claim Item ${item.itemId}`)}
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition"
                                    >
                                        This is mine! (Claim)
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default AutoMatchView;