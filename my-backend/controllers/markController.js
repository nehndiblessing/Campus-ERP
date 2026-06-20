import mongoose from "mongoose";
import Mark from "../models/Marks.js";
import Student from "../models/Student.js";

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);
const validExamTypes = ["Quiz", "Midterm", "Final"];

export const getMarks = async (req, res) => {
  try {
    const marks = await Mark.find().populate("student", "name rollNo");
    res.json(marks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createMark = async (req, res) => {
  try {
    const { student, subject, examType, marks } = req.body;

    if (!student || !subject || !examType || marks === undefined) {
      return res.status(400).json({ message: "Student, subject, exam type, and marks are required" });
    }

    if (!isValidObjectId(student)) {
      return res.status(400).json({ message: "Invalid student ID" });
    }

    if (!validExamTypes.includes(examType)) {
      return res.status(400).json({ message: "Invalid exam type" });
    }

    if (typeof marks !== "number" && isNaN(Number(marks))) {
      return res.status(400).json({ message: "Marks must be a number" });
    }

    const numericMarks = Number(marks);
    if (numericMarks < 0 || numericMarks > 100) {
      return res.status(400).json({ message: "Marks must be between 0 and 100" });
    }

    const existingStudent = await Student.findById(student);
    if (!existingStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    const mark = await Mark.create({
      student,
      subject,
      examType,
      marks: numericMarks,
    });

    res.status(201).json(mark);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteMark = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid mark ID" });
    }

    const mark = await Mark.findById(req.params.id);

    if (!mark) {
      return res.status(404).json({ message: "Mark not found" });
    }

    await mark.deleteOne();
    res.json({ message: "Mark deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default {
  getMarks,
  createMark,
  deleteMark,
};