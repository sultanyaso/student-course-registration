const express = require("express");
const router = express.Router();
const { getMyCourses, getCourseRoster } = require("../controllers/teacherController");
const { authMiddleware, teacherMiddleware } = require("../middleware/authMiddleware");

// All routes here require being a teacher
router.use(authMiddleware, teacherMiddleware);

// Get courses assigned to the teacher
router.get("/my-courses", getMyCourses);

// Get student roster for a specific course
router.get("/course/:courseId/roster", getCourseRoster);

module.exports = router;
