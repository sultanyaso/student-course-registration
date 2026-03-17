const Course = require("../models/course");

// Get all courses
exports.getCourses = async (req, res) => {
  try {
    const courses = await Course.find({});
    res.json({ courses });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Add a new course (only teacher/admin)
exports.addCourse = async (req, res) => {
  try {
    const { name, instructor, description, creditHours, feePerCredit } = req.body;

    // Validate required fields
    if (!name || !instructor || !creditHours || !feePerCredit) {
      return res.status(400).json({ message: "All fields are required (name, instructor, creditHours, feePerCredit)" });
    }

    const course = new Course({ name, instructor, description, creditHours, feePerCredit });
    await course.save();
    res.status(201).json({ message: "Course added", course });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update a course
exports.updateCourse = async (req, res) => {
  try {
    const { name, instructor, description, creditHours, feePerCredit } = req.body;
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      { name, instructor, description, creditHours, feePerCredit },
      { new: true }
    );
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.json({ message: "Course updated", course });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a course
exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.json({ message: "Course deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};