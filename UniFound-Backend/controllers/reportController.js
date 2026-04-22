import Report from '../models/report.js';
import User from '../models/user.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create reports directory if it doesn't exist
const reportsDir = path.join(__dirname, '../reports');
if (!fs.existsSync(reportsDir)) {
  fs.mkdirSync(reportsDir, { recursive: true });
}

// @desc    Get system overview data
// @route   GET /api/reports/system-overview
// @access  Private/Admin
export const getSystemOverviewData = async (req, res) => {
  try {
    const data = await Report.getSystemOverviewData();
    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get user activity data
// @route   GET /api/reports/user-activity
// @access  Private/Admin
export const getUserActivityData = async (req, res) => {
  try {
    const { dateRange = 'month' } = req.query;
    const data = await Report.getUserActivityData(dateRange);
    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get items report data
// @route   GET /api/reports/items
// @access  Private/Admin
export const getItemsReportData = async (req, res) => {
  try {
    const data = await Report.getItemsReportData();
    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get categories report data
// @route   GET /api/reports/categories
// @access  Private/Admin
export const getCategoriesReportData = async (req, res) => {
  try {
    const { dateRange = 'month' } = req.query;
    const data = await Report.getCategoriesReportData(dateRange);
    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get claims report data
// @route   GET /api/reports/claims
// @access  Private/Admin
export const getClaimsReportData = async (req, res) => {
  try {
    const data = await Report.getClaimsReportData();
    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Generate and save a report
// @route   POST /api/reports/generate
// @access  Private/Admin
export const generateReport = async (req, res) => {
  try {
    const { type, format, dateRange, emailRecipients, isScheduled, scheduleFrequency } = req.body;
    
    if (!type || !format || !dateRange) {
      return res.status(400).json({
        success: false,
        message: 'Please provide type, format, and dateRange'
      });
    }

    // Get data based on report type
    let data;
    switch (type) {
      case 'overview':
        data = await Report.getSystemOverviewData(dateRange);
        break;
      case 'users':
        data = await Report.getUserActivityData(dateRange);
        break;
      case 'categories':
        data = await Report.getCategoriesReportData(dateRange);
        break;
      case 'claims':
        data = await Report.getClaimsReportData(dateRange);
        break;
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid report type'
        });
    }

    // Create report record
    const report = new Report({
      name: `${getReportTypeName(type)} - ${new Date().toLocaleDateString()}`,
      type,
      format,
      dateRange,
      generatedBy: req.user._id,
      data,
      emailRecipients: emailRecipients || [],
      isScheduled: isScheduled || false,
      scheduleFrequency: scheduleFrequency || null
    });

    // Generate file
    const fileName = await generateReportFile(report, data);
    report.filePath = fileName;
    report.fileSize = getFileSize(fileName);
    report.status = 'completed';

    await report.save();

    res.status(201).json({
      success: true,
      data: report
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all reports
// @route   GET /api/reports
// @access  Private/Admin
export const getAllReports = async (req, res) => {
  try {
    const { page = 1, limit = 10, type, status } = req.query;
    
    const query = {};
    if (type) query.type = type;
    if (status) query.status = status;

    const reports = await Report.find(query)
      .populate('generatedBy', 'name email')
      .sort({ generatedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Report.countDocuments(query);

    res.status(200).json({
      success: true,
      data: reports,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single report by ID
// @route   GET /api/reports/:id
// @access  Private/Admin
export const getReportById = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id)
      .populate('generatedBy', 'name email');

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    res.status(200).json({
      success: true,
      data: report
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Download report file
// @route   GET /api/reports/:id/download
// @access  Private/Admin
export const downloadReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    if (!report.filePath) {
      return res.status(404).json({
        success: false,
        message: 'Report file not found'
      });
    }

    const filePath = path.join(reportsDir, report.filePath);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'Report file does not exist'
      });
    }

    res.download(filePath, report.name);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete report
// @route   DELETE /api/reports/:id
// @access  Private/Admin
export const deleteReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    // Delete file if exists
    if (report.filePath) {
      const filePath = path.join(reportsDir, report.filePath);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await report.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Report deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update scheduled report
// @route   PATCH /api/reports/:id/schedule
// @access  Private/Admin
export const updateScheduledReport = async (req, res) => {
  try {
    const { isScheduled, scheduleFrequency, emailRecipients } = req.body;
    
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    report.isScheduled = isScheduled !== undefined ? isScheduled : report.isScheduled;
    report.scheduleFrequency = scheduleFrequency || report.scheduleFrequency;
    report.emailRecipients = emailRecipients || report.emailRecipients;

    if (isScheduled && scheduleFrequency) {
      report.nextScheduledRun = calculateNextScheduledRun(scheduleFrequency);
    }

    await report.save();

    res.status(200).json({
      success: true,
      data: report
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Helper functions
function getReportTypeName(type) {
  const names = {
    overview: 'System Overview',
    users: 'User Activity Report',
    items: 'Items Report',
    categories: 'Categories Report',
    claims: 'Claims Approval/Rejected Report'
  };
  return names[type] || 'Unknown Report';
}

async function generateReportFile(report, data) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const fileName = `${report.type}_${report.format}_${timestamp}.${report.format}`;
  const filePath = path.join(reportsDir, fileName);

  let content;

  switch (report.format) {
    case 'csv':
      content = generateCSVContent(report.type, data);
      break;
    case 'excel':
      content = generateExcelContent(report.type, data);
      break;
    default:
      throw new Error('Unsupported format');
  }

  fs.writeFileSync(filePath, content);
  return fileName;
}

function generateCSVContent(type, data) {
  const timestamp = new Date().toLocaleString();
  
  switch (type) {
    case 'overview':
      return [
        ['Metric', 'Value'],
        ['Report Name', 'System Overview'],
        ['Generated', timestamp],
        ['Total Users', data.totalUsers],
        ['Found Items', data.foundItems],
        ['Active Claims', data.activeClaims],
        ['Open Tickets', data.openTickets]
      ].map(row => row.join(',')).join('\n');

    case 'users':
      const userHeaders = ['User Name', 'Email', 'Role', 'Status', 'Items Posted', 'Claims Made', 'Total Actions'];
      const userRows = data.userActivity.map(user => [
        user.name,
        user.email,
        user.role || 'customer',
        user.status || 'active',
        user.itemsPosted,
        user.claimsMade,
        user.totalActivity || 0
      ]);
      return [
        ['Report Name', 'User Activity Report'],
        ['Generated', timestamp],
        ['Date Range', data.dateRange || 'month'],
        [],
        ['Summary', ''],
        ['Total Users', data.userCategories?.totalUsers || 0],
        ['Active Users', data.userCategories?.activeUsers || 0],
        ['Admin Users', data.userCategories?.adminUsers || 0],
        ['Suspended Users', data.userCategories?.suspendedUsers || 0],
        [],
        userHeaders,
        ...userRows
      ].map(row => row.join(',')).join('\n');

    case 'items':
      const itemHeaders = ['Category', 'Item Count'];
      const itemRows = data.itemsByCategory.map(cat => [
        cat.categoryName,
        cat.itemCount
      ]);
      return [
        ['Report Name', 'Items Report'],
        ['Generated', timestamp],
        ['Total Items', data.totalItems],
        ['Average Resolution Time (days)', data.avgResolutionTime],
        ['Success Rate (%)', data.successRate],
        [],
        ...itemHeaders,
        ...itemRows
      ].map(row => row.join(',')).join('\n');

    case 'categories':
      const summaryHeaders = ['Metric', 'Value'];
      const summaryRows = [
        ['Report Name', 'Categories Report'],
        ['Generated', timestamp],
        ['Date Range', data.dateRange || 'month'],
        ['Period Start', data.period?.start ? new Date(data.period.start).toLocaleDateString() : 'N/A'],
        ['Period End', data.period?.end ? new Date(data.period.end).toLocaleDateString() : 'N/A'],
        [],
        ['Category Summary', ''],
        ['Total Categories', data.categorySummary?.totalCategories || 0],
        ['Active Categories', data.categorySummary?.activeCategories || 0],
        ['Inactive Categories', data.categorySummary?.inactiveCategories || 0],
        ['Categories With Items', data.categorySummary?.categoriesWithItems || 0],
        ['Empty Categories', data.categorySummary?.emptyCategories || 0],
        ['Total Items', data.categorySummary?.totalItems || 0],
        ['Recent Items', data.categorySummary?.totalRecentItems || 0],
        [],
        ['Category Details', ''],
        ['Category Name', 'Description', 'Status', 'Total Items', 'Recent Items', 'Unclaimed Items', 'Claimed Items', 'Claim Rate %']
      ];
      
      const categoryRows = data.categoryDistribution.map(cat => [
        cat.categoryName || 'N/A',
        cat.description || '',
        cat.isActive ? 'Active' : 'Inactive',
        cat.totalItems || 0,
        cat.recentItems || 0,
        cat.unclaimedItems || 0,
        cat.claimedItems || 0,
        cat.claimRate || 0
      ]);
      
      return [summaryHeaders, ...summaryRows, [], ...categoryRows].map(row => row.join(',')).join('\n');

    case 'claims':
      const claimData = [
        ['Report Name', 'Claims Approval/Rejected Report'],
        ['Generated', timestamp],
        ['Total Claims', data.totalClaims],
        ['Approved Claims', data.approvedClaims],
        ['Rejected Claims', data.rejectedClaims],
        ['Pending Claims', data.pendingClaims],
        ['Approval Rate (%)', data.approvalRate],
        ['Rejection Rate (%)', data.rejectionRate],
        ['Average Processing Time (days)', data.avgProcessingTime]
      ];
      return claimData.map(row => row.join(',')).join('\n');

    default:
      return 'No data available';
  }
}

function generateExcelContent(type, data) {
  const timestamp = new Date().toLocaleString();
  const reportName = getReportTypeName(type);

  switch (type) {
    case 'overview':
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
            <table>
              <tr><th>Metric</th><th>Value</th></tr>
              <tr><td>Total Users</td><td>${data.totalUsers}</td></tr>
              <tr><td>Found Items</td><td>${data.foundItems}</td></tr>
              <tr><td>Active Claims</td><td>${data.activeClaims}</td></tr>
              <tr><td>Open Tickets</td><td>${data.openTickets}</td></tr>
            </table>
          </body>
        </html>
      `;

    case 'users':
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
            <p><strong>Date Range:</strong> ${data.dateRange || 'month'}</p>
            
            <h3>User Summary</h3>
            <table>
              <tr><th>Metric</th><th>Value</th></tr>
              <tr><td>Total Users</td><td>${data.userCategories?.totalUsers || 0}</td></tr>
              <tr><td>Active Users</td><td>${data.userCategories?.activeUsers || 0}</td></tr>
              <tr><td>Admin Users</td><td>${data.userCategories?.adminUsers || 0}</td></tr>
              <tr><td>Suspended Users</td><td>${data.userCategories?.suspendedUsers || 0}</td></tr>
            </table>
            
            <h3>User Activity Details</h3>
            <table>
              <tr><th>User Name</th><th>Email</th><th>Role</th><th>Status</th><th>Items Posted</th><th>Claims Made</th><th>Total Actions</th></tr>
              ${data.userActivity.map(user => `
                <tr>
                  <td>${user.name}</td>
                  <td>${user.email}</td>
                  <td>${user.role || 'customer'}</td>
                  <td>${user.status || 'active'}</td>
                  <td>${user.itemsPosted}</td>
                  <td>${user.claimsMade}</td>
                  <td>${user.totalActivity || 0}</td>
                </tr>
              `).join('')}
            </table>
          </body>
        </html>
      `;

    case 'categories':
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
            <p><strong>Date Range:</strong> ${data.dateRange || 'month'}</p>
            <p><strong>Period:</strong> ${data.period?.start ? new Date(data.period.start).toLocaleDateString() : 'N/A'} - ${data.period?.end ? new Date(data.period.end).toLocaleDateString() : 'N/A'}</p>
            
            <h3>Category Summary</h3>
            <table class="summary-table">
              <tr><th>Metric</th><th>Value</th></tr>
              <tr><td>Total Categories</td><td>${data.categorySummary?.totalCategories || 0}</td></tr>
              <tr><td>Active Categories</td><td>${data.categorySummary?.activeCategories || 0}</td></tr>
              <tr><td>Inactive Categories</td><td>${data.categorySummary?.inactiveCategories || 0}</td></tr>
              <tr><td>Categories With Items</td><td>${data.categorySummary?.categoriesWithItems || 0}</td></tr>
              <tr><td>Empty Categories</td><td>${data.categorySummary?.emptyCategories || 0}</td></tr>
              <tr><td>Total Items</td><td>${data.categorySummary?.totalItems || 0}</td></tr>
              <tr><td>Recent Items</td><td>${data.categorySummary?.totalRecentItems || 0}</td></tr>
            </table>
            
            <h3>Category Details</h3>
            <table class="details-table">
              <tr><th>Category Name</th><th>Description</th><th>Status</th><th>Total Items</th><th>Recent Items</th><th>Unclaimed Items</th><th>Claimed Items</th><th>Claim Rate %</th></tr>
              ${data.categoryDistribution.map(cat => `
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

    // Add other cases for items, claims...
    default:
      return '<html><body><h2>No data available</h2></body></html>';
  }
}


function getFileSize(fileName) {
  const filePath = path.join(reportsDir, fileName);
  const stats = fs.statSync(filePath);
  const bytes = stats.size;
  
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function calculateNextScheduledRun(frequency) {
  const now = new Date();
  
  switch (frequency) {
    case 'daily':
      return new Date(now.getTime() + 24 * 60 * 60 * 1000);
    case 'weekly':
      return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    case 'monthly':
      return new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());
    case 'quarterly':
      return new Date(now.getFullYear(), now.getMonth() + 3, now.getDate());
    default:
      return null;
  }
}
