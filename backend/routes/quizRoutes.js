const express = require("express");
const router = express.Router();
const { 
  getAvailableQuizzes, 
  getQuizDetails, 
  submitQuiz, 
  createQuiz 
} = require("../controllers/quizController");
const { authMiddleware } = require("../middleware/authMiddleware");

// Student Routes
router.get("/available", authMiddleware, getAvailableQuizzes);
router.get("/:id", authMiddleware, getQuizDetails);
router.post("/submit", authMiddleware, submitQuiz);

// Admin/Teacher Routes (Sanaan can use these)
router.post("/create", authMiddleware, createQuiz);

module.exports = router;
