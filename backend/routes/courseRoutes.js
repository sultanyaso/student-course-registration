const express = require("express");
const router = express.Router();
const { getCourses, addCourse } = require("../controllers/courseController");
const { authMiddleware, staffMiddleware } = require("../middleware/authMiddleware");

// Get all courses (any logged-in student/teacher)
router.get("/", authMiddleware, getCourses);

// Add new course (teacher/admin only)
router.post("/add", authMiddleware, staffMiddleware, addCourse);

module.exports = router;