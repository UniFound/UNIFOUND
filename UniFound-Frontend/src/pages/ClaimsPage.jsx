import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus, Edit, Trash2, ShieldCheck, MapPin, Calendar, CheckCircle, Clock, AlertTriangle, Eye, User, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminLayout from "../pages/AdminLayout";

const ClaimsPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('pending');
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [claimToDelete, setClaimToDelete] = useState(null);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Mock data for demonstration
  const mockClaims = [
    {
      _id: '1',
      claimId: 'CLM-001',
      itemName: 'Black Laptop Charger',
      itemId: 'FI-102',
      claimantName: 'John Smith',
      claimantEmail: 'john.smith@university.edu',
      claimDate: '2024-03-26',
      status: 'PENDING',
      priority: 'MEDIUM',
      description: 'I lost my Dell laptop charger near the library on March 24th. It has a 65W output and is black in color.',
      evidence: ['Photo of charger', 'Purchase receipt'],
      location: 'Library Floor 2',
      foundDate: '2024-03-25'
    },
    {
      _id: '2',
      claimId: 'CLM-002',
      itemName: 'Nike Water Bottle',
      itemId: 'FI-105',
      claimantName: 'Sarah Johnson',
      claimantEmail: 'sarah.j@university.edu',
      claimDate: '2024-03-25',
      status: 'APPROVED',
      priority: 'LOW',
      description: 'Blue Nike water bottle with my name written on the bottom. Lost it after gym class.',
      evidence: ['Photo with name visible'],
      location: 'Main Gym',
      foundDate: '2024-03-24'
    },
    {
      _id: '3',
      claimId: 'CLM-003',
      itemName: 'Wireless Headphones',
      itemId: 'FI-108',
      claimantName: 'Mike Wilson',
      claimantEmail: 'mike.w@university.edu',
      claimDate: '2024-03-26',
      status: 'UNDER REVIEW',
      priority: 'HIGH',
      description: 'Sony WH-1000XM4 headphones in black case. Very expensive and important for my studies.',
      evidence: ['Serial number photo', 'Original box photo'],
      location: 'Student Center',
      foundDate: '2024-03-23'
    },
    {
      _id: '4',
      claimId: 'CLM-004',
      itemName: 'Silver Watch',
      itemId: 'LI-201',
      claimantName: 'Emily Davis',
      claimantEmail: 'emily.d@university.edu',
      claimDate: '2024-03-27',
      status: 'REJECTED',
      priority: 'LOW',
      description: 'Silver analog watch with leather strap. It was a gift from my parents.',
      evidence: ['Photo of similar watch'],
      location: 'Cafeteria',
      foundDate: '2024-03-26'
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const filteredClaims = mockClaims.filter(claim => {
        if (activeTab === 'pending') return claim.status === 'PENDING' || claim.status === 'UNDER REVIEW';
        if (activeTab === 'approved') return claim.status === 'APPROVED';
        if (activeTab === 'rejected') return claim.status === 'REJECTED';
        return true;
      });
      setClaims(filteredClaims);
      setLoading(false);
    }, 1000);
  }, [activeTab]);

  const handleViewClaim = (claim) => {
    setSelectedClaim(claim);
    setShowDetailModal(true);
  };

  const handleDeleteClaim = (claim) => {
    setClaimToDelete(claim);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    setClaims(claims.filter(claim => claim._id !== claimToDelete._id));
    setShowDeleteModal(false);
    setClaimToDelete(null);
  };

  const handleApproveClaim = (claimId) => {
    setClaims(claims.map(claim => 
      claim._id === claimId 
        ? { ...claim, status: 'APPROVED' }
        : claim
    ));
  };

  const handleRejectClaim = (claimId) => {
    setClaims(claims.map(claim => 
      claim._id === claimId 
        ? { ...claim, status: 'REJECTED' }
        : claim
    ));
  };

  const getStatusColor = (status) => {
    const statusColors = {
      'PENDING': 'bg-orange-50 text-orange-600',
      'UNDER REVIEW': 'bg-blue-50 text-blue-600',
      'APPROVED': 'bg-emerald-50 text-emerald-600',
      'REJECTED': 'bg-rose-50 text-rose-600'
    };
    return statusColors[status] || 'bg-slate-50 text-slate-600';
  };

  const getPriorityColor = (priority) => {
    const priorityColors = {
      'HIGH': 'bg-rose-50 text-rose-600',
      'MEDIUM': 'bg-orange-50 text-orange-600',
      'LOW': 'bg-emerald-50 text-emerald-600'
    };
    return priorityColors[priority] || 'bg-slate-50 text-slate-600';
  };

  const filteredClaims = claims.filter(claim => {
    const matchesSearch = claim.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         claim.claimantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         claim.claimId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || claim.status === statusFilter;
    const matchesPriority = !priorityFilter || claim.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <AdminLayout>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Page Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="font-black text-slate-900 text-3xl tracking-tight">Claims Management</h1>
            <p className="text-[10px] font-black text-slate-400 mt-1 uppercase tracking-[0.2em]">
              Review and manage item ownership claims
            </p>
          </div>
          <button
            onClick={() => navigate('/admin/claim-form')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl flex items-center space-x-2 transition-colors shadow-lg shadow-blue-200"
          >
            <Plus className="h-4 w-4" />
            <span className="font-black text-xs uppercase tracking-widest">New Claim</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-[32px] p-2 shadow-sm border border-slate-100/50 inline-flex">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${
              activeTab === 'pending'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            PENDING REVIEW
          </button>
          <button
            onClick={() => setActiveTab('approved')}
            className={`px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${
              activeTab === 'approved'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            APPROVED
          </button>
          <button
            onClick={() => setActiveTab('rejected')}
            className={`px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${
              activeTab === 'rejected'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            REJECTED
          </button>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100/50">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search claims by item, claimant, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-50/50 border border-slate-100 rounded-2xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 bg-slate-50/50 border border-slate-100 rounded-2xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium"
              >
                <option value="">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="UNDER REVIEW">Under Review</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
              </select>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="px-4 py-3 bg-slate-50/50 border border-slate-100 rounded-2xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium"
              >
                <option value="">All Priority</option>
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
              </select>
              <button className="p-3 bg-slate-100 hover:bg-slate-200 border border-slate-100 rounded-2xl text-slate-800 transition-colors">
                <Filter className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Claims Table */}
        <div className="bg-white rounded-[32px] shadow-sm border border-slate-100/50 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-slate-600 font-black">Loading claims...</p>
              </div>
            </div>
          ) : filteredClaims.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <ShieldCheck className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-600 mb-4 font-black">No claims found</p>
                <button
                  onClick={() => navigate('/admin/claim-form')}
                  className="px-6 py-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-colors font-black text-xs uppercase tracking-widest"
                >
                  Create First Claim
                </button>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="text-left py-4 px-6 text-slate-600 font-black text-[10px] uppercase tracking-[0.15em]">Claim Info</th>
                    <th className="text-left py-4 px-6 text-slate-600 font-black text-[10px] uppercase tracking-[0.15em]">Claimant</th>
                    <th className="text-left py-4 px-6 text-slate-600 font-black text-[10px] uppercase tracking-[0.15em]">Date & Priority</th>
                    <th className="text-left py-4 px-6 text-slate-600 font-black text-[10px] uppercase tracking-[0.15em]">Status</th>
                    <th className="text-left py-4 px-6 text-slate-600 font-black text-[10px] uppercase tracking-[0.15em]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredClaims.map((claim) => (
                    <tr key={claim._id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                            <ShieldCheck className="h-5 w-5 text-slate-600" />
                          </div>
                          <div>
                            <div className="font-medium text-slate-800">{claim.itemName}</div>
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">{claim.claimId}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="space-y-1">
                          <div className="flex items-center text-slate-800 text-sm">
                            <User className="h-3 w-3 mr-1" />
                            {claim.claimantName}
                          </div>
                          <div className="text-[10px] text-slate-400">{claim.claimantEmail}</div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="space-y-2">
                          <div className="flex items-center text-slate-600 text-sm">
                            <Calendar className="h-3 w-3 mr-1" />
                            {claim.claimDate}
                          </div>
                          <span className={`px-2 py-1 text-[10px] font-black rounded-full ${getPriorityColor(claim.priority)}`}>
                            {claim.priority}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 text-[10px] font-black rounded-full ${getStatusColor(claim.status)}`}>
                          {claim.status}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => handleViewClaim(claim)}
                            className="p-2 text-blue-600 hover:text-blue-700 transition-colors"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          {claim.status === 'PENDING' || claim.status === 'UNDER REVIEW' ? (
                            <>
                              <button 
                                onClick={() => handleApproveClaim(claim._id)}
                                className="p-2 text-emerald-600 hover:text-emerald-700 transition-colors"
                                title="Approve"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </button>
                              <button 
                                onClick={() => handleRejectClaim(claim._id)}
                                className="p-2 text-rose-600 hover:text-rose-700 transition-colors"
                                title="Reject"
                              >
                                <AlertTriangle className="h-4 w-4" />
                              </button>
                            </>
                          ) : null}
                          <button 
                            onClick={() => handleDeleteClaim(claim)}
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

      {/* Claim Detail Modal */}
      {showDetailModal && selectedClaim && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white border border-slate-100 rounded-[32px] p-8 max-w-2xl w-full mx-4 shadow-lg max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-slate-800 text-lg font-black flex items-center space-x-2">
                <ShieldCheck className="h-5 w-5 text-blue-600" />
                <span>Claim Details</span>
              </h3>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-1">Claim ID</p>
                  <p className="font-medium text-slate-800">{selectedClaim.claimId}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-1">Status</p>
                  <span className={`px-3 py-1 text-[10px] font-black rounded-full ${getStatusColor(selectedClaim.status)}`}>
                    {selectedClaim.status}
                  </span>
                </div>
              </div>

              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-1">Item Information</p>
                <p className="font-medium text-slate-800">{selectedClaim.itemName}</p>
                <p className="text-sm text-slate-600">Item ID: {selectedClaim.itemId}</p>
              </div>

              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-1">Claimant Information</p>
                <p className="font-medium text-slate-800">{selectedClaim.claimantName}</p>
                <p className="text-sm text-slate-600">{selectedClaim.claimantEmail}</p>
              </div>

              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-1">Description</p>
                <p className="text-slate-600">{selectedClaim.description}</p>
              </div>

              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-1">Evidence</p>
                <div className="flex flex-wrap gap-2">
                  {selectedClaim.evidence.map((evidence, index) => (
                    <span key={index} className="px-3 py-1 bg-slate-50 text-slate-600 rounded-full text-sm">
                      {evidence}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-1">Found Location</p>
                  <p className="text-slate-600">{selectedClaim.location}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-1">Found Date</p>
                  <p className="text-slate-600">{selectedClaim.foundDate}</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-slate-100">
              {selectedClaim.status === 'PENDING' || selectedClaim.status === 'UNDER REVIEW' ? (
                <>
                  <button
                    onClick={() => {
                      handleRejectClaim(selectedClaim._id);
                      setShowDetailModal(false);
                    }}
                    className="px-6 py-3 bg-rose-600 hover:bg-rose-700 rounded-2xl text-white transition-colors font-black text-xs uppercase tracking-widest"
                  >
                    Reject Claim
                  </button>
                  <button
                    onClick={() => {
                      handleApproveClaim(selectedClaim._id);
                      setShowDetailModal(false);
                    }}
                    className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 rounded-2xl text-white transition-colors font-black text-xs uppercase tracking-widest"
                  >
                    Approve Claim
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="px-6 py-3 bg-slate-600 hover:bg-slate-700 rounded-2xl text-white transition-colors font-black text-xs uppercase tracking-widest"
                >
                  Close
                </button>
              )}
            </div>
          </div>
        </div>
      )}

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
              <p className="text-slate-600 mb-2">Are you sure you want to delete this claim? This action cannot be undone.</p>
              <p className="text-slate-600">
                <strong>Claim: </strong>
                <span className="text-slate-800">{claimToDelete?.itemName}</span>
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
                Delete Claim
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default ClaimsPage;
