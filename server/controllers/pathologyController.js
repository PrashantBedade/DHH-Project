const { Pathology } = require('../models/registerPathologyModel');
const {PathologyAppointment}=require('../models/pathologyAppointment')
const { Appointment } = require("../models/appointmentModel");
const { Doctor } = require("../models/Doctor");
const PDFDocument = require("pdfkit");
const fs = require("fs");
// Book appointment
const path = require("path");
const { Patient1 } = require("../models/Patient"); // Patient1 table in patient_db
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env; // Ensure JWT_SECRET is set in environment variables

// Controller function to get Pathology details by ID
const getPathologyDetailsById = async (req, res) => {
  try {
    const pathologyID = req.pathologyID; // Pathology ID from the decoded JWT token
    
    // Find pathology details by pathologyID
    const pathology = await Pathology.findOne({
      where: { pathologyID }
    });

    if (!pathology) {
      return res.status(404).json({ message: 'Pathology not found' });
    }

    return res.json(pathology); // Return pathology details in the response
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

const updatePathologyDetailsById = async (req, res) => {
    try {
      const pathologyID = req.pathologyID; // Pathology ID from the decoded JWT token
      const updates = req.body; // Data to update
  
      // Find the pathology record by pathologyID
      const pathology = await Pathology.findOne({ where: { pathologyID } });
  
      if (!pathology) {
        return res.status(404).json({ message: 'Pathology not found' });
      }
  
      // Update pathology details
      await pathology.update(updates);
  
      return res.json({
        message: 'Pathology details updated successfully',
        updatedPathology: pathology,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Server error' });
    }
  };

  const moment = require('moment-timezone'); // Library for timezone conversions

  const generateSlots = (date) => {
    const slots = [];
    const startTime = 8 * 60; // 8:00 AM in minutes
    const endTime = 20 * 60; // 8:00 PM in minutes
    const slotDuration = 30; // 30 minutes per slot
  
    for (let time = startTime; time < endTime; time += slotDuration) {
      const hours = Math.floor(time / 60)
        .toString()
        .padStart(2, "0");
      const minutes = (time % 60).toString().padStart(2, "0");
      slots.push(`${hours}:${minutes}`);
    }
  
    return slots;
  };

  
  const bookPathologyAppointment = async (req, res) => {
    const { pathologyID, appointment_date,test_type, appointment_time } = req.body;
  
    // Validate input
    if (!pathologyID || !appointment_date || !appointment_time) {
      return res.status(400).json({ message: "All fields are required" });
    }
    
    try {
      // Extract patientID from the JWT token
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) return res.status(401).json({ message: "Token missing" });
      
      const decoded = jwt.verify(token, JWT_SECRET);
      const patientID = decoded.patientID;
      
      // Fetch patient details
      const patient = await Patient1.findOne({ where: { patientID } });
      if (!patient) return res.status(404).json({ message: "Patient not found" });
  
      // Check if the pathology appointment slot is already booked
      const existingAppointment = await PathologyAppointment.findOne({
        where: { pathologyID, appointment_date, appointment_time },
      });
      if (existingAppointment) {
        return res.status(400).json({ message: "Time slot already booked" });
      }
  
      // Create pathology appointment
      const appointment = await PathologyAppointment.create({
        pathologyID,
        test_type,
        appointment_date,
        appointment_time,
        patientID,
      });
      
      return res.status(201).json({
        message: "Pathology appointment booked successfully",
        appointment,
      });
    } catch (error) {
      console.error("Error booking pathology appointment:", error);
      return res.status(500).json({ message: "Error booking pathology appointment", error });
    }
  };
  
  const getPathologyAppointmentsBYID = async (req, res) => {
    try {
      // Extract token from authorization header
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) return res.status(401).json({ message: "Token missing" });
  
      // Decode the token to extract pathologyID
      const decoded = jwt.verify(token, JWT_SECRET);
      const pathologyID = decoded.pathologyID;
  
      if (!pathologyID) {
        return res.status(400).json({ message: "Invalid token or pathology ID" });
      }
  
      // Fetch all appointments for the given pathologyID
      const allAppointments = await PathologyAppointment.findAll({
        where: { pathologyID },
      });
  
      // Respond with the fetched appointments
      res.status(200).json(allAppointments);
    } catch (error) {
      console.error("Error fetching pathology appointments:", error);
      res.status(500).json({ message: "Error fetching appointments", error });
    }
  };
  

module.exports = {getPathologyAppointmentsBYID, getPathologyDetailsById,updatePathologyDetailsById,bookPathologyAppointment };
