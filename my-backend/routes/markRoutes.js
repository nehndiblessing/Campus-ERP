import express from "express";
import protect from "../middleware/authMiddleware.js";
import adminOnly from "../middleware/adminMiddleware.js";
import {
  getMarks,
  createMark,
  deleteMark,
} from "../controllers/markController.js";

const router = express.Router();

router.get("/", protect, getMarks);
router.post("/", protect, adminOnly, createMark);
router.delete("/:id", protect, adminOnly, deleteMark);

export default router;
