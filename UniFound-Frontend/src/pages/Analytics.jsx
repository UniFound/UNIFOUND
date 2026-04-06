import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Users, Package, Clock, CheckCircle, BarChart3, PieChart, Activity, Calendar, Download } from 'lucide-react';

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('month');
  const [selectedMetric, setSelectedMetric] = useState('overview');
  
  // Mock data
  const stats = {
    overview: {
      totalItems: 156,
      resolvedItems: 89,
      pendingItems: 45,
      averageResolutionTime: '2.5 days',
      resolutionRate: 57.1
    },
    trends: {
      monthlyGrowth: 12.5,
      weeklyGrowth: 3.2,
      dailyGrowth: 0.8
    }
  };
  
  const monthlyData = [
    { month: 'Jan', lost: 12, found: 8, resolved: 6 },
    { month: 'Feb', lost: 19, found: 15, resolved: 12 },
    { month: 'Mar', lost: 15, found: 18, resolved: 14 },
    { month: 'Apr', lost: 25, found: 20, resolved: 18 },
    { month: 'May', lost: 22, found: 25, resolved: 22 },
    { month: 'Jun', lost: 30, found: 28, resolved: 25 }
  ];
  
  const categoryData = [
    { name: 'Electronics', value: 35, color: 'bg-blue-500' },
    { name: 'Clothing', value: 25, color: 'bg-purple-500' },
    { name: 'Books', value: 20, color: 'bg-green-500' },
    { name: 'Accessories', value: 12, color: 'bg-yellow-500' },
    { name: 'Documents', value: 5, color: 'bg-red-500' },
    { name: 'Other', value: 3, color: 'bg-gray-500' }
  ];
  
  const resolutionTimeData = [
    { category: 'Electronics', avgTime: 3.2 },
    { category: 'Clothing', avgTime: 2.1 },
    { category: 'Books', avgTime: 1.8 },
    { category: 'Accessories', avgTime: 2.5 },
    { category: 'Documents', avgTime: 1.2 },
    { category: 'Other', avgTime: 3.8 }
  ];
  
  const topPerformers = [
    { name: 'Sarah Johnson', itemsFound: 15, successRate: 92 },
    { name: 'Mike Chen', itemsFound: 12, successRate: 88 },
    { name: 'Emily Davis', itemsFound: 10, successRate: 85 },
    { name: 'James Wilson', itemsFound: 8, successRate: 80 }
  ];
  
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
            <a href="/admin/analytics" className="text-blue-600 font-medium transition hover:text-blue-700">Analytics</a>
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics</h1>
            <p className="text-gray-600">Detailed insights and performance metrics</p>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="day">Last 24 Hours</option>
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="year">Last Year</option>
            </select>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
              <Download className="h-4 w-4" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <span className="flex items-center text-green-600 text-sm">
                <TrendingUp className="h-4 w-4 mr-1" />
                +12.5%
              </span>
            </div>
            <p className="text-gray-500 text-sm mb-1">Total Items</p>
            <p className="text-2xl font-bold text-gray-800">{stats.overview.totalItems}</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <span className="flex items-center text-green-600 text-sm">
                <TrendingUp className="h-4 w-4 mr-1" />
                +8.2%
              </span>
            </div>
            <p className="text-gray-500 text-sm mb-1">Resolved Items</p>
            <p className="text-2xl font-bold text-gray-800">{stats.overview.resolvedItems}</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <span className="flex items-center text-red-600 text-sm">
                <TrendingDown className="h-4 w-4 mr-1" />
                -5.1%
              </span>
            </div>
            <p className="text-gray-500 text-sm mb-1">Avg Resolution Time</p>
            <p className="text-2xl font-bold text-gray-800">{stats.overview.averageResolutionTime}</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Activity className="h-6 w-6 text-purple-600" />
              </div>
              <span className="flex items-center text-green-600 text-sm">
                <TrendingUp className="h-4 w-4 mr-1" />
                +3.7%
              </span>
            </div>
            <p className="text-gray-500 text-sm mb-1">Resolution Rate</p>
            <p className="text-2xl font-bold text-gray-800">{stats.overview.resolutionRate}%</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Monthly Trends */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-gray-800 text-lg font-semibold">Monthly Trends</h3>
              <div className="flex space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded"></div>
                  <span className="text-gray-600 text-sm">Lost Items</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded"></div>
                  <span className="text-gray-600 text-sm">Found Items</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-purple-500 rounded"></div>
                  <span className="text-gray-600 text-sm">Resolved</span>
                </div>
              </div>
            </div>
            <div className="h-64 flex items-end justify-between space-x-2">
              {monthlyData.map((data, index) => (
                <div key={index} className="flex-1 flex flex-col items-center space-y-2">
                  <div className="w-full flex flex-col space-y-1">
                    <div 
                      className="bg-blue-500 rounded-t"
                      style={{ height: `${(data.lost / 30) * 100}%` }}
                    ></div>
                    <div 
                      className="bg-green-500"
                      style={{ height: `${(data.found / 30) * 100}%` }}
                    ></div>
                    <div 
                      className="bg-purple-500 rounded-b"
                      style={{ height: `${(data.resolved / 30) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-gray-600 text-xs">{data.month}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Category Distribution */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-gray-800 text-lg font-semibold">Category Distribution</h3>
              <PieChart className="h-5 w-5 text-gray-400" />
            </div>
            <div className="h-64 flex items-center justify-center">
              <div className="relative w-48 h-48">
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-500 via-purple-500 to-green-500 opacity-80"></div>
                <div className="absolute inset-4 rounded-full bg-white flex items-center justify-center">
                  <span className="text-gray-800 text-2xl font-bold">100%</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {categoryData.map((category, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded ${category.color}`}></div>
                  <span className="text-gray-600 text-sm">{category.name}: {category.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Resolution Time by Category */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mb-8">
          <h3 className="text-gray-800 text-lg font-semibold mb-6">Average Resolution Time by Category</h3>
          <div className="space-y-4">
            {resolutionTimeData.map((item, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className="w-32 text-gray-700 text-sm font-medium">{item.category}</div>
                <div className="flex-1 bg-gray-200 rounded-full h-4">
                  <div 
                    className="bg-blue-500 h-4 rounded-full"
                    style={{ width: `${(item.avgTime / 4) * 100}%` }}
                  ></div>
                </div>
                <div className="w-16 text-gray-600 text-sm text-right">{item.avgTime} days</div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Performers */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h3 className="text-gray-800 text-lg font-semibold mb-6">Top Performers</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-gray-600 font-medium text-sm">Name</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-medium text-sm">Items Found</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-medium text-sm">Success Rate</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-medium text-sm">Performance</th>
                </tr>
              </thead>
              <tbody>
                {topPerformers.map((performer, index) => (
                  <tr key={index} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 text-gray-800">{performer.name}</td>
                    <td className="py-3 px-4 text-gray-600">{performer.itemsFound}</td>
                    <td className="py-3 px-4 text-gray-600">{performer.successRate}%</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${performer.successRate}%` }}
                          ></div>
                        </div>
                        <span className="text-gray-600 text-sm">{performer.successRate}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
