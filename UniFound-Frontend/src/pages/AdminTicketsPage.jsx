import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import api from '../api/axios';

export default function AdminTicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [expandedTicket, setExpandedTicket] = useState(null);
  

  // Per-ticket state
  const [replyMessage, setReplyMessage] = useState({});
  const [rejectionReason, setRejectionReason] = useState({});
  const [editMessage, setEditMessage] = useState({});

  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchAllTickets();
  }, []);

  const fetchAllTickets = async () => {
    try {
      setLoading(true);
      const response = await api.get('/tickets');
      setTickets(response.data);
    } catch (err) {
      setError('Failed to fetch tickets');
      console.error('Error fetching tickets:', err);
    } finally {
      setLoading(false);
    }
  };

  const deleteMessage = async (ticketId, messageId) => {
    try {
      await api.delete(`/tickets/${ticketId}/message/${messageId}`, {
        data: { senderId: localStorage.getItem('adminId') || 'admin-demo-id' }
      });
      setSuccess('Message deleted successfully');
      fetchAllTickets();
    } catch (err) {
      setError('Failed to delete message');
    }
  };


  const updateMessage = async (ticketId, messageId, newText) => {
    try {
      await api.put(`/tickets/${ticketId}/message/${messageId}`, { text: newText });
      setSuccess('Message updated successfully');
      setEditMessage({ ...editMessage, [messageId]: null });
      fetchAllTickets();
    } catch (err) {
      setError('Failed to update message');
    }
  };

  const updateTicketStatus = async (ticketId, status, reason = null) => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      await api.put(`/tickets/${ticketId}/status`, { status, rejectionReason: reason });
      setSuccess('Ticket status updated successfully');

      // Clear rejection reason input for that ticket
      if (status === 'Rejected') {
        setRejectionReason({ ...rejectionReason, [ticketId]: '' });
      }

      fetchAllTickets();
    } catch (err) {
      setError('Failed to update ticket status');
    } finally {
      setLoading(false);
    }
  };

  const addReply = async (ticketId) => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const adminId = localStorage.getItem('adminId') || 'admin-demo-id';
      await api.post(`/tickets/${ticketId}/message`, {
        senderId: adminId,
        text: replyMessage[ticketId],
      });

      setSuccess('Reply sent successfully');
      setReplyMessage({ ...replyMessage, [ticketId]: '' });
      fetchAllTickets();
    } catch (err) {
      setError('Failed to send reply');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'open': return 'bg-green-100 text-green-800';
      case 'in progress': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-blue-100 text-blue-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesFilter = filter === 'all' || ticket.status.toLowerCase() === filter.toLowerCase();
    const matchesSearch = searchQuery === '' || 
      ticket.ticketId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket._id?.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-['Inter',_-apple-system,_.SFNSText-Regular,'Segoe_UI','Helvetica_Neue',sans-serif]">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Ticket Management</h1>
        <p className="text-lg text-gray-600 max-w-2xl">Manage and respond to user support tickets.</p>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-700 font-medium">{success}</p>
        </div>
      )}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 font-medium">{error}</p>
        </div>
      )}

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        {/* Search Bar */}
        <div className="relative max-w-md">
          <div className="absolute left-3 top-1/2 -translate-y-1/2">
            <Search className="w-5 h-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by ticket ID (e.g., TIDMNB4SK1C0F52WC)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium placeholder:text-gray-400 focus:bg-white focus:border-blue-300 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all duration-200"
          />
        </div>

        {/* Status Filters */}
        <div className="flex gap-2 flex-wrap">
              {['all', 'open', 'in progress', 'resolved', 'closed', 'rejected'].map(status => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === status ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
        </div>

          {/* Tickets List */}
          {filteredTickets.length === 0 ? (
            <div className="text-center py-20 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl border border-blue-100">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2 2v5a2 2 0 012 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">No tickets found</h3>
              <p className="text-gray-600 max-w-md mx-auto text-lg">No support tickets have been created yet. Check back later for new tickets.</p>
            </div>
          ) : (
            <div className="space-y-8">
              {filteredTickets.map(ticket => (
                <div key={ticket._id} className="bg-white border border-gray-200 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                  <div className="p-8">
                    {/* Ticket Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-6">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
                              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h10M7 16h10M3 8l7 7-7 7" />
                              </svg>
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-gray-900">{ticket.subject}</h3>
                              <p className="text-sm text-blue-600 font-semibold mt-1">{ticket.ticketId}</p>
                            </div>
                          </div>
                          <span className={`px-4 py-2 text-sm font-bold rounded-full ${getStatusColor(ticket.status)} shadow-md`}>
                            {ticket.status}
                          </span>
                        </div>

                        {/* Ticket Info */}
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-6 border border-blue-100">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 007-7z" />
                                </svg>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 font-medium">Name</p>
                                <p className="font-semibold text-gray-800">{ticket.name}</p>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 font-medium">Email</p>
                                <p className="text-gray-800 text-sm">{ticket.email}</p>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 font-medium">Phone</p>
                                <p className="text-gray-800 text-sm">{ticket.phone}</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {ticket.description && (
                          <div className="mb-6">
                            <h4 className="text-sm font-semibold text-gray-700 mb-3">Description</h4>
                            <p className="text-gray-700 leading-relaxed bg-gray-50 rounded-xl p-4 border border-gray-200">{ticket.description}</p>
                          </div>
                        )}

                        {/* Ticket Footer */}
                        <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                          <div className="flex items-center gap-6 text-sm text-gray-500">
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mr-2">
                                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                              </div>
                              <div>
                                <p className="text-xs text-gray-400 font-medium">Created</p>
                                <p className="font-medium text-gray-700">{new Date(ticket.createdAt).toLocaleDateString()}</p>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-2">
                                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                              </div>
                              <div>
                                <p className="text-xs text-gray-400 font-medium">Messages</p>
                                <p className="font-medium text-gray-700">{ticket.messages?.length || 0}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Expand Button */}
                      <div className="flex flex-col gap-3 ml-8">
                        <button
                          onClick={() => setExpandedTicket(expandedTicket === ticket._id ? null : ticket._id)}
                          className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 text-blue-600 rounded-xl transition-all duration-300 group shadow-md hover:shadow-lg"
                          title={expandedTicket === ticket._id ? 'Hide details' : 'View details'}
                        >
                          <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {expandedTicket === ticket._id ? (
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            ) : (
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            )}
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Expanded Ticket Details */}
                    {expandedTicket === ticket._id && (
                      <div className="mt-8 pt-8 border-t border-gray-200 space-y-8">
                        {/* Messages */}
                        <div className="space-y-4">
                          <h4 className="text-lg font-bold text-gray-900 mb-6">Conversation History</h4>
                          {ticket.messages?.map((message) => (
                            <div key={message._id} className={`rounded-2xl p-6 shadow-md ${message.senderType === "Admin" ? 'bg-gray-100 mr-12 border border-gray-200' : 'bg-gradient-to-r from-blue-50 to-indigo-50 ml-12 border border-blue-100'}`}>
                              <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center">
                                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-3 shadow-md ${message.senderType === "Admin" ? 'bg-gradient-to-br from-gray-400 to-gray-600' : 'bg-gradient-to-br from-blue-500 to-indigo-600'}`}>
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      {message.senderType === "Admin" ? (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                      ) : (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 007-7z" />
                                      )}
                                    </svg>
                                  </div>
                                  <div>
                                    <span className="text-base font-bold text-gray-900">
                                      {message.senderType === "Admin" ? 'Support Team' : 'User'}
                                    </span>
                                    <p className="text-xs text-gray-500 mt-1">
                                      {new Date(message.createdAt).toLocaleString()}
                                    </p>
                                  </div>
                                </div>
                              </div>

                              {/* Edit/Delete Buttons for Admin Messages */}
                              {message.senderType === "Admin" && (
                                <div className="flex gap-3 mt-4">
                                  {!editMessage[message._id] && (
                                    <button
                                      onClick={() => setEditMessage({ ...editMessage, [message._id]: { text: message.text } })}
                                      className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center transition-colors"
                                    >
                                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                      </svg>
                                      Edit
                                    </button>
                                  )}
                                  <button
                                    onClick={() => deleteMessage(ticket._id, message._id)}
                                    disabled={loading}
                                    className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center transition-colors"
                                  >
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                    Delete
                                  </button>
                                </div>
                              )}

                              {/* Edit Form for Admin Messages */}
                              {editMessage[message._id] && message.senderType === "Admin" ? (
                                <div className="space-y-4 mt-4">
                                  <textarea
                                    value={editMessage[message._id].text}
                                    onChange={(e) => setEditMessage({ ...editMessage, [message._id]: { text: e.target.value } })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                    rows={4}
                                    placeholder="Edit your message..."
                                  />
                                  <div className="flex gap-3">
                                    <button
                                      onClick={() => updateMessage(ticket._id, message._id, editMessage[message._id].text)}
                                      className="px-4 py-2 bg-blue-600 text-white text-sm rounded-xl hover:bg-blue-700 transition-colors font-medium shadow-md"
                                    >
                                      Save Changes
                                    </button>
                                    <button
                                      onClick={() => setEditMessage({ ...editMessage, [message._id]: null })}
                                      className="px-4 py-2 bg-gray-300 text-gray-700 text-sm rounded-xl hover:bg-gray-400 transition-colors font-medium"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <p className="text-gray-700 leading-relaxed mt-3 text-base">{message.text}</p>
                              )}
                            </div>
                          ))}
                        </div>

                        {/* Status Update */}
                        <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-6 border border-gray-200">
                          <h4 className="text-lg font-bold text-gray-900 mb-6">Ticket Management</h4>
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-4">Update Status</label>
                            <div className="flex gap-3 flex-wrap mb-6">
                              {['Open', 'In Progress', 'Resolved', 'Closed', 'Rejected'].map(status => (
                                <button
                                  key={status}
                                  onClick={() => updateTicketStatus(ticket._id, status)}
                                  disabled={loading}
                                  className={`px-4 py-2 text-sm font-bold rounded-xl transition-all duration-200 shadow-sm ${
                                    ticket.status === status ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                                  } disabled:opacity-50`}
                                >
                                  {status}
                                </button>
                              ))}
                            </div>

                            {/* Reject Reason */}
                            {ticket.status !== 'Rejected' && (
                              <div className="mt-6">
                                <label className="block text-sm font-semibold text-gray-700 mb-3">Reject with Reason (optional)</label>
                                <div className="flex gap-3">
                                  <input
                                    type="text"
                                    value={rejectionReason[ticket._id] || ''}
                                    onChange={(e) => setRejectionReason({ ...rejectionReason, [ticket._id]: e.target.value })}
                                    className="flex-1 px-4 py-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter rejection reason..."
                                  />
                                  <button
                                    onClick={() => updateTicketStatus(ticket._id, 'Rejected', rejectionReason[ticket._id])}
                                    disabled={loading || !rejectionReason[ticket._id]?.trim()}
                                    className="px-6 py-3 bg-red-600 text-white text-sm font-bold rounded-xl hover:bg-red-700 transition-all duration-200 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    Reject Ticket
                                  </button>
                                </div>
                              </div>
                            )}

                            {/* Show rejection reason */}
                            {ticket.rejectionReason && (
                              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                                <p className="text-sm text-red-700 font-medium">
                                  <strong>Rejection Reason:</strong> {ticket.rejectionReason}
                                </p>
                              </div>
                            )}

                            {/* Reply Form */}
                            <div className="mt-8">
                              <label className="block text-sm font-semibold text-gray-700 mb-4">Reply to Ticket</label>
                              <div className="flex gap-3">
                                <input
                                  type="text"
                                  value={replyMessage[ticket._id] || ''}
                                  onChange={(e) => setReplyMessage({ ...replyMessage, [ticket._id]: e.target.value })}
                                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  placeholder="Type your reply..."
                                />
                                <button
                                  onClick={() => addReply(ticket._id)}
                                  disabled={loading || !replyMessage[ticket._id]?.trim()}
                                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  Send Reply
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
    </div>
  );
}