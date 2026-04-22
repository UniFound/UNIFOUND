"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Send, ArrowLeft, Edit2, Trash2, Check, CheckCheck, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ChatPage = () => {
  const { claimId } = useParams();
  const navigate = useNavigate();

  const [chat, setChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingMessage, setEditingMessage] = useState(null);
  const [editText, setEditText] = useState("");

  const BASE_URL = "http://localhost:5000/api";

  const token = localStorage.getItem("token");

  // Robust user ID extraction with fallback
  const getUserId = () => {
    try {
      const userString = localStorage.getItem("user");
      if (!userString) {
        console.error("No user found in localStorage");
        return null;
      }
      
      const user = JSON.parse(userString);
      const userId = user?.userId;
      
      if (!userId || typeof userId !== 'string') {
        console.error("Invalid userId format:", userId);
        return null;
      }
      
      return userId.trim();
    } catch (error) {
      console.error("Error parsing user from localStorage:", error);
      return null;
    }
  };

  const userId = getUserId();

  // ✅ 1️⃣ Create or Get Chat
  const initializeChat = async () => {
    try {
      const res = await fetch(`${BASE_URL}/chats`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ claimId }),
      });

      const data = await res.json();
      if (res.ok) {
        // Handle both old and new response formats
        const chatData = data.data || data;
        console.log("Chat created/retrieved:", chatData);
        setChat(chatData);
        fetchMessages(chatData._id);
      } else {
        console.error("Chat initialization failed:", data);
        alert(`Failed to initialize chat: ${data.message || 'Unknown error'}`);
      }
    } catch (err) {
      console.error("Chat initialization error:", {
        message: err.message,
        stack: err.stack,
        name: err.name
      });
      alert(`Chat initialization error: ${err.message || 'Unknown error'}`);
    }
  };

  // ✅ 2️⃣ Load Messages
  const fetchMessages = async (chatId) => {
    try {
      const res = await fetch(`${BASE_URL}/messages/${chatId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (res.ok) {
        // Handle both old and new response formats
        const messagesData = data.data || data;
        setMessages(messagesData);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ 3️⃣ Send Message
  const handleSend = async () => {
    if (!text.trim()) return;

    // Validate userId before sending
    if (!userId) {
      console.error("Cannot send message: userId is null or invalid");
      alert("Authentication error. Please refresh the page and try again.");
      return;
    }

    // Validate chat exists before sending
    if (!chat || !chat._id) {
      console.error("Cannot send message: chat is null or missing _id");
      alert("Chat session error. Please refresh the page and try again.");
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          chatId: chat._id,
          senderId: userId.trim(),
          text: text.trim(),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        // Handle both old and new response formats
        const messageData = data.data || data;
        setMessages((prev) => [...prev, messageData]);
        setText("");
      } else {
        console.error("Message send failed:", data);
        alert(`Failed to send message: ${data.message || 'Unknown error'}`);
      }
    } catch (err) {
      console.error("Network error details:", {
        message: err.message,
        stack: err.stack,
        name: err.name,
        status: err.status
      });
      alert(`Network error: ${err.message || 'Unknown network error'}`);
    }
  };

  // ✅ 4️⃣ Edit Message
  const handleEditMessage = async (messageId, newText) => {
    try {
      const res = await fetch(`${BASE_URL}/messages/${messageId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          senderId: userId.trim(),
          text: newText.trim(),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        const updatedMessage = data.data || data;
        setMessages((prev) =>
          prev.map((msg) =>
            msg._id === messageId ? { ...msg, text: newText } : msg
          )
        );
        setEditingMessage(null);
        setEditText("");
      } else {
        console.error("Message edit failed:", data);
        alert(`Failed to edit message: ${data.message || 'Unknown error'}`);
      }
    } catch (err) {
      console.error("Edit error:", err);
      alert(`Edit error: ${err.message || 'Unknown error'}`);
    }
  };

  // ✅ 5️⃣ Delete Message
  const handleDeleteMessage = async (messageId) => {
    if (!window.confirm("Are you sure you want to delete this message?")) {
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/messages/${messageId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          senderId: userId.trim(),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessages((prev) => prev.filter((msg) => msg._id !== messageId));
        setEditingMessage(null);
        setEditText("");
      } else {
        console.error("Message delete failed:", data);
        alert(`Failed to delete message: ${data.message || 'Unknown error'}`);
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert(`Delete error: ${err.message || 'Unknown error'}`);
    }
  };

  useEffect(() => {
    initializeChat();
  }, []);

  // Helper functions for message display
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl h-[90vh] max-h-[800px] flex flex-col bg-white rounded-2xl shadow-xl overflow-hidden">
      
      {/* 🔹 Header - Same as ChatBox */}
      <div className="bg-blue-400 hover:bg-blue-500 text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="text-white hover:bg-white/20 p-2 rounded-full transition"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h3 className="text-lg font-semibold">Claim Chat</h3>
            <p className="text-sm opacity-90">Claim ID: {claimId}</p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
        {messages.map((message) => {
          return (
            <div
              key={message._id}
              className={`flex ${message.senderId === userId ? 'justify-end' : 'justify-start'} mb-3`}
            >
              {/* Avatar for other user (left side) */}
              {message.senderId !== userId && (
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-sm bg-blue-600`}>
                  F
                </div>
              )}

              {/* Message Bubble */}
              <div 
                className={`group relative max-w-xs lg:max-w-md px-4 py-3 rounded-[20px] shadow-sm hover:shadow-md transition-all duration-300 ${
                  message.senderId === userId 
                    ? 'bg-gradient-to-br from-blue-50 to-blue-100 text-black ml-auto' 
                    : 'bg-gradient-to-br from-gray-50 to-gray-100 text-black mr-auto'
                }`}
              >
                {/* Hover Action Icons - Top Right Corner */}
                {message.senderId === userId && (
                  <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-90 group-hover:scale-100">
                    <div className="flex gap-1 bg-white rounded-full shadow-lg p-1">
                      <button
                        onClick={() => {
                          setEditingMessage(message._id);
                          setEditText(message.text);
                        }}
                        className="p-1.5 text-blue-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all duration-200"
                        title="Edit message"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleDeleteMessage(message._id)}
                        className="p-1.5 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-all duration-200"
                        title="Delete message"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                )}

                {/* Message Content */}
                <div className="pr-8">
                  {editingMessage === message._id ? (
                    <div className="flex flex-col gap-2">
                      <input
                        type="text"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/80 backdrop-blur-sm"
                        onKeyPress={(e) => e.key === 'Enter' && handleEditMessage(message._id, editText)}
                        autoFocus
                      />
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => {
                            setEditingMessage(null);
                            setEditText("");
                          }}
                          className="px-3 py-1 text-xs text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-md transition-all duration-200"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleEditMessage(message._id, editText)}
                          className="px-3 py-1 text-xs text-white bg-blue-500 hover:bg-blue-600 rounded-md transition-all duration-200 shadow-sm"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm leading-relaxed break-words text-gray-800">{message.text}</p>
                  )}
                </div>

                {/* Time - Bottom Right */}
                <div className="mt-2 text-right">
                  <span className="text-xs text-gray-500 opacity-75">
                    {formatTime(message.createdAt)}
                  </span>
                </div>
              </div>

              {/* Avatar for current user (right side) */}
              {message.senderId === userId && (
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-sm bg-blue-500 ml-2`}>
                  Y
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 p-4 bg-white">
        <div className="flex gap-2">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your message..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          />
          <button
            onClick={handleSend}
            disabled={!text.trim()}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  </div>
);

};

export default ChatPage;