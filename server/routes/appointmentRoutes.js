const express = require('express');
const { bookAppointment, getDoctorAppointments,getAvailableTimeSlots,getdoneappointment,doneAppointment } = require('../controllers/appointmentController');

const router = express.Router();

router.post('/book', bookAppointment);
router.get('/appointments/:doctorID', getDoctorAppointments);

router.get('/slots', getAvailableTimeSlots); // Get available slots for the selected doctor and date

router.get('/appointment/getdoneappointment',getdoneappointment);
router.post('/appintment/doneappointment',doneAppointment);

module.exports = router;
