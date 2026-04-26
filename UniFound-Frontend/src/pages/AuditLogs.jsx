import React, { useState } from 'react';
import { Search, Filter, Calendar, User, Shield, AlertTriangle, CheckCircle, XCircle, Clock, ChevronLeft, ChevronRight, Download, Eye } from 'lucide-react';
import AdminLayout from './AdminLayout';

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  
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
    <AdminLayout>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Page Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="font-black text-slate-900 text-2xl tracking-tight">Audit Logs</h1>
            <p className="text-[10px] font-black text-slate-400 mt-1 uppercase tracking-[0.2em]">System Activity Monitoring</p>
          </div>
          <button
            onClick={exportLogs}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl flex items-center space-x-2 transition-all duration-300 shadow-lg shadow-blue-100/50 hover:shadow-blue-200/60"
          >
            <Download className="h-4 w-4" />
            <span className="font-black text-xs uppercase tracking-wider">Export Logs</span>
          </button>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100/50">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-slate-50/50 border border-slate-200 rounded-2xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="px-4 py-4 bg-slate-50/50 border border-slate-200 rounded-2xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="">All Actions</option>
              {actionTypes.map(action => (
                <option key={action} value={action}>{action.replace('_', ' ')}</option>
              ))}
            </select>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-4 bg-slate-50/50 border border-slate-200 rounded-2xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
              className="px-4 py-4 bg-slate-50/50 border border-slate-200 rounded-2xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
          
          <div className="flex justify-end mt-6">
            <button
              onClick={resetFilters}
              className="px-6 py-3 bg-slate-100 hover:bg-slate-200 rounded-2xl text-slate-800 font-black text-xs uppercase tracking-wider transition-all"
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* Logs Table */}
        <div className="bg-white rounded-[32px] shadow-sm border border-slate-100/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="text-left py-4 px-6 text-slate-600 font-black text-[10px] uppercase tracking-[0.15em]">Timestamp</th>
                  <th className="text-left py-4 px-6 text-slate-600 font-black text-[10px] uppercase tracking-[0.15em]">User</th>
                  <th className="text-left py-4 px-6 text-slate-600 font-black text-[10px] uppercase tracking-[0.15em]">Action</th>
                  <th className="text-left py-4 px-6 text-slate-600 font-black text-[10px] uppercase tracking-[0.15em]">Resource</th>
                  <th className="text-left py-4 px-6 text-slate-600 font-black text-[10px] uppercase tracking-[0.15em]">Status</th>
                  <th className="text-left py-4 px-6 text-slate-600 font-black text-[10px] uppercase tracking-[0.15em]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentLogs.map((log) => (
                  <tr key={log.id} className="border-b border-slate-50 hover:bg-slate-50/30 transition-colors">
                    <td className="py-4 px-6 text-slate-600 text-sm font-medium">{log.timestamp}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-slate-100 rounded-xl">
                          <User className="h-4 w-4 text-slate-600" />
                        </div>
                        <span className="text-slate-800 font-medium">{log.user}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1.5 text-[10px] font-black rounded-xl ${getActionBadge(log.action)}`}>
                        {log.action.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-600 text-sm max-w-xs truncate font-medium" title={log.resource}>
                      {log.resource}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(log.status)}
                        <span className={`px-3 py-1.5 text-[10px] font-black rounded-xl ${getStatusBadge(log.status)}`}>
                          {log.status}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <button
                        onClick={() => setShowLogDetails(log)}
                        className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-xl transition-all"
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
          <div className="flex justify-between items-center p-6 border-t border-slate-100">
            <div className="text-slate-600 text-sm font-medium">
              Showing {indexOfFirstLog + 1} to {Math.min(indexOfLastLog, filteredLogs.length)} of {filteredLogs.length} logs
            </div>
            <div className="flex items-center space-x-2">
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
          </div>
        </div>
      </div>

      {/* Log Details Modal */}
      {showLogDetails && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-[32px] p-8 max-w-2xl w-full mx-4 shadow-xl border border-slate-100/50 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-black text-slate-900 text-xl tracking-tight">Log Details</h3>
              <button
                onClick={() => setShowLogDetails(null)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-2">Timestamp</label>
                  <p className="text-slate-800 font-medium">{showLogDetails.timestamp}</p>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-2">User</label>
                  <p className="text-slate-800 font-medium">{showLogDetails.user}</p>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-2">Action</label>
                  <span className={`inline-block px-3 py-1.5 text-[10px] font-black rounded-xl ${getActionBadge(showLogDetails.action)}`}>
                    {showLogDetails.action.replace('_', ' ')}
                  </span>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-2">Status</label>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(showLogDetails.status)}
                    <span className={`px-3 py-1.5 text-[10px] font-black rounded-xl ${getStatusBadge(showLogDetails.status)}`}>
                      {showLogDetails.status}
                    </span>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-2">Resource</label>
                <p className="text-slate-800 font-medium">{showLogDetails.resource}</p>
              </div>
              
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-2">Details</label>
                <p className="text-slate-800 font-medium">{showLogDetails.details}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-2">IP Address</label>
                  <p className="text-slate-800 font-mono text-sm bg-slate-50 p-3 rounded-xl">{showLogDetails.ipAddress}</p>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-2">User Agent</label>
                  <p className="text-slate-800 text-sm bg-slate-50 p-3 rounded-xl break-all">{showLogDetails.userAgent}</p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end mt-8">
              <button
                onClick={() => setShowLogDetails(null)}
                className="px-6 py-3 bg-slate-100 hover:bg-slate-200 rounded-2xl text-slate-800 font-black text-xs uppercase tracking-wider transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AuditLogs;
