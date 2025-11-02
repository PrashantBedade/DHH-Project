// patientRoutes.js
const express = require("express");
const {
  register,
  login,
  getAllDetailsById,
  editInfoById,
  getAppointmentHistory,
  checkUnique
} = require("../controllers/patientController"); // Import the controller
const {bookPathologyAppointment}=require('../controllers/pathologyController')
const { patientAuth } = require("../middleware/authMiddelware");

const router = express.Router();

router.post("/login", login);

// Route for patient registration
router.post("/register", register);

router.get("/details", patientAuth, getAllDetailsById);


router.get('/checkUnique', checkUnique);

// Route to edit patient info by ID
router.put("/edit", patientAuth, editInfoById);

router.get("/history", patientAuth, getAppointmentHistory);

router.post('/pathology/appointment',patientAuth, bookPathologyAppointment);


// Export the router properly
module.exports = router;
