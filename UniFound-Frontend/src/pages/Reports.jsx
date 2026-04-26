import React, { useState } from 'react';
import { FileText, Download, Calendar, Filter, TrendingUp, Users, Package, CheckCircle, Clock, BarChart3, PieChart, Activity, Printer, Mail, Trash2, Edit, Tag, XCircle, AlertCircle } from 'lucide-react';
import AdminLayout from './AdminLayout';

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
      description: 'Summary of total users, found items, claims and open tickets',
      icon: BarChart3,
      metrics: ['Total Users', 'Found Items', 'Total Claims', 'Open Tickets']
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
      id: 'categories',
      name: 'Categories Report',
      description: 'Analysis of item categories and their distribution',
      icon: Tag,
      metrics: ['Category Distribution', 'Most Common Items', 'Category Trends', 'Unclaimed by Category']
    },
    {
      id: 'claims',
      name: 'Claims Approval/Rejected Report',
      description: 'Detailed analysis of claims approval and rejection rates',
      icon: AlertCircle,
      metrics: ['Approval Rate', 'Rejection Rate', 'Processing Time', 'Rejection Reasons']
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
  
  const handleGenerateReport = async () => {
    try {
      const report = generateReport();
      
      // Create report content based on the selected report type and format
      const reportContent = generateReportContent(selectedReport, dateRange, format);
      
      // Create blob with appropriate MIME type based on format
      const mimeType = format === 'pdf' ? 'text/plain' : 
                     format === 'excel' ? 'text/html' : 
                     'text/csv';
      
      const blob = new Blob([reportContent], { type: mimeType });
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${report.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.${format}`;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up
      window.URL.revokeObjectURL(url);
      
      // Show success message
      console.log(`Report ${report.name} downloaded successfully`);
      
    } catch (error) {
      console.error('Error generating report:', error);
      alert('Error generating report. Please try again.');
    }
  };

  const generateReportContent = (reportType, dateRange, format) => {
    const timestamp = new Date().toLocaleString();
    const reportName = reportTypes.find(r => r.id === reportType)?.name;
    
    // Generate sample data
    const totalUsers = Math.floor(Math.random() * 1000) + 100;
    const foundItems = Math.floor(Math.random() * 500) + 50;
    const totalClaims = Math.floor(Math.random() * 300) + 30;
    const openTickets = Math.floor(Math.random() * 100) + 10;
    
    if (format === 'csv') {
      // Generate CSV content
      const headers = ['Metric', 'Value'];
      const rows = [
        ['Report Name', reportName],
        ['Generated', timestamp],
        ['Date Range', dateRange],
        ['Total Users', totalUsers],
        ['Found Items', foundItems],
        ['Total Claims', totalClaims],
        ['Open Tickets', openTickets]
      ];
      
      return [headers, ...rows].map(row => row.join(',')).join('\n');
    } else if (format === 'excel') {
      // Generate simple HTML table that can be opened in Excel
      return `
        <html>
          <head>
            <title>${reportName}</title>
            <style>
              table { border-collapse: collapse; width: 100%; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f2f2f2; }
            </style>
          </head>
          <body>
            <h2>${reportName}</h2>
            <p><strong>Generated:</strong> ${timestamp}</p>
            <p><strong>Date Range:</strong> ${dateRange}</p>
            <table>
              <tr><th>Metric</th><th>Value</th></tr>
              <tr><td>Total Users</td><td>${totalUsers}</td></tr>
              <tr><td>Found Items</td><td>${foundItems}</td></tr>
              <tr><td>Total Claims</td><td>${totalClaims}</td></tr>
              <tr><td>Open Tickets</td><td>${openTickets}</td></tr>
            </table>
          </body>
        </html>
      `;
    } else {
      // For PDF, generate a simple text file for now
      // In a real implementation, you'd use a PDF library like jsPDF
      return `
Report: ${reportName}
Generated: ${timestamp}
Date Range: ${dateRange}
=====================================

Total Users: ${totalUsers}
Found Items: ${foundItems}
Total Claims: ${totalClaims}
Open Tickets: ${openTickets}

Report generated successfully.
      `;
    }
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
    <AdminLayout>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Page Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="font-black text-slate-900 text-2xl tracking-tight">Reports</h1>
            <p className="text-[10px] font-black text-slate-400 mt-1 uppercase tracking-[0.2em]">Generate and Manage System Reports</p>
          </div>
        </div>

        {/* Report Generation */}
        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100/50">
          <h3 className="font-black text-slate-900 text-lg tracking-tight mb-6">Generate New Report</h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Report Types */}
            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {reportTypes.map((report) => {
                  const Icon = report.icon;
                  return (
                    <div
                      key={report.id}
                      onClick={() => setSelectedReport(report.id)}
                      className={`p-6 border-2 rounded-2xl cursor-pointer transition-all duration-300 group ${
                        selectedReport === report.id
                          ? 'border-blue-500 bg-blue-50/50 shadow-lg shadow-blue-100/50'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/30'
                      }`}
                    >
                      <div className="flex items-start space-x-4">
                        <div className={`p-3 rounded-xl transition-all ${
                          selectedReport === report.id ? 'bg-blue-100 shadow-lg' : 'bg-slate-100 group-hover:bg-slate-200'
                        }`}>
                          <Icon className={`h-6 w-6 transition-colors ${
                            selectedReport === report.id ? 'text-blue-600' : 'text-slate-600 group-hover:text-slate-700'
                          }`} />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-black text-slate-900 tracking-tight">{report.name}</h4>
                          <p className="text-slate-600 text-sm mt-2 leading-relaxed">{report.description}</p>
                          <div className="flex flex-wrap gap-2 mt-3">
                            {report.metrics.slice(0, 2).map((metric, index) => (
                              <span key={index} className="text-[10px] font-black text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl">
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
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-2">Date Range</label>
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="w-full px-4 py-4 bg-slate-50/50 border border-slate-200 rounded-2xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-2">Format</label>
                <div className="grid grid-cols-1 gap-3">
                  {['pdf', 'excel', 'csv'].map((fmt) => (
                    <button
                      key={fmt}
                      onClick={() => setFormat(fmt)}
                      className={`px-4 py-3 rounded-2xl border-2 font-black text-xs uppercase tracking-wider transition-all ${
                        format === fmt
                          ? 'border-blue-500 bg-blue-50 text-blue-600 shadow-lg'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {fmt.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="emailReport"
                  checked={emailReport}
                  onChange={(e) => setEmailReport(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
                />
                <label htmlFor="emailReport" className="text-slate-700 font-medium text-sm">
                  Email report when ready
                </label>
              </div>
              
              {emailReport && (
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-2">Recipient Email</label>
                  <input
                    type="email"
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                    placeholder="Enter email address"
                    className="w-full px-4 py-4 bg-slate-50/50 border border-slate-200 rounded-2xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              )}
              
              <button
                onClick={handleGenerateReport}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-2xl flex items-center justify-center space-x-2 transition-all duration-300 shadow-lg shadow-blue-100/50 hover:shadow-blue-200/60"
              >
                <Download className="h-4 w-4" />
                <span className="font-black text-xs uppercase tracking-wider">Generate Report</span>
              </button>
            </div>
          </div>
        </div>

              </div>
    </AdminLayout>
  );
};

export default Reports;
