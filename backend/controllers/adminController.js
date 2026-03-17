const User = require("../models/user");
const Course = require("../models/course");

// --- Admin profile ---
exports.getAdminInfo = async (req, res) => {
  try {
    const admin = await User.findById(req.user.id).select("-password");
    if (!admin) return res.status(404).json({ message: "Admin not found" });
    res.json({ admin });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// --- Students ---
exports.getStudents = async (req, res) => {
  try {
    const students = await User.find({ role: "student" }).select("-password");
    res.json({ students });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Approve / Reject student
exports.approveStudent = async (req, res) => {
  try {
    const student = await User.findById(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found" });

    const approve = req.body.approve;
    if (approve === undefined) {
      return res.status(400).json({ message: "approve field is required" });
    }

    // Convert string/boolean to proper boolean
    student.isApproved = approve === true || approve === "true";

    await student.save();

    res.json({
      message: `Student has been ${student.isApproved ? "approved" : "rejected"}`,
      student,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// --- Courses ---
exports.getCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.json({ courses });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addCourse = async (req, res) => {
  try {
    const { name, instructor } = req.body;
    if (!name || !instructor) {
      return res.status(400).json({ message: "Name and instructor required" });
    }
    const course = await Course.create({ name, instructor });
    res.status(201).json({ message: "Course added", course });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.json({ message: "Course updated", course });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.json({ message: "Course deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};