const express = require("express");
const {
  addMedicine,
  updateMedicine,
  deleteMedicine,
  viewMedicine,
  searchAllMedicines,
  getPharmacyById,
  getMedicines,
} = require("../controllers/PharmacyInventoryController");
const { PharmacyauthMiddleware } = require("../middleware/authMiddelware");

const router = express.Router();

router.post("/addmedicine1", PharmacyauthMiddleware, addMedicine);
router.get("/getmedicine1", PharmacyauthMiddleware, getMedicines);
router.put("/EditInventory", PharmacyauthMiddleware, updateMedicine);
router.delete("/deletemedecine", PharmacyauthMiddleware, deleteMedicine);
router.get("/viewbyid", PharmacyauthMiddleware, viewMedicine);
router.post("/Viewall", searchAllMedicines);
router.get("/pharmacybyID", getPharmacyById);

module.exports = router;
