const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  title: { type: String, required: true },
  description: { type: String },
  source: { type: String, enum: ["openTDB", "custom"], default: "custom" },
  questions: [
    {
      question: { type: String, required: true },
      options: [{ type: String, required: true }],
      correctAnswer: { type: String, required: true },
      explanation: { type: String },
    }
  ],
  duration: { type: Number, default: 10 }, // in minutes
}, { timestamps: true });

module.exports = mongoose.model("Quiz", quizSchema);
