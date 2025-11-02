const { Appointment } = require("../models/appointmentModel");
const { Doctor } = require("../models/Doctor");
const { DoneAppointment } = require('../models/doneAppointment');
const PDFDocument = require("pdfkit");
const fs = require("fs");
// Book appointment
const path = require("path");
const { Patient1 } = require("../models/Patient"); // Patient1 table in patient_db
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env; // Ensure JWT_SECRET is set in environment variables

const bookAppointment = async (req, res) => {
  const { hospital, doctorID, date, time } = req.body;

  // Validate input
  if (!hospital || !doctorID || !date || !time) {
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

    // Check if doctor is available
    const doctor = await Doctor.findOne({
      where: { doctorID, available: true },
    });
    if (!doctor)
      return res.status(400).json({ message: "Doctor is not available" });

    // Check if the appointment slot is already booked
    const existingAppointment = await Appointment.findOne({
      where: { doctorID, date, time },
    });
    if (existingAppointment)
      return res.status(400).json({ message: "Time slot already booked" });

    // Create appointment
    const appointment = await Appointment.create({
      hospital,
      doctorID,
      date,
      time,
      patientID,
    });

    // Generate PDF
    const doc = new PDFDocument({
      size: [500, 600], // Custom page size
      layout: "portrait",
      margin: 20, // Margins for borders
    });

    // Set response headers
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=Appointment-${appointment.id}.pdf`
    );
    res.setHeader("Content-Type", "application/pdf");

    // Stream the PDF to the response
    doc.pipe(res);

    const pageWidth = doc.page.width;
    const pageHeight = doc.page.height;

    // Resolve paths dynamically
    const backgroundImagePath = path.resolve(
      __dirname,
      "../../client/assets/maincontentrightimg.png"
    );
    const logoPath = path.resolve(
      __dirname,
      "../../client/assets/logo_blue.jpg"
    );

    // Draw page border (double border)
    doc
      .rect(10, 10, pageWidth - 20, pageHeight - 20)
      .strokeColor("#000")
      .lineWidth(2)
      .stroke();
    doc
      .rect(15, 15, pageWidth - 30, pageHeight - 30)
      .strokeColor("#000")
      .lineWidth(1)
      .stroke();

    // Background Image with opacity
    if (fs.existsSync(backgroundImagePath)) {
      doc
        .save()
        .opacity(0.2)
        .image(backgroundImagePath, pageWidth / 2 - 200, pageHeight / 2 - 200, {
          width: 400,
          height: 400,
        })
        .opacity(1)
        .restore();
    } else {
      console.warn(
        `Background image not found at path: ${backgroundImagePath}`
      );
    }

    // Header Section
    const headerHeight = 140;
    doc.rect(20, 20, pageWidth - 40, headerHeight).fill("#1F89E5");

    // Logo inside header section (circular logo, larger size)
    if (fs.existsSync(logoPath)) {
      doc
        .save()
        .circle(70, 70, 40) // Center at (70, 70), radius 40 (moved 10 units to the right)
        .clip()
        .image(logoPath, 30, 30, { width: 80, height: 80 }) // Adjust logo size and position to shift by 10 units
        .restore();
    } else {
      console.warn(`Logo image not found at path: ${logoPath}`);
    }

    // Header content
    doc
      .fillColor("#fff")
      .fontSize(20)
      .font("Helvetica-Bold")
      .text("Digital Health Hub", 90, 40, { align: "center" });
    doc
      .fontSize(14)
      .text("APPOINTMENT CONFIRMATION", 90, 70, { align: "center" });

    // Contact details horizontally aligned below the header section
    doc
      .fontSize(10)
      .text("Mobile No: 7978726856 / 9405983929", 40, 116, {
        align: "left",
        width: pageWidth - 240,
      })
      .text("Email ID: digitalhealthhub69@gmail.com", 40, 128, {
        align: "left",
        width: pageWidth - 240,
      })
      .text("Location: Maharashtra, Nashik", 40, 140, {
        align: "left",
        width: pageWidth - 240,
      });

    // Line below the header section
    doc
      .moveTo(20, 160)
      .lineTo(pageWidth - 20, 160)
      .stroke();

    // Date and Appointment ID Section (left-aligned)
    const dateStr = new Date().toLocaleDateString(); // Current date in locale format
    const appointmentID = appointment.id; // Assuming the appointment ID is available

    // Display the date and appointment ID on the same line, left-aligned
    doc
      .fontSize(10)
      .fillColor("#000")
      .text(`Date: ${dateStr}`, 40, 180)
      .text(`Appointment ID: ${appointmentID}`, pageWidth / 2, 180, {
        align: "left",
      });

    // Patient and Appointment Details (centered table)
    const tableStartX = pageWidth / 2 - 200;
    const tableStartY = 200;

    const drawTableRow = (x, y, text1, text2, isHeader = false) => {
      doc
        .rect(x, y, 200, 20)
        .fillOpacity(0.1) // Increase opacity for blur effect
        .fillAndStroke("#fff", "#000")
        .stroke();
      doc
        .rect(x + 200, y, 200, 20)
        .fillOpacity(0.1)
        .fillAndStroke("#fff", "#000")
        .stroke();
      doc
        .fillOpacity(1)
        .font(isHeader ? "Helvetica-Bold" : "Helvetica")
        .fontSize(10)
        .fillColor("#000")
        .text(text1, x + 10, y + 5, { width: 180, align: "left" })
        .text(text2, x + 210, y + 5, { width: 180, align: "left" });
    };

    drawTableRow(tableStartX, tableStartY, "Field", "Details", true);
    drawTableRow(
      tableStartX,
      tableStartY + 20,
      "Patient ID",
      patient.patientID
    );
    drawTableRow(tableStartX, tableStartY + 40, "Hospital Name", hospital);
    drawTableRow(tableStartX, tableStartY + 60, "Patient Name", patient.name);
    drawTableRow(tableStartX, tableStartY + 80, "Phone", patient.mobile);
    drawTableRow(tableStartX, tableStartY + 100, "Email", patient.email);
    drawTableRow(
      tableStartX,
      tableStartY + 120,
      "Doctor Name",
      `${doctor.firstName} ${doctor.surname}`
    );
    drawTableRow(
      tableStartX,
      tableStartY + 140,
      "Specialization",
      doctor.specialization || "Not Specified"
    );
    drawTableRow(tableStartX, tableStartY + 160, "Date", date);
    drawTableRow(tableStartX, tableStartY + 180, "Time", time);

    // Footer Section
    doc
      .fontSize(12)
      .font("Helvetica-Bold")
      .fillColor("#000")
      .text("Digitally Signed By:", 50, 500);
    doc.fontSize(12).font("Helvetica").text("DIGITAL HEALTH HUB", 165, 500);

    doc
      .fontSize(10)
      .fillColor("#000")
      .text("!!! Thank you !!!", 50, 540, { align: "center" });

    // End PDF document
    doc.end();
  } catch (error) {
    console.error("Error booking appointment:", error);
    res.status(500).json({ message: "Error booking appointment", error });
  }
};

// Get appointments for a doctor
const getDoctorAppointments = async (req, res) => {
  const { doctorID } = req.params;

  try {
    const appointments = await Appointment.findAll({
      where: { doctorID },
    });

    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching appointments", error });
  }
};

const generateSlots = (date) => {
  const slots = [];
  const startTime = 9 * 60; // 9:00 AM in minutes
  const endTime = 21 * 60; // 9:00 PM in minutes
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

module.exports = generateSlots;

const getAvailableTimeSlots = async (req, res) => {
  const { doctorID, date } = req.query;

  if (!doctorID || !date) {
    return res.status(400).json({ message: "Doctor ID and date are required" });
  }

  // Define the time slots (9:00 AM to 9:00 PM, in 30-minute intervals)
  const allSlots = [
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "17:30",
    "18:00",
    "18:30",
    "19:00",
    "19:30",
    "20:00",
    "20:30",
  ];

  try {
    // Fetch appointments for the doctor on the given date
    const bookedAppointments = await Appointment.findAll({
      where: {
        doctorID: doctorID,
        date: date,
      },
      attributes: ["time"], // Fetch only the 'time' column
    });

    // Extract and format the time slots of the booked appointments
    const bookedSlots = bookedAppointments.map((appointment) => {
      // Convert '09:00:00' to '09:00' for comparison
      return appointment.time.slice(0, 5);
    });

    // Filter out the booked slots from all available slots
    const availableSlots = allSlots.filter(
      (slot) => !bookedSlots.includes(slot)
    );

    return res.json({ availableSlots });
  } catch (error) {
    console.error("Error fetching available slots:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const doneAppointment=async (req, res) => {
  const { appointmentID } = req.body;

  try {
      // Find the appointment
      const appointment = await Appointment.findByPk(appointmentID);

      if (!appointment) {
          return res.status(404).json({ message: 'Appointment not found.' });
      }

      // Create a record in DoneAppointment
      const doneAppointment = await DoneAppointment.create({
          hospital: appointment.hospital,
          doctorID: appointment.doctorID,
          date: appointment.date,
          time: appointment.time,
          patientID: appointment.patientID,
      });

      // Delete the original appointment
      await appointment.destroy();

      res.status(200).json({ message: 'Appointment marked as done.', doneAppointment });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error marking appointment as done.', error });
  }
};

const getdoneappointment=async (req, res) => {
  try {
      const doneAppointments = await DoneAppointment.findAll();
      res.status(200).json(doneAppointments);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching done appointments.', error });
  }
};


module.exports = {
  bookAppointment,
  getDoctorAppointments,
  getAvailableTimeSlots,
  doneAppointment,
  getdoneappointment
};
