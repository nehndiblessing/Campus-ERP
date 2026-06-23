import mongoose from "mongoose";
import dotenv from "dotenv";
import Student from "../models/Student.js";
import Attendance from "../models/Attendance.js";
import Mark from "../models/Marks.js";
import Department from "../models/Department.js";
import Activity from "../models/Activity.js";

dotenv.config();

await mongoose.connect(process.env.MONGO_URI);

console.log("🧹 Cleaning corrupted data...\n");

try {
  // Delete all corrupted records
  await Student.deleteMany({});
  await Attendance.deleteMany({});
  await Mark.deleteMany({});
  await Activity.deleteMany({});

  console.log("✓ Deleted all corrupted students, attendance, marks, and activities");

  // Keep departments but verify they exist
  const departments = await Department.find();
  console.log(`✓ Found ${departments.length} departments:\n`);
  departments.forEach((d) => {
    console.log(`  - ${d.name} (${d.code}): ${d._id}`);
  });

  console.log("\n✅ Database cleaned and ready for re-seeding!");
  console.log("   Next: npm run seed");
} catch (error) {
  console.error("Cleanup failed:", error.message);
  process.exit(1);
} finally {
  await mongoose.connection.close();
}
