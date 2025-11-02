const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const { Patient1 } = require("../models/Patient"); // Patient1 table in patient_db
const { Appointment } = require("../models/appointmentModel");
const { Doctor } = require("../models/Doctor");
const { Nurse1 } = require("../models/Nurse");
const jwt = require("jsonwebtoken");
const axios = require("axios");

const predictDiseaseAndGeneratePDF = async (req, res) => {
    try {
      const { patientID, symptoms } = req.body;
  
      // Validate inputs
      if (!patientID) {
        return res
          .status(400)
          .json({ status: "error", message: "Patient ID is required" });
      }
      if (!symptoms || symptoms.length === 0) {
        return res
          .status(400)
          .json({ status: "error", message: "Symptoms are required" });
      }
  
      // Remove duplicate symptoms
      const uniqueSymptoms = [...new Set(symptoms)];
  
      // Fetch appointment details
      const appointments = await Appointment.findAll({
        where: { patientID: patientID },
        order: [["date", "ASC"]],
      });
  
      if (!appointments || appointments.length === 0) {
        return res.status(404).json({
          status: "error",
          message: "No appointments found for the patient",
        });
      }
  
      const nearestAppointment = appointments.find(
        (appointment) => new Date(appointment.date) > new Date()
      );
  
      if (!nearestAppointment) {
        return res
          .status(404)
          .json({ status: "error", message: "No upcoming appointments" });
      }
  
      // Fetch patient and doctor details
      const patient = await Patient1.findOne({ where: { patientID: patientID } });
      if (!patient) {
        return res
          .status(404)
          .json({ status: "error", message: "Patient not found" });
      }
  
      const doctor = await Doctor.findOne({
        where: { doctorID: nearestAppointment.doctorID },
      });
      if (!doctor) {
        return res
          .status(404)
          .json({ status: "error", message: "Doctor not found" });
      }
  
      // Predict disease via Flask API
      const flaskApiUrl = "http://localhost:5000/disease/predict";
      const response = await axios.post(flaskApiUrl, {
        patientID: patient.patientID,
        symptoms: uniqueSymptoms,
      });
  
      const predictedDisease = response.data;
  
      // Ensure all fields in predictedDisease are properly formatted
      predictedDisease.precautions = predictedDisease.precautions || [];
      predictedDisease.medications = predictedDisease.medications || [];
      predictedDisease.diets = predictedDisease.diets || [];
      predictedDisease.workout = predictedDisease.workout || "Not Specified";
      predictedDisease.description = predictedDisease.description || "No description available";
  
      // Prepare data for PDF generation
      const data = {
        patient,
        appointmentDetails: nearestAppointment,
        doctorDetails: doctor,
        predictedDisease,
      };
  
      // Set headers for PDF download
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=Appointment-${nearestAppointment.id}.pdf`
      );
      res.setHeader("Content-Type", "application/pdf");
  
      generatePDF(data, res);
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: "error", message: "Internal Server Error" });
    }
  };
  
  const generatePDF = (data, res) => {
    const { patient, appointmentDetails, doctorDetails, predictedDisease } = data;
  
    const doc = new PDFDocument({ size: "A4", margin: 10 });
    doc.pipe(res);
  
    try {
      // Double Border
      const margin = 10;
      doc
        .rect(
          margin,
          margin,
          doc.page.width - 2 * margin,
          doc.page.height - 2 * margin
        )
        .lineWidth(2)
        .stroke();
      doc
        .rect(
          margin + 5,
          margin + 5,
          doc.page.width - 2 * (margin + 5),
          doc.page.height - 2 * (margin + 5)
        )
        .lineWidth(1)
        .stroke();
  
      // Header
      doc
        .rect(margin + 5, margin + 5, doc.page.width - 2 * (margin + 5), 60)
        .fill("#1f89e5");
      doc
        .fontSize(20)
        .fillColor("#fff")
        .text("Digital Health Hub", doc.page.width / 2 - 100, margin + 15, {
          align: "center",
        });
      doc
        .fontSize(18)
        .text("Report / Prescription", doc.page.width / 2 - 100, margin + 35, {
          align: "center",
        });
      doc
        .moveTo(margin + 5, 60 + margin)
        .lineTo(doc.page.width - margin - 5, 60 + margin)
        .stroke();
  
      // Patient and Doctor Details
      const containerY = 80;
      const leftX = margin + 15;
      const rightX = doc.page.width / 2 + 10;
  
      doc.fontSize(12).fillColor("#000");
      doc.text(`Patient ID: ${patient.patientID}`, leftX, containerY + 10);
      doc.text(`Name: ${patient.name}`, leftX, containerY + 30);
      doc.text(`Mobile No: ${patient.mobile}`, leftX, containerY + 50);
      doc.text(`Email: ${patient.email}`, leftX, containerY + 70);
      doc.text(`Address: ${patient.address}`, leftX, containerY + 90);
      doc.text(
        `Hospital Name: ${appointmentDetails.hospital}`,
        leftX,
        containerY + 110
      );
  
      doc.text(
        `Doctor Name: ${doctorDetails.firstName} ${doctorDetails.surname}`,
        rightX,
        containerY + 10
      );
      doc.text(`Doctor ID: ${doctorDetails.doctorID}`, rightX, containerY + 30);
      doc.text(
        `Specialization: ${doctorDetails.specialization}`,
        rightX,
        containerY + 50
      );
      doc.text(`Email: ${doctorDetails.email}`, rightX, containerY + 70);
      doc.text(
        `Appointment Date & Time: ${appointmentDetails.date}, ${appointmentDetails.time}`,
        rightX,
        containerY + 90
      );
  
      // Predicted Disease Details
      const bodyY = containerY + 120 + 10;
      doc.rect(margin + 5, bodyY, doc.page.width - 2 * (margin + 5), 200).stroke();
  
      const tableData = [
        { label: "Predicted Disease", value: predictedDisease.disease },
        { label: "Description", value: predictedDisease.description },
        { label: "Precautions", value: predictedDisease.precautions.join(", ") },
        { label: "Medications", value: predictedDisease.medications.join(", ") },
        { label: "Workout", value: predictedDisease.workout },
        { label: "Diets", value: predictedDisease.diets.join(", ") },
      ];
  
      let currentY = bodyY + 10;
      for (const { label, value } of tableData) {
        doc.text(label, margin + 10, currentY);
        doc.text(value, margin + 150, currentY);
        currentY += 20;
      }
  
      // Doctor's Suggestion
      doc
        .rect(margin + 5, currentY + 10, doc.page.width - 2 * (margin + 5), 100)
        .stroke();
      doc.text("Doctor Suggestion:", margin + 10, currentY + 20);
      doc.text(
        `Doctor Signature: ${doctorDetails.firstName} ${doctorDetails.surname}`,
        doc.page.width - 150,
        doc.page.height - 50
      );
  
      doc.end();
    } catch (err) {
      console.error("PDF Generation Error:", err);
      res.status(500).end();
    }
  };
  

const getNurseInfoByID = async (req, res) => {
  try {
    const { nurseID } = req;

    // console.log("Extracted Nurse ID:", nurseID);

    const nurse = await Nurse1.findOne({ where: { nurseID } });

    if (!nurse) {
      return res.status(404).json({ error: `Nurse with ID not found.` });
    }

    const { password, ...nurseData } = nurse.toJSON();

    res.status(200).json(nurseData);
  } catch (err) {
    console.error("Error fetching nurse information:", err);
    res
      .status(500)
      .json({ error: "An error occurred while fetching nurse information." });
  }
};

const updateNurseInfoByID = async (req, res) => {
  try {
    const { nurseID } = req;
    const { firstName, surname, email, phone } = req.body;

    const nurse = await Nurse1.findOne({ where: { nurseID } });

    if (!nurse) {
      return res
        .status(404)
        .json({ error: `Nurse with ID ${nurseID} not found.` });
    }

    await nurse.update({ firstName, surname, email, phone });

    const { password, ...updatedNurseData } = nurse.toJSON();
    res.status(200).json({
      message: "Nurse information updated successfully.",
      data: updatedNurseData,
    });
  } catch (err) {
    console.error("Error updating nurse information:", err);
    res
      .status(500)
      .json({ error: "An error occurred while updating nurse information." });
  }
};

module.exports = {
  predictDiseaseAndGeneratePDF,
  getNurseInfoByID,
  updateNurseInfoByID,
};
