const express = require("express");
const {
  getAvailableDoctors,
  updateDoctorAvailability,
  getDoctorDetailsByID,
  updateDoctorDetails,
  getAppointmentHistory,
  getFutureAppointments,
} = require("../controllers/doctorController");
const { doctorAuth } = require("../middleware/authMiddelware");
const router = express.Router();

router.get("/available", getAvailableDoctors);

router.put("/update-availability", doctorAuth, updateDoctorAvailability);
router.get("/get-doctor-details", doctorAuth, getDoctorDetailsByID);
router.put("/update-doctor-details", doctorAuth, updateDoctorDetails);

router.get("/future-appointments", doctorAuth, getFutureAppointments);

// Get past appointments for the doctor
router.get("/appointment-history", doctorAuth, getAppointmentHistory);

module.exports = router;
