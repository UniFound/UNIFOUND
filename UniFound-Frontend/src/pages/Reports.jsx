import React, { useState } from 'react';

import { FileText, Download, Calendar, Filter, TrendingUp, Users, Package, CheckCircle, Clock, BarChart3, PieChart, Activity, Printer, Mail, Trash2, Edit, Tag, XCircle, AlertCircle } from 'lucide-react';

import AdminLayout from './AdminLayout';



const Reports = () => {

  const [selectedReport, setSelectedReport] = useState('overview');

  const [dateRange, setDateRange] = useState('month');

  const [format, setFormat] = useState('excel');

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

      // Fetch real data from backend API

      let reportData;

      try {

        const apiUrl = `/api/reports/${selectedReport}${selectedReport === 'overview' || selectedReport === 'users' ? `?dateRange=${dateRange}` : ''}`;

        const response = await fetch(apiUrl, {

          method: 'GET',

          headers: {

            'Content-Type': 'application/json',

            'Authorization': `Bearer ${localStorage.getItem('token')}`

          }

        });

        

        if (!response.ok) {

          throw new Error('Failed to fetch report data');

        }

        

        const result = await response.json();

        reportData = result.data;

      } catch (apiError) {

        console.warn('Failed to fetch real data, using fallback:', apiError);

        // Fallback to zeros if API fails

        reportData = selectedReport === 'users' ? {

          userCategories: {

            totalUsers: 0,

            activeUsers: 0,

            adminUsers: 0,

            suspendedUsers: 0,

            regularUsers: 0,

            inactiveUsers: 0

          },

          userRegistrations: 0,

          activeUsers: 0,

          adminUsers: 0,

          suspendedUsers: 0,

          topPerformers: [],

          userActivity: [],

          auditLogSummary: {

            totalActions: 0,

            successfulActions: 0,

            failedActions: 0,

            uniqueUsers: 0

          },

          mostActiveUsers: [],

          actionDistribution: {},

          dateRange,

          generatedAt: new Date()

        } : {

          totalUsers: 0,

          totalItems: 0,

          foundItems: 0,

          activeClaims: 0,

          openTickets: 0

        };

      }

      

      const report = generateReport();

      

      // Create report content based on the selected report type and format with real data

      const reportContent = generateReportContent(selectedReport, dateRange, format, reportData);

      

      // Create blob with appropriate MIME type based on format

      const mimeType = format === 'excel' ? 'text/html' : 'text/csv';

      

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



  const generateReportContent = (reportType, dateRange, format, reportData) => {

    const timestamp = new Date().toLocaleString();

    const reportName = reportTypes.find(r => r.id === reportType)?.name;

    

    if (reportType === 'users') {

      // Enhanced user activity report with audit logs

      const userCategories = reportData?.userCategories || {};

      const userRegistrations = reportData?.userRegistrations || 0;

      const activeUsers = reportData?.activeUsers || 0;

      const adminUsers = reportData?.adminUsers || 0;

      const suspendedUsers = reportData?.suspendedUsers || 0;

      const totalActions = reportData?.auditLogSummary?.totalActions || 0;

      const successfulActions = reportData?.auditLogSummary?.successfulActions || 0;

      const failedActions = reportData?.auditLogSummary?.failedActions || 0;

      const uniqueUsers = reportData?.auditLogSummary?.uniqueUsers || 0;

      const userActivity = reportData?.userActivity || [];

      const topPerformers = reportData?.topPerformers || [];

      const mostActiveUsers = reportData?.mostActiveUsers || [];

      const actionDistribution = reportData?.actionDistribution || {};

      

      if (format === 'csv') {

        const headers = ['User Name', 'Email', 'Role', 'Status', 'Items Posted', 'Claims Made', 'Total Actions'];

        const userRows = userActivity.map(user => [

          user.name || 'N/A',

          user.email || 'N/A',

          user.role || 'user',

          user.status || 'active',

          user.itemsPosted || 0,

          user.claimsMade || 0,

          user.auditLogActivity?.totalActions || 0

        ]);

        

        const summaryRows = [

          ['Report Name', reportName],

          ['Generated', timestamp],

          ['Date Range', reportData?.dateRange || dateRange],

          [],

          ['Summary', ''],

          ['Total Users', userCategories?.totalUsers || 0],

          ['Active Users', userCategories?.activeUsers || 0],

          ['Admin Users', userCategories?.adminUsers || 0],

          ['Suspended Users', userCategories?.suspendedUsers || 0],

          [],

          headers,

          ...userRows

        ];

        

        return summaryRows.map(row => row.join(',')).join('\n');

      } else if (format === 'excel') {

        return `

          <html>

            <head>

              <title>${reportName}</title>

              <style>

                table { border-collapse: collapse; width: 100%; }

                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }

                th { background-color: #f2f2f2; font-weight: bold; }

              </style>

            </head>

            <body>

              <h2>${reportName}</h2>

              <p><strong>Generated:</strong> ${timestamp}</p>

              <p><strong>Date Range:</strong> ${reportData?.dateRange || dateRange}</p>

              

              <h3>User Summary</h3>

              <table>

                <tr><th>Metric</th><th>Value</th></tr>

                <tr><td>Total Users</td><td>${userCategories?.totalUsers || 0}</td></tr>

                <tr><td>Active Users</td><td>${userCategories?.activeUsers || 0}</td></tr>

                <tr><td>Admin Users</td><td>${userCategories?.adminUsers || 0}</td></tr>

                <tr><td>Suspended Users</td><td>${userCategories?.suspendedUsers || 0}</td></tr>

              </table>

              

              <h3>User Activity Details</h3>

              <table>

                <tr><th>User Name</th><th>Email</th><th>Role</th><th>Status</th><th>Items Posted</th><th>Claims Made</th><th>Total Actions</th></tr>

                ${userActivity.map(user => `

                  <tr>

                    <td>${user.name || 'N/A'}</td>

                    <td>${user.email || 'N/A'}</td>

                    <td>${user.role || 'user'}</td>

                    <td>${user.status || 'active'}</td>

                    <td>${user.itemsPosted || 0}</td>

                    <td>${user.claimsMade || 0}</td>

                    <td>${user.auditLogActivity?.totalActions || 0}</td>

                  </tr>

                `).join('')}

              </table>

            </body>

          </html>

        `;

      }

    } else if (reportType === 'categories') {

      // Enhanced categories report

      const categorySummary = reportData?.categorySummary || {};

      const categoryDistribution = reportData?.categoryDistribution || [];

      

      if (format === 'csv') {

        const headers = ['Category Name', 'Description', 'Status', 'Total Items', 'Recent Items', 'Unclaimed Items', 'Claimed Items', 'Claim Rate %'];

        const categoryRows = categoryDistribution.map(cat => [

          cat.categoryName || 'N/A',

          cat.description || '',

          cat.isActive ? 'Active' : 'Inactive',

          cat.totalItems || 0,

          cat.recentItems || 0,

          cat.unclaimedItems || 0,

          cat.claimedItems || 0,

          cat.claimRate || 0

        ]);

        

        const summaryRows = [

          ['Report Name', reportName],

          ['Generated', timestamp],

          ['Date Range', reportData?.dateRange || dateRange],

          ['Period Start', reportData?.period?.start ? new Date(reportData.period.start).toLocaleDateString() : 'N/A'],

          ['Period End', reportData?.period?.end ? new Date(reportData.period.end).toLocaleDateString() : 'N/A'],

          [],

          ['Category Summary', ''],

          ['Total Categories', categorySummary.totalCategories || 0],

          ['Active Categories', categorySummary.activeCategories || 0],

          ['Inactive Categories', categorySummary.inactiveCategories || 0],

          ['Categories With Items', categorySummary.categoriesWithItems || 0],

          ['Empty Categories', categorySummary.emptyCategories || 0],

          ['Total Items', categorySummary.totalItems || 0],

          ['Recent Items', categorySummary.totalRecentItems || 0],

          [],

          headers,

          ...categoryRows

        ];

        

        return summaryRows.map(row => row.join(',')).join('\n');

      } else if (format === 'excel') {

        return `

          <html>

            <head>

              <title>${reportName}</title>

              <style>

                table { border-collapse: collapse; width: 100%; margin-bottom: 20px; }

                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }

                th { background-color: #f2f2f2; font-weight: bold; }

                .summary-table { width: 60%; }

                .details-table { width: 100%; }

              </style>

            </head>

            <body>

              <h2>${reportName}</h2>

              <p><strong>Generated:</strong> ${timestamp}</p>

              <p><strong>Date Range:</strong> ${reportData?.dateRange || dateRange}</p>

              <p><strong>Period:</strong> ${reportData?.period?.start ? new Date(reportData.period.start).toLocaleDateString() : 'N/A'} - ${reportData?.period?.end ? new Date(reportData.period.end).toLocaleDateString() : 'N/A'}</p>

              

              <h3>Category Summary</h3>

              <table class="summary-table">

                <tr><th>Metric</th><th>Value</th></tr>

                <tr><td>Total Categories</td><td>${categorySummary.totalCategories || 0}</td></tr>

                <tr><td>Active Categories</td><td>${categorySummary.activeCategories || 0}</td></tr>

                <tr><td>Inactive Categories</td><td>${categorySummary.inactiveCategories || 0}</td></tr>

                <tr><td>Categories With Items</td><td>${categorySummary.categoriesWithItems || 0}</td></tr>

                <tr><td>Empty Categories</td><td>${categorySummary.emptyCategories || 0}</td></tr>

                <tr><td>Total Items</td><td>${categorySummary.totalItems || 0}</td></tr>

                <tr><td>Recent Items</td><td>${categorySummary.totalRecentItems || 0}</td></tr>

              </table>

              

              <h3>Category Details</h3>

              <table class="details-table">

                <tr><th>Category Name</th><th>Description</th><th>Status</th><th>Total Items</th><th>Recent Items</th><th>Unclaimed Items</th><th>Claimed Items</th><th>Claim Rate %</th></tr>

                ${categoryDistribution.map(cat => `

                  <tr>

                    <td>${cat.categoryName || 'N/A'}</td>

                    <td>${cat.description || ''}</td>

                    <td>${cat.isActive ? 'Active' : 'Inactive'}</td>

                    <td>${cat.totalItems || 0}</td>

                    <td>${cat.recentItems || 0}</td>

                    <td>${cat.unclaimedItems || 0}</td>

                    <td>${cat.claimedItems || 0}</td>

                    <td>${cat.claimRate || 0}%</td>

                  </tr>

                `).join('')}

              </table>

            </body>

          </html>

        `;

      }

    } else {

      // Handle other report types (overview, claims)

      const totalUsers = reportData?.totalUsers || 0;

      const totalItems = reportData?.totalItems || 0;

      const foundItems = reportData?.foundItems || 0;

      const activeClaims = reportData?.activeClaims || 0;

      const openTickets = reportData?.openTickets || 0;

      

      if (format === 'csv') {

        const headers = ['Metric', 'Value'];

        const rows = [

          ['Report Name', reportName],

          ['Generated', timestamp],

          ['Date Range', dateRange],

          ['Total Users', totalUsers],

          ['Total Items', totalItems],

          ['Found Items', foundItems],

          ['Active Claims', activeClaims],

          ['Open Tickets', openTickets]

        ];

        

        return [headers, ...rows].map(row => row.join(',')).join('\n');

      } else if (format === 'excel') {

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

                <tr><td>Total Items</td><td>${totalItems}</td></tr>

                <tr><td>Found Items</td><td>${foundItems}</td></tr>

                <tr><td>Active Claims</td><td>${activeClaims}</td></tr>

                <tr><td>Open Tickets</td><td>${openTickets}</td></tr>

              </table>

            </body>

          </html>

        `;

      }

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

                  {['excel', 'csv'].map((fmt) => (

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

