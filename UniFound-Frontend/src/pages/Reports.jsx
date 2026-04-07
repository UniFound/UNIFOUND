import React, { useState } from 'react';
import { FileText, Download, Calendar, Filter, TrendingUp, Users, Package, CheckCircle, Clock, BarChart3, PieChart, Activity, Printer, Mail, Trash2, Edit } from 'lucide-react';
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

        {/* Recent Reports */}
        <div className="bg-white rounded-[32px] shadow-sm border border-slate-100/50 overflow-hidden">
          <div className="flex justify-between items-center p-8 border-b border-slate-100">
            <h3 className="font-black text-slate-900 text-lg tracking-tight">Recent Reports</h3>
            <button className="text-blue-600 hover:text-blue-700 font-black text-xs uppercase tracking-wider transition-colors">
              View All
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="text-left py-4 px-6 text-slate-600 font-black text-[10px] uppercase tracking-[0.15em]">Report Name</th>
                  <th className="text-left py-4 px-6 text-slate-600 font-black text-[10px] uppercase tracking-[0.15em]">Type</th>
                  <th className="text-left py-4 px-6 text-slate-600 font-black text-[10px] uppercase tracking-[0.15em]">Generated</th>
                  <th className="text-left py-4 px-6 text-slate-600 font-black text-[10px] uppercase tracking-[0.15em]">Format</th>
                  <th className="text-left py-4 px-6 text-slate-600 font-black text-[10px] uppercase tracking-[0.15em]">Size</th>
                  <th className="text-left py-4 px-6 text-slate-600 font-black text-[10px] uppercase tracking-[0.15em]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentReports.map((report) => (
                  <tr key={report.id} className="border-b border-slate-50 hover:bg-slate-50/30 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-slate-100 rounded-xl">
                          <FileText className="h-4 w-4 text-slate-600" />
                        </div>
                        <span className="text-slate-800 font-medium">{report.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-slate-600 text-sm font-medium">{report.type}</td>
                    <td className="py-4 px-6 text-slate-600 text-sm font-medium">{report.generatedAt}</td>
                    <td className="py-4 px-6">
                      <span className="px-3 py-1.5 text-[10px] font-black bg-slate-100 text-slate-600 rounded-xl">
                        {report.format}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-600 text-sm font-medium">{report.size}</td>
                    <td className="py-4 px-6">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => downloadReport(report.id)}
                          className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-xl transition-all"
                          title="Download"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                        <button
                          className="p-2 text-slate-600 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all"
                          title="Print"
                        >
                          <Printer className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => deleteReport(report.id)}
                          className="p-2 text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-all"
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
      </div>
    </AdminLayout>
  );
};

export default Reports;
