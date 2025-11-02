const express = require('express');
const { getPathologyDetailsById,updatePathologyDetailsById,getPathologyAppointmentsBYID } = require('../controllers/pathologyController');
const {pathologyAuth} = require('../middleware/authMiddelware');

const router = express.Router();

// Define route to get pathology details by ID (protected route)
router.get('/pathology/details', pathologyAuth, getPathologyDetailsById);
router.put('/update-details', pathologyAuth, updatePathologyDetailsById);
router.get('/all-Appointments', getPathologyAppointmentsBYID);


module.exports = router;
