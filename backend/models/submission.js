const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema({
  assignmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Assignment", required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  fileUrl: { type: String }, // Path to uploaded file
  fileName: { type: String },
  content: { type: String }, // For text-based submissions
  grade: { type: Number },
  feedback: { type: String },
  submittedAt: { type: Date, default: Date.now },
  status: { type: String, enum: ["submitted", "graded"], default: "submitted" },
}, { timestamps: true });

module.exports = mongoose.model("Submission", submissionSchema);
