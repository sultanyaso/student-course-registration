const express = require("express");
const {
  getAdminInfo,
  getStudents,
  approveStudent,
  getCourses,
  addCourse,
  updateCourse,
  deleteCourse,
} = require("../controllers/adminController");

const { authMiddleware } = require("../middleware/authMiddleware"); // must be a function
// Optional: add adminMiddleware if you want only admins to approve
// const { adminMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

// --- Admin profile ---
router.get("/me", authMiddleware, getAdminInfo);

// --- Students ---
router.get("/students", authMiddleware, getStudents);
router.patch("/students/:id", authMiddleware, approveStudent); // approve/reject

// --- Courses ---
router.get("/courses", authMiddleware, getCourses);
router.post("/courses", authMiddleware, addCourse);
router.put("/courses/:id", authMiddleware, updateCourse);
router.delete("/courses/:id", authMiddleware, deleteCourse);

module.exports = router;