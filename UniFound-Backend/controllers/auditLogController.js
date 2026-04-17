import AuditLog from "../models/auditLog.js";

/**
 * Get all audit logs with filtering, sorting, and pagination
 * Query parameters:
 * - search: Search in user, action, resource fields
 * - action: Filter by specific action
 * - status: Filter by status (success, error)
 * - date: Filter by specific date (YYYY-MM-DD)
 * - page: Page number (default: 1)
 * - limit: Number of logs per page (default: 50)
 */
export const getAllLogs = async (req, res) => {
  try {
    const {
      search,
      action,
      status,
      date,
      page = 1,
      limit = 50
    } = req.query;

    // Build query
    const query = {};

    // Search filter (search in user, action, resource)
    if (search) {
      query.$or = [
        { user: { $regex: search, $options: 'i' } },
        { action: { $regex: search, $options: 'i' } },
        { resource: { $regex: search, $options: 'i' } }
      ];
    }

    // Action filter
    if (action) {
      query.action = { $regex: action, $options: 'i' };
    }

    // Status filter
    if (status) {
      query.status = status;
    }

    // Date filter (filter by specific date)
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      startDate.setHours(0, 0, 0, 0);
      
      query.timestamp = {
        $gte: startDate,
        $lte: endDate
      };
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const limitNum = parseInt(limit);

    // Fetch logs
    const logs = await AuditLog.find(query)
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limitNum);

    // Get total count for pagination
    const totalLogs = await AuditLog.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        logs,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalLogs / limitNum),
          totalLogs,
          limit: limitNum
        }
      }
    });

  } catch (error) {
    console.error("Error fetching audit logs:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch audit logs"
    });
  }
};

/**
 * Export audit logs as CSV file
 */
export const exportLogs = async (req, res) => {
  try {
    const { search, action, status, date } = req.query;

    // Build same query as getAllLogs
    const query = {};

    if (search) {
      query.$or = [
        { user: { $regex: search, $options: 'i' } },
        { action: { $regex: search, $options: 'i' } },
        { resource: { $regex: search, $options: 'i' } }
      ];
    }

    if (action) {
      query.action = { $regex: action, $options: 'i' };
    }

    if (status) {
      query.status = status;
    }

    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      startDate.setHours(0, 0, 0, 0);
      
      query.timestamp = {
        $gte: startDate,
        $lte: endDate
      };
    }

    // Fetch all logs (no pagination for export)
    const logs = await AuditLog.find(query).sort({ timestamp: -1 });

    // Convert to CSV
    const csvHeaders = 'User,Action,Resource,Status,Details,Timestamp\n';
    const csvData = logs.map(log => {
      const row = [
        `"${log.user}"`,
        `"${log.action}"`,
        `"${log.resource}"`,
        `"${log.status}"`,
        `"${log.details || ''}"`,
        `"${log.timestamp.toISOString()}"`
      ].join(',');
      return row;
    }).join('\n');

    const csv = csvHeaders + csvData;

    // Set headers for CSV download
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="audit-logs-${new Date().toISOString().split('T')[0]}.csv"`);
    
    res.send(csv);

  } catch (error) {
    console.error("Error exporting audit logs:", error);
    res.status(500).json({
      success: false,
      message: "Failed to export audit logs"
    });
  }
};
