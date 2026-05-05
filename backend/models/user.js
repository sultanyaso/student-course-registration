const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["student", "teacher", "admin"],
      default: "student",
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    rollNo: { type: String },
    campus: { type: String },
    program: { type: String },
    department: { type: String },
    status: { type: String, default: "Active" },
    registeredCourses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
