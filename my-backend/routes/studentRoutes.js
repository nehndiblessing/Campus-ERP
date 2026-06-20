import express from "express";

import {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  getStudentProfile,
} from "../controllers/studentController.js";

import protect from "../middleware/authMiddleware.js";
import adminOnly from "../middleware/adminMiddleware.js";

const router = express.Router();

router.get('/:id/profile', protect, getStudentProfile);

router
  .route("/")
  .get(protect, getStudents)
  .post(protect, adminOnly, createStudent);

router
  .route("/:id")
  .get(protect, getStudentById)
  .put(protect, adminOnly, updateStudent)
  .delete(protect, adminOnly, deleteStudent);

export default router;