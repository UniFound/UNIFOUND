import React, { useState, useEffect } from 'react';
import { Users as UsersIcon, Search, Filter, Plus, Edit, Ban, Trash2, ChevronLeft, ChevronRight, ArrowLeft, Package, BarChart3, Clock, FileText, CheckCircle, Shield, AlertTriangle, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminLayout from "../pages/AdminLayout";

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
    <AdminLayout>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Page Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="font-black text-slate-900 text-3xl tracking-tight">User Management</h1>
            <p className="text-[10px] font-black text-slate-400 mt-1 uppercase tracking-[0.2em]">Manage System Users</p>
          </div>
          <button
            onClick={openCreateUser}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl flex items-center space-x-2 transition-colors shadow-lg shadow-blue-200"
          >
            <Plus className="h-4 w-4" />
            <span className="font-black text-xs uppercase tracking-widest">Add New User</span>
          </button>
        </div>

        {/* User Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            icon={<UsersIcon size={20} />} 
            color="blue"
            label="Total Users" 
            value={totalUsers.toString()} 
            trend="+12%" 
            isPositive={true}
          />
          <StatCard 
            icon={<CheckCircle size={20} />} 
            color="emerald"
            label="Active Users" 
            value={activeUsers.toString()} 
            trend="+5.4%" 
            isPositive={true}
          />
          <StatCard 
            icon={<Shield size={20} />} 
            color="purple"
            label="Admin Users" 
            value={adminUsers.toString()} 
            trend="+2.1%" 
            isPositive={true}
          />
          <StatCard 
            icon={<AlertTriangle size={20} />} 
            color="rose"
            label="Suspended" 
            value={suspendedUsers.toString()} 
            trend="-2%" 
            isPositive={false}
          />
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100/50">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-50/50 border border-slate-100 rounded-2xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-4 py-3 bg-slate-50/50 border border-slate-100 rounded-2xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium"
              >
                <option value="">All Roles</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 bg-slate-50/50 border border-slate-100 rounded-2xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
              </select>
              <button
                onClick={resetFilters}
                className="px-6 py-3 bg-slate-100 hover:bg-slate-200 border border-slate-100 rounded-2xl text-slate-800 transition-colors font-black text-xs uppercase tracking-widest"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-[32px] shadow-sm border border-slate-100/50 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-slate-600 font-black">Loading users...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="text-rose-600 mb-4">
                  <AlertTriangle className="h-12 w-12 mx-auto" />
                </div>
                <p className="text-slate-600 mb-4 font-black">{error}</p>
                <button
                  onClick={fetchUsers}
                  className="px-6 py-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-colors font-black text-xs uppercase tracking-widest"
                >
                  Retry
                </button>
              </div>
            </div>
          ) : users.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="text-slate-400 mb-4">
                  <UsersIcon className="h-12 w-12 mx-auto" />
                </div>
                <p className="text-slate-600 mb-4 font-black">No users found</p>
                <button
                  onClick={openCreateUser}
                  className="px-6 py-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-colors font-black text-xs uppercase tracking-widest"
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
                    <tr className="bg-slate-50/50 border-b border-slate-100">
                      <th className="text-left py-4 px-6 text-slate-600 font-black text-[10px] uppercase tracking-[0.15em]">Name</th>
                      <th className="text-left py-4 px-6 text-slate-600 font-black text-[10px] uppercase tracking-[0.15em]">Email</th>
                      <th className="text-left py-4 px-6 text-slate-600 font-black text-[10px] uppercase tracking-[0.15em]">Role</th>
                      <th className="text-left py-4 px-6 text-slate-600 font-black text-[10px] uppercase tracking-[0.15em]">Status</th>
                      <th className="text-left py-4 px-6 text-slate-600 font-black text-[10px] uppercase tracking-[0.15em]">Items Found</th>
                      <th className="text-left py-4 px-6 text-slate-600 font-black text-[10px] uppercase tracking-[0.15em]">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentUsers.map((user) => (
                      <tr key={user._id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                              <User className="h-5 w-5 text-slate-600" />
                            </div>
                            <span className="text-slate-800 font-medium">{user.fullName || user.name}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-slate-600">{user.email}</td>
                        <td className="py-4 px-6">
                          <span className={`px-3 py-1 text-[10px] font-black rounded-full ${
                            user.role === 'admin' 
                              ? 'bg-blue-50 text-blue-600' 
                              : user.role === 'manager'
                              ? 'bg-purple-50 text-purple-600'
                              : 'bg-slate-50 text-slate-600'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`px-3 py-1 text-[10px] font-black rounded-full ${
                            user.status === 'active' 
                              ? 'bg-emerald-50 text-emerald-600' 
                              : 'bg-rose-50 text-rose-600'
                          }`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-slate-600">{user.itemsFound || 0}</td>
                        <td className="py-4 px-6">
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => editUser(user._id)}
                              className="p-2 text-blue-600 hover:text-blue-700 transition-colors"
                              title="Edit"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => toggleUserStatus(user._id)}
                              className="p-2 text-yellow-600 hover:text-yellow-700 transition-colors"
                              title={user.status === 'active' ? 'Disable' : 'Enable'}
                            >
                              <Ban className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => handleDeleteUser(user)}
                              className="p-2 text-rose-600 hover:text-rose-700 transition-colors"
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
              <div className="flex justify-between items-center p-6 border-t border-slate-100">
                <div className="text-slate-600 text-sm font-medium">
                  Showing {indexOfFirstUser + 1} to {Math.min(indexOfLastUser, filteredUsers.length)} of {filteredUsers.length} users
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-2 bg-white hover:bg-slate-50 border border-slate-100 rounded-xl text-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  {[...Array(totalPages)].map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentPage(index + 1)}
                      className={`w-10 h-10 rounded-xl ${
                        currentPage === index + 1
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-slate-800 hover:bg-slate-50 border border-slate-100'
                      } transition-colors font-black text-sm`}
                    >
                      {index + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="p-2 bg-white hover:bg-slate-50 border border-slate-100 rounded-xl text-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
          <div className="bg-white border border-slate-100 rounded-[32px] p-8 max-w-md w-full mx-4 shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-slate-800 text-lg font-black flex items-center space-x-2">
                <Trash2 className="h-5 w-5 text-rose-600" />
                <span>Confirm Delete</span>
              </h3>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ×
              </button>
            </div>
            <div className="mb-6">
              <p className="text-slate-600 mb-2">Are you sure you want to delete this user? This action cannot be undone.</p>
              <p className="text-slate-600">
                <strong>User: </strong>
                <span className="text-slate-800">{userToDelete?.name}</span>
              </p>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-6 py-3 bg-slate-100 hover:bg-slate-200 rounded-2xl text-slate-800 transition-colors font-black text-xs uppercase tracking-widest"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-6 py-3 bg-rose-600 hover:bg-rose-700 rounded-2xl text-white transition-colors font-black text-xs uppercase tracking-widest"
              >
                Delete User
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

function StatCard({ icon, color, label, value, trend, isPositive }) {
  // Color configuration to remove excessive whiteness
  const theme = {
    blue: "bg-blue-50/50 border-blue-100 text-blue-600 hover:border-blue-300",
    emerald: "bg-emerald-50/50 border-emerald-100 text-emerald-600 hover:border-emerald-300",
    purple: "bg-purple-50/50 border-purple-100 text-purple-600 hover:border-purple-300",
    rose: "bg-rose-50/50 border-rose-100 text-rose-600 hover:border-rose-300",
  }[color];

  return (
    <div className={`p-6 rounded-[30px] border transition-all duration-300 group ${theme}`}>
      <div className="flex items-center justify-between mb-5">
        <div className={`p-3 rounded-2xl bg-white shadow-sm group-hover:scale-110 transition-transform`}>
          {icon}
        </div>
        <div className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-black text-[10px] bg-white shadow-sm ${
          isPositive ? 'text-emerald-600' : 'text-rose-600'
        }`}>
          {isPositive ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
          {trend}
        </div>
      </div>
      <div>
        <p className="text-[10px] font-black opacity-60 uppercase tracking-[0.15em] mb-1">{label}</p>
        <p className="text-2xl font-black text-slate-900 tracking-tighter">{value}</p>
      </div>
    </div>
  );
}

export default UsersPage;
