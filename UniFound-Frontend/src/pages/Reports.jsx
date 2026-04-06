import React, { useState } from 'react';
import { FileText, Download, Calendar, Filter, TrendingUp, Users, Package, CheckCircle, Clock, BarChart3, PieChart, Activity, Printer, Mail } from 'lucide-react';

const Reports = () => {
  const [selectedReport, setSelectedReport] = useState('overview');
  const [dateRange, setDateRange] = useState('month');
  const [format, setFormat] = useState('pdf');
  const [emailReport, setEmailReport] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState('');
  
  const reportTypes = [
    {
      id: 'overview',
      name: 'System Overview',
      description: 'Comprehensive system performance and statistics',
      icon: BarChart3,
      metrics: ['Total Users', 'Active Items', 'Resolution Rate', 'System Health']
    },
    {
      id: 'users',
      name: 'User Activity Report',
      description: 'Detailed user engagement and activity metrics',
      icon: Users,
      metrics: ['User Registrations', 'Active Users', 'Top Performers', 'User Retention']
    },
    {
      id: 'items',
      name: 'Items Report',
      description: 'Lost and found items analysis and trends',
      icon: Package,
      metrics: ['Items by Category', 'Resolution Times', 'Success Rates', 'Trending Items']
    },
    {
      id: 'performance',
      name: 'Performance Report',
      description: 'System performance and response times',
      icon: Activity,
      metrics: ['Response Times', 'Server Load', 'Database Performance', 'Error Rates']
    },
    {
      id: 'financial',
      name: 'Financial Summary',
      description: 'Cost analysis and financial impact',
      icon: TrendingUp,
      metrics: ['Operational Costs', 'Value Recovered', 'ROI Analysis', 'Cost Savings']
    },
    {
      id: 'compliance',
      name: 'Compliance Report',
      description: 'Security and regulatory compliance metrics',
      icon: CheckCircle,
      metrics: ['Security Incidents', 'Audit Compliance', 'Data Protection', 'Policy Adherence']
    }
  ];
  
  const recentReports = [
    {
      id: 1,
      name: 'Monthly Overview Report',
      type: 'overview',
      generatedAt: '2024-03-24 10:30:00',
      generatedBy: 'Admin',
      format: 'PDF',
      size: '2.4 MB',
      status: 'completed'
    },
    {
      id: 2,
      name: 'User Activity Q1 2024',
      type: 'users',
      generatedAt: '2024-03-20 14:15:00',
      generatedBy: 'John Doe',
      format: 'Excel',
      size: '1.8 MB',
      status: 'completed'
    },
    {
      id: 3,
      name: 'Items Analysis Report',
      type: 'items',
      generatedAt: '2024-03-18 09:45:00',
      generatedBy: 'Sarah Johnson',
      format: 'PDF',
      size: '3.1 MB',
      status: 'completed'
    },
    {
      id: 4,
      name: 'Performance Metrics',
      type: 'performance',
      generatedAt: '2024-03-15 16:20:00',
      generatedBy: 'System',
      format: 'PDF',
      size: '1.2 MB',
      status: 'completed'
    },
    {
      id: 5,
      name: 'Weekly Summary Report',
      type: 'overview',
      generatedAt: '2024-03-14 11:00:00',
      generatedBy: 'Admin',
      format: 'CSV',
      size: '856 KB',
      status: 'completed'
    }
  ];
  
  const scheduledReports = [
    {
      id: 1,
      name: 'Weekly System Overview',
      type: 'overview',
      frequency: 'weekly',
      nextRun: '2024-03-31 00:00:00',
      recipients: ['admin@unifound.edu', 'manager@unifound.edu'],
      format: 'PDF',
      enabled: true
    },
    {
      id: 2,
      name: 'Monthly User Activity',
      type: 'users',
      frequency: 'monthly',
      nextRun: '2024-04-01 00:00:00',
      recipients: ['hr@unifound.edu'],
      format: 'Excel',
      enabled: true
    },
    {
      id: 3,
      name: 'Quarterly Financial Summary',
      type: 'financial',
      frequency: 'quarterly',
      nextRun: '2024-04-01 00:00:00',
      recipients: ['finance@unifound.edu', 'admin@unifound.edu'],
      format: 'PDF',
      enabled: false
    }
  ];
  
  const generateReport = () => {
    // Simulate report generation
    const newReport = {
      id: recentReports.length + 1,
      name: `${reportTypes.find(r => r.id === selectedReport)?.name} - ${new Date().toLocaleDateString()}`,
      type: selectedReport,
      generatedAt: new Date().toISOString(),
      generatedBy: 'Current User',
      format: format.toUpperCase(),
      size: Math.floor(Math.random() * 3000 + 500) + ' KB',
      status: 'generating'
    };
    
    // Simulate generation completion
    setTimeout(() => {
      newReport.status = 'completed';
    }, 2000);
    
    return newReport;
  };
  
  const handleGenerateReport = () => {
    const report = generateReport();
    // In a real app, this would trigger actual report generation
    alert(`Generating ${report.name} in ${format.toUpperCase()} format...`);
  };
  
  const handleEmailReport = () => {
    if (emailReport && recipientEmail) {
      alert(`Report will be emailed to ${recipientEmail}`);
    }
  };
  
  const downloadReport = (reportId) => {
    // Simulate download
    const report = recentReports.find(r => r.id === reportId);
    alert(`Downloading ${report.name}...`);
  };
  
  const deleteReport = (reportId) => {
    if (window.confirm('Are you sure you want to delete this report?')) {
      // In a real app, this would delete the report
      alert('Report deleted successfully');
    }
  };
  
  const toggleScheduledReport = (reportId) => {
    // In a real app, this would toggle the scheduled report
    alert('Scheduled report status updated');
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
            <a href="/admin/audit" className="transition hover:text-blue-600">Audit Logs</a>
            <a href="/admin/reports" className="text-blue-600 font-medium transition hover:text-blue-700">Reports</a>
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Reports</h1>
            <p className="text-gray-600">Generate and manage system reports</p>
          </div>
        </div>

        {/* Report Generation */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mb-8">
          <h3 className="text-gray-800 text-lg font-semibold mb-6">Generate New Report</h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Report Types */}
            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reportTypes.map((report) => {
                  const Icon = report.icon;
                  return (
                    <div
                      key={report.id}
                      onClick={() => setSelectedReport(report.id)}
                      className={`p-4 border rounded-xl cursor-pointer transition-all ${
                        selectedReport === report.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-lg ${
                          selectedReport === report.id ? 'bg-blue-100' : 'bg-gray-100'
                        }`}>
                          <Icon className={`h-5 w-5 ${
                            selectedReport === report.id ? 'text-blue-600' : 'text-gray-600'
                          }`} />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-800">{report.name}</h4>
                          <p className="text-sm text-gray-600 mt-1">{report.description}</p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {report.metrics.slice(0, 2).map((metric, index) => (
                              <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                {metric}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Report Options */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="quarter">This Quarter</option>
                  <option value="year">This Year</option>
                  <option value="custom">Custom Range</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Format</label>
                <div className="grid grid-cols-2 gap-2">
                  {['pdf', 'excel', 'csv'].map((fmt) => (
                    <button
                      key={fmt}
                      onClick={() => setFormat(fmt)}
                      className={`px-4 py-2 rounded-lg border-2 font-medium transition-colors ${
                        format === fmt
                          ? 'border-blue-500 bg-blue-50 text-blue-600'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                    >
                      {fmt.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="emailReport"
                  checked={emailReport}
                  onChange={(e) => setEmailReport(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="emailReport" className="text-sm text-gray-700">
                  Email report when ready
                </label>
              </div>
              
              {emailReport && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Recipient Email</label>
                  <input
                    type="email"
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                    placeholder="Enter email address"
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              )}
              
              <button
                onClick={handleGenerateReport}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors"
              >
                <Download className="h-4 w-4" />
                <span>Generate Report</span>
              </button>
            </div>
          </div>
        </div>

        {/* Recent Reports */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mb-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-gray-800 text-lg font-semibold">Recent Reports</h3>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View All
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-gray-600 font-medium text-sm">Report Name</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-medium text-sm">Type</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-medium text-sm">Generated</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-medium text-sm">Format</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-medium text-sm">Size</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-medium text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentReports.map((report) => (
                  <tr key={report.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-800">{report.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{report.type}</td>
                    <td className="py-3 px-4 text-gray-600 text-sm">{report.generatedAt}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                        {report.format}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{report.size}</td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => downloadReport(report.id)}
                          className="p-1 text-blue-600 hover:text-blue-700 transition-colors"
                          title="Download"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                        <button
                          className="p-1 text-gray-600 hover:text-gray-700 transition-colors"
                          title="Print"
                        >
                          <Printer className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => deleteReport(report.id)}
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
        </div>

        {/* Scheduled Reports */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-gray-800 text-lg font-semibold">Scheduled Reports</h3>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
              Add Schedule
            </button>
          </div>
          
          <div className="space-y-4">
            {scheduledReports.map((schedule) => (
              <div key={schedule.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h4 className="font-medium text-gray-800">{schedule.name}</h4>
                      <span className={`px-2 py-1 text-xs rounded ${
                        schedule.enabled ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {schedule.enabled ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center space-x-4 text-sm text-gray-600">
                      <span>Frequency: {schedule.frequency}</span>
                      <span>Next run: {schedule.nextRun}</span>
                      <span>Format: {schedule.format}</span>
                    </div>
                    <div className="mt-1 text-sm text-gray-600">
                      Recipients: {schedule.recipients.join(', ')}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => toggleScheduledReport(schedule.id)}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                        schedule.enabled
                          ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                          : 'bg-blue-100 hover:bg-blue-200 text-blue-700'
                      }`}
                    >
                      {schedule.enabled ? 'Disable' : 'Enable'}
                    </button>
                    <button className="p-1 text-gray-600 hover:text-gray-700 transition-colors">
                      <Edit className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
