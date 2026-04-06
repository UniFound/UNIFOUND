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

  const getMessageStatus = (message) => {
    if (message.senderId === currentUser?.id) {
      if (message.seen) {
        return { text: 'Seen', color: 'text-black', bgColor: 'bg-green-100', icon: CheckCheck };
      } else if (message.delivered) {
        return { text: 'Delivered', color: 'text-black', bgColor: 'bg-blue-100', icon: Check };
      } else {
        return { text: 'Sent', color: 'text-black', bgColor: 'bg-gray-100', icon: Send };
      }
    } else {
      if (message.seen) {
        return { text: 'Seen', color: 'text-black', bgColor: 'bg-green-100', icon: CheckCheck };
      } else if (message.delivered) {
        return { text: 'Delivered', color: 'text-black', bgColor: 'bg-blue-100', icon: Check };
      } else {
        return { text: 'Received', color: 'text-black', bgColor: 'bg-gray-100', icon: null };
      }
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96 bg-white border border-gray-200 rounded-lg shadow-2xl">
      {/* Header */}
      <div className="bg-linear-to-r from-blue-500 to-blue-600 text-white p-4 rounded-t-lg flex items-center justify-between">
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
          const status = getMessageStatus(message);
          return (
            <div
              key={message._id}
              className={`flex ${message.senderId === currentUser?.id ? 'justify-end' : 'justify-start'} mb-3`}
            >
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-sm ${
                message.senderId === currentUser?.id 
                  ? 'bg-green-600' 
                  : message.senderId === otherUser?.id 
                    ? 'bg-blue-600' 
                    : 'bg-gray-500'
              }`}>
                {message.senderId === currentUser?.id 
                  ? 'Y' 
                  : message.senderId === otherUser?.id 
                    ? 'O' 
                    : 'F'}
              </div>

              {/* Message Bubble */}
              <div className={`max-w-xs lg:max-w-md px-3 py-2 rounded-2xl ${
                message.senderId === currentUser?.id 
                  ? 'bg-green-100 text-black' 
                  : message.senderId === otherUser?.id 
                    ? 'bg-blue-100 text-black' 
                    : 'bg-gray-100 text-black'
              }`}>
                <div className="flex items-start justify-between gap-2">
                  {/* Message Content */}
                  <div className="flex-1">
                    {editingMessageId === message._id ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm text-black"
                          onKeyPress={(e) => e.key === 'Enter' && handleSaveEdit()}
                        />
                        <button
                          onClick={handleSaveEdit}
                          className="text-green-600 hover:text-green-700 text-sm font-medium"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="text-gray-500 hover:text-gray-700 text-sm font-medium ml-2"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <p className="text-sm break-words text-black">{message.text}</p>
                    )}
                  </div>

                  {/* Status and Actions */}
                  <div className="flex items-center gap-2 mt-1">
                    {/* Status Icon */}
                    {status && (
                      <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${status.bgColor}`}>
                        {status.icon && <status.icon size={12} />}
                        <span className={status.color}>{status.text}</span>
                      </div>
                    )}

                    {/* Time */}
                    <span className="text-xs text-gray-500">
                      {formatTime(message.createdAt)}
                    </span>

                    {/* Edit/Delete Actions */}
                    {message.senderId === currentUser?.id && (
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleEdit(message._id)}
                          className="text-gray-500 hover:text-gray-700"
                          title="Edit message"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(message._id)}
                          className="text-red-500 hover:text-red-700"
                          title="Delete message"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
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
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
