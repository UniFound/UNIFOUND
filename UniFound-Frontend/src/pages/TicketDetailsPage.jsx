import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../api/axios';

export default function TicketDetailsPage() {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [editMessage, setEditMessage] = useState({});
  const [isEditingTicket, setIsEditingTicket] = useState(false);
  const [editedTicket, setEditedTicket] = useState({});
  const [emailError, setEmailError] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const userId = localStorage.getItem('userId');

  // Helper function to get user's full name
  const getUserFullName = () => {
    const userData = JSON.parse(localStorage.getItem('user')) || {};
    // Prefer firstName + lastName if available, fallback to name
    if (userData.firstName && userData.lastName) {
      return `${userData.firstName} ${userData.lastName}`;
    }
    return userData.name || '';
  };

  useEffect(() => {
    fetchTicketDetails();
  }, [ticketId]);

  const fetchTicketDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/tickets/${ticketId}`);
      setTicket(response.data);
    } catch (err) {
      setError('Failed to fetch ticket details');
      console.error('Error fetching ticket details:', err);
    } finally {
      setLoading(false);
    }
  };

  const closeTicket = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      await api.put(`/tickets/${ticket._id}/status`, { status: 'Closed' });
      setSuccess('Ticket closed successfully');
      fetchTicketDetails();
    } catch (err) {
      setError('Failed to close ticket');
    } finally {
      setLoading(false);
    }
  };

  
  const updateMessage = async (messageId, newText) => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      await api.put(`/tickets/${ticket._id}/message/${messageId}`, { 
        senderId: localStorage.getItem('userId'),
        text: newText 
      });
      setSuccess('Message updated successfully');
      setEditMessage({ ...editMessage, [messageId]: null });
      fetchTicketDetails();
    } catch (err) {
      setError('Failed to update message');
    } finally {
      setLoading(false);
    }
  };

  const deleteMessage = async (messageId) => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      await api.delete(`/tickets/${ticket._id}/message/${messageId}`, {
        data: { senderId: localStorage.getItem('userId') }
      });
      setSuccess('Message deleted successfully');
      fetchTicketDetails();
    } catch (err) {
      setError('Failed to delete message');
    } finally {
      setLoading(false);
    }
  };

  const updateTicket = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      setEmailError('');

      // Validate all fields
      const nameValidation = validateName(editedTicket.name);
      const emailValidation = validateEmail(editedTicket.email);
      const phoneValidation = validatePhone(editedTicket.phone);

      // Set specific error messages
      if (!nameValidation.isValid) {
        setError(nameValidation.error);
        return;
      }

      if (!emailValidation.isValid) {
        setEmailError(emailValidation.error);
        return;
      }

      if (!phoneValidation.isValid) {
        setError(phoneValidation.error);
        return;
      }

      // Additional cross-field validation
      if (editedTicket.email === ticket.email && editedTicket.name === ticket.name && editedTicket.phone === ticket.phone) {
        setError('No changes detected. Please modify at least one field.');
        return;
      }

      await api.put(`/tickets/${ticket._id}`, editedTicket);
      setSuccess('Ticket updated successfully');
      setIsEditingTicket(false);
      fetchTicketDetails();
    } catch (err) {
      setError('Failed to update ticket. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const startEditingTicket = () => {
    setEditedTicket({
      name: ticket.name,
      email: ticket.email,
      phone: ticket.phone
    });
    setIsEditingTicket(true);
  };

  const cancelEditingTicket = () => {
    setIsEditingTicket(false);
    setEditedTicket({});
    setEmailError('');
  };

  const validateEmail = (email) => {
    if (!email || email.trim() === '') {
      return { isValid: false, error: 'Email is required' };
    }
    
    // Accept only @gmail.com or @example.com with lowercase letters, numbers, dots, underscores, hyphens
    const emailRegex = /^[a-z0-9._-]+@(gmail\.com|example\.com)$/;
    
    if (!emailRegex.test(email.toLowerCase().trim())) {
      return { isValid: false, error: 'Email must be a valid @gmail.com or @example.com address with lowercase letters, numbers, dots, underscores, or hyphens' };
    }
    
    
    // Check for consecutive dots
    if (email.includes('..')) {
      return { isValid: false, error: 'Email cannot contain consecutive dots' };
    }
    
    // Check for dot at start or end of local part
    const localPart = email.split('@')[0];
    if (localPart.startsWith('.') || localPart.endsWith('.')) {
      return { isValid: false, error: 'Email cannot start or end with a dot' };
    }
    
    return { isValid: true, error: '' };
  };

  const validateName = (name) => {
    if (!name || name.trim() === '') {
      return { isValid: false, error: 'Name is required' };
    }
    
    const trimmedName = name.trim();
    
    // Allow only English letters and spaces
    if (!/^[a-zA-Z\s]*$/.test(trimmedName)) {
      return { isValid: false, error: 'Name can only contain English letters and spaces' };
    }
    
    // Check minimum length (at least 2 characters)
    if (trimmedName.length < 2) {
      return { isValid: false, error: 'Name must be at least 2 characters long' };
    }
    
    // Check maximum length (at most 50 characters)
    if (trimmedName.length > 50) {
      return { isValid: false, error: 'Name cannot be more than 50 characters long' };
    }
    
    // Check for multiple consecutive spaces
    if (/\s{2,}/.test(trimmedName)) {
      return { isValid: false, error: 'Name cannot contain multiple consecutive spaces' };
    }
    
    // Check if name starts or ends with space
    if (trimmedName !== name) {
      return { isValid: false, error: 'Name cannot start or end with spaces' };
    }
    
    return { isValid: true, error: '' };
  };

  const validatePhone = (phone) => {
    if (!phone || phone.trim() === '') {
      return { isValid: false, error: 'Phone number is required' };
    }
    
    const trimmedPhone = phone.trim();
    
    // Remove common phone number formatting characters
    const cleanPhone = trimmedPhone.replace(/[\s\-\(\)]/g, '');
    
    // Check if contains only digits (after cleaning)
    if (!/^\d+$/.test(cleanPhone)) {
      return { isValid: false, error: 'Phone number can only contain digits and basic formatting characters (spaces, dashes, parentheses)' };
    }
    
    // Check exact length (must be exactly 10 digits)
    if (cleanPhone.length !== 10) {
      return { isValid: false, error: 'Phone number must be exactly 10 digits long' };
    }
    
    // Check if starts with 0
    if (cleanPhone[0] !== '0') {
      return { isValid: false, error: 'Phone number must start with 0' };
    }
    
    // Check for reasonable phone number patterns
    // Should not have all same digits (like 1111111111)
    if (/^(\d)\1+$/.test(cleanPhone)) {
      return { isValid: false, error: 'Phone number cannot consist of the same digit repeated' };
    }
    
    return { isValid: true, error: '' };
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

  if (loading) {
    return (
      <div className="bg-white text-gray-800 min-h-screen">
        <Navbar />
        <div className="pt-24 pb-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error && !ticket) {
    return (
      <div className="bg-white text-gray-800 min-h-screen">
        <Navbar />
        <div className="pt-24 pb-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Ticket</h3>
              <p className="text-red-600">{error}</p>
              <button
                onClick={() => navigate('/tickets')}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Back to Tickets
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="bg-white text-gray-800 min-h-screen">
        <Navbar />
        <div className="pt-24 pb-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Ticket not found</h3>
              <button
                onClick={() => navigate('/tickets')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Back to Tickets
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-white text-gray-800 min-h-screen">
      <Navbar />
      
      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-6">
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

          {/* Header */}
          <div className="mb-6">
            <button
              onClick={() => navigate('/tickets')}
              className="flex items-center text-blue-600 hover:text-blue-700 mb-4"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Tickets
            </button>
            
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{ticket.subject}</h1>
                <p className="text-gray-600">Ticket ID: {ticket.ticketId}</p>
              </div>
              
              <div className="flex items-center gap-4">
                <span className={`px-4 py-2 text-sm font-semibold rounded-full ${getStatusColor(ticket.status)}`}>
                  {ticket.status}
                </span>
                {ticket.status !== 'Closed' && ticket.status !== 'Resolved' && (
                  <button
                    onClick={closeTicket}
                    disabled={loading}
                    className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition disabled:opacity-50"
                  >
                    Close Ticket
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Messages Section */}
            <div className="lg:col-span-2">
              <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Conversation</h2>
                  
                  {/* Messages */}
                  <div className="space-y-4">
                    {ticket.messages.map((message) => (
                      <div key={message._id} className="flex gap-4">
                        <div className="flex-shrink-0">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            message.senderType === 'User' 
                              ? 'bg-blue-100 text-blue-600' 
                              : 'bg-green-100 text-green-600'
                          }`}>
                            {message.senderType === 'User' ? (
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                            ) : (
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <span className="font-medium text-gray-900">
                                {message.senderType === 'User' ? ticket.name : 'Admin'}
                              </span>
                              {message.autoReply && (
                                <span className="ml-2 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                  Auto-reply
                                </span>
                              )}
                            </div>
                            <div className="text-sm text-gray-500">
                              {new Date(message.createdAt).toLocaleString()}
                            </div>
                          </div>
                          
                          {editMessage[message._id] ? (
                            <div className="space-y-3">
                              <textarea
                                value={editMessage[message._id].text}
                                onChange={(e) => setEditMessage({ ...editMessage, [message._id]: { text: e.target.value } })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                rows={3}
                              />
                              <div className="flex gap-2">
                                <button
                                  onClick={() => updateMessage(message._id, editMessage[message._id].text)}
                                  className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={() => setEditMessage({ ...editMessage, [message._id]: null })}
                                  className="px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-400"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="bg-gray-50 rounded-lg p-4">
                              <p className="text-gray-800 whitespace-pre-wrap">{message.text}</p>
                              
                              {message.senderType === 'User' && !message.autoReply && 
                               message.senderId === userId && 
                               ticket.status !== 'Resolved' && ticket.status !== 'Closed' && (
                                <div className="mt-3 flex gap-2">
                                  <button
                                    onClick={() => setEditMessage({ ...editMessage, [message._id]: { text: message.text } })}
                                    className="text-sm text-blue-600 hover:text-blue-700"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => deleteMessage(message._id)}
                                    className="text-sm text-red-600 hover:text-red-700"
                                  >
                                    Delete
                                  </button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  
                  {/* Show message when admin hasn't replied yet */}
                  {!ticket.messages.some(msg => msg.senderType === 'Admin' && !msg.autoReply) && 
                   ticket.status === 'Open' && (
                    <div className="mt-6 border-t pt-6">
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-center">
                          <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <p className="text-blue-800">
                            Admin hasn't responded yet. You'll be able to reply once they respond to your ticket.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Ticket Info Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-blue-50 border border-blue-200 rounded-xl shadow-sm">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Ticket Information</h2>
                    {!isEditingTicket && (
                      <button
                        onClick={startEditingTicket}
                        className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Edit Ticket
                      </button>
                    )}
                  </div>
                  
                  {isEditingTicket ? (
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Name *</label>
                        <input
                          type="text"
                          value={editedTicket.name}
                          onChange={(e) => {
                            // Only allow English letters and spaces
                            const value = e.target.value;
                            const filteredValue = value.replace(/[^a-zA-Z\s]/g, '');
                            setEditedTicket({ ...editedTicket, name: filteredValue });
                            setError(''); // Clear general error on input
                          }}
                          className={`mt-1 w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors bg-blue-50 ${
                            editedTicket.name && !validateName(editedTicket.name).isValid ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                          }`}
                          placeholder="Enter your full name (English letters only)"
                          maxLength={50}
                          required
                        />
                        {editedTicket.name && !validateName(editedTicket.name).isValid && (
                          <p className="mt-1 text-xs text-red-600 flex items-center">
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            {validateName(editedTicket.name).error}
                          </p>
                        )}
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-gray-700">Email *</label>
                        <input
                          type="email"
                          value={editedTicket.email}
                          onChange={(e) => {
                            setEditedTicket({ ...editedTicket, email: e.target.value });
                            setEmailError(''); // Clear email error on input
                            setError(''); // Clear general error on input
                          }}
                          className={`mt-1 w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors bg-blue-50 ${
                            editedTicket.email && !validateEmail(editedTicket.email).isValid ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                          }`}
                          placeholder="Enter your email address"
                          required
                        />
                        {emailError && (
                          <p className="mt-1 text-xs text-red-600 flex items-center">
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            {emailError}
                          </p>
                        )}
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-gray-700">Phone *</label>
                        <input
                          type="tel"
                          value={editedTicket.phone}
                          onChange={(e) => {
                            // Format phone number as 071 554 6714
                            let value = e.target.value.replace(/\D/g, ''); // Remove non-digits
                            
                            // If first digit is not 0 and field is not empty, don't allow it
                            if (value.length === 1 && value !== '0') {
                              value = ''; // Clear field if first digit is not 0
                            }
                            
                            // Auto-format as user types
                            if (value.length > 0) {
                              let formatted = value;
                              
                              // Format: 071 554 6714
                              if (value.length <= 3) {
                                formatted = value; // 071
                              } else if (value.length <= 6) {
                                formatted = value.slice(0, 3) + ' ' + value.slice(3); // 071 554
                              } else {
                                formatted = value.slice(0, 3) + ' ' + value.slice(3, 6) + ' ' + value.slice(6); // 071 554 6714
                              }
                              
                              value = formatted;
                            }
                            
                            // Limit to 10 digits (excluding spaces)
                            const cleanValue = value.replace(/\s/g, '');
                            if (cleanValue.length > 10) {
                              value = value.replace(/\s/g, '').substring(0, 10);
                              // Reformat if truncated
                              if (value.length > 3) {
                                value = value.slice(0, 3) + ' ' + value.slice(3, 6) + ' ' + value.slice(6);
                              }
                            }
                            
                            setEditedTicket({ ...editedTicket, phone: value });
                            setError(''); // Clear general error on input
                          }}
                          className={`mt-1 w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors bg-blue-50 ${
                            editedTicket.phone && !validatePhone(editedTicket.phone).isValid ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                          }`}
                          placeholder="071 554 6714"
                          maxLength={13}
                          required
                        />
                        {editedTicket.phone && !validatePhone(editedTicket.phone).isValid && (
                          <p className="mt-1 text-xs text-red-600 flex items-center">
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            {validatePhone(editedTicket.phone).error}
                          </p>
                        )}
                      </div>
                      
                      <div className="flex gap-2 pt-4">
                        <button
                          onClick={updateTicket}
                          disabled={loading}
                          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                        >
                          Save Changes
                        </button>
                        <button
                          onClick={cancelEditingTicket}
                          className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Status</label>
                        <div className="mt-1">
                          <span className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(ticket.status)}`}>
                            {ticket.status}
                          </span>
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-700">Created</label>
                        <div className="mt-1 text-sm text-gray-900">
                          {new Date(ticket.createdAt).toLocaleDateString()} at {new Date(ticket.createdAt).toLocaleTimeString()}
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-700">Name</label>
                        <div className="mt-1 text-sm text-gray-900">{ticket.name}</div>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-700">Email</label>
                        <div className="mt-1 text-sm text-gray-900">{ticket.email}</div>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-700">Phone</label>
                        <div className="mt-1 text-sm text-gray-900">{ticket.phone}</div>
                      </div>

                      {ticket.rejectionReason && (
                        <div>
                          <label className="text-sm font-medium text-gray-700">Rejection Reason</label>
                          <div className="mt-1 text-sm text-red-600 bg-red-50 p-2 rounded">
                            {ticket.rejectionReason}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
