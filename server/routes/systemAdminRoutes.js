const express = require("express");
const {
  registerHospitalAndAdmin,
  loginSystemAdmin,
} = require("../controllers/systemAdminController");
const {
  registerPharmacy,
  registerBloodbank,
  registerPathology,
} = require("../controllers/servicesController");
const { systemAdminAuth } = require("../middleware/authMiddelware");

const router = express.Router();

// Register Hospital Admin
router.post(
  "/registerHospitalAndAdmin",

  systemAdminAuth,
  registerHospitalAndAdmin
);

router.post("/register/Pharmacy",systemAdminAuth, registerPharmacy);
router.post("/register/BloodBank", registerBloodbank);
router.post("/register/Pathology", registerPathology);

router.post("/system-Admin/protected", loginSystemAdmin);

module.exports = router;
