import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus, Edit, Trash2, Package, MapPin, Calendar, CheckCircle, Clock, AlertTriangle, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminLayout from "../pages/AdminLayout";

const ItemsPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('found');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  // Mock data for demonstration
  const mockFoundItems = [
    {
      _id: '1',
      itemId: 'FI-102',
      name: 'Black Laptop Charger',
      category: 'Electronics',
      location: 'Library Floor 2',
      date: '2024-03-25',
      status: 'IN STORAGE',
      description: 'Dell laptop charger with 65W output'
    },
    {
      _id: '2',
      itemId: 'FI-105',
      name: 'Nike Water Bottle',
      category: 'Personal',
      location: 'Main Gym',
      date: '2024-03-24',
      status: 'CLAIMED',
      description: 'Blue Nike water bottle, 750ml'
    },
    {
      _id: '3',
      itemId: 'FI-108',
      name: 'Wireless Headphones',
      category: 'Electronics',
      location: 'Student Center',
      date: '2024-03-23',
      status: 'PENDING VERIFICATION',
      description: 'Sony WH-1000XM4 wireless headphones'
    }
  ];

  const mockLostItems = [
    {
      _id: '4',
      itemId: 'LI-201',
      name: 'Silver Watch',
      category: 'Accessories',
      location: 'Cafeteria',
      date: '2024-03-26',
      status: 'SEARCHING',
      description: 'Silver analog watch with leather strap'
    },
    {
      _id: '5',
      itemId: 'LI-203',
      name: 'Student ID Card',
      category: 'Documents',
      location: 'Science Building',
      date: '2024-03-25',
      status: 'FOUND',
      description: 'Student ID for John Doe'
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setItems(activeTab === 'found' ? mockFoundItems : mockLostItems);
      setLoading(false);
    }, 1000);
  }, [activeTab]);

  const handleDeleteItem = (item) => {
    setItemToDelete(item);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    setItems(items.filter(item => item._id !== itemToDelete._id));
    setShowDeleteModal(false);
    setItemToDelete(null);
  };

  const getStatusColor = (status) => {
    const statusColors = {
      'IN STORAGE': 'bg-blue-50 text-blue-600',
      'CLAIMED': 'bg-emerald-50 text-emerald-600',
      'PENDING VERIFICATION': 'bg-orange-50 text-orange-600',
      'SEARCHING': 'bg-rose-50 text-rose-600',
      'FOUND': 'bg-purple-50 text-purple-600'
    };
    return statusColors[status] || 'bg-slate-50 text-slate-600';
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.itemId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !categoryFilter || item.category === categoryFilter;
    const matchesStatus = !statusFilter || item.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <AdminLayout>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Page Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="font-black text-slate-900 text-3xl tracking-tight">Items Management</h1>
            <p className="text-[10px] font-black text-slate-400 mt-1 uppercase tracking-[0.2em]">
              Monitor and manage all reported items across campus
            </p>
          </div>
          <button
            onClick={() => navigate('/admin/item-form')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl flex items-center space-x-2 transition-colors shadow-lg shadow-blue-200"
          >
            <Plus className="h-4 w-4" />
            <span className="font-black text-xs uppercase tracking-widest">Add Item</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-[32px] p-2 shadow-sm border border-slate-100/50 inline-flex">
          <button
            onClick={() => setActiveTab('found')}
            className={`px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${
              activeTab === 'found'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            FOUND ITEMS
          </button>
          <button
            onClick={() => setActiveTab('lost')}
            className={`px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${
              activeTab === 'lost'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            LOST ITEMS
          </button>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100/50">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <input
                type="text"
                placeholder={`Search ${activeTab} items...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-50/50 border border-slate-100 rounded-2xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-3 bg-slate-50/50 border border-slate-100 rounded-2xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium"
              >
                <option value="">All Categories</option>
                <option value="Electronics">Electronics</option>
                <option value="Personal">Personal</option>
                <option value="Accessories">Accessories</option>
                <option value="Documents">Documents</option>
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 bg-slate-50/50 border border-slate-100 rounded-2xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium"
              >
                <option value="">All Status</option>
                {activeTab === 'found' ? (
                  <>
                    <option value="IN STORAGE">In Storage</option>
                    <option value="CLAIMED">Claimed</option>
                    <option value="PENDING VERIFICATION">Pending Verification</option>
                  </>
                ) : (
                  <>
                    <option value="SEARCHING">Searching</option>
                    <option value="FOUND">Found</option>
                  </>
                )}
              </select>
              <button className="p-3 bg-slate-100 hover:bg-slate-200 border border-slate-100 rounded-2xl text-slate-800 transition-colors">
                <Filter className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="bg-white rounded-[32px] shadow-sm border border-slate-100/50 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-slate-600 font-black">Loading items...</p>
              </div>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Package className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-600 mb-4 font-black">No items found</p>
                <button
                  onClick={() => navigate('/admin/item-form')}
                  className="px-6 py-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-colors font-black text-xs uppercase tracking-widest"
                >
                  Add First Item
                </button>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="text-left py-4 px-6 text-slate-600 font-black text-[10px] uppercase tracking-[0.15em]">Item Info</th>
                    <th className="text-left py-4 px-6 text-slate-600 font-black text-[10px] uppercase tracking-[0.15em]">Category</th>
                    <th className="text-left py-4 px-6 text-slate-600 font-black text-[10px] uppercase tracking-[0.15em]">Location & Date</th>
                    <th className="text-left py-4 px-6 text-slate-600 font-black text-[10px] uppercase tracking-[0.15em]">Status</th>
                    <th className="text-left py-4 px-6 text-slate-600 font-black text-[10px] uppercase tracking-[0.15em]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.map((item) => (
                    <tr key={item._id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                            <Package className="h-5 w-5 text-slate-600" />
                          </div>
                          <div>
                            <div className="font-medium text-slate-800">{item.name}</div>
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">{item.itemId}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="px-3 py-1 text-[10px] font-black rounded-full bg-slate-50 text-slate-600">
                          {item.category}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="space-y-1">
                          <div className="flex items-center text-slate-600 text-sm">
                            <MapPin className="h-3 w-3 mr-1" />
                            {item.location}
                          </div>
                          <div className="flex items-center text-slate-400 text-xs">
                            <Calendar className="h-3 w-3 mr-1" />
                            {item.date}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 text-[10px] font-black rounded-full ${getStatusColor(item.status)}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex space-x-2">
                          <button 
                            className="p-2 text-blue-600 hover:text-blue-700 transition-colors"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button 
                            className="p-2 text-slate-600 hover:text-slate-700 transition-colors"
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteItem(item)}
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
              <p className="text-slate-600 mb-2">Are you sure you want to delete this item? This action cannot be undone.</p>
              <p className="text-slate-600">
                <strong>Item: </strong>
                <span className="text-slate-800">{itemToDelete?.name}</span>
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
                Delete Item
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default ItemsPage;
