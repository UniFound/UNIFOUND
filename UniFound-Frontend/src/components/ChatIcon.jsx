import React from 'react';
import { MessageCircle } from 'lucide-react';

export default function ChatIcon({ onClick, hasUnread }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-4 right-4 z-40 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all hover:scale-110"
    >
      <MessageCircle size={24} />
      {hasUnread && (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
      )}
    </button>
  );
}
