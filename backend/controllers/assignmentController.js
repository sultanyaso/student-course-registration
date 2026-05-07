const Assignment = require("../models/assignment");
const Submission = require("../models/submission");
const User = require("../models/user");
const Course = require("../models/course");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Multer Config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "uploads/assignments";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

exports.upload = multer({ storage: storage });

// Get all assignments for a student
exports.getStudentAssignments = async (req, res) => {
  try {
    const student = await User.findById(req.user.id);
    const assignments = await Assignment.find({ courseId: { $in: student.registeredCourses } })
      .populate("courseId", "name");
    
    // Get student's submissions to check status
    const submissions = await Submission.find({ studentId: req.user.id });

    const assignmentsWithStatus = assignments.map(a => {
      const sub = submissions.find(s => s.assignmentId.toString() === a._id.toString());
      return {
        ...a._doc,
        status: sub ? sub.status : "pending",
        submission: sub
      };
    });

    res.json({ assignments: assignmentsWithStatus });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Submit an assignment
exports.submitAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.body;
    if (!req.file) return res.status(400).json({ message: "Please upload a file" });

    const submission = new Submission({
      assignmentId,
      studentId: req.user.id,
      fileUrl: req.file.path,
      fileName: req.file.originalname,
      status: "submitted"
    });

    await submission.save();
    res.status(201).json({ message: "Assignment submitted", submission });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all assignments created for courses assigned to this teacher
exports.getTeacherAssignments = async (req, res) => {
  try {
    const teacherCourses = await Course.find({ 
      $or: [
        { teacherId: req.user.id },
        { instructor: req.user.name }
      ]
    }).select("_id");
    
    const courseIds = teacherCourses.map(c => c._id);
    const assignments = await Assignment.find({ courseId: { $in: courseIds } })
      .populate("courseId", "name");
    
    res.json({ assignments });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all submissions for a specific assignment
exports.getAssignmentSubmissions = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const submissions = await Submission.find({ assignmentId })
      .populate("studentId", "name email rollNo");
    res.json({ submissions });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Grade a submission
exports.gradeSubmission = async (req, res) => {
  try {
    const { submissionId } = req.params;
    const { grade, feedback } = req.body;

    const submission = await Submission.findByIdAndUpdate(
      submissionId,
      { grade, feedback, status: "graded" },
      { new: true }
    );

    if (!submission) return res.status(404).json({ message: "Submission not found" });
    res.json({ message: "Graded successfully", submission });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create Assignment (Admin/Teacher)
exports.createAssignment = async (req, res) => {
  try {
    const assignment = new Assignment(req.body);
    await assignment.save();
    res.status(201).json({ message: "Assignment created", assignment });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update Assignment
exports.updateAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!assignment) return res.status(404).json({ message: "Assignment not found" });
    res.json({ message: "Assignment updated", assignment });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete Assignment
exports.deleteAssignment = async (req, res) => {
  try {
    // Delete the assignment
    const assignment = await Assignment.findByIdAndDelete(req.params.id);
    if (!assignment) return res.status(404).json({ message: "Assignment not found" });

    // Also delete any submissions related to this assignment
    await Submission.deleteMany({ assignmentId: req.params.id });

    res.json({ message: "Assignment deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
