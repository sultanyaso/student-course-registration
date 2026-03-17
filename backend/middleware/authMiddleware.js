const jwt = require("jsonwebtoken");
const User = require("../models/user");

// Auth middleware
exports.authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback_secret");
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ message: "User not found" });

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

// Admin/teacher middleware
exports.adminMiddleware = (req, res, next) => {
  if (req.user.role !== "admin" && req.user.role !== "teacher") {
    return res.status(403).json({ message: "Access denied. Admins/Teachers only." });
  }
  next();
};