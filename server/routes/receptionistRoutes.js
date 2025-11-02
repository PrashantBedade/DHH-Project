// routes/receptionistRoutes.js
const express = require('express');
const { receptionistAuth } = require('../middleware/authMiddelware');
const { getReceptionistByID,updateReceptionistByID } = require('../controllers/receptionistController');
const router = express.Router();

// Define the GET route for fetching receptionist details
router.get('/get-receptionist', receptionistAuth, getReceptionistByID);

router.put('/update-receptionist', receptionistAuth, updateReceptionistByID);


module.exports = router;
