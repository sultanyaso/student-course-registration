const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes"); // no () here
const adminRoutes = require("./routes/adminRoutes");


const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect DB
connectDB();

// Routes
app.use("/api/auth", authRoutes); // correct
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);

const studentRoutes = require("./routes/studentRoutes");
app.use("/api/student", studentRoutes);


const courseRoutes = require("./routes/courseRoutes");
app.use("/api/courses", courseRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
