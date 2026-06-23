import mongoose from "mongoose";
import dotenv from "dotenv";
import Student from "../models/Student.js";

dotenv.config();

await mongoose.connect(process.env.MONGO_URI);

console.log("🔍 Database Diagnostic Report\n");

try {
  // Count total students
  const totalStudents = await Student.countDocuments();
  console.log(`Total Students: ${totalStudents}`);

  // Check for string department references
  const stringDeptStudents = await Student.find({
    department: { $type: "string" },
  });
  console.log(
    `\n⚠️  Students with STRING department: ${stringDeptStudents.length}`
  );
  if (stringDeptStudents.length > 0) {
    stringDeptStudents.slice(0, 5).forEach((s) => {
      console.log(`   - ${s.name}: "${s.department}"`);
    });
    if (stringDeptStudents.length > 5) {
      console.log(`   ... and ${stringDeptStudents.length - 5} more`);
    }
  }

  // Check for ObjectId references
  const objectIdDeptStudents = await Student.find({
    department: { $type: "objectId" },
  });
  console.log(
    `✓ Students with OBJECTID department: ${objectIdDeptStudents.length}`
  );

  // Check for null/missing departments
  const nullDeptStudents = await Student.find({
    $or: [{ department: null }, { department: { $exists: false } }],
  });
  console.log(`⚠️  Students with NULL/missing department: ${nullDeptStudents.length}`);

  // Summary
  console.log("\n📊 Summary:");
  console.log(`  Valid (ObjectId): ${objectIdDeptStudents.length}`);
  console.log(`  Invalid (String): ${stringDeptStudents.length}`);
  console.log(`  Missing: ${nullDeptStudents.length}`);

  const healthPercent = (
    (objectIdDeptStudents.length / totalStudents) *
    100
  ).toFixed(1);
  console.log(`  Health: ${healthPercent}%`);

  if (stringDeptStudents.length === 0 && nullDeptStudents.length === 0) {
    console.log("\n✅ Database is healthy! All students have valid departments.");
    console.log(
      "If dashboard still has issues, check network/API connection."
    );
  } else {
    console.log("\n❌ Database has issues. Run: npm run migrate");
  }
} catch (error) {
  console.error("Diagnostic failed:", error.message);
} finally {
  await mongoose.connection.close();
}
