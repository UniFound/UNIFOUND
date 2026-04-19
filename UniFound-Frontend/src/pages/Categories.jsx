import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Filter, Package, Tag, ChevronLeft, ChevronRight } from 'lucide-react';
import AdminLayout from './AdminLayout';

const API_BASE_URL = 'http://localhost:5000/api';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: 'blue',
    icon: '📦'
  });
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  
  const colorOptions = [
    { value: 'blue', label: 'Blue', class: 'bg-blue-100 text-blue-600' },
    { value: 'purple', label: 'Purple', class: 'bg-purple-100 text-purple-600' },
    { value: 'green', label: 'Green', class: 'bg-green-100 text-green-600' },
    { value: 'yellow', label: 'Yellow', class: 'bg-yellow-100 text-yellow-600' },
    { value: 'red', label: 'Red', class: 'bg-red-100 text-red-600' },
    { value: 'indigo', label: 'Indigo', class: 'bg-indigo-100 text-indigo-600' },
    { value: 'gray', label: 'Gray', class: 'bg-gray-100 text-gray-600' },
    { value: 'pink', label: 'Pink', class: 'bg-pink-100 text-pink-600' }
  ];
  
  const iconOptions = ['💻', '👕', '📚', '👜', '📄', '⚽', '🔑', '📦', '🎧', '📱', '⌚', '🎒', '🔐', '💳', '🧢', '👟'];
  
  // Fetch categories from backend
  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/categories`);
      const data = await response.json();
      setCategories(data.data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  // Load categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Filter categories
  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Pagination
  const indexOfLastCategory = currentPage * itemsPerPage;
  const indexOfFirstCategory = indexOfLastCategory - itemsPerPage;
  const currentCategories = filteredCategories.slice(indexOfFirstCategory, indexOfLastCategory);
  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
  
  // Add category to backend
  const handleAddCategory = async () => {
    if (formData.name && formData.description) {
      try {
        const response = await fetch(`${API_BASE_URL}/categories`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        
        if (response.ok) {
          await fetchCategories(); // Refresh categories list
          setFormData({ name: '', description: '', color: 'blue', icon: '📦' });
          setShowAddModal(false);
        } else {
          console.error('Error adding category');
        }
      } catch (error) {
        console.error('Error adding category:', error);
      }
    }
  };
  
  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
      color: category.color,
      icon: category.icon
    });
    setShowAddModal(true);
  };
  
  // Update category in backend
  const handleUpdateCategory = async () => {
    if (editingCategory && formData.name && formData.description) {
      try {
        const response = await fetch(`${API_BASE_URL}/categories/${editingCategory._id || editingCategory.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        
        if (response.ok) {
          await fetchCategories(); // Refresh categories list
          setFormData({ name: '', description: '', color: 'blue', icon: '📦' });
          setShowAddModal(false);
          setEditingCategory(null);
        } else {
          console.error('Error updating category');
        }
      } catch (error) {
        console.error('Error updating category:', error);
      }
    }
  };
  
  // Delete category from backend
  const handleDeleteCategory = async (categoryId) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        const response = await fetch(`${API_BASE_URL}/categories/${categoryId}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          await fetchCategories(); // Refresh categories list
        } else {
          console.error('Error deleting category');
        }
      } catch (error) {
        console.error('Error deleting category:', error);
      }
    }
  };
  
  const getColorClass = (color) => {
    const colorOption = colorOptions.find(opt => opt.value === color);
    return colorOption ? colorOption.class : 'bg-gray-100 text-gray-600';
  };
  
  return (
    <AdminLayout>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Page Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="font-black text-slate-900 text-2xl tracking-tight">Categories</h1>
            <p className="text-[10px] font-black text-slate-400 mt-1 uppercase tracking-[0.2em]">Manage Item Categories</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl flex items-center space-x-2 transition-all duration-300 shadow-lg shadow-blue-100/50 hover:shadow-blue-200/60"
          >
            <Plus className="h-4 w-4" />
            <span className="font-black text-xs uppercase tracking-wider">Add Category</span>
          </button>
        </div>

        {/* Search */}
        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100/50">
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-slate-50/50 border border-slate-200 rounded-2xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentCategories.map((category) => (
            <div key={category._id || category.id} className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100/50 hover:shadow-lg transition-all duration-300 group">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="text-4xl group-hover:scale-110 transition-transform">{category.icon}</div>
                  <div>
                    <h3 className="font-black text-slate-900 text-lg tracking-tight">{category.name}</h3>
                    <span className={`inline-block px-3 py-1.5 text-[10px] font-black rounded-xl ${getColorClass(category.color)}`}>
                      {category.color}
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditCategory(category)}
                    className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-xl transition-all"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(category._id || category.id)}
                    className="p-2 text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-all"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <p className="text-slate-600 text-sm mb-6 font-medium leading-relaxed">{category.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 text-sm font-medium">Items in category</span>
                <span className="bg-slate-100 text-slate-800 px-3 py-1.5 rounded-xl text-sm font-black">
                  {category.itemCount}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index + 1)}
                className={`w-10 h-10 rounded-xl font-black text-sm ${
                  currentPage === index + 1
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-100/50'
                    : 'bg-white text-slate-800 hover:bg-slate-50 border border-slate-200'
                } transition-all`}
              >
                {index + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* Add/Edit Category Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-[32px] p-8 max-w-md w-full mx-4 shadow-xl border border-slate-100/50">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-black text-slate-900 text-xl tracking-tight">
                {editingCategory ? 'Edit Category' : 'Add New Category'}
              </h3>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingCategory(null);
                  setFormData({ name: '', description: '', color: 'blue', icon: '📦' });
                }}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-2">Category Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-4 bg-slate-50/50 border border-slate-200 rounded-2xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter category name"
                />
              </div>
              
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-4 bg-slate-50/50 border border-slate-200 rounded-2xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  rows={3}
                  placeholder="Enter category description"
                />
              </div>
              
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-2">Color</label>
                <div className="grid grid-cols-4 gap-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => setFormData({ ...formData, color: color.value })}
                      className={`px-3 py-3 rounded-xl border-2 text-[10px] font-black transition-all ${
                        formData.color === color.value
                          ? `${color.class} border-current shadow-lg`
                          : `${color.class} border-transparent hover:border-current/50`
                      }`}
                    >
                      {color.label}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-2">Icon</label>
                <div className="grid grid-cols-8 gap-2">
                  {iconOptions.map((icon) => (
                    <button
                      key={icon}
                      onClick={() => setFormData({ ...formData, icon })}
                      className={`p-3 rounded-xl border-2 text-xl transition-all ${
                        formData.icon === icon
                          ? 'border-blue-500 bg-blue-50 shadow-lg'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-8">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingCategory(null);
                  setFormData({ name: '', description: '', color: 'blue', icon: '📦' });
                }}
                className="px-6 py-3 bg-slate-100 hover:bg-slate-200 rounded-2xl text-slate-800 font-black text-xs uppercase tracking-wider transition-all"
              >
                Cancel
              </button>
              <button
                onClick={editingCategory ? handleUpdateCategory : handleAddCategory}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-2xl text-white font-black text-xs uppercase tracking-wider transition-all shadow-lg shadow-blue-100/50"
              >
                {editingCategory ? 'Update' : 'Add'} Category
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default Categories;
