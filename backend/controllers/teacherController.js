const Course = require("../models/course");
const User = require("../models/user");

// Get courses assigned to the logged-in teacher
exports.getMyCourses = async (req, res) => {
  try {
    // We can find by teacherId or by instructor name (if teacherId is missing)
    // Preference is teacherId
    const courses = await Course.find({ 
      $or: [
        { teacherId: req.user.id },
        { instructor: req.user.name }
      ]
    });
    res.json({ courses });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get roster of students enrolled in a specific course
exports.getCourseRoster = async (req, res) => {
  try {
    const { courseId } = req.params;
    
    // Verify the course belongs to this teacher
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });
    
    // Security check: only the assigned teacher or admin can view roster
    if (course.teacherId?.toString() !== req.user.id && course.instructor !== req.user.name && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. You are not the instructor for this course." });
    }

    // Find students who have this courseId in their registeredCourses array
    const students = await User.find({ 
      role: "student",
      registeredCourses: courseId 
    }).select("name email rollNo program department campus");

    res.json({ students });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
