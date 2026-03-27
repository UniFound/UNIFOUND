import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, X, Users, Mail, Lock, Shield, ToggleLeft } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const UserForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const editingUserId = location.state?.userId;
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    role: '',
    status: 'active'
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if (editingUserId) {
      fetchUser();
    }
  }, [editingUserId]);
  
  const fetchUser = async () => {
    try {
      setLoading(true);
      const users = await axios.get('http://localhost:5000/api/admin-users');
      const user = users.data.users?.find(u => u._id === editingUserId) || users.data?.find(u => u._id === editingUserId);
      if (user) {
        setFormData({
          fullName: user.fullName || user.name,
          email: user.email,
          password: '',
          role: user.role,
          status: user.status
        });
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const validateForm = async () => {
    const newErrors = {};
    
    // Validate full name
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters';
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    } else {
      // Check if email already exists (for new users)
      try {
        const users = await axios.get('http://localhost:5000/api/admin-users');
        const existingUser = users.data.users?.find(u => u.email === formData.email && u._id !== editingUserId) || users.data?.find(u => u.email === formData.email && u._id !== editingUserId);
        if (existingUser) {
          newErrors.email = 'Email already exists';
        }
      } catch (error) {
        console.error('Error checking email:', error);
      }
    }
    
    // Validate password (only for new users)
    if (!editingUserId) {
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      }
    }
    
    // Validate role
    if (!formData.role) {
      newErrors.role = 'Please select a role';
    }
    
    // Validate status
    if (!formData.status) {
      newErrors.status = 'Please select a status';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const isValid = await validateForm();
    if (!isValid) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      if (editingUserId) {
        // Update existing user
        await axios.put(`http://localhost:5000/api/admin-users/${editingUserId}`, {
          fullName: formData.fullName,
          email: formData.email,
          role: formData.role,
          status: formData.status
        });
      } else {
        // Create new user
        await axios.post('http://localhost:5000/api/admin-users', {
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
          role: formData.role,
          status: formData.status
        });
      }
      
      // Show success message
      const message = editingUserId ? 'User updated successfully!' : 'User created successfully!';
      
      // Navigate back to admin dashboard
      setTimeout(() => {
        navigate('/admin/users', { state: { notification: message } });
      }, 500);
      
    } catch (error) {
      console.error('Error saving user:', error);
      // You could show an error message here
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const goBack = () => {
    navigate('/admin/users');
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <div className="w-full flex justify-center fixed top-4 z-50">
        <div className="w-[92%] max-w-7xl flex items-center justify-between px-6 py-3
          bg-white/70 backdrop-blur-xl border border-white/40
          rounded-full shadow-lg">

          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
              U
            </div>
            <span className="font-semibold text-gray-800">
              UniFound
            </span>
            <span className="ml-3 px-3 py-1 bg-blue-100 text-blue-600 text-xs rounded-full">Admin Control</span>
          </div>

          {/* Nav */}
          <div className="hidden lg:flex items-center gap-6 text-sm text-gray-600">
            <a href="/admin" className="text-blue-600 font-medium transition hover:text-blue-700">Dashboard</a>
            <a href="/admin/users" className="transition hover:text-blue-600">Users</a>
            <a href="/admin/categories" className="transition hover:text-blue-600">Categories</a>
            <a href="/admin/analytics" className="transition hover:text-blue-600">Analytics</a>
            <a href="/admin/audit" className="transition hover:text-blue-600">Audit Logs</a>
            <a href="/admin/reports" className="transition hover:text-blue-600">Reports</a>
          </div>

          {/* Right */}
          <div className="flex items-center gap-3">
            <button className="text-sm text-gray-600 hover:text-blue-600">
              Sign out
            </button>
            <button className="bg-blue-600 text-white px-4 py-1.5 rounded-full text-sm shadow hover:bg-blue-700 transition">
              Admin →
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8">
        {/* Page Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {editingUserId ? 'Edit User' : 'Add New User'}
            </h1>
            <p className="text-gray-600">
              {editingUserId ? 'Update user information and permissions' : 'Create a new user account with appropriate permissions'}
            </p>
          </div>
          <button
            onClick={goBack}
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Users</span>
          </button>
        </div>

        {/* User Form */}
        <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 bg-white border rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.fullName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter full name"
                  />
                </div>
                {errors.fullName && (
                  <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 bg-white border rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter email address"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              {/* Password (only for create) */}
              {!editingUserId && (
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password <span className="text-red-600">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-3 bg-white border rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.password ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter password"
                    />
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                  )}
                </div>
              )}

              {/* Role */}
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                  Role <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 bg-white border rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none ${
                      errors.role ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="" className="bg-white">Select Role</option>
                    <option value="admin" className="bg-white">Admin</option>
                    <option value="user" className="bg-white">User</option>
                  </select>
                </div>
                {errors.role && (
                  <p className="mt-1 text-sm text-red-600">{errors.role}</p>
                )}
              </div>

              {/* Status */}
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                  Status <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <ToggleLeft className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 bg-white border rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none ${
                      errors.status ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="" className="bg-white">Select Status</option>
                    <option value="active" className="bg-white">Active</option>
                    <option value="inactive" className="bg-white">Inactive</option>
                  </select>
                </div>
                {errors.status && (
                  <p className="mt-1 text-sm text-red-600">{errors.status}</p>
                )}
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={goBack}
                className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <X className="h-4 w-4" />
                <span>Cancel</span>
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center space-x-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="h-4 w-4" />
                <span>{isSubmitting ? 'Saving...' : (editingUserId ? 'Update User' : 'Create User')}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Additional Information */}
        <div className="mt-6 bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h3 className="text-gray-800 text-lg font-semibold mb-4">Role Permissions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-blue-600 font-medium mb-2">Admin</h4>
              <ul className="text-gray-600 text-sm space-y-1">
                <li>• Full system access</li>
                <li>• Manage all users</li>
                <li>• View analytics and reports</li>
                <li>• System configuration</li>
              </ul>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-purple-600 font-medium mb-2">User</h4>
              <ul className="text-gray-600 text-sm space-y-1">
                <li>• Post lost & found items</li>
                <li>• View own items</li>
                <li>• Claim found items</li>
                <li>• Basic dashboard access</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserForm;
