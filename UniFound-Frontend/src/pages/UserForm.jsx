import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, X, Users, Mail, Lock, Shield, ToggleLeft } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import AdminLayout from "../pages/AdminLayout";

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
    
    // Validation for full name field - only allow letters and spaces
    if (name === 'fullName') {
      const lettersOnly = value.replace(/[^a-zA-Z\s]/g, '');
      setFormData(prev => ({
        ...prev,
        [name]: lettersOnly
      }));
      
      // Clear error for this field when user starts typing
      if (errors[name]) {
        setErrors(prev => ({
          ...prev,
          [name]: ''
        }));
      }
    } else {
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
    <AdminLayout>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Page Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="font-black text-slate-900 text-3xl tracking-tight">
              {editingUserId ? 'Edit User' : 'Add New User'}
            </h1>
            <p className="text-[10px] font-black text-slate-400 mt-1 uppercase tracking-[0.2em]">
              {editingUserId ? 'Update user information and permissions' : 'Create a new user account with appropriate permissions'}
            </p>
          </div>
          <button
            onClick={goBack}
            className="bg-slate-100 hover:bg-slate-200 text-slate-800 px-6 py-3 rounded-2xl flex items-center space-x-2 transition-colors font-black text-xs uppercase tracking-widest"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Users</span>
          </button>
        </div>

        {/* User Form */}
        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100/50">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div>
                <label htmlFor="fullName" className="block text-[10px] font-black text-slate-600 uppercase tracking-[0.15em] mb-2">
                  Full Name <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <Users className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className={`w-full pl-12 pr-4 py-3 bg-slate-50/50 border rounded-2xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium ${
                      errors.fullName ? 'border-rose-300' : 'border-slate-100'
                    }`}
                    placeholder="Enter full name"
                  />
                </div>
                {errors.fullName && (
                  <p className="mt-1 text-[10px] font-black text-rose-600 uppercase tracking-[0.1em]">{errors.fullName}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-[10px] font-black text-slate-600 uppercase tracking-[0.15em] mb-2">
                  Email Address <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full pl-12 pr-4 py-3 bg-slate-50/50 border rounded-2xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium ${
                      errors.email ? 'border-rose-300' : 'border-slate-100'
                    }`}
                    placeholder="Enter email address"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-[10px] font-black text-rose-600 uppercase tracking-[0.1em]">{errors.email}</p>
                )}
              </div>

              {/* Password (only for create) */}
              {!editingUserId && (
                <div>
                  <label htmlFor="password" className="block text-[10px] font-black text-slate-600 uppercase tracking-[0.15em] mb-2">
                    Password <span className="text-rose-600">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`w-full pl-12 pr-4 py-3 bg-slate-50/50 border rounded-2xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium ${
                        errors.password ? 'border-rose-300' : 'border-slate-100'
                      }`}
                      placeholder="Enter password"
                    />
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-[10px] font-black text-rose-600 uppercase tracking-[0.1em]">{errors.password}</p>
                  )}
                </div>
              )}

              {/* Role */}
              <div>
                <label htmlFor="role" className="block text-[10px] font-black text-slate-600 uppercase tracking-[0.15em] mb-2">
                  Role <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <Shield className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className={`w-full pl-12 pr-4 py-3 bg-slate-50/50 border rounded-2xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none font-medium ${
                      errors.role ? 'border-rose-300' : 'border-slate-100'
                    }`}
                  >
                    <option value="" className="bg-white">Select Role</option>
                    <option value="admin" className="bg-white">Admin</option>
                    <option value="user" className="bg-white">User</option>
                  </select>
                </div>
                {errors.role && (
                  <p className="mt-1 text-[10px] font-black text-rose-600 uppercase tracking-[0.1em]">{errors.role}</p>
                )}
              </div>

              {/* Status */}
              <div>
                <label htmlFor="status" className="block text-[10px] font-black text-slate-600 uppercase tracking-[0.15em] mb-2">
                  Status <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <ToggleLeft className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className={`w-full pl-12 pr-4 py-3 bg-slate-50/50 border rounded-2xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none font-medium ${
                      errors.status ? 'border-rose-300' : 'border-slate-100'
                    }`}
                  >
                    <option value="" className="bg-white">Select Status</option>
                    <option value="active" className="bg-white">Active</option>
                    <option value="inactive" className="bg-white">Inactive</option>
                  </select>
                </div>
                {errors.status && (
                  <p className="mt-1 text-[10px] font-black text-rose-600 uppercase tracking-[0.1em]">{errors.status}</p>
                )}
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-slate-100">
              <button
                type="button"
                onClick={goBack}
                className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-2xl flex items-center space-x-2 transition-colors font-black text-xs uppercase tracking-widest"
              >
                <X className="h-4 w-4" />
                <span>Cancel</span>
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl flex items-center space-x-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-black text-xs uppercase tracking-widest shadow-lg shadow-blue-200"
              >
                <Save className="h-4 w-4" />
                <span>{isSubmitting ? 'Saving...' : (editingUserId ? 'Update User' : 'Create User')}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Additional Information */}
        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100/50">
          <h3 className="font-black text-slate-900 text-lg tracking-tight mb-6">Role Permissions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-50/50 rounded-2xl p-6 border border-slate-100/50">
              <h4 className="font-black text-blue-600 text-sm uppercase tracking-[0.15em] mb-4">Admin</h4>
              <ul className="text-slate-600 text-sm space-y-2 font-medium">
                <li>• Full system access</li>
                <li>• Manage all users</li>
                <li>• View analytics and reports</li>
                <li>• System configuration</li>
              </ul>
            </div>
            <div className="bg-slate-50/50 rounded-2xl p-6 border border-slate-100/50">
              <h4 className="font-black text-purple-600 text-sm uppercase tracking-[0.15em] mb-4">User</h4>
              <ul className="text-slate-600 text-sm space-y-2 font-medium">
                <li>• Post lost & found items</li>
                <li>• View own items</li>
                <li>• Claim found items</li>
                <li>• Basic dashboard access</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default UserForm;
