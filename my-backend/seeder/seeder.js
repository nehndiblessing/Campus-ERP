import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

import User from "../models/User.js";
import Department from "../models/Department.js";
import Student from "../models/Student.js";
import Attendance from "../models/Attendance.js";
import Mark from "../models/Marks.js";

dotenv.config();

await mongoose.connect(
  process.env.MONGO_URI
);

console.log("MongoDB Connected");

const firstNames = [
  "Rahul",
  "Priya",
  "Aman",
  "Neha",
  "Arjun",
  "Simran",
  "Rohit",
  "Karan",
  "Pooja",
  "Anjali",
];

const lastNames = [
  "Sharma",
  "Singh",
  "Verma",
  "Gupta",
  "Kumar",
  "Patel",
  "Mehta",
  "Yadav",
  "Kapoor",
  "Malhotra",
];

const departmentData = [
  { name: "Computer Science", code: "CSE" },
  { name: "Information Technology", code: "IT" },
  { name: "Electronics", code: "ECE" },
  { name: "Mechanical", code: "ME" },
  { name: "Civil", code: "CE" },
];

const subjects = [
  "DBMS",
  "Operating Systems",
  "Computer Networks",
  "Java",
  "Web Development",
];

const examTypes = [
  "Quiz",
  "Midterm",
  "Final",
];
const hashedPassword =
  await bcrypt.hash(
    "123456",
    10
  );

const existingAdmin = await User.findOne({ email: "admin@gmail.com" });

if (!existingAdmin) {
  await User.create({
    name: "Admin",
    email: "admin@gmail.com",
    password: hashedPassword,
    role: "admin",
  });
  console.log("Admin user created");
} else {
  console.log("Admin user already exists, skipping admin creation");
}

console.log("Users created");

const createdDepartments = await Department.insertMany(departmentData);
console.log("Departments created");

const students = [];

for (let i = 1; i <= 50; i++) {
  const first =
    firstNames[
      Math.floor(
        Math.random() *
          firstNames.length
      )
    ];

  const last =
    lastNames[
      Math.floor(
        Math.random() *
          lastNames.length
      )
    ];

  const fullName =
    `${first} ${last}`;

  students.push({
    name: fullName,

    email:
      `student${i}@gmail.com`,

    rollNo:
      `CSE${String(
        i
      ).padStart(3, "0")}`,

    department:
      createdDepartments[
        Math.floor(
          Math.random() *
            createdDepartments.length
        )
      ]._id,

    semester:
      Math.floor(
        Math.random() * 8
      ) + 1,

    phone:
      `98765${String(
        i
      ).padStart(5, "0")}`,

    photo:
      `https://api.dicebear.com/9.x/adventurer/svg?seed=${encodeURIComponent(
        fullName
      )}`,
  });
}

const createdStudents =
  await Student.insertMany(
    students
  );

console.log(
  "50 students created"
);

const attendanceRecords =
  [];

for (let i = 0; i < 250; i++) {
  const student =
    createdStudents[
      Math.floor(
        Math.random() *
          createdStudents.length
      )
    ];

  const randomDays =
    Math.floor(
      Math.random() * 30
    );

  const date =
    new Date();

  date.setDate(
    date.getDate() -
      randomDays
  );

  attendanceRecords.push({
    student:
      student._id,

    date,

    status:
      Math.random() > 0.2
        ? "Present"
        : "Absent",
  });
}

const today = new Date();
today.setHours(0, 0, 0, 0);
for (let i = 0; i < 5; i++) {
  const student = createdStudents[i % createdStudents.length];
  attendanceRecords.push({
    student: student._id,
    date: new Date(today),
    status: i % 2 === 0 ? "Present" : "Absent",
  });
}

await Attendance.insertMany(
  attendanceRecords
);

console.log(
  "250 attendance records created"
);

const marksRecords = [];

for (let i = 0; i < 200; i++) {
  const student =
    createdStudents[
      Math.floor(
        Math.random() *
          createdStudents.length
      )
    ];

  marksRecords.push({
    student:
      student._id,

    subject:
      subjects[
        Math.floor(
          Math.random() *
            subjects.length
        )
      ],

    examType:
      examTypes[
        Math.floor(
          Math.random() *
            examTypes.length
        )
      ],

    marks:
      Math.floor(
        Math.random() * 51
      ) + 50,
  });
}

await Mark.insertMany(
  marksRecords
);

console.log(
  "200 marks records created"
);

console.log(
  "Seeding Complete"
);

process.exit();
