const axios = require("axios");
const CasePaper= require("../models/casepaperModel");
const {Appointment} = require("../models/appointmentModel");
const { Op } = require("sequelize");

exports.createCasePaper = async (req, res) => {
  try {
    const { patientID, symptoms } = req.body;

    // Validate inputs
    if (!patientID) {
      return res.status(400).json({ status: "error", message: "Patient ID is required" });
    }
    if (!symptoms || !Array.isArray(symptoms) || symptoms.length === 0) {
      return res.status(400).json({ status: "error", message: "Symptoms are required as an array" });
    }

    // Remove duplicate symptoms and convert to lowercase
    const uniqueSymptoms = [...new Set(symptoms.map(s => s.toLowerCase()))];

    // Get current timestamp
    const currentTime = new Date();
    
    // Find nearest appointment within ±30 minutes
    const nearestAppointment = await Appointment.findOne({
      where: {
        patientID: patientID,
        date: { 
          [Op.between]: [
            new Date(currentTime.getTime() - 30 * 60000), // 30 min before
            new Date(currentTime.getTime() + 3000 * 60000), // 30 min after
          ],
        },
      },
      order: [["date", "ASC"]],
    });

    if (!nearestAppointment) {
      return res.status(400).json({
        status: "error",
        message: "No appointment found",
      });
    }
  

    // Call Flask ML Model API
    const flaskResponse = await axios.post("http://127.0.0.1:5000/predict", {
      symptoms: uniqueSymptoms,
    });

    const predictionData = flaskResponse.data;

    // Save Case Paper in Database
    const casePaper = await CasePaper.create({
      patientID,
      symptoms: uniqueSymptoms.join(", "), // Store symptoms as a string
      disease: predictionData.disease,
      accuracy: predictionData.accuracy,
      description: predictionData.description || "N/A",
      precaution: predictionData.precaution || "N/A",
      medication: predictionData.medication || "N/A",
      diet: predictionData.diet || "N/A",
    });

    res.status(201).json({
      status: "success",
      message: "Case paper created successfully",
      casePaper,
    });
  } catch (error) {
    console.error("Error creating case paper:", error);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
};
