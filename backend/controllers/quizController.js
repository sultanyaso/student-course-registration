const Quiz = require("../models/quiz");
const QuizAttempt = require("../models/quizAttempt");
const User = require("../models/user");
const Course = require("../models/course");
const axios = require("axios");

// Helper to decode HTML entities
const decodeHTML = (str) => {
  return str.replace(/&quot;/g, '"')
            .replace(/&#039;/g, "'")
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&deg;/g, '°')
            .replace(/&ldquo;/g, '"')
            .replace(/&rdquo;/g, '"')
            .replace(/&lsquo;/g, "'")
            .replace(/&rsquo;/g, "'");
};

// Fetch questions from OpenTDB
exports.fetchOpenTDBQuestions = async (req, res) => {
  try {
    const { amount = 10, category = 18, difficulty = "medium" } = req.query;
    
    const response = await axios.get(`https://opentdb.com/api.php?amount=${amount}&category=${category}&difficulty=${difficulty}&type=multiple`);
    
    if (response.data.response_code !== 0) {
      return res.status(400).json({ message: "Failed to fetch questions from OpenTDB" });
    }

    // Transform to our schema and decode HTML entities
    const questions = response.data.results.map(q => ({
      question: decodeHTML(q.question),
      options: [...q.incorrect_answers, q.correct_answer].map(opt => decodeHTML(opt)).sort(() => Math.random() - 0.5),
      correctAnswer: decodeHTML(q.correct_answer),
      explanation: `Category: ${q.category}`
    }));

    res.json({ questions });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all quizzes created for courses assigned to this teacher
exports.getTeacherQuizzes = async (req, res) => {
  try {
    const teacherCourses = await Course.find({ 
      $or: [
        { teacherId: req.user.id },
        { instructor: req.user.name }
      ]
    }).select("_id");
    
    const courseIds = teacherCourses.map(c => c._id);
    const quizzes = await Quiz.find({ courseId: { $in: courseIds } })
      .populate("courseId", "name");
    
    res.json({ quizzes });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all quizzes for a student (based on registered courses)
exports.getAvailableQuizzes = async (req, res) => {
  try {
    const student = await User.findById(req.user.id);
    const quizzes = await Quiz.find({ courseId: { $in: student.registeredCourses } })
      .populate("courseId", "name");
    
    // Check if student already attempted these quizzes
    const attempts = await QuizAttempt.find({ studentId: req.user.id });
    const attemptedQuizIds = attempts.map(a => a.quizId.toString());

    const quizzesWithStatus = quizzes.map(q => ({
      ...q._doc,
      isAttempted: attemptedQuizIds.includes(q._id.toString()),
      score: attempts.find(a => a.quizId.toString() === q._id.toString())?.score
    }));

    res.json({ quizzes: quizzesWithStatus });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get quiz details (without correct answers)
exports.getQuizDetails = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id).populate("courseId", "name");
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    // Remove correct answers before sending to student
    const sanitizedQuestions = quiz.questions.map(q => ({
      _id: q._id,
      question: q.question,
      options: q.options
    }));

    res.json({
      _id: quiz._id,
      title: quiz.title,
      description: quiz.description,
      duration: quiz.duration,
      courseName: quiz.courseId.name,
      questions: sanitizedQuestions
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Submit quiz
exports.submitQuiz = async (req, res) => {
  try {
    const { quizId, answers } = req.body; // answers: [{ questionId, selectedAnswer }]
    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    let score = 0;
    const gradedAnswers = answers.map(ans => {
      const question = quiz.questions.id(ans.questionId);
      const isCorrect = question.correctAnswer === ans.selectedAnswer;
      if (isCorrect) score++;
      return {
        questionId: ans.questionId,
        selectedAnswer: ans.selectedAnswer,
        isCorrect
      };
    });

    const attempt = new QuizAttempt({
      studentId: req.user.id,
      quizId,
      score,
      totalQuestions: quiz.questions.length,
      answers: gradedAnswers
    });

    await attempt.save();

    res.json({
      message: "Quiz submitted successfully",
      score,
      totalQuestions: quiz.questions.length,
      gradedAnswers
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create Quiz (Admin/Teacher)
exports.createQuiz = async (req, res) => {
  try {
    const quiz = new Quiz(req.body);
    await quiz.save();
    res.status(201).json({ message: "Quiz created", quiz });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update Quiz
exports.updateQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });
    res.json({ message: "Quiz updated", quiz });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete Quiz
exports.deleteQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findByIdAndDelete(req.params.id);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    // Delete any attempts related to this quiz
    await QuizAttempt.deleteMany({ quizId: req.params.id });

    res.json({ message: "Quiz deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
