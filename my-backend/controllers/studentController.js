import mongoose from "mongoose";
import Student from "../models/Student.js";
import Attendance from "../models/Attendance.js";
import Mark from "../models/Marks.js";
import Activity from "../models/Activity.js";

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

export const getStudents = async (req, res) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Number(req.query.limit ?? 0);
    const { department, semester, searchName, searchRollNo } = req.query;
    const filter = {};
    if (department) filter.department = department;
    if (semester) filter.semester = parseInt(semester, 10);
    if (searchName) filter.name = { $regex: searchName, $options: "i" };
    if (searchRollNo) filter.rollNo = { $regex: searchRollNo, $options: "i" };

    const total = await Student.countDocuments(filter);
    const query = Student.find(filter).populate("department");

    if (limit > 0) {
      query.skip((page - 1) * limit).limit(limit);
    }

    const students = await query;
    const totalPages = limit > 0 ? Math.max(1, Math.ceil(total / limit)) : 1;

    res.json({
      students,
      page,
      limit,
      totalPages,
      total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getStudentById = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid student ID" });
    }

    const student = await Student.findById(req.params.id).populate("department");

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createStudent = async (req, res) => {
  try {
    const { name, email, rollNo, department, semester } = req.body;

    if (!name || !email || !rollNo || !department || !semester) {
      return res.status(400).json({ message: "All student fields are required" });
    }

    const student = await (await Student.create(req.body)).populate("department");

    await Activity.create({
      action: "student_created",
      description: `New student "${student.name}" (${student.rollNo}) added`,
    });

    res.status(201).json(student);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Student email or roll number must be unique" });
    }
    res.status(500).json({ message: error.message });
  }
};

export const updateStudent = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid student ID" });
    }

    let student = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    student = await student.populate("department");
    res.json(student);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Student email or roll number must be unique" });
    }
    res.status(500).json({ message: error.message });
  }
};

export const deleteStudent = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid student ID" });
    }

    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    await Attendance.deleteMany({ student: req.params.id });
    await Mark.deleteMany({ student: req.params.id });
    await student.deleteOne();

    res.json({ message: "Student and related records deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getStudentProfile = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid student ID" });
    }

    const student = await Student.findById(req.params.id).populate("department");

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const attendance = await Attendance.find({ student: req.params.id });
    const marks = await Mark.find({ student: req.params.id });

    res.json({ student, attendance, marks });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
