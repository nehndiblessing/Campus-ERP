import express from "express";

import protect from "../middleware/authMiddleware.js";

import {
  getDashboardStats,
  getAttendanceTrend,
  getSubjectAverageMarks,
  getDepartmentStats,
  getAtRiskStudents,
} from "../controllers/dashboardController.js";

const router = express.Router();

router.get("/stats", protect, getDashboardStats);
router.get("/attendance-trend", protect, getAttendanceTrend);
router.get("/subject-averages", protect, getSubjectAverageMarks);
router.get("/department-stats", protect, getDepartmentStats);
router.get("/at-risk", protect, getAtRiskStudents);

export default router;