const express = require("express");
const {
  predictDiseaseAndGeneratePDF,
  getNurseInfoByID,
  updateNurseInfoByID,
} = require("../controllers/nurseController");
const {createCasePaper}= require("../controllers/casepaperController")
const { nurseAuth } = require("../middleware/authMiddelware");

const router = express.Router();

// Case paper submission and PDF generation
// router.post("/casepaper", predictDiseaseAndGeneratePDF);
router.post("/casepaper1", createCasePaper);

// Nurse info routes
router.get("/getNurseInfo", nurseAuth, getNurseInfoByID);
router.put("/nurse-info", nurseAuth, updateNurseInfoByID);

module.exports = router;
