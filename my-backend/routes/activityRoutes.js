import express from "express";
import protect from "../middleware/authMiddleware.js";
import { getActivities } from "../controllers/activityController.js";

const router = express.Router();

router.get("/", protect, getActivities);

export default router;
