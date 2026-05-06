const express = require("express");
const {
  getAdminInfo,
  getStudents,
  approveStudent,
  getCourses,
  addCourse,
  updateCourse,
  deleteCourse,
  getSystemStats
} = require("../controllers/adminController");

const { authMiddleware, adminMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

// All routes here require being an admin
router.use(authMiddleware, adminMiddleware);

// --- Analytics ---
router.get("/stats", getSystemStats);

// --- Admin profile ---
router.get("/me", getAdminInfo);

// --- Students ---
router.get("/students", getStudents);
router.patch("/students/:id", approveStudent); // approve/reject

// --- Courses ---
router.get("/courses", getCourses);
router.post("/courses", addCourse);
router.put("/courses/:id", updateCourse);
router.delete("/courses/:id", deleteCourse);

module.exports = router;