import express from 'express';
import {
  getSystemOverviewData,
  getUserActivityData,
  getItemsReportData,
  getCategoriesReportData,
  getClaimsReportData,
  generateReport,
  getAllReports,
  getReportById,
  downloadReport,
  deleteReport,
  updateScheduledReport
} from '../controllers/reportController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Apply protection to all routes
router.use(protect);
router.use(authorize('admin'));

// Data endpoints for real-time report generation
router.get('/system-overview', getSystemOverviewData);
router.get('/user-activity', getUserActivityData);
router.get('/items', getItemsReportData);
router.get('/categories', getCategoriesReportData);
router.get('/claims', getClaimsReportData);

// Report management endpoints
router.post('/generate', generateReport);
router.get('/', getAllReports);
router.get('/:id', getReportById);
router.get('/:id/download', downloadReport);
router.delete('/:id', deleteReport);
router.patch('/:id/schedule', updateScheduledReport);

export default router;
