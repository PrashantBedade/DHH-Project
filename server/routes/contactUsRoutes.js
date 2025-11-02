// routes/contactUsRoutes.js
const express = require("express");
const {sendContactUsEmail}  = require("../controllers/contactUSController");

const router = express.Router();

// Contact Us POST route
router.post("/contactus", sendContactUsEmail);

module.exports = router;
