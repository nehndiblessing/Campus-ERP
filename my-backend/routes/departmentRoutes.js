import express from "express";

import {
  getDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from "../controllers/departmentController.js";

import protect from "../middleware/authMiddleware.js";
import adminOnly from "../middleware/adminMiddleware.js";

const router = express.Router();

router
  .route("/")
  .get(protect, getDepartments)
  .post(protect, adminOnly, createDepartment);

router
  .route("/:id")
  .get(protect, getDepartmentById)
  .put(protect, adminOnly, updateDepartment)
  .delete(protect, adminOnly, deleteDepartment);

export default router;
