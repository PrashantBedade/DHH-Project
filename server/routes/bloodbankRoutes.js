const express = require("express");
const {
  addBlood,
  searchAllBlood,
  updateBlood,
  getBloodrecord,
  deletebloodrecord,
  geBloodbankById,
} = require("../controllers/BloodbankController");
const { BloodBankAuthMiddleware } = require("../middleware/authMiddelware");

const router = express.Router();

router.post("/addblood", BloodBankAuthMiddleware, addBlood);
router.get("/getallbloodrecord", BloodBankAuthMiddleware, getBloodrecord);
router.delete("/delbloodrecord", BloodBankAuthMiddleware, deletebloodrecord);
router.put("/updateblood", BloodBankAuthMiddleware, updateBlood);
router.get("/getbloodbankbyID", BloodBankAuthMiddleware, geBloodbankById);
router.post("/serachblood", searchAllBlood);

module.exports = router;
