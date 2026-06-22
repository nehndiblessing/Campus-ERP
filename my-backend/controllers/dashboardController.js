import Student from "../models/Student.js";
import Attendance from "../models/Attendance.js";
import Mark from "../models/Marks.js";
import Department from "../models/Department.js";
export const getDashboardStats =
  async (req, res) => {
    try {
      const totalStudents =
        await Student.countDocuments();

      const today = new Date();

      today.setHours(
        0,
        0,
        0,
        0
      );

      const tomorrow =
        new Date(today);

      tomorrow.setDate(
        tomorrow.getDate() + 1
      );

      const presentToday =
        await Attendance.countDocuments(
          {
            date: {
              $gte: today,
              $lt: tomorrow,
            },
            status: "Present",
          }
        );

      const absentToday =
        await Attendance.countDocuments(
          {
            date: {
              $gte: today,
              $lt: tomorrow,
            },
            status: "Absent",
          }
        );

      const totalAttendance =
        presentToday +
        absentToday;

      const attendancePercentage =
        totalAttendance > 0
          ? (
              (presentToday /
                totalAttendance) *
              100
            ).toFixed(1)
          : 0;

      const recentStudents =
        await Student.find()
          .sort({
            createdAt: -1,
          })
          .limit(5);

      const totalMarksRecords = await Mark.countDocuments();

      const avgMarksAgg = await Mark.aggregate([
        {
          $group: {
            _id: null,
            average: { $avg: "$marks" },
          },
        },
      ]);

      const averageMarks =
        avgMarksAgg?.[0]?.average ?? 0;

      const startDate = new Date(today);
      startDate.setDate(startDate.getDate() - 6);

      const attendanceTrendAgg = await Attendance.aggregate([
        {
          $match: {
            date: {
              $gte: startDate,
              $lt: tomorrow,
            },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: {
                format: "%Y-%m-%d",
                date: "$date",
              },
            },
            present: {
              $sum: {
                $cond: [
                  { $eq: ["$status", "Present"] },
                  1,
                  0,
                ],
              },
            },
            absent: {
              $sum: {
                $cond: [
                  { $eq: ["$status", "Absent"] },
                  1,
                  0,
                ],
              },
            },
          },
        },
        {
          $sort: {
            _id: 1,
          },
        },
      ]);

      const attendanceTrend = [];
      for (let i = 0; i < 7; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        const dateString = date.toISOString().split("T")[0];
        const record = attendanceTrendAgg.find((item) => item._id === dateString);
        attendanceTrend.push({
          date: dateString,
          present: record?.present ?? 0,
          absent: record?.absent ?? 0,
        });
      }

      const subjectAverageAgg = await Mark.aggregate([
        {
          $group: {
            _id: "$subject",
            averageMarks: { $avg: "$marks" },
          },
        },
        {
          $sort: {
            averageMarks: -1,
          },
        },
      ]);

      const subjectAverageMarks = subjectAverageAgg.map((item) => ({
        subject: item._id,
        marks: Math.round(item.averageMarks),
      }));

      const attendanceData = [
        { name: "Present", value: presentToday },
        { name: "Absent", value: absentToday },
      ];

      res.json({
        totalStudents,
        presentToday,
        absentToday,
        attendancePercentage,
        totalMarksRecords,
        averageMarks,
        attendanceData,
        attendanceTrend,
        subjectAverageMarks,
        recentStudents,
      });
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  };

export const getAttendanceTrend = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - 6);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const attendanceTrendAgg = await Attendance.aggregate([
      {
        $match: {
          date: {
            $gte: startDate,
            $lt: tomorrow,
          },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$date",
            },
          },
          present: {
            $sum: {
              $cond: [
                { $eq: ["$status", "Present"] },
                1,
                0,
              ],
            },
          },
          absent: {
            $sum: {
              $cond: [
                { $eq: ["$status", "Absent"] },
                1,
                0,
              ],
            },
          },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
    ]);

    const attendanceTrend = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      const dateString = date.toISOString().split("T")[0];
      const record = attendanceTrendAgg.find((item) => item._id === dateString);
      attendanceTrend.push({
        date: dateString,
        present: record?.present ?? 0,
        absent: record?.absent ?? 0,
      });
    }

    res.json({ attendanceTrend });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDepartmentStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const departments = await Department.find().lean();

    const studentCounts = await Student.aggregate([
      { $group: { _id: "$department", count: { $sum: 1 } } },
    ]);

    const todayAttendance = await Attendance.aggregate([
      { $match: { date: { $gte: today, $lt: tomorrow } } },
      {
        $lookup: {
          from: "students",
          localField: "student",
          foreignField: "_id",
          as: "studentInfo",
        },
      },
      { $unwind: "$studentInfo" },
      {
        $group: {
          _id: "$studentInfo.department",
          present: {
            $sum: { $cond: [{ $eq: ["$status", "Present"] }, 1, 0] },
          },
          absent: {
            $sum: { $cond: [{ $eq: ["$status", "Absent"] }, 1, 0] },
          },
        },
      },
    ]);

    const avgMarks = await Mark.aggregate([
      {
        $lookup: {
          from: "students",
          localField: "student",
          foreignField: "_id",
          as: "studentInfo",
        },
      },
      { $unwind: "$studentInfo" },
      {
        $group: {
          _id: "$studentInfo.department",
          averageMarks: { $avg: "$marks" },
        },
      },
    ]);

    const deptStats = departments.map((dept) => {
      const deptId = dept._id.toString();
      const studentCount =
        studentCounts.find((s) => s._id.toString() === deptId)?.count || 0;
      const attendance = todayAttendance.find(
        (a) => a._id.toString() === deptId
      );
      const marks = avgMarks.find((m) => m._id.toString() === deptId);

      const present = attendance?.present || 0;
      const absent = attendance?.absent || 0;
      const totalAttendance = present + absent;
      const attendancePercentage =
        totalAttendance > 0
          ? ((present / totalAttendance) * 100).toFixed(1)
          : "0.0";

      return {
        department: dept.name,
        departmentCode: dept.code,
        totalStudents: studentCount,
        presentToday: present,
        absentToday: absent,
        attendancePercentage,
        averageMarks: marks?.averageMarks
          ? Math.round(marks.averageMarks)
          : 0,
      };
    });

    res.json({
      totalDepartments: departments.length,
      departmentStats: deptStats,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAtRiskStudents = async (req, res) => {
  try {
    const attendanceAgg = await Attendance.aggregate([
      {
        $group: {
          _id: "$student",
          total: { $sum: 1 },
          present: {
            $sum: { $cond: [{ $eq: ["$status", "Present"] }, 1, 0] },
          },
        },
      },
      {
        $project: {
          _id: 1,
          total: 1,
          present: 1,
          attendancePercent: {
            $round: [{ $multiply: [{ $divide: ["$present", "$total"] }, 100] }, 1],
          },
        },
      },
    ]);

    const marksAgg = await Mark.aggregate([
      { $group: { _id: "$student", avgMarks: { $avg: "$marks" } } },
    ]);

    const marksMap = {};
    marksAgg.forEach((m) => {
      marksMap[m._id.toString()] = Math.round(m.avgMarks);
    });

    const atRiskIds = new Set();
    const atRiskData = {};

    attendanceAgg.forEach((a) => {
      const sid = a._id.toString();
      const avgMarks = marksMap[sid];
      const hasLowAttendance = a.attendancePercent < 75;
      const hasLowMarks = avgMarks !== undefined && avgMarks < 40;
      if (hasLowAttendance || hasLowMarks) {
        atRiskIds.add(a._id);
        atRiskData[sid] = {
          attendancePercent: a.attendancePercent,
          totalAttendance: a.total,
          presentAttendance: a.present,
          avgMarks: avgMarks ?? 0,
        };
      }
    });

    marksAgg.forEach((m) => {
      const sid = m._id.toString();
      if (!atRiskIds.has(sid) && Math.round(m.avgMarks) < 40) {
        atRiskIds.add(m._id);
        atRiskData[sid] = {
          attendancePercent: 0,
          totalAttendance: 0,
          presentAttendance: 0,
          avgMarks: Math.round(m.avgMarks),
        };
      }
    });

    const students = await Student.find({ _id: { $in: [...atRiskIds] } })
      .populate("department", "name code")
      .lean();

    const result = students.map((s) => {
      const sid = s._id.toString();
      const d = atRiskData[sid];
      const lowAttendance = d.attendancePercent < 75;
      const lowMarks = d.avgMarks < 40;
      let reason;
      if (lowAttendance && lowMarks) reason = "Low attendance & low marks";
      else if (lowAttendance) reason = "Low attendance";
      else reason = "Low marks";
      return { ...s, ...d, reason };
    });

    res.json({ atRiskStudents: result, total: result.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSubjectAverageMarks = async (req, res) => {
  try {
    const subjectAverageAgg = await Mark.aggregate([
      {
        $group: {
          _id: "$subject",
          averageMarks: { $avg: "$marks" },
        },
      },
      {
        $sort: {
          averageMarks: -1,
        },
      },
    ]);

    const subjectAverageMarks = subjectAverageAgg.map((item) => ({
      subject: item._id,
      marks: Math.round(item.averageMarks),
    }));

    res.json({ subjectAverageMarks });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};