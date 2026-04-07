import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from "../components/Navbar";
import Features from "../components/Features";
import HowItWorks from "../components/HowItWorks";
import Stats from "../components/Stats";
import Footer from "../components/Footer";
import SystemPreview from "../components/SystemPreview";
import Hero from "../components/HeroSection";
import ChatIcon from "../components/ChatIcon";
import ChatBox from "../components/ChatBox";
import { MessageCircle, Bell } from "lucide-react";

export default function Home() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();

  const BASE_URL = "http://localhost:5000/api";

  // Get current user info
  const getUserId = () => {
    try {
      const userString = localStorage.getItem("user");
      if (!userString) return null;
      
      const user = JSON.parse(userString);
      return user?.userId?.trim();
    } catch (error) {
      console.error("Error parsing user:", error);
      return null;
    }
  };

  const userId = getUserId();

  // Fetch user's chat rooms (as finder)
  useEffect(() => {
    const fetchUserChats = async () => {
      if (!userId) {
        console.log("❌ No userId found in localStorage");
        return;
      }

      console.log("🔍 Fetching chats for userId:", userId);
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${BASE_URL}/chats/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("📡 Chat fetch response status:", response.status);

        if (response.ok) {
          const data = await response.json();
          const userChats = data.data || data;
          
          console.log("📋 User chats found:", userChats);
          console.log("📊 Number of chats:", userChats.length);
          
          // Count unread messages
          let totalUnread = 0;
          userChats.forEach(chat => {
            if (chat.lastMessage && !chat.lastMessage.includes(userId)) {
              totalUnread++;
            }
          });
          
          console.log("🔔 Unread count:", totalUnread);
          setUnreadCount(totalUnread);
          
          // Set active chat to first available chat
          if (userChats.length > 0) {
            console.log("✅ Setting active chat:", userChats[0]);
            setActiveChat(userChats[0]);
            // Load messages for active chat
            await loadMessagesForChat(userChats[0]._id);
          } else {
            console.log("❌ No chats found for user");
            setActiveChat(null);
          }
        } else {
          const errorData = await response.json();
          console.error("❌ Failed to fetch chats:", errorData);
        }
      } catch (error) {
        console.error("❌ Error fetching user chats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserChats();
  }, [userId]);

  // Load messages for specific chat
  const loadMessagesForChat = async (chatId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${BASE_URL}/messages/${chatId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const messages = data.data || data;
        setChatMessages(messages || []);
        console.log("📨 Messages loaded:", messages.length);
      }
    } catch (error) {
      console.error("Error loading messages:", error);
    }
  };

  const handleSendMessage = async (message) => {
    if (!activeChat || !message.trim()) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${BASE_URL}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          chatId: activeChat._id,
          senderId: userId,
          text: message.trim(),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const newMessage = data.data || data;
        setChatMessages(prev => [...prev, newMessage]);
        console.log("📤 Message sent:", newMessage);
      } else {
        console.error("Failed to send message:", await response.json());
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleEditMessage = async (messageId, newText) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${BASE_URL}/messages/${messageId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          senderId: userId,
          text: newText,
        }),
      });

      if (response.ok) {
        setChatMessages(prev =>
          prev.map(msg =>
            msg._id === messageId ? { ...msg, text: newText } : msg
          )
        );
        console.log("✏️ Message edited:", messageId);
      }
    } catch (error) {
      console.error("Error editing message:", error);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${BASE_URL}/messages/${messageId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          senderId: userId,
        }),
      });

      if (response.ok) {
        setChatMessages(prev => prev.filter(msg => msg._id !== messageId));
        console.log("🗑️ Message deleted:", messageId);
      }
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  // Get current user info
  const currentUser = userId ? { id: userId, name: 'You' } : null;
  const otherUser = activeChat ? { 
    id: 'claimant', 
    name: 'Claimant', 
    email: 'claimant@example.com' 
  } : null;

  return (
    <div className="bg-white text-neutral-text relative">
      <Navbar />
      <Hero />
      <Features />
      <SystemPreview/>
      <HowItWorks />
      <Stats />
      <Footer />
      
      {/* Chat Icon - Only show if user has active chats */}
      {activeChat && (
        <ChatIcon 
          onClick={() => setIsChatOpen(true)}
          hasUnread={unreadCount > 0}
          unreadCount={unreadCount}
        />
      )}
      
      {/* Chat Box - Only show if user has active chats */}
      {activeChat && (
        <ChatBox
          claimId={activeChat.claimId || activeChat._id}
          messages={chatMessages}
          onSendMessage={handleSendMessage}
          onEditMessage={handleEditMessage}
          onDeleteMessage={handleDeleteMessage}
          currentUser={currentUser}
          otherUser={otherUser}
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
        />
      )}
    </div>
  );
}