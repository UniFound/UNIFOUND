import React, { useState } from 'react';
import { Search, Filter, Calendar, User, Shield, AlertTriangle, CheckCircle, XCircle, Clock, ChevronLeft, ChevronRight, Download, Eye } from 'lucide-react';

const AuditLogs = () => {
  const [logs, setLogs] = useState([
    {
      id: 1,
      timestamp: '2024-03-24 14:32:15',
      user: 'John Doe',
      action: 'USER_CREATED',
      resource: 'User: jane.smith@university.edu',
      details: 'Created new user account',
      status: 'success',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    },
    {
      id: 2,
      timestamp: '2024-03-24 14:28:42',
      user: 'Sarah Johnson',
      action: 'ITEM_POSTED',
      resource: 'Item: iPhone 13 Pro',
      details: 'Posted lost item in Electronics category',
      status: 'success',
      ipAddress: '192.168.1.105',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
    },
    {
      id: 3,
      timestamp: '2024-03-24 14:15:30',
      user: 'Mike Chen',
      action: 'LOGIN_FAILED',
      resource: 'Authentication',
      details: 'Failed login attempt - invalid password',
      status: 'error',
      ipAddress: '192.168.1.110',
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15'
    },
    {
      id: 4,
      timestamp: '2024-03-24 13:45:18',
      user: 'Admin',
      action: 'CATEGORY_UPDATED',
      resource: 'Category: Electronics',
      details: 'Updated category description and icon',
      status: 'success',
      ipAddress: '192.168.1.1',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    },
    {
      id: 5,
      timestamp: '2024-03-24 13:30:22',
      user: 'Emily Davis',
      action: 'ITEM_CLAIMED',
      resource: 'Item: MacBook Pro',
      details: 'Successfully claimed found item',
      status: 'success',
      ipAddress: '192.168.1.120',
      userAgent: 'Mozilla/5.0 (Android 14; Mobile; rv:109.0) Gecko/109.0 Firefox/115.0'
    },
    {
      id: 6,
      timestamp: '2024-03-24 13:15:10',
      user: 'System',
      action: 'BACKUP_COMPLETED',
      resource: 'Database',
      details: 'Automated backup completed successfully',
      status: 'success',
      ipAddress: 'localhost',
      userAgent: 'System Process'
    },
    {
      id: 7,
      timestamp: '2024-03-24 12:45:33',
      user: 'Tom Wilson',
      action: 'USER_SUSPENDED',
      resource: 'User: mike.j@university.edu',
      details: 'User account suspended due to policy violation',
      status: 'warning',
      ipAddress: '192.168.1.1',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    },
    {
      id: 8,
      timestamp: '2024-03-24 12:30:15',
      user: 'Lisa Anderson',
      action: 'ITEM_RESOLVED',
      resource: 'Item: Wallet',
      details: 'Item marked as resolved and returned to owner',
      status: 'success',
      ipAddress: '192.168.1.125',
      userAgent: 'Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15'
    }
  ]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showLogDetails, setShowLogDetails] = useState(null);
  
  const logsPerPage = 10;
  
  const actionTypes = [
    'USER_CREATED', 'USER_UPDATED', 'USER_DELETED', 'USER_SUSPENDED',
    'ITEM_POSTED', 'ITEM_CLAIMED', 'ITEM_RESOLVED', 'ITEM_UPDATED',
    'CATEGORY_CREATED', 'CATEGORY_UPDATED', 'CATEGORY_DELETED',
    'LOGIN_SUCCESS', 'LOGIN_FAILED', 'LOGOUT',
    'BACKUP_COMPLETED', 'SYSTEM_ALERT', 'DATA_EXPORT'
  ];
  
  // Filter logs
  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.resource.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.details.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesAction = !actionFilter || log.action === actionFilter;
    const matchesStatus = !statusFilter || log.status === statusFilter;
    const matchesDate = !dateFilter || log.timestamp.startsWith(dateFilter);
    
    return matchesSearch && matchesAction && matchesStatus && matchesDate;
  });
  
  // Pagination
  const indexOfLastLog = currentPage * logsPerPage;
  const indexOfFirstLog = indexOfLastLog - logsPerPage;
  const currentLogs = filteredLogs.slice(indexOfFirstLog, indexOfLastLog);
  const totalPages = Math.ceil(filteredLogs.length / logsPerPage);
  
  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };
  
  const getStatusBadge = (status) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-600';
      case 'error':
        return 'bg-red-100 text-red-600';
      case 'warning':
        return 'bg-yellow-100 text-yellow-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };
  
  const getActionBadge = (action) => {
    if (action.includes('USER')) return 'bg-blue-100 text-blue-600';
    if (action.includes('ITEM')) return 'bg-purple-100 text-purple-600';
    if (action.includes('CATEGORY')) return 'bg-green-100 text-green-600';
    if (action.includes('LOGIN') || action.includes('LOGOUT')) return 'bg-yellow-100 text-yellow-600';
    return 'bg-gray-100 text-gray-600';
  };
  
  const resetFilters = () => {
    setSearchTerm('');
    setActionFilter('');
    setStatusFilter('');
    setDateFilter('');
    setCurrentPage(1);
  };
  
  const exportLogs = () => {
    // Create CSV content
    const headers = ['Timestamp', 'User', 'Action', 'Resource', 'Details', 'Status', 'IP Address'];
    const csvContent = [
      headers.join(','),
      ...filteredLogs.map(log => 
        [log.timestamp, log.user, log.action, log.resource, log.details, log.status, log.ipAddress]
          .map(field => `"${field}"`)
          .join(',')
      )
    ].join('\n');
    
    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
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
            <a href="/admin/categories" className="transition hover:text-blue-600">Categories</a>
            <a href="/admin/analytics" className="transition hover:text-blue-600">Analytics</a>
            <a href="/admin/audit" className="text-blue-600 font-medium transition hover:text-blue-700">Audit Logs</a>
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Audit Logs</h1>
            <p className="text-gray-600">System activity and security monitoring</p>
          </div>
          <button
            onClick={exportLogs}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>Export Logs</span>
          </button>
        </div>

        {/* Search and Filters */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Actions</option>
              {actionTypes.map(action => (
                <option key={action} value={action}>{action.replace('_', ' ')}</option>
              ))}
            </select>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Status</option>
              <option value="success">Success</option>
              <option value="error">Error</option>
              <option value="warning">Warning</option>
            </select>
            
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex justify-end mt-4">
            <button
              onClick={resetFilters}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-800 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* Logs Table */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-gray-600 font-medium text-sm">Timestamp</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-medium text-sm">User</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-medium text-sm">Action</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-medium text-sm">Resource</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-medium text-sm">Status</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-medium text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentLogs.map((log) => (
                  <tr key={log.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 text-gray-600 text-sm">{log.timestamp}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-800">{log.user}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${getActionBadge(log.action)}`}>
                        {log.action.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600 text-sm max-w-xs truncate" title={log.resource}>
                      {log.resource}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(log.status)}
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(log.status)}`}>
                          {log.status}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => setShowLogDetails(log)}
                        className="p-1 text-blue-600 hover:text-blue-700 transition-colors"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="flex justify-between items-center p-4 border-t border-gray-200">
            <div className="text-gray-600 text-sm">
              Showing {indexOfFirstLog + 1} to {Math.min(indexOfLastLog, filteredLogs.length)} of {filteredLogs.length} logs
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
        </div>
      </div>

      {/* Log Details Modal */}
      {showLogDetails && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white border border-gray-200 rounded-xl p-6 max-w-2xl w-full mx-4 shadow-lg max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-gray-800 text-lg font-semibold">Log Details</h3>
              <button
                onClick={() => setShowLogDetails(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Timestamp</label>
                  <p className="text-gray-800">{showLogDetails.timestamp}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">User</label>
                  <p className="text-gray-800">{showLogDetails.user}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Action</label>
                  <span className={`inline-block px-2 py-1 text-xs rounded-full ${getActionBadge(showLogDetails.action)}`}>
                    {showLogDetails.action.replace('_', ' ')}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(showLogDetails.status)}
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(showLogDetails.status)}`}>
                      {showLogDetails.status}
                    </span>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Resource</label>
                <p className="text-gray-800">{showLogDetails.resource}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Details</label>
                <p className="text-gray-800">{showLogDetails.details}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">IP Address</label>
                  <p className="text-gray-800 font-mono text-sm">{showLogDetails.ipAddress}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">User Agent</label>
                  <p className="text-gray-800 text-sm break-all">{showLogDetails.userAgent}</p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowLogDetails(null)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-800 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuditLogs;
