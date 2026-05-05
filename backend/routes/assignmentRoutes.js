const express = require("express");
const router = express.Router();
const { 
  getStudentAssignments, 
  submitAssignment, 
  upload, 
  createAssignment 
} = require("../controllers/assignmentController");
const { authMiddleware } = require("../middleware/authMiddleware");

// Student Routes
router.get("/student", authMiddleware, getStudentAssignments);
router.post("/submit", authMiddleware, upload.single("file"), submitAssignment);

// Admin/Teacher Routes
router.post("/create", authMiddleware, createAssignment);

module.exports = router;
