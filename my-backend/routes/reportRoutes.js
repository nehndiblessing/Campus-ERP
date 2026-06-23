import express from "express";
import protect from "../middleware/authMiddleware.js";
import adminOnly from "../middleware/adminMiddleware.js";
import { exportPDF, exportExcel } from "../controllers/reportController.js";

const router = express.Router();

router.get("/pdf", protect, adminOnly, exportPDF);
router.get("/excel", protect, adminOnly, exportExcel);

export default router;
