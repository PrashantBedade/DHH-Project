// const express = require('express');
// const { registerPharmacy } = require('../controllers/pharmacyController');
// const router = express.Router();

// // Route to register a pharmacy
// router.post('/register', registerPharmacy);

// module.exports = router;

const express = require("express");
const {
  registerPharmacy,
  login,
} = require("../controllers/servicesController");
const pharmacyController = require("../controllers/servicesController");
const { authenticateToken } = require("../authMiddleware");
const path = require("path");
const router = express.Router();

// Route to register a pharmacy
router.post("/register", registerPharmacy);

// Route to login a pharmacy
router.post("/login", login);

router.get("/list", pharmacyController.getPharmacyList);
// Example protected route (middleware applied)
router.get("/protected", authenticateToken, (req, res) => {
  const { pharmacy_id, owner_name } = req.user;
  res.status(200).json({
    message: `Welcome, ${owner_name}! You are accessing data for pharmacy_id: ${pharmacy_id}.`,
  });
});

const authMiddleware = require("../authMiddleware");

// Serve the dashboard
router.get("/pharmacydashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/pharmacydashboard.html"));
});

module.exports = router;
