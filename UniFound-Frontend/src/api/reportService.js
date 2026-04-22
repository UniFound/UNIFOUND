import api from './axios.js';

// System Overview API calls
export const getSystemOverviewData = async () => {
  try {
    const response = await api.get('/reports/system-overview');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching system overview data:', error);
    throw error;
  }
};

// User Activity Report API calls
export const getUserActivityData = async (dateRange = 'month') => {
  try {
    const response = await api.get(`/reports/user-activity?dateRange=${dateRange}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching user activity data:', error);
    throw error;
  }
};

// Items Report API calls
export const getItemsReportData = async () => {
  try {
    const response = await api.get('/reports/items');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching items report data:', error);
    throw error;
  }
};

// Categories Report API calls
export const getCategoriesReportData = async () => {
  try {
    const response = await api.get('/reports/categories');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching categories report data:', error);
    throw error;
  }
};

// Claims Approval/Rejected Report API calls
export const getClaimsReportData = async () => {
  try {
    const response = await api.get('/reports/claims');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching claims report data:', error);
    throw error;
  }
};

// Generate and save report
export const generateReport = async (reportData) => {
  try {
    const response = await api.post('/reports/generate', reportData);
    return response.data.data;
  } catch (error) {
    console.error('Error generating report:', error);
    throw error;
  }
};

// Get all reports
export const getAllReports = async (params = {}) => {
  try {
    const response = await api.get('/reports', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching reports:', error);
    throw error;
  }
};

// Get single report by ID
export const getReportById = async (id) => {
  try {
    const response = await api.get(`/reports/${id}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching report:', error);
    throw error;
  }
};

// Download report file
export const downloadReportFile = async (id) => {
  try {
    const response = await api.get(`/reports/${id}/download`, {
      responseType: 'blob'
    });
    return response.data;
  } catch (error) {
    console.error('Error downloading report:', error);
    throw error;
  }
};

// Delete report
export const deleteReportById = async (id) => {
  try {
    await api.delete(`/reports/${id}`);
  } catch (error) {
    console.error('Error deleting report:', error);
    throw error;
  }
};

// Update scheduled report
export const updateScheduledReport = async (id, scheduleData) => {
  try {
    const response = await api.patch(`/reports/${id}/schedule`, scheduleData);
    return response.data.data;
  } catch (error) {
    console.error('Error updating scheduled report:', error);
    throw error;
  }
};
