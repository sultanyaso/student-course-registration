const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const User = require("./models/user");
const authRoutes = require("./routes/authRoutes"); // no () here
const adminRoutes = require("./routes/adminRoutes");


const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect DB
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);

const studentRoutes = require("./routes/studentRoutes");
app.use("/api/student", studentRoutes);

const teacherRoutes = require("./routes/teacherRoutes");
app.use("/api/teacher", teacherRoutes);

const quizRoutes = require("./routes/quizRoutes");
app.use("/api/quizzes", quizRoutes);

const assignmentRoutes = require("./routes/assignmentRoutes");
app.use("/api/assignments", assignmentRoutes);

const chatRoutes = require("./routes/chatRoutes");
app.use("/api/chat", chatRoutes);

// Static folder for file uploads
app.use("/uploads", express.static("uploads"));

const courseRoutes = require("./routes/courseRoutes");
app.use("/api/courses", courseRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
