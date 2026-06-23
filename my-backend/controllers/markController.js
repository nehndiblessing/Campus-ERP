import mongoose from "mongoose";
import Mark from "../models/Marks.js";
import Student from "../models/Student.js";
import Activity from "../models/Activity.js";

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

export const getMarksAnalytics = async (req, res) => {
  try {
    const totalMarks = await Mark.countDocuments();

    if (totalMarks === 0) {
      return res.json({
        averageMarks: 0,
        passRate: 0,
        topSubject: null,
        lowestSubject: null,
      });
    }

    const analytics = await Mark.aggregate([
      {
        $facet: {
          overall: [
            {
              $group: {
                _id: null,
                averageMarks: { $avg: "$marks" },
                totalMarks: { $sum: 1 },
                passedMarks: {
                  $sum: {
                    $cond: [{ $gte: ["$marks", 40] }, 1, 0],
                  },
                },
              },
            },
            {
              $project: {
                _id: 0,
                averageMarks: { $round: ["$averageMarks", 1] },
                passRate: {
                  $round: [
                    {
                      $multiply: [
                        { $divide: ["$passedMarks", "$totalMarks"] },
                        100,
                      ],
                    },
                    1,
                  ],
                },
              },
            },
          ],
          subjects: [
            {
              $group: {
                _id: "$subject",
                averageMarks: { $avg: "$marks" },
              },
            },
            {
              $project: {
                _id: 0,
                subject: "$_id",
                averageMarks: { $round: ["$averageMarks", 1] },
              },
            },
            {
              $sort: {
                averageMarks: -1,
                subject: 1,
              },
            },
          ],
        },
      },
    ]);

    const overall = analytics[0]?.overall?.[0] ?? {
      averageMarks: 0,
      passRate: 0,
    };
    const subjects = analytics[0]?.subjects ?? [];

    res.json({
      averageMarks: overall.averageMarks,
      passRate: overall.passRate,
      topSubject: subjects[0] ?? null,
      lowestSubject: subjects[subjects.length - 1] ?? null,
    });
  } catch (error) {
    console.error("Marks analytics error:", error);
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

    await Activity.create({
      action: "marks_uploaded",
      description: `Marks uploaded for ${existingStudent.name} - ${subject} (${examType}: ${numericMarks})`,
    });

    res.status(201).json(mark);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateMark = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid mark ID" });
    }

    const { student, subject, examType, marks } = req.body;

    if (!student || !subject || !examType || marks === undefined) {
      return res.status(400).json({ message: "Student, subject, exam type, and marks are required" });
    }

    if (!validExamTypes.includes(examType)) {
      return res.status(400).json({ message: "Invalid exam type" });
    }

    const numericMarks = Number(marks);
    if (numericMarks < 0 || numericMarks > 100) {
      return res.status(400).json({ message: "Marks must be between 0 and 100" });
    }

    const mark = await Mark.findByIdAndUpdate(
      req.params.id,
      { student, subject, examType, marks: numericMarks },
      { new: true, runValidators: true }
    );

    if (!mark) {
      return res.status(404).json({ message: "Mark not found" });
    }

    res.json(mark);
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
  getMarksAnalytics,
  createMark,
  updateMark,
  deleteMark,
};
