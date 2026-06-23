import express from "express";
import protect from "../middleware/authMiddleware.js";
import adminOnly from "../middleware/adminMiddleware.js";
import {
  getMarks,
  getMarksAnalytics,
  createMark,
  updateMark,
  deleteMark,
} from "../controllers/markController.js";

const router = express.Router();

router.get("/analytics", protect, getMarksAnalytics);
router.get("/", protect, getMarks);
router.post("/", protect, adminOnly, createMark);
router.put("/:id", protect, adminOnly, updateMark);
router.delete("/:id", protect, adminOnly, deleteMark);

export default router;
