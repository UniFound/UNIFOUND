import React, { useState, useEffect } from 'react';
import { Users, Box, CheckCircle, TrendingUp, Search, Filter, Plus, Edit, Ban, Trash2, ChevronLeft, ChevronRight, Clock, FileText, Package } from 'lucide-react';

const AdminDashboard = () => {
  const [users] = useState([
    { id: 1, name: 'John Doe', email: 'john.doe@university.edu', role: 'admin', status: 'active', itemsFound: 12, joinedDate: '2024-01-15' },
    { id: 2, name: 'Jane Smith', email: 'jane.smith@university.edu', role: 'user', status: 'active', itemsFound: 8, joinedDate: '2024-02-20' },
    { id: 3, name: 'Mike Johnson', email: 'mike.j@university.edu', role: 'user', status: 'suspended', itemsFound: 5, joinedDate: '2024-03-10' },
    { id: 4, name: 'Sarah Wilson', email: 'sarah.w@university.edu', role: 'user', status: 'active', itemsFound: 15, joinedDate: '2024-01-20' },
    { id: 5, name: 'Tom Brown', email: 'tom.brown@university.edu', role: 'admin', status: 'active', itemsFound: 20, joinedDate: '2023-12-10' }
  ]);
  
  // Stats
  const totalUsers = users.length;
  const activeUsers = users.filter(user => user.status === 'active').length;
  const totalItems = users.reduce((sum, user) => sum + user.itemsFound, 0);
  const resolvedCases = Math.floor(totalItems * 0.7); // Mock calculation
  
  // Chart data (mock)
  const monthlyData = [
    { month: 'Jan', lost: 12, found: 8 },
    { month: 'Feb', lost: 19, found: 15 },
    { month: 'Mar', lost: 15, found: 18 },
    { month: 'Apr', lost: 25, found: 20 },
    { month: 'May', lost: 22, found: 25 },
    { month: 'Jun', lost: 30, found: 28 }
  ];
  
  const categoryData = [
    { name: 'Electronics', value: 30, color: 'bg-blue-500' },
    { name: 'Clothing', value: 25, color: 'bg-purple-500' },
    { name: 'Books', value: 20, color: 'bg-green-500' },
    { name: 'Accessories', value: 15, color: 'bg-yellow-500' },
    { name: 'Other', value: 10, color: 'bg-red-500' }
  ];
  
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8">
        {/* Page Header */}
        <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">System Intelligence & Administration Control Center</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm border-l-4 border-l-blue-500 hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">TOTAL</p>
                <p className="text-2xl font-bold text-gray-800">{totalUsers.toLocaleString()}</p>
                <p className="text-gray-500 text-sm">Registered Users</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm border-l-4 border-l-purple-500 hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Box className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">ITEMS</p>
                <p className="text-2xl font-bold text-gray-800">{totalItems}</p>
                <p className="text-gray-500 text-sm">Lost + Found Posts</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm border-l-4 border-l-green-500 hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">SUCCESS</p>
                <p className="text-2xl font-bold text-gray-800">{resolvedCases}</p>
                <p className="text-gray-500 text-sm">Resolved Cases</p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-gray-800 text-lg font-semibold">Monthly Activity</h3>
              <div className="flex space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded"></div>
                  <span className="text-gray-600 text-sm">Lost Items</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded"></div>
                  <span className="text-gray-600 text-sm">Found Items</span>
                </div>
              </div>
            </div>
            <div className="h-64 flex items-end justify-between space-x-2">
              {monthlyData.map((data, index) => (
                <div key={index} className="flex-1 flex flex-col items-center space-y-2">
                  <div className="w-full flex flex-col space-y-1">
                    <div 
                      className="bg-blue-500 rounded-t"
                      style={{ height: `${(data.lost / 30) * 100}%` }}
                    ></div>
                    <div 
                      className="bg-green-500 rounded-b"
                      style={{ height: `${(data.found / 30) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-gray-600 text-xs">{data.month}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-gray-800 text-lg font-semibold mb-4">Category Distribution</h3>
            <div className="h-64 flex items-center justify-center">
              <div className="relative w-48 h-48">
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-500 via-purple-500 to-green-500 opacity-80"></div>
                <div className="absolute inset-4 rounded-full bg-white flex items-center justify-center">
                  <span className="text-gray-800 text-2xl font-bold">100%</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {categoryData.map((category, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded ${category.color}`}></div>
                  <span className="text-gray-600 text-sm">{category.name}: {category.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mb-8">
          <h3 className="text-gray-800 text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a href="/admin/users" className="flex items-center space-x-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
              <Users className="h-8 w-8 text-blue-600" />
              <div>
                <p className="font-medium text-gray-800">Manage Users</p>
                <p className="text-sm text-gray-600">Add, edit, or remove users</p>
              </div>
            </a>
            <a href="/admin/categories" className="flex items-center space-x-3 p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
              <Package className="h-8 w-8 text-purple-600" />
              <div>
                <p className="font-medium text-gray-800">Categories</p>
                <p className="text-sm text-gray-600">Manage item categories</p>
              </div>
            </a>
            <a href="/admin/reports" className="flex items-center space-x-3 p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
              <FileText className="h-8 w-8 text-green-600" />
              <div>
                <p className="font-medium text-gray-800">Generate Reports</p>
                <p className="text-sm text-gray-600">View system analytics</p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
