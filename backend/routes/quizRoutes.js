const express = require("express");
const router = express.Router();
const { 
  getAvailableQuizzes, 
  getQuizDetails, 
  submitQuiz, 
  createQuiz,
  fetchOpenTDBQuestions
} = require("../controllers/quizController");
const { authMiddleware, staffMiddleware } = require("../middleware/authMiddleware");

// Student Routes
router.get("/available", authMiddleware, getAvailableQuizzes);
router.get("/:id", authMiddleware, getQuizDetails);
router.post("/submit", authMiddleware, submitQuiz);

// Admin/Teacher Routes
router.get("/opentdb/fetch", authMiddleware, staffMiddleware, fetchOpenTDBQuestions);
router.post("/create", authMiddleware, staffMiddleware, createQuiz);

module.exports = router;
