import React, { useState } from 'react';
import Navbar from "../components/Navbar";
import Features from "../components/Features";
import HowItWorks from "../components/HowItWorks";
import Stats from "../components/Stats";
import Footer from "../components/Footer";
import SystemPreview from "../components/SystemPreview";
import Hero from "../components/HeroSection";
import ChatIcon from "../components/ChatIcon";
import ChatBox from "../components/ChatBox";

export default function Home() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    {
      _id: '1',
      text: 'Hi, I think I found your item. Please reply.',
      senderId: 'founder',
      createdAt: new Date().toISOString(),
      seen: true,
      delivered: true
    }
  ]);

  const handleSendMessage = (message) => {
    const newMessage = {
      _id: Date.now().toString(),
      text: message,
      senderId: 'owner',
      createdAt: new Date().toISOString(),
      sent: true,
      delivered: true
    };
    
    setChatMessages(prev => [...prev, newMessage]);
    
    // Simulate delivery and seen status
    setTimeout(() => {
      setChatMessages(prev => 
        prev.map(msg => 
          msg._id === newMessage._id 
            ? { ...msg, delivered: true }
            : msg
        )
      );
    }, 1000);
    
    setTimeout(() => {
      setChatMessages(prev => 
        prev.map(msg => 
          msg._id === newMessage._id 
            ? { ...msg, seen: true }
            : msg
        )
      );
    }, 2000);
  };

  const handleEditMessage = (messageId, newText) => {
    setChatMessages(prev => 
      prev.map(msg => 
        msg._id === messageId 
          ? { ...msg, text: newText, edited: true }
          : msg
      )
    );
  };

  const handleDeleteMessage = (messageId) => {
    setChatMessages(prev => prev.filter(msg => msg._id !== messageId));
  };

  const currentUser = { id: 'owner', name: 'You' };
  const otherUser = { id: 'founder', name: 'UniFound Team', email: 'support@unifound.com' };

  return (
    <div className="bg-white text-neutral-text relative">
      <Navbar />
      <Hero />
      <Features />
      <SystemPreview/>
      <HowItWorks />
      <Stats />
      <Footer />
      
      {/* Chat Icon */}
      <ChatIcon 
        onClick={() => setIsChatOpen(true)}
        hasUnread={false}
      />
      
      {/* Chat Box */}
      <ChatBox
        claimId="CLAIM-001"
        messages={chatMessages}
        onSendMessage={handleSendMessage}
        onEditMessage={handleEditMessage}
        onDeleteMessage={handleDeleteMessage}
        currentUser={currentUser}
        otherUser={otherUser}
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />
    </div>
  );
}