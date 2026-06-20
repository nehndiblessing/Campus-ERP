import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import bcrypt from "bcryptjs";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import markRoutes from "./routes/markRoutes.js";
import errorHandler from "./middleware/errorHandler.js";
import User from "./models/User.js";

dotenv.config();

if (!process.env.JWT_SECRET) {
  console.error("Missing JWT_SECRET in environment");
  process.exit(1);
}

const app = express();

const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:5173",
  "http://localhost:3000",
].filter(Boolean).map((origin) => origin.replace(/\/+$/, ""));

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin.replace(/\/+$/, ""))) {
      callback(null, true);
    } else {
      callback(new Error(`Not allowed by CORS: ${origin}`));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(morgan("dev"));
app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/marks", markRoutes);
app.get("/", (req, res) => {
  res.send("Campus ERP API Running");
});

app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

app.use(errorHandler);

const createDefaultAdmin = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || "admin@gmail.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "123456";

    const existingAdmin = await User.findOne({ email: adminEmail });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);

      await User.create({
        name: "Admin",
        email: adminEmail,
        password: hashedPassword,
        role: "admin",
      });

      console.log(
        `Created default admin: ${adminEmail} / ${adminPassword}`
      );
    }
  } catch (error) {
    console.error("Failed to create default admin:", error.message);
  }
};

const startServer = async () => {
  await connectDB();
  await createDefaultAdmin();

  const PORT = process.env.PORT || 8006;

  app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
  });
};

startServer();