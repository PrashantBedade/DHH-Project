const {Doctor} = require('../models/Doctor');
const {Appointment} = require('../models/appointmentModel');
const {Patient1} = require('../models/Patient');
const {Op}=require('sequelize');
const sequelize=require('sequelize');

// Get available doctors
const getAvailableDoctors = async (req, res) => {
    try {
        const doctors = await Doctor.findAll({
            where: { available: true },
        });

        if (doctors.length === 0) {
            return res.status(404).json({ message: "No available doctors found" });
        }

        const doctorList = doctors.map(doctor => ({
            doctorID: doctor.doctorID,
            name: `${doctor.firstName} ${doctor.surname} (${doctor.specialization || 'Not Specified'})`,
        }));

        res.status(200).json(doctorList);
    } catch (error) {
        res.status(500).json({ message: "Error fetching doctors", error });
    }
};


const updateDoctorAvailability = async (req, res) => {
    const { doctorID } = req.user; // Extract doctorID from the decoded JWT token
    const { available } = req.body; // Extract availability status from request body
  
    try {
      // Find doctor by doctorID
      const doctor = await Doctor.findOne({ where: { doctorID } });
  
      if (!doctor) {
        return res.status(404).json({ message: "Doctor not found" });
      }
  
      // Update availability
      doctor.available = available;
      await doctor.save();
  
      res.status(200).json({
        message: "Doctor availability updated successfully",
        doctor: { doctorID: doctor.doctorID, available: doctor.available },
      });
    } catch (error) {
      console.error("Error updating availability:", error);
      res.status(500).json({ message: "Error updating availability", error });
    }
  };
    

const getDoctorDetailsByID = async (req, res) => {
    const { doctorID } = req.user; // Extract doctorID from req.user
  
    try {
      const doctor = await Doctor.findOne({ where: { doctorID } });
  
      if (!doctor) {
        return res.status(404).json({ message: "Doctor not found" });
      }
  
      return res.status(200).json({ doctor });
    } catch (error) {
      console.error("Error fetching doctor details:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  const updateDoctorDetails = async (req, res) => {
    const { doctorID } = req.user; // Extract doctorID from decoded JWT
    const updatedData = { ...req.body }; // Copy the request body to prevent mutations
  
    try {
      // Ensure doctorID is not included in the update
      if ("doctorID" in updatedData) {
        delete updatedData.doctorID;
      }
  
      // Check if the doctor exists
      const doctor = await Doctor.findOne({ where: { doctorID } });
  
      if (!doctor) {
        return res.status(404).json({ message: "Doctor not found" });
      }
  
      // Update doctor information
      await doctor.update(updatedData);
  
      return res.status(200).json({ message: "Doctor information updated successfully", doctor });
    } catch (error) {
      console.error("Error updating doctor details:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  const getFutureAppointments = async (req, res) => {
    const { doctorID } = req.user; // Extract doctorID from the JWT token

    try {
        // Get current date and time in UTC
        let currentDateTime = new Date();

        // Adjust for Indian Standard Time (GMT +5:30)
        currentDateTime.setHours(currentDateTime.getHours() + 5);
        currentDateTime.setMinutes(currentDateTime.getMinutes() + 30);

        // Log current date and time for debugging
        console.log("Current Date and Time (IST): ", currentDateTime);

        // Build a combined datetime for the current date and time
        const currentDateTimeString = currentDateTime.toISOString().split('T').join(' ').split('Z')[0];

        // Find future appointments for the doctor (appointments that are after the current date and time)
        const appointments = await Appointment.findAll({
            where: {
                doctorID,
                // Use Op.gt to compare both date and time in a single datetime value
                [Op.and]: [
                    sequelize.literal(
                        `CONCAT(date, ' ', time) > '${currentDateTimeString}'`
                    ),
                ]
            }
        });

        // If no future appointments are found
        if (appointments.length === 0) {
            return res.status(404).json({ message: "No future appointments found." });
        }

        // Fetch patient information for each appointment
        const result = [];
        for (const appointment of appointments) {
            // Fetch patient details from patient_db
            const patient = await Patient1.findOne({ where: { patientID: appointment.patientID } });

            if (!patient) {
                continue; // Skip if patient not found
            }

            // Add patient info and appointment details to the result
            result.push({
                patientID: patient.patientID,
                name: patient.name, // Assuming 'name' is the patient name
                date: appointment.date,
                time: appointment.time,
            });
        }

        // Return the appointments with patient details
        return res.status(200).json({
            currentDateTime: currentDateTimeString, // Include current date and time for debugging
            appointments: result, // List of appointments with patient details
        });

    } catch (error) {
        console.error("Error fetching future appointments:", error);
        return res.status(500).json({ message: "Error fetching future appointments.", error });
    }
};


const getAppointmentHistory = async (req, res) => {
    const { doctorID } = req.user; // Extract doctorID from the JWT token

    try {
        // Get current date and time in UTC
        let currentDateTime = new Date();

        // Adjust for Indian Standard Time (GMT +5:30)
        currentDateTime.setHours(currentDateTime.getHours() + 5);
        currentDateTime.setMinutes(currentDateTime.getMinutes() + 30);

        // Log current date and time for debugging
        console.log("Current Date and Time (IST): ", currentDateTime);

        // Build a combined datetime for the current date and time
        const currentDateTimeString = currentDateTime.toISOString().split('T').join(' ').split('Z')[0];

        // Find past appointments for the doctor (appointments that are before current date and time)
        const appointments = await Appointment.findAll({
            where: {
                doctorID,
                // Use Op.lt to compare both date and time in a single datetime value
                [Op.and]: [
                    sequelize.literal(
                        `CONCAT(date, ' ', time) < '${currentDateTimeString}'`
                    ),
                ]
            }
        });

        // If no past appointments are found
        if (appointments.length === 0) {
            return res.status(404).json({ message: "No past appointments found." });
        }

        // Fetch patient information for each appointment
        const result = [];
        for (const appointment of appointments) {
            // Fetch patient details from patient_db
            const patient = await Patient1.findOne({ where: { patientID: appointment.patientID } });

            if (!patient) {
                continue; // Skip if patient not found
            }

            // Add patient info and appointment details to the result
            result.push({
                patientID: patient.patientID,
                name: patient.name, // Assuming 'name' is the patient name
                date: appointment.date,
                time: appointment.time,
            });
        }

        // Return the appointments with patient details
        return res.status(200).json({
            currentDateTime: currentDateTimeString, // Include current date and time for debugging
            appointments: result, // List of appointments with patient details
        });

    } catch (error) {
        console.error("Error fetching appointment history:", error);
        return res.status(500).json({ message: "Error fetching appointment history.", error });
    }
};

module.exports = { getAvailableDoctors,getAppointmentHistory, updateDoctorAvailability,getDoctorDetailsByID, updateDoctorDetails,getFutureAppointments };
