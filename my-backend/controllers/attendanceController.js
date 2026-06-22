import mongoose from "mongoose";
import Attendance from "../models/Attendance.js";
import Student from "../models/Student.js";

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

export const getAttendance = async (req, res) => {
  try {
    const { date } = req.query;
    const filter = {};
    if (date) {
      const d = new Date(date);
      d.setHours(0, 0, 0, 0);
      const next = new Date(d);
      next.setDate(next.getDate() + 1);
      filter.date = { $gte: d, $lt: next };
    }
    const attendance = await Attendance.find(filter).populate("student", "name rollNo");
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createAttendance = async (req, res) => {
  try {
    const { student, date, status } = req.body;

    if (!student || !date || !status) {
      return res.status(400).json({ message: "Student, date, and status are required" });
    }

    if (!isValidObjectId(student)) {
      return res.status(400).json({ message: "Invalid student ID" });
    }

    const existingStudent = await Student.findById(student);
    if (!existingStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    const attendanceDate = new Date(date);
    attendanceDate.setHours(0, 0, 0, 0);

    const existingRecord = await Attendance.findOne({
      student,
      date: attendanceDate,
    });

    if (existingRecord) {
      return res.status(400).json({ message: "Attendance already recorded for this student and date" });
    }

    const attendance = await Attendance.create({
      student,
      date: attendanceDate,
      status,
    });

    res.status(201).json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const bulkCreateAttendance = async (req, res) => {
  try {
    const { date, records } = req.body;

    if (!date || !records || !Array.isArray(records) || records.length === 0) {
      return res.status(400).json({ message: "Date and records array are required" });
    }

    const attendanceDate = new Date(date);
    attendanceDate.setHours(0, 0, 0, 0);

    const results = [];
    const errors = [];

    for (const record of records) {
      const { student, status } = record;
      if (!student || !status) {
        errors.push({ student, message: "Student and status are required" });
        continue;
      }

      try {
        const existing = await Attendance.findOne({
          student,
          date: attendanceDate,
        });

        if (existing) {
          existing.status = status;
          await existing.save();
          results.push(existing);
        } else {
          const created = await Attendance.create({
            student,
            date: attendanceDate,
            status,
          });
          results.push(created);
        }
      } catch (err) {
        errors.push({ student, message: err.message });
      }
    }

    res.status(201).json({ results, errors });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteAttendance = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid attendance ID" });
    }

    const attendance = await Attendance.findById(req.params.id);

    if (!attendance) {
      return res.status(404).json({ message: "Attendance not found" });
    }

    await attendance.deleteOne();
    res.json({ message: "Attendance deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};