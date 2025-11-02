const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sequelizePatient } = require('../db'); // Make sure this path is correct
const {Patient1} = require('../models/Patient'); // Patient1 model
const{Appointment}=require('../models/appointmentModel')
const { Doctor } = require("../models/Doctor");
const { Op } = require('sequelize');
const router = express.Router();
require("dotenv").config();
const { JWT_SECRET } = process.env; // Ensure JWT_SECRET is in your environment variables

const register = async (req, res) => {
    try {
        const {
            name,
            age,
            dob,
            address,
            state,
            city,
            height,
            weight,
            disability,
            mobile,
            family,
            email,
            password,
            confirm_password,
        } = req.body;

        // Check for missing required fields
        if (!name || !age || !dob || !mobile || !email || !password) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Check if passwords match
        if (password !== confirm_password) {
            return res.status(400).json({ message: 'Passwords do not match.' });
        }

        // Check for duplicate email or mobile
        const existingPatient = await Patient1.findOne({
            where: {
                [Op.or]: [{ email }, { mobile }],
            },
        });

        if (existingPatient) {
            if (existingPatient.email === email) {
                return res.status(400).json({ message: 'Email already exists. Please use a different email.' });
            }
            if (existingPatient.mobile === mobile) {
                return res.status(400).json({ message: 'Mobile number already exists. Please use a different mobile number.' });
            }
        }

        // Generate a unique patientID based on the last one
        const lastPatient = await Patient1.findOne({
            order: [['id', 'DESC']],
        });

        let patientID = 'Rugna001'; // Default ID if no previous records are found
        if (lastPatient) {
            // Increment the last patientID by 1
            const lastPatientID = parseInt(lastPatient.patientID.replace('Rugna', ''));
            patientID = `Rugna${(lastPatientID + 1).toString().padStart(3, '0')}`;
        }

        // Hash password before saving
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create patient record with hashed password
        const newPatient = await Patient1.create({
            patientID,
            name,
            age,
            dob,
            address,
            state,
            city,
            height,
            weight,
            disability,
            mobile,
            family,
            email,
            password: hashedPassword,
        });

        res.status(201).json({
            message: 'Patient registered successfully',
            patientID: newPatient.patientID,
        });
    } catch (error) {
        console.error('Error registering patient:', error);

        // Handle specific Sequelize validation errors (e.g., unique constraint violation)
        if (error.name === 'SequelizeUniqueConstraintError') {
            const field = error.errors[0].path;
            if (field === 'email') {
                return res.status(400).json({ message: 'Email already exists. Please use a different email.' });
            }
            if (field === 'mobile') {
                return res.status(400).json({ message: 'Mobile number already exists. Please use a different mobile number.' });
            }
        }

        res.status(500).json({ message: 'Internal server error' });
    }
};

const login = async (req, res) => {
    try {
        const { patientID } = req.body;

        // Validate if patientID is provided
        if (!patientID) {
            return res.status(400).json({ message: 'PatientID is required' });
        }

        // Fetch patient data from the database
        const patient = await sequelizePatient.query(`
            SELECT * FROM Patient1s WHERE patientID = '${patientID}'
        `);

        // If no patient found
        if (patient[0].length === 0) {
            return res.status(400).json({ message: 'Invalid patientID' });
        }

        // Generate JWT Token with patientID as payload
        const token = jwt.sign({ patientID: patient[0][0].patientID }, JWT_SECRET, { expiresIn: '1h' });

        // Insert or update the LoginLog table using raw SQL query
        await sequelizePatient.query(`
            INSERT INTO LoginLog (patientID, token, createdAt, updatedAt)
            VALUES ('${patientID}', '${token}', NOW(), NOW())
            ON DUPLICATE KEY UPDATE token = '${token}', updatedAt = NOW()
        `);

        // Send the JWT token back to the patient
        res.status(200).json({
            message: 'Login successful',
            token,
        });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get all details of a patient by ID
const getAllDetailsById = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1]; // Extract token from Authorization header
        if (!token) return res.status(401).json({ message: "Token missing" });

        const decoded = jwt.verify(token, JWT_SECRET); // Decode the token
        const patientID = decoded.patientID; // Extract patientID from the token

        const patient = await Patient1.findOne({ where: { patientID } });
        if (!patient) return res.status(404).json({ message: "Patient not found" });

        return res.status(200).json(patient);
    } catch (error) {
        console.error("Error fetching patient details:", error);
        return res.status(500).json({ message: "Error fetching patient details", error });
    }
};

// Edit patient info by ID
const editInfoById = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1]; // Extract token from Authorization header
        if (!token) return res.status(401).json({ message: "Token missing" });

        const decoded = jwt.verify(token, JWT_SECRET); // Decode the token
        const patientID = decoded.patientID; // Extract patientID from the token

        const updates = req.body; // Get updates from the request body
        const patient = await Patient1.findOne({ where: { patientID } });
        if (!patient) return res.status(404).json({ message: "Patient not found" });

        await patient.update(updates); // Update patient info
        return res.status(200).json({ message: "Patient details updated successfully" });
    } catch (error) {
        console.error("Error updating patient details:", error);
        return res.status(500).json({ message: "Error updating patient details", error });
    }
};


const getAppointmentHistory = async (req, res) => {
    try {
        const { patientID } = req; // Extracted from the token
        
        // Fetch appointments based on patientID
        const appointments = await Appointment.findAll({
            where: {
                patientID: patientID
            },
            order: [['date', 'DESC'], ['time', 'ASC']], // Sorting appointments by date and time
        });

        if (appointments.length === 0) {
            return res.status(404).json({ message: 'No appointment history found' });
        }

        // Fetch doctor details for each appointment based on doctorID
        const formattedAppointments = await Promise.all(appointments.map(async (appointment) => {
            // Find the doctor using the doctorID from the appointment
            const doctor = await Doctor.findOne({
                where: { doctorID: appointment.doctorID }
            });

            if (!doctor) {
                throw new Error(`Doctor with ID ${appointment.doctorID} not found`);
            }

            return {
                ...appointment.toJSON(),
                doctorName: `${doctor.firstName} ${doctor.surname}`, // Constructing the full name
                doctorSpecialization: doctor.specialization || 'Not Specified', // Include doctor's specialization
                doctorAvailable: doctor.available, // Include doctor's availability status
            };
        }));

        // Return the appointment history with the doctor name instead of doctor ID
        res.status(200).json(formattedAppointments);
    } catch (error) {
        console.error("Error fetching appointment history:", error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};


const checkUnique = async (req, res) => {
    try {
        const { email, mobile } = req.query;

        if (!email && !mobile) {
            return res.status(400).json({ message: "Email or mobile number is required" });
        }

        const existingPatient = await Patient1.findOne({
            where: {
                [Op.or]: [{ email }, { mobile }]
            }
        });

        if (existingPatient) {
            return res.json({ isTaken: true, message: "Email or Mobile number already exists" });
        }

        return res.json({ isTaken: false, message: "Email and Mobile number are available" });
    } catch (error) {
        console.error("Error in checkUnique:", error);
        res.status(500).json({ message: "Server error" });
    }
};




module.exports = {register,login, getAllDetailsById, editInfoById,getAppointmentHistory,checkUnique };
