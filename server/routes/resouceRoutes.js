const express = require("express");
const {
  getAllResources,
  updateResourceByID,
  addResource,
  checkAvailability,
  getUniqueCategories,
  getUniqueResources
} = require("../controllers/resoucesController");
const router = express.Router();

// Get all resources
router.get("/get-resources", getAllResources);

// Update a resource by ID
// Define route in your backend with resourceID as parameter
router.put('/:id', updateResourceByID);

router.post("/add-resources", addResource);

router.post("/availability", checkAvailability);

router.get("/unique-resources", getUniqueResources);

// Endpoint to fetch unique categories
router.get("/unique-categories", getUniqueCategories);

module.exports = router;
