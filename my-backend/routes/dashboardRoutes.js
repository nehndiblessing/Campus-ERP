import express from "express";

import protect from "../middleware/authMiddleware.js";

import {
  getDashboardStats,
  getAttendanceTrend,
  getSubjectAverageMarks,
} from "../controllers/dashboardController.js";

const router = express.Router();

router.get("/stats", protect, getDashboardStats);
router.get("/attendance-trend", protect, getAttendanceTrend);
router.get("/subject-averages", protect, getSubjectAverageMarks);

export default router;