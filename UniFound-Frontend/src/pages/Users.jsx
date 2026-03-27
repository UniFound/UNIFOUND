import React, { useState, useEffect } from 'react';
import { Users as UsersIcon, Search, Filter, Plus, Edit, Ban, Trash2, ChevronLeft, ChevronRight, ArrowLeft, Package, BarChart3, Clock, FileText, CheckCircle, Shield, AlertTriangle, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const UsersPage = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  
  const usersPerPage = 8;
  
  // API functions
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/admin-users');
      setUsers(response.data.users || response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch users');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const deleteUser = async (userId) => {
    try {
      await axios.delete(`http://localhost:5000/api/admin-users/${userId}`);
      setUsers(users.filter(user => user._id !== userId));
      setShowDeleteModal(false);
      setUserToDelete(null);
    } catch (err) {
      setError('Failed to delete user');
      console.error('Error deleting user:', err);
    }
  };
  
  const toggleUserStatus = async (userId) => {
    try {
      const user = users.find(u => u._id === userId);
      const newStatus = user.status === 'active' ? 'inactive' : 'active';
      
      await axios.put(`http://localhost:5000/api/admin-users/${userId}`, { status: newStatus });
      
      setUsers(users.map(u => 
        u._id === userId 
          ? { ...u, status: newStatus }
          : u
      ));
    } catch (err) {
      setError('Failed to update user status');
      console.error('Error updating user status:', err);
    }
  };
  
  // Load users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);
  
  // Stats calculations
  const totalUsers = users.length;
  const activeUsers = users.filter(user => user.status === 'active').length;
  const adminUsers = users.filter(user => user.role === 'admin').length;
  const suspendedUsers = users.filter(user => user.status === 'suspended').length;
  
  const handleDeleteUser = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };
  
  const confirmDelete = () => {
    if (userToDelete) {
      deleteUser(userToDelete._id);
    }
  };
  
  // Filter users
  const filteredUsers = users.filter(user => {
    const matchesSearch = (user.fullName || user.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = !roleFilter || user.role === roleFilter;
    const matchesStatus = !statusFilter || user.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });
  
  // Pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  
  const resetFilters = () => {
    setSearchTerm('');
    setRoleFilter('');
    setStatusFilter('');
    setCurrentPage(1);
  };
  
  const openCreateUser = () => {
    navigate('/admin/user-form');
  };
  
  const editUser = (userId) => {
    navigate('/admin/user-form', { state: { userId } });
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
            <a href="/admin" className="transition hover:text-blue-600">Dashboard</a>
            <a href="/admin/users" className="text-blue-600 font-medium transition hover:text-blue-700">Users</a>
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8">
        {/* Page Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">User Management</h1>
            <p className="text-gray-600">Manage system users and permissions</p>
          </div>
          <button
            onClick={openCreateUser}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Add New User</span>
          </button>
        </div>

        {/* User Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <UsersIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Total Users</p>
                <p className="text-2xl font-bold text-gray-800">{totalUsers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Active Users</p>
                <p className="text-2xl font-bold text-gray-800">{activeUsers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Shield className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Admin Users</p>
                <p className="text-2xl font-bold text-gray-800">{adminUsers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-red-100 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Suspended</p>
                <p className="text-2xl font-bold text-gray-800">{suspendedUsers}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Roles</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
              </select>
              <button
                onClick={resetFilters}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-lg text-gray-800 transition-colors"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading users...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="text-red-600 mb-4">
                  <AlertTriangle className="h-12 w-12 mx-auto" />
                </div>
                <p className="text-gray-600 mb-4">{error}</p>
                <button
                  onClick={fetchUsers}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Retry
                </button>
              </div>
            </div>
          ) : users.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="text-gray-400 mb-4">
                  <UsersIcon className="h-12 w-12 mx-auto" />
                </div>
                <p className="text-gray-600 mb-4">No users found</p>
                <button
                  onClick={openCreateUser}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add First User
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-gray-600 font-medium text-sm">Name</th>
                      <th className="text-left py-3 px-4 text-gray-600 font-medium text-sm">Email</th>
                      <th className="text-left py-3 px-4 text-gray-600 font-medium text-sm">Role</th>
                      <th className="text-left py-3 px-4 text-gray-600 font-medium text-sm">Status</th>
                      <th className="text-left py-3 px-4 text-gray-600 font-medium text-sm">Items Found</th>
                      <th className="text-left py-3 px-4 text-gray-600 font-medium text-sm">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentUsers.map((user) => (
                      <tr key={user._id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                              <User className="h-5 w-5 text-gray-600" />
                            </div>
                            <span className="text-gray-800">{user.fullName || user.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-600">{user.email}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            user.role === 'admin' 
                              ? 'bg-blue-100 text-blue-600' 
                              : user.role === 'manager'
                              ? 'bg-purple-100 text-purple-600'
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            user.status === 'active' 
                              ? 'bg-green-100 text-green-600' 
                              : 'bg-red-100 text-red-600'
                          }`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-600">{user.itemsFound || 0}</td>
                        <td className="py-3 px-4">
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => editUser(user._id)}
                              className="p-1 text-blue-600 hover:text-blue-700 transition-colors"
                              title="Edit"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => toggleUserStatus(user._id)}
                              className="p-1 text-yellow-600 hover:text-yellow-700 transition-colors"
                              title={user.status === 'active' ? 'Disable' : 'Enable'}
                            >
                              <Ban className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => handleDeleteUser(user)}
                              className="p-1 text-red-600 hover:text-red-700 transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination */}
              <div className="flex justify-between items-center p-4 border-t border-gray-200">
                <div className="text-gray-600 text-sm">
                  Showing {indexOfFirstUser + 1} to {Math.min(indexOfLastUser, filteredUsers.length)} of {filteredUsers.length} users
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-2 bg-white hover:bg-gray-50 border border-gray-300 rounded-lg text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  {[...Array(totalPages)].map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentPage(index + 1)}
                      className={`w-10 h-10 rounded-lg ${
                        currentPage === index + 1
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-gray-800 hover:bg-gray-50 border border-gray-300'
                      } transition-colors`}
                    >
                      {index + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="p-2 bg-white hover:bg-gray-50 border border-gray-300 rounded-lg text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white border border-gray-200 rounded-xl p-6 max-w-md w-full mx-4 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-gray-800 text-lg font-semibold flex items-center space-x-2">
                <Trash2 className="h-5 w-5 text-red-600" />
                <span>Confirm Delete</span>
              </h3>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            <div className="mb-6">
              <p className="text-gray-600 mb-2">Are you sure you want to delete this user? This action cannot be undone.</p>
              <p className="text-gray-600">
                <strong>User: </strong>
                <span className="text-gray-800">{userToDelete?.name}</span>
              </p>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white transition-colors"
              >
                Delete User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersPage;
