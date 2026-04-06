import React, { useState } from 'react';
import { Plus, Edit, Trash2, Search, Filter, Package, Tag, ChevronLeft, ChevronRight } from 'lucide-react';

const Categories = () => {
  const [categories, setCategories] = useState([
    { id: 1, name: 'Electronics', description: 'Phones, laptops, tablets, and other electronic devices', itemCount: 45, color: 'blue', icon: '💻' },
    { id: 2, name: 'Clothing', description: 'Shirts, pants, jackets, and accessories', itemCount: 38, color: 'purple', icon: '👕' },
    { id: 3, name: 'Books', description: 'Textbooks, notebooks, and reading materials', itemCount: 62, color: 'green', icon: '📚' },
    { id: 4, name: 'Accessories', description: 'Jewelry, watches, bags, and personal items', itemCount: 29, color: 'yellow', icon: '👜' },
    { id: 5, name: 'Documents', description: 'IDs, cards, certificates, and papers', itemCount: 18, color: 'red', icon: '📄' },
    { id: 6, name: 'Sports Equipment', description: 'Sports gear, equipment, and accessories', itemCount: 15, color: 'indigo', icon: '⚽' },
    { id: 7, name: 'Keys', description: 'Room keys, car keys, and keycards', itemCount: 22, color: 'gray', icon: '🔑' },
    { id: 8, name: 'Other', description: 'Items that don\'t fit in other categories', itemCount: 12, color: 'pink', icon: '📦' }
  ]);
  
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
  
  const handleAddCategory = () => {
    if (formData.name && formData.description) {
      const newCategory = {
        id: categories.length + 1,
        ...formData,
        itemCount: 0
      };
      setCategories([...categories, newCategory]);
      setFormData({ name: '', description: '', color: 'blue', icon: '📦' });
      setShowAddModal(false);
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
  
  const handleUpdateCategory = () => {
    if (editingCategory && formData.name && formData.description) {
      setCategories(categories.map(cat =>
        cat.id === editingCategory.id
          ? { ...cat, ...formData }
          : cat
      ));
      setFormData({ name: '', description: '', color: 'blue', icon: '📦' });
      setShowAddModal(false);
      setEditingCategory(null);
    }
  };
  
  const handleDeleteCategory = (categoryId) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      setCategories(categories.filter(cat => cat.id !== categoryId));
    }
  };
  
  const getColorClass = (color) => {
    const colorOption = colorOptions.find(opt => opt.value === color);
    return colorOption ? colorOption.class : 'bg-gray-100 text-gray-600';
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
            <a href="/admin/users" className="transition hover:text-blue-600">Users</a>
            <a href="/admin/categories" className="text-blue-600 font-medium transition hover:text-blue-700">Categories</a>
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Categories</h1>
            <p className="text-gray-600">Manage item categories for better organization</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Add Category</span>
          </button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {currentCategories.map((category) => (
            <div key={category.id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="text-3xl">{category.icon}</div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{category.name}</h3>
                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${getColorClass(category.color)}`}>
                      {category.color}
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditCategory(category)}
                    className="p-1 text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(category.id)}
                    className="p-1 text-red-600 hover:text-red-700 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-4">{category.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-sm">Items in category</span>
                <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-sm font-medium">
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
        )}
      </div>

      {/* Add/Edit Category Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white border border-gray-200 rounded-xl p-6 max-w-md w-full mx-4 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-gray-800 text-lg font-semibold">
                {editingCategory ? 'Edit Category' : 'Add New Category'}
              </h3>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingCategory(null);
                  setFormData({ name: '', description: '', color: 'blue', icon: '📦' });
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter category name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Enter category description"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                <div className="grid grid-cols-4 gap-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => setFormData({ ...formData, color: color.value })}
                      className={`px-3 py-2 rounded-lg border-2 text-sm font-medium ${
                        formData.color === color.value
                          ? `${color.class} border-current`
                          : `${color.class} border-transparent`
                      }`}
                    >
                      {color.label}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Icon</label>
                <div className="grid grid-cols-8 gap-2">
                  {iconOptions.map((icon) => (
                    <button
                      key={icon}
                      onClick={() => setFormData({ ...formData, icon })}
                      className={`p-2 rounded-lg border-2 text-xl ${
                        formData.icon === icon
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingCategory(null);
                  setFormData({ name: '', description: '', color: 'blue', icon: '📦' });
                }}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={editingCategory ? handleUpdateCategory : handleAddCategory}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors"
              >
                {editingCategory ? 'Update' : 'Add'} Category
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;
