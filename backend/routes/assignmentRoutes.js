const express = require("express");
const router = express.Router();
const { 
  getStudentAssignments, 
  submitAssignment, 
  upload, 
  createAssignment,
  getTeacherAssignments,
  getAssignmentSubmissions,
  gradeSubmission,
  updateAssignment,
  deleteAssignment
} = require("../controllers/assignmentController");
const { authMiddleware, staffMiddleware } = require("../middleware/authMiddleware");

// Student Routes
router.get("/student", authMiddleware, getStudentAssignments);
router.post("/submit", authMiddleware, upload.single("file"), submitAssignment);

// Admin/Teacher Routes
router.get("/teacher", authMiddleware, staffMiddleware, getTeacherAssignments);
router.get("/submissions/:assignmentId", authMiddleware, staffMiddleware, getAssignmentSubmissions);
router.patch("/submissions/:submissionId/grade", authMiddleware, staffMiddleware, gradeSubmission);
router.post("/create", authMiddleware, staffMiddleware, createAssignment);
router.put("/:id", authMiddleware, staffMiddleware, updateAssignment);
router.delete("/:id", authMiddleware, staffMiddleware, deleteAssignment);

module.exports = router;
