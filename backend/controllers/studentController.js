const User = require("../models/user");
const Course = require("../models/course");

// Get all available courses
exports.getCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.json({ courses }); // JSON object must contain 'courses' array
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all courses the student has registered
exports.getRegisteredCourses = async (req, res) => {
  try {
    const student = await User.findById(req.user.id).populate("registeredCourses");
    res.json({ registeredCourses: student.registeredCourses });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Register a course
exports.registerCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const student = await User.findById(req.user.id);
    if (!student.registeredCourses.includes(req.params.courseId)) {
      student.registeredCourses.push(req.params.courseId);
      await student.save();
    }

    res.json({ message: "Course registered", registeredCourses: student.registeredCourses });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};