const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["student", "teacher"],
      default: "student",
    },
    isApproved: {
      type: Boolean,
      default: false, // new users start as unapproved
    },
    registeredCourses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course", // links to Course model
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);