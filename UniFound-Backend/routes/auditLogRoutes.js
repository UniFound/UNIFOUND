import express from "express";
import { getAllLogs, exportLogs } from "../controllers/auditLogController.js";

const router = express.Router();

// Get all audit logs with filtering and pagination
router.get("/", getAllLogs);

// Export audit logs as CSV
router.get("/export", exportLogs);

export default router;
