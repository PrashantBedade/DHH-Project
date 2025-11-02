// routes/loginRoutes.js
const express = require("express");
const { handleLogin } = require("../controllers/loginController");

const router = express.Router();

// Route to handle login form submission
router.post("/login", handleLogin);

module.exports = router;