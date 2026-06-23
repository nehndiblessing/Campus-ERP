import mongoose from "mongoose";
import dotenv from "dotenv";
import Student from "../models/Student.js";
import Department from "../models/Department.js";

dotenv.config();

await mongoose.connect(process.env.MONGO_URI);

console.log("Starting department reference fix...");

try {
  // Find all students where department is a string
  const studentsWithStringDept = await Student.find({
    department: { $type: "string" },
  });

  if (studentsWithStringDept.length === 0) {
    console.log("✓ No students with string department references found");
  } else {
    console.log(
      `Found ${studentsWithStringDept.length} students with string department references`
    );

    for (const student of studentsWithStringDept) {
      const deptName = student.department;
      const dept = await Department.findOne({ name: deptName });

      if (dept) {
        student.department = dept._id;
        await student.save();
        console.log(`✓ Fixed student ${student.name}: ${deptName} -> ${dept._id}`);
      } else {
        console.warn(
          `✗ Department "${deptName}" not found for student ${student.name}`
        );
      }
    }
  }

  // Verify all students now have proper ObjectId department references
  const invalidStudents = await Student.find({
    $or: [
      { department: { $type: "string" } },
      { department: null },
      { department: undefined },
    ],
  });

  if (invalidStudents.length > 0) {
    console.warn(
      `\n⚠ Warning: ${invalidStudents.length} students still have invalid department references`
    );
    invalidStudents.forEach((s) => {
      console.warn(`  - ${s.name}: department = ${s.department}`);
    });
  } else {
    console.log("\n✓ All students have valid department references");
  }

  console.log("\nMigration completed successfully!");
} catch (error) {
  console.error("Migration failed:", error.message);
  process.exit(1);
} finally {
  await mongoose.connection.close();
}
