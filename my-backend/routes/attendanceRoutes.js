import express from "express";

import protect from "../middleware/authMiddleware.js";
import adminOnly from "../middleware/adminMiddleware.js";

import {
  getAttendance,
  createAttendance,
  bulkCreateAttendance,
  deleteAttendance,
} from "../controllers/attendanceController.js";

const router = express.Router();

router
  .route("/")
  .get(protect, getAttendance)
  .post(protect, adminOnly, createAttendance);

router.post("/bulk", protect, adminOnly, bulkCreateAttendance);

router
  .route("/:id")
  .delete(protect, adminOnly, deleteAttendance);

export default router;