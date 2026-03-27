import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../api/axios';

export default function TicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    description: ''
  });
  const [editFormData, setEditFormData] = useState({ 
    name: '', 
    email: '', 
    phone: '', 
    subject: '', 
    description: ''
  });
  const [emailError, setEmailError] = useState('');
  const [editEmailError, setEditEmailError] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [expandedTicket, setExpandedTicket] = useState(null);
  const [editingTicket, setEditingTicket] = useState(null);
  const [editMessage, setEditMessage] = useState({});

  React.useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const userId = localStorage.getItem('userId') || 'demo-user-id';
      const response = await api.get(`/tickets/user/${userId}`);
      setTickets(response.data);
    } catch (err) {
      console.error('Error fetching tickets:', err);
    }
  };

  const validateEmail = (email) => {
    if (!email || !email.trim()) {
      return 'Email is required';
    }
    
    if (email.includes(' ')) {
      return 'Email cannot contain spaces';
    }
    
    if (email !== email.toLowerCase()) {
      return 'Email must be lowercase only';
    }
    
    const emailRegex = /^[a-z0-9._-]+@gmail\.com$/;
    if (!emailRegex.test(email)) {
      return 'Email must end with @gmail.com and contain only lowercase letters, numbers, dots, underscores, and hyphens';
    }
    
    return 'Valid email';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.subject.trim() || !formData.description.trim()) {
      setError('Name, Email, Phone, Subject, and Description are required');
      return;
    }

    // Validate email
    const emailValidation = validateEmail(formData.email);
    if (emailValidation !== 'Valid email') {
      setError(emailValidation);
      return;
    }

    // Validate phone number format
    const phoneRegex = /^0\d{9}$/;
    const cleanPhone = formData.phone.replace(/\s/g, '');
    if (!phoneRegex.test(cleanPhone)) {
      setError('Phone number must start with 0 and contain exactly 10 digits');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const userId = localStorage.getItem('userId') || 'demo-user-id';
      await api.post('/tickets', {
        userId,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: formData.subject,
        description: formData.description
      });

      setSuccess('Ticket created successfully!');
      setFormData({ name: '', email: '', phone: '', subject: '', description: '' });
      setEmailError(''); // Clear email error
      // Clear file input
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) {
        fileInput.value = '';
      }
      fetchTickets();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create ticket');
    } finally {
      setLoading(false);
    }
  };

  const handleEditTicket = async (e) => {
    e.preventDefault();
    if (!editFormData.name.trim() || !editFormData.email.trim() || !editFormData.phone.trim() || !editFormData.subject.trim() || !editFormData.description.trim()) {
      setError('Name, Email, Phone, Subject, and Description are required');
      return;
    }

    // Validate email
    const emailValidation = validateEmail(editFormData.email);
    if (emailValidation !== 'Valid email') {
      setError(emailValidation);
      return;
    }

    // Validate phone number format
    const phoneRegex = /^0\d{9}$/;
    const cleanPhone = editFormData.phone.replace(/\s/g, '');
    if (!phoneRegex.test(cleanPhone)) {
      setError('Phone number must start with 0 and contain exactly 10 digits');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Update ticket by creating a new ticket with updated details and deleting the old one
      // This is a workaround since we don't have a direct update endpoint
      const userId = localStorage.getItem('userId') || 'demo-user-id';
      
      // Create new ticket with updated details
      await api.post('/tickets', {
        userId,
        name: editFormData.name,
        email: editFormData.email,
        phone: editFormData.phone,
        subject: editFormData.subject,
        description: editFormData.description
      });

      // Delete the old ticket
      await api.delete(`/tickets/${editingTicket._id}`);

      setSuccess('Ticket updated successfully!');
      setEditingTicket(null);
      setEditFormData({ name: '', email: '', phone: '', subject: '', description: '' });
      fetchTickets();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update ticket');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTicket = async (ticketId) => {
    if (!window.confirm('Are you sure you want to delete this ticket? This action cannot be undone.')) {
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await api.delete(`/tickets/${ticketId}`);
      setSuccess('Ticket deleted successfully!');
      setExpandedTicket(null);
      fetchTickets();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete ticket');
    } finally {
      setLoading(false);
    }
  };

  const handleEditMessage = async (ticketId, messageId) => {
    if (!editMessage.text) return;

    try {
      const userId = localStorage.getItem('userId') || 'demo-user-id';
      await api.put(`/tickets/${ticketId}/message/${messageId}`, {
        senderId: userId,
        text: editMessage.text
      });

      setSuccess('Message updated successfully!');
      setEditMessage({});
      fetchTickets();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update message');
    }
  };

  const startEditTicket = (ticket) => {
    setEditingTicket(ticket);
    setEditFormData({
      name: ticket.name,
      email: ticket.email,
      phone: ticket.phone,
      subject: ticket.subject,
      description: ticket.description
    });
    setError('');
    setSuccess('');
    setEmailError(''); // Clear email error when switching to edit mode
  };

  const cancelEdit = () => {
    setEditingTicket(null);
    setEditFormData({ name: '', email: '', phone: '', subject: '', description: '' });
    setError('');
    setSuccess('');
    setEditEmailError(''); // Clear edit email error when canceling
  };

  const handleNameChange = (e, isEdit = false) => {
    const value = e.target.value;
    
    // Allow only letters and spaces, block numbers and special characters
    const lettersOnly = value.replace(/[^a-zA-Z\s]/g, '');
    
    // Update the form state
    if (isEdit) {
      setEditFormData(prev => ({ ...prev, name: lettersOnly }));
    } else {
      setFormData(prev => ({ ...prev, name: lettersOnly }));
    }
  };

  const handleEmailChange = (e, isEdit = false) => {
    const value = e.target.value.toLowerCase(); // Force lowercase
    
    // Real-time validation
    if (value && value.trim()) {
      const validation = validateEmail(value);
      if (isEdit) {
        setEditEmailError(validation === 'Valid email' ? '' : validation);
      } else {
        setEmailError(validation === 'Valid email' ? '' : validation);
      }
    } else {
      // Clear error if field is empty
      if (isEdit) {
        setEditEmailError('');
      } else {
        setEmailError('');
      }
    }
    
    if (isEdit) {
      setEditFormData({ ...editFormData, email: value });
    } else {
      setFormData({ ...formData, email: value });
    }
  };

  const handlePhoneChange = (e, isEdit = false) => {
    let value = e.target.value;
    
    // Remove all non-digit characters
    let digitsOnly = value.replace(/\D/g, '');
    
    // If empty and user types something that doesn't start with 0, don't allow it
    if (digitsOnly.length > 0 && !digitsOnly.startsWith('0')) {
      return; // Don't update the state, effectively blocking the input
    }
    
    // Limit to exactly 10 digits
    if (digitsOnly.length > 10) {
      digitsOnly = digitsOnly.slice(0, 10);
    }
    
    // Format with spaces: 0XX XXX XXX (10 digits total with spaces)
    let formatted = digitsOnly;
    if (digitsOnly.length > 3) {
      formatted = digitsOnly.slice(0, 3) + ' ' + digitsOnly.slice(3);
    }
    if (digitsOnly.length > 6) {
      formatted = formatted.slice(0, 7) + ' ' + digitsOnly.slice(6);
    }
    
    if (isEdit) {
      setEditFormData({ ...editFormData, phone: formatted });
    } else {
      setFormData({ ...formData, phone: formatted });
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'open': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-blue-100 text-blue-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white text-gray-800 min-h-screen">
      <Navbar />
      
      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <div className="text-left mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Support Tickets
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl">
              Get help from our support team. Create tickets and track their progress.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Create/Edit Ticket Form */}
            <div className="lg:col-span-1">
              <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  {editingTicket ? 'Edit Ticket' : 'Create New Ticket'}
                </h2>
                
                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    {error}
                  </div>
                )}
                
                {success && (
                  <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                    {success}
                  </div>
                )}

                <form onSubmit={editingTicket ? handleEditTicket : handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name *
                    </label>
                    <input
                      type="text"
                      value={editingTicket ? editFormData.name : formData.name}
                      onChange={(e) => handleNameChange(e, editingTicket)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Your full name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    {emailError && !editingTicket && (
                      <div className="mb-2 p-2 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-xs text-red-600 font-medium">{emailError}</p>
                      </div>
                    )}
                    {editEmailError && editingTicket && (
                      <div className="mb-2 p-2 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-xs text-red-600 font-medium">{editEmailError}</p>
                      </div>
                    )}
                    <input
                      type="email"
                      value={editingTicket ? editFormData.email : formData.email}
                      onChange={(e) => handleEmailChange(e, editingTicket)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="your@gmail.com"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">Example: username@gmail.com (lowercase, no spaces, Gmail only)</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      value={editingTicket ? editFormData.phone : formData.phone}
                      onChange={(e) => handlePhoneChange(e, editingTicket)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0XX XXX XXX"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">Format: 0XX XXX XXX (10 digits starting with 0)</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Subject *
                    </label>
                    <input
                      type="text"
                      value={editingTicket ? editFormData.subject : formData.subject}
                      onChange={(e) => editingTicket 
                        ? setEditFormData({ ...editFormData, subject: e.target.value })
                        : setFormData({ ...formData, subject: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Brief description of your issue"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description *
                    </label>
                    <textarea
                      value={editingTicket ? editFormData.description : formData.description}
                      onChange={(e) => editingTicket 
                        ? setEditFormData({ ...editFormData, description: e.target.value })
                        : setFormData({ ...formData, description: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={4}
                      placeholder="Provide more details about your issue"
                      required
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (editingTicket ? 'Updating...' : 'Creating...') : (editingTicket ? 'Update Ticket' : 'Create Ticket')}
                    </button>
                    
                    {editingTicket && (
                      <button
                        type="button"
                        onClick={cancelEdit}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>

            {/* Tickets List */}
            <div className="lg:col-span-2">
              <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                    <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Your Tickets ({tickets.length})
                  </h2>
                </div>

                {tickets.length === 0 ? (
                  <div className="p-16 text-center bg-gradient-to-br from-gray-50 to-blue-50">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                      <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">No tickets yet</h3>
                    <p className="text-gray-600 max-w-md mx-auto">Create your first ticket to get personalized support from our team. We're here to help!</p>
                  </div>
                ) : (
                  <div className="p-6 space-y-4 bg-gradient-to-br from-gray-50 to-blue-50">
                    {tickets.map((ticket) => (
                      <div key={ticket._id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100 overflow-hidden">
                        <div className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-4">
                                <div className="flex items-center gap-2">
                                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                                    </svg>
                                  </div>
                                  <h3 className="text-lg font-semibold text-gray-900">
                                    {ticket.subject}
                                  </h3>
                                </div>
                                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(ticket.status)} shadow-sm`}>
                                  {ticket.status}
                                </span>
                              </div>
                              
                              <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg p-4 mb-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                                  <div className="flex items-center">
                                    <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    <span className="font-medium text-gray-700">{ticket.name}</span>
                                  </div>
                                  <div className="flex items-center">
                                    <svg className="w-4 h-4 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    <span className="text-gray-600">{ticket.email}</span>
                                  </div>
                                  <div className="flex items-center">
                                    <svg className="w-4 h-4 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                    <span className="text-gray-600">{ticket.phone}</span>
                                  </div>
                                </div>
                              </div>
                              
                              {ticket.description && (
                                <div className="mb-4">
                                  <p className="text-gray-700 text-sm leading-relaxed bg-gray-50 rounded-lg p-3">
                                    {ticket.description}
                                  </p>
                                </div>
                              )}

                              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                  <div className="flex items-center">
                                    <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                                  </div>
                                  <div className="flex items-center">
                                    <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                    <span>{ticket.messages?.length || 0} messages</span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-col gap-2 ml-6">
                              <button
                                onClick={() => setExpandedTicket(expandedTicket === ticket._id ? null : ticket._id)}
                                className="flex items-center justify-center w-10 h-10 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors group"
                                title={expandedTicket === ticket._id ? 'Hide details' : 'View details'}
                              >
                                <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  {expandedTicket === ticket._id ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                  ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                  )}
                                </svg>
                              </button>
                              
                              <button
                                onClick={() => startEditTicket(ticket)}
                                className="flex items-center justify-center w-10 h-10 bg-green-50 hover:bg-green-100 text-green-600 rounded-lg transition-colors group"
                                title="Edit ticket"
                              >
                                <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </button>
                              
                              <button
                                onClick={() => handleDeleteTicket(ticket._id)}
                                disabled={loading}
                                className="flex items-center justify-center w-10 h-10 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors group disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Delete ticket"
                              >
                                <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </div>

                          {expandedTicket === ticket._id && (
                            <div className="mt-6 pt-6 border-t border-gray-200">
                              <div className="flex items-center mb-4">
                                <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                                <h4 className="text-lg font-semibold text-gray-900">Messages</h4>
                              </div>
                              <div className="space-y-3">
                                {ticket.messages?.map((message, index) => (
                                  <div key={index} className={`rounded-lg p-4 ${message.senderId ? 'bg-gradient-to-r from-blue-50 to-indigo-50 ml-8' : 'bg-gray-100 mr-8'}`}>
                                    <div className="flex items-center justify-between mb-2">
                                      <div className="flex items-center">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${message.senderId ? 'bg-blue-600' : 'bg-gray-400'}`}>
                                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            {message.senderId ? (
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            ) : (
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            )}
                                          </svg>
                                        </div>
                                        <span className="text-sm font-semibold text-gray-900">
                                          {message.senderId ? 'You' : 'Support Team'}
                                        </span>
                                      </div>
                                      <span className="text-xs text-gray-500">
                                        {new Date(message.createdAt).toLocaleString()}
                                      </span>
                                    </div>
                                    
                                    {editMessage[index] ? (
                                      <div className="space-y-3">
                                        <textarea
                                          value={editMessage[index].text}
                                          onChange={(e) => setEditMessage({ ...editMessage, [index]: { ...editMessage[index], text: e.target.value } })}
                                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                          rows={3}
                                        />
                                        <div className="flex gap-2">
                                          <button
                                            onClick={() => handleEditMessage(ticket._id, message._id)}
                                            className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                                          >
                                            Save
                                          </button>
                                          <button
                                            onClick={() => setEditMessage({ ...editMessage, [index]: null })}
                                            className="px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-400 transition-colors"
                                          >
                                            Cancel
                                          </button>
                                        </div>
                                      </div>
                                    ) : (
                                      <div>
                                        <p className="text-gray-700 leading-relaxed">{message.text}</p>
                                        {message.senderId && !message.autoReply && (
                                          <button
                                            onClick={() => setEditMessage({ ...editMessage, [index]: { text: message.text } })}
                                            className="text-xs text-blue-600 hover:text-blue-700 mt-2 flex items-center"
                                          >
                                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                            Edit
                                          </button>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
