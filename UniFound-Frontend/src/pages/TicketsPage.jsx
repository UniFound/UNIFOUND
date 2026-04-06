import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../api/axios';

export default function TicketsPage() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    description: ''
  });
  const [emailError, setEmailError] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchTickets();
    // Auto-fill user data
    const userData = JSON.parse(localStorage.getItem('user')) || {};
    if (userData.firstName || userData.lastName || userData.email) {
      const fullName = userData.firstName && userData.lastName 
        ? `${userData.firstName} ${userData.lastName}` 
        : userData.name || '';
      setFormData(prev => ({
        ...prev,
        name: fullName,
        email: userData.email || ''
      }));
    }
  }, []);

  const fetchTickets = async () => {
    try {
      const userId = localStorage.getItem('userId') || 'demo-user-id';
      const response = await api.get(`/tickets/user/${userId}`);
      setTickets(response.data);
    } catch (err) {
      setError('Failed to fetch tickets');
      console.error('Error fetching tickets:', err);
    }
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
    
    // Remove common phone number formatting characters (spaces, dashes, parentheses)
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
      return { isValid: false, error: 'Phone number cannot consist of same digit repeated' };
    }
    
    return { isValid: true, error: '' };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setEmailError('');

    // Validate all fields
    const nameValidation = validateName(formData.name);
    const emailValidation = validateEmail(formData.email);
    const phoneValidation = validatePhone(formData.phone);

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

    // Validate required fields
    if (!formData.subject?.trim()) {
      setError('Subject is required');
      return;
    }

    if (!formData.description?.trim()) {
      setError('Description is required');
      return;
    }

    try {
      setLoading(true);
      const userId = localStorage.getItem('userId') || 'demo-user-id';
      
      const response = await api.post('/tickets', {
        userId,
        ...formData
      });

      setSuccess('Ticket created successfully!');
      const userData = JSON.parse(localStorage.getItem('user')) || {};
      const fullName = userData.firstName && userData.lastName 
        ? `${userData.firstName} ${userData.lastName}` 
        : userData.name || '';
      setFormData({
        name: fullName,
        email: userData.email || '',
        phone: '',
        subject: '',
        description: ''
      });
      setShowForm(false);
      fetchTickets();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create ticket');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'email') {
      setEmailError('');
      setError('');
    } else if (name === 'name') {
      // Allow only English letters and spaces
      const lettersOnly = value.replace(/[^a-zA-Z\s]/g, '');
      setFormData(prev => ({ ...prev, [name]: lettersOnly }));
      setError(''); // Clear general error on input
    } else if (name === 'phone') {
      // Format phone number as 071 554 6714
      let phoneValue = value.replace(/\D/g, ''); // Remove non-digits
      
      // If first digit is not 0 and field is not empty, don't allow it
      if (phoneValue.length === 1 && phoneValue !== '0') {
        phoneValue = ''; // Clear field if first digit is not 0
      }
      
      // Auto-format as user types
      if (phoneValue.length > 0) {
        let formatted = phoneValue;
        
        // Format: 071 554 6714
        if (phoneValue.length <= 3) {
          formatted = phoneValue; // 071
        } else if (phoneValue.length <= 6) {
          formatted = phoneValue.slice(0, 3) + ' ' + phoneValue.slice(3); // 071 554
        } else {
          formatted = phoneValue.slice(0, 3) + ' ' + phoneValue.slice(3, 6) + ' ' + phoneValue.slice(6); // 071 554 6714
        }
        
        phoneValue = formatted;
      }
      
      // Limit to 10 digits (excluding spaces)
      const cleanPhoneValue = phoneValue.replace(/\s/g, '');
      if (cleanPhoneValue.length > 10) {
        phoneValue = phoneValue.replace(/\s/g, '').substring(0, 10);
        // Reformat if truncated
        if (phoneValue.length > 3) {
          phoneValue = phoneValue.slice(0, 3) + ' ' + phoneValue.slice(3, 6) + ' ' + phoneValue.slice(6);
        }
      }
      
      setFormData(prev => ({ ...prev, [name]: phoneValue }));
      setError(''); // Clear general error on input
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
      setError(''); // Clear general error on input
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

  return (
    <div className="bg-white text-gray-800 min-h-screen">
      <Navbar />
      
      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Tickets</h1>
            <p className="text-lg text-gray-600">View and manage your support tickets</p>
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

          {/* Create Ticket Button */}
          <div className="mb-8">
            <button
              onClick={() => setShowForm(!showForm)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {showForm ? 'Cancel' : 'Create New Ticket'}
            </button>
          </div>

          {/* Create Ticket Form */}
          {showForm && (
            <div className="mb-8 bg-white border border-gray-200 rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Create New Ticket</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-blue-50 ${
                        formData.name && !validateName(formData.name).isValid ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                      }`}
                      placeholder="Enter your full name (English letters only)"
                      maxLength={50}
                      required
                    />
                    {formData.name && !validateName(formData.name).isValid && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {validateName(formData.name).error}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-blue-50 ${
                        formData.email && !validateEmail(formData.email).isValid ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                      }`}
                      placeholder="your.email@gmail.com"
                      required
                    />
                    {emailError && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {emailError}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-blue-50 ${
                        formData.phone && !validatePhone(formData.phone).isValid ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                      }`}
                      placeholder="071 554 6714"
                      maxLength={13}
                      required
                    />
                    {formData.phone && !validatePhone(formData.phone).isValid && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {validatePhone(formData.phone).error}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-blue-50"
                      placeholder="Brief description of your issue"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-blue-50"
                    placeholder="Provide detailed information about your issue"
                    required
                  />
                </div>

                <div className="flex items-center justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Creating...' : 'Create Ticket'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Tickets Table */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl shadow-sm">
            <div className="p-6">
              <div className="flex items-center mb-6">
                <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h2 className="text-xl font-semibold text-gray-900">Your Tickets ({tickets.length})</h2>
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
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ticket ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Subject
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Created Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Created Time
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {tickets.map((ticket) => (
                        <tr 
                          key={ticket._id} 
                          onClick={() => navigate(`/ticket/${ticket.ticketId}`)}
                          className="hover:bg-gray-50 cursor-pointer transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                            {ticket.ticketId}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                            {ticket.subject}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(ticket.status)}`}>
                              {ticket.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(ticket.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(ticket.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              
              {tickets.length > 0 && (
                <div className="mt-4 text-sm text-gray-500 text-center">
                  Click on any ticket row to view full details
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
