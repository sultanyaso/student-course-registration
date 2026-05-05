const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  instructor: { type: String, required: true }, // Keep for now or use teacherId? Doc says teacherId.
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  creditHours: { type: Number, required: true, min: 1 },
  feePerCredit: { type: Number, required: true, min: 0 },
  capacity: { type: Number, default: 50 },
  enrolledCount: { type: Number, default: 0 },
  schedule: { type: String }, // e.g., "Mon/Wed 10:00 AM"
  department: { type: String },
}, { timestamps: true });

module.exports = mongoose.model("Course", courseSchema);
