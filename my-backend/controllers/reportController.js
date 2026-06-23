import PDFDocument from "pdfkit";
import ExcelJS from "exceljs";
import Student from "../models/Student.js";
import Attendance from "../models/Attendance.js";
import Mark from "../models/Marks.js";
import Department from "../models/Department.js";

export const exportPDF = async (req, res) => {
  try {
    const students = await Student.find().populate("department", "name code").lean();
    const departments = await Department.find().lean();
    const attendanceCount = await Attendance.countDocuments();
    const marksCount = await Mark.countDocuments();

    const doc = new PDFDocument({ margin: 30, size: "A4" });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=campus-erp-report-${new Date().toISOString().split("T")[0]}.pdf`);

    doc.pipe(res);

    doc.fontSize(22).font("Helvetica-Bold").text("Campus ERP Report", { align: "center" });
    doc.fontSize(11).font("Helvetica").text(`Generated on ${new Date().toLocaleDateString()}`, { align: "center" });
    doc.moveDown(1.5);

    doc.fontSize(14).font("Helvetica-Bold").text("Summary");
    doc.moveDown(0.5);
    doc.fontSize(11).font("Helvetica");
    doc.text(`Total Departments: ${departments.length}`);
    doc.text(`Total Students: ${students.length}`);
    doc.text(`Total Attendance Records: ${attendanceCount}`);
    doc.text(`Total Marks Records: ${marksCount}`);
    doc.moveDown(1.5);

    doc.fontSize(14).font("Helvetica-Bold").text("Departments");
    doc.moveDown(0.5);
    doc.fontSize(11).font("Helvetica");
    departments.forEach((dept) => {
      doc.text(`  ${dept.name} (${dept.code})`);
    });
    doc.moveDown(1.5);

    doc.fontSize(14).font("Helvetica-Bold").text("Students");
    doc.moveDown(0.5);
    doc.fontSize(10).font("Helvetica");

    const studentsPerPage = 30;
    let count = 0;
    for (const student of students) {
      if (count > 0 && count % studentsPerPage === 0) {
        doc.addPage();
      }
      const deptName = student.department?.name || "N/A";
      doc.text(`${student.rollNo} - ${student.name} (Sem ${student.semester}, ${deptName})`);
      count++;
    }

    doc.end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const exportExcel = async (req, res) => {
  try {
    const students = await Student.find().populate("department", "name code").lean();
    const attendance = await Attendance.find().populate("student", "name rollNo").lean();
    const marks = await Mark.find().populate("student", "name rollNo").lean();

    const workbook = new ExcelJS.Workbook();
    workbook.creator = "Campus ERP";
    workbook.created = new Date();

    const studentsSheet = workbook.addWorksheet("Students");
    studentsSheet.columns = [
      { header: "Roll No", key: "rollNo", width: 15 },
      { header: "Name", key: "name", width: 25 },
      { header: "Email", key: "email", width: 30 },
      { header: "Department", key: "department", width: 20 },
      { header: "Semester", key: "semester", width: 10 },
      { header: "Phone", key: "phone", width: 18 },
    ];
    students.forEach((s) => {
      studentsSheet.addRow({
        rollNo: s.rollNo,
        name: s.name,
        email: s.email,
        department: s.department?.name || "N/A",
        semester: s.semester,
        phone: s.phone || "",
      });
    });

    const attendanceSheet = workbook.addWorksheet("Attendance");
    attendanceSheet.columns = [
      { header: "Student", key: "student", width: 25 },
      { header: "Roll No", key: "rollNo", width: 15 },
      { header: "Date", key: "date", width: 15 },
      { header: "Status", key: "status", width: 12 },
    ];
    attendance.forEach((a) => {
      attendanceSheet.addRow({
        student: a.student?.name || "N/A",
        rollNo: a.student?.rollNo || "N/A",
        date: new Date(a.date).toLocaleDateString(),
        status: a.status,
      });
    });

    const marksSheet = workbook.addWorksheet("Marks");
    marksSheet.columns = [
      { header: "Student", key: "student", width: 25 },
      { header: "Roll No", key: "rollNo", width: 15 },
      { header: "Subject", key: "subject", width: 20 },
      { header: "Exam Type", key: "examType", width: 12 },
      { header: "Marks", key: "marks", width: 10 },
    ];
    marks.forEach((m) => {
      marksSheet.addRow({
        student: m.student?.name || "N/A",
        rollNo: m.student?.rollNo || "N/A",
        subject: m.subject,
        examType: m.examType,
        marks: m.marks,
      });
    });

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", `attachment; filename=campus-erp-export-${new Date().toISOString().split("T")[0]}.xlsx`);

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
