const express = require("express");
const {
  loginAdmin,
  addStaff,
  getAdminAndHospitalDetails,
} = require("../controllers/HospitalAdminController");
const { hospitalAdminAuth } = require("../middleware/authMiddelware");

const router = express.Router();

// Register Hospital Admin

// Login Hospital Admin
router.post("/login", loginAdmin);

router.post("/add-staff", hospitalAdminAuth, addStaff);
router.get(
  "/get-admin-and-hospital",
  hospitalAdminAuth,
  getAdminAndHospitalDetails
);

module.exports = router;
