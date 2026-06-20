import express from "express";

import protect from "../middleware/authMiddleware.js";
import adminOnly from "../middleware/adminMiddleware.js";

import {
  getAttendance,
  createAttendance,
  deleteAttendance,
} from "../controllers/attendanceController.js";

const router = express.Router();

router
  .route("/")
  .get(protect, getAttendance)
  .post(protect, adminOnly, createAttendance);

router
  .route("/:id")
  .delete(protect, adminOnly, deleteAttendance);

export default router;