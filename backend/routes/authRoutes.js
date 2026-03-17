// routes/authRoutes.js
const express = require("express");
// Verify this line has BOTH register and login inside the { }
const { register, login } = require("../controllers/authController"); 

const router = express.Router();

router.post("/register", register);
router.post("/login", login); // Line 7: This will work now!

module.exports = router;