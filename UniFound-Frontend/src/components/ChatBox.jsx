import React, { useState } from 'react';
import { Send, Check, CheckCheck, Edit, Trash2, MessageCircle, X } from 'lucide-react';

export default function ChatBox({ claimId, messages, onSendMessage, onEditMessage, onDeleteMessage, currentUser, otherUser, isOpen, onClose }) {
  const [newMessage, setNewMessage] = useState('');
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editText, setEditText] = useState('');

  const handleSend = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage('');
    }
  };

  const handleEdit = (messageId) => {
    const message = messages.find(m => m._id === messageId);
    if (message) {
      setEditingMessageId(messageId);
      setEditText(message.text);
    }
  };

  const handleSaveEdit = () => {
    if (editingMessageId && editText.trim()) {
      onEditMessage(editingMessageId, editText);
      setEditingMessageId(null);
      setEditText('');
    }
  };

  const handleCancelEdit = () => {
    setEditingMessageId(null);
    setEditText('');
  };

  const handleDelete = (messageId) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      onDeleteMessage(messageId);
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  
  if (!isOpen) {
    return null;
  }

  return (
    <div 
      className="fixed bg-white border border-gray-200 rounded-lg shadow-2xl"
      style={{
        position: 'fixed',
        bottom: '80px',
        right: '24px',
        width: '384px',
        maxHeight: '600px',
        zIndex: 9998
      }}
    >
      {/* Header */}
      <div className="bg-blue-400 hover:bg-blue-500 text-white p-4 rounded-t-lg flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Claim Chat</h3>
          <p className="text-sm opacity-90">Claim ID: {claimId}</p>
        </div>
        <button
          onClick={onClose}
          className="text-white hover:bg-white/20 p-1 rounded-full transition"
        >
          <X size={20} />
        </button>
      </div>

      {/* Messages */}
      <div className="h-80 overflow-y-auto p-4 space-y-3">
        {messages.map((message) => {
          return (
            <div
              key={message._id}
              className={`flex ${message.senderId === currentUser?.id ? 'justify-end' : 'justify-start'} mb-3`}
            >
              {/* Avatar for other user (left side) */}
              {message.senderId !== currentUser?.id && (
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-sm ${
                  message.senderId === otherUser?.id 
                    ? 'bg-blue-600' 
                    : 'bg-gray-500'
                }`}>
                  {message.senderId === otherUser?.id 
                    ? 'O' 
                    : 'F'}
                </div>
              )}

              {/* Message Bubble */}
              <div 
                className={`group relative max-w-xs lg:max-w-md px-4 py-3 rounded-[20px] shadow-sm hover:shadow-md transition-all duration-300 ${
                  message.senderId === currentUser?.id 
                    ? 'bg-gradient-to-br from-blue-50 to-blue-100 text-black ml-auto' 
                    : message.senderId === otherUser?.id 
                      ? 'bg-gradient-to-br from-gray-50 to-gray-100 text-black mr-auto' 
                      : 'bg-gradient-to-br from-gray-50 to-gray-100 text-black mr-auto'
                }`}
              >
                {/* Hover Action Icons - Top Right Corner */}
                {message.senderId === currentUser?.id && (
                  <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-90 group-hover:scale-100">
                    <div className="flex gap-1 bg-white rounded-full shadow-lg p-1">
                      <button
                        onClick={() => handleEdit(message._id)}
                        className="p-1.5 text-blue-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all duration-200"
                        title="Edit message"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(message._id)}
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
                  {editingMessageId === message._id ? (
                    <div className="flex flex-col gap-2">
                      <input
                        type="text"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/80 backdrop-blur-sm"
                        onKeyPress={(e) => e.key === 'Enter' && handleSaveEdit(message._id)}
                        autoFocus
                      />
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={handleCancelEdit}
                          className="px-3 py-1 text-xs text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-md transition-all duration-200"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleSaveEdit(message._id)}
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
              {message.senderId === currentUser?.id && (
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-sm bg-blue-500 ml-2`}>
                  Y
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Message Input */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your message..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          />
          <button
            onClick={handleSend}
            disabled={!newMessage.trim()}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
