const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  instructor: { type: String, required: true },
  creditHours: { type: Number, required: true, min: 1 },
  feePerCredit: { type: Number, required: true, min: 0 },
});

module.exports = mongoose.model("Course", courseSchema);