const User = require("../models/user");
const Course = require("../models/course");

// --- Analytics ---
exports.getSystemStats = async (req, res) => {
  try {
    const studentCount = await User.countDocuments({ role: "student" });
    const teacherCount = await User.countDocuments({ role: "teacher" });
    const courseCount = await Course.countDocuments();
    
    // Calculate total enrollment and fees
    const allCourses = await Course.find();
    const totalEnrollments = allCourses.reduce((sum, c) => sum + c.enrolledCount, 0);
    const totalPotentialRevenue = allCourses.reduce((sum, c) => sum + (c.enrolledCount * c.creditHours * c.feePerCredit), 0);

    res.json({
      stats: {
        students: studentCount,
        teachers: teacherCount,
        courses: courseCount,
        enrollments: totalEnrollments,
        revenue: totalPotentialRevenue
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

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

// --- Teachers ---
exports.getTeachers = async (req, res) => {
  try {
    const teachers = await User.find({ role: "teacher" }).select("name email");
    res.json({ teachers });
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
    const { name, instructor, creditHours, feePerCredit, department, capacity, schedule, description } = req.body;
    
    if (!name || !instructor || !creditHours || !feePerCredit) {
      return res.status(400).json({ message: "All required fields must be filled" });
    }

    const course = await Course.create({ 
      name, 
      instructor, 
      creditHours, 
      feePerCredit, 
      department, 
      capacity, 
      schedule,
      description
    });
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