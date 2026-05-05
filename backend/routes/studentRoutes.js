const express = require("express");
const { authMiddleware } = require("../middleware/authMiddleware");
const User = require("../models/user");
const Course = require("../models/course");

const router = express.Router();

// --- Get all available courses ---
router.get("/courses", authMiddleware, async (req, res) => {
  try {
    const courses = await Course.find();
    res.json({ courses });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- Get student info ---
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const student = await User.findById(req.user.id).select("-password");
    res.json({ student });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- Get student's registered courses ---
router.get("/registrations", authMiddleware, async (req, res) => {
  try {
    const student = await User.findById(req.user.id).populate("registeredCourses");
    // Return only required info for Course Registration view
    const registeredCourses = student.registeredCourses.map(c => ({
      _id: c._id,
      name: c.name,
      instructor: c.instructor,
      creditHours: c.creditHours,
    }));
    res.json({ registeredCourses });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- Fee Slip Route ---
router.get("/fee", authMiddleware, async (req, res) => {
  try {
    const student = await User.findById(req.user.id).populate("registeredCourses");

    // Calculate total fee
    let totalFee = 0;
    const feeDetails = student.registeredCourses.map(c => {
      const courseFee = c.creditHours * c.feePerCredit;
      totalFee += courseFee;
      return {
        name: c.name,
        instructor: c.instructor,
        creditHours: c.creditHours,
        feePerCredit: c.feePerCredit,
        courseFee,
      };
    });

    res.json({ feeDetails, totalFee });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- Register for a course ---
router.post("/register/:courseId", authMiddleware, async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    // Check capacity
    if (course.enrolledCount >= course.capacity) {
      return res.status(400).json({ message: "Course is full" });
    }

    const student = await User.findById(req.user.id);
    if (!student.registeredCourses.includes(req.params.courseId)) {
      student.registeredCourses.push(req.params.courseId);
      await student.save();

      // Increment enrolledCount
      course.enrolledCount += 1;
      await course.save();
    }
    const updatedStudent = await student.populate("registeredCourses");
    res.json({ message: "Course registered", registeredCourses: updatedStudent.registeredCourses });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- Unregister from a course ---
router.post("/unregister/:courseId", authMiddleware, async (req, res) => {
  try {
    const student = await User.findById(req.user.id);
    if (student.registeredCourses.includes(req.params.courseId)) {
      student.registeredCourses = student.registeredCourses.filter(c => c.toString() !== req.params.courseId);
      await student.save();

      // Decrement enrolledCount
      const course = await Course.findById(req.params.courseId);
      if (course && course.enrolledCount > 0) {
        course.enrolledCount -= 1;
        await course.save();
      }
    }
    const updatedStudent = await student.populate("registeredCourses");
    res.json({ message: "Course unregistered", registeredCourses: updatedStudent.registeredCourses });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- Update student profile ---
router.put("/profile", authMiddleware, async (req, res) => {
  try {
    const { name, rollNo, campus, program, department } = req.body;
    const student = await User.findByIdAndUpdate(
      req.user.id,
      { name, rollNo, campus, program, department },
      { new: true }
    ).select("-password");
    res.json({ student });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;