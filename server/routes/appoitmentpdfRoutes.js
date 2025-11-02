const express = require('express');
const { generatePDF } = require('../controllers/pdfgenerationofappointment');

const router = express.Router();

router.post('/generate-pdf', (req, res) => {
    const { hospital, doctor, date, time } = req.body;

    if (!hospital || !doctor || !date || !time) {
        return res.status(400).json({ message: "Missing appointment details" });
    }

    const appointmentDetails = { hospital, doctor, date, time };
    generatePDF(appointmentDetails, res);
});

module.exports = router;
