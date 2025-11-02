const PDFDocument = require("pdfkit");
const fs = require("fs");
// Book appointment
const path = require("path");
const { Patient1 } = require("../models/Patient"); // Patient1 table in patient_db
const {Appointment}=require("../models/appointmentModel")
const {Doctor}=require("../models/Doctor");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env; // Ensure JWT_SECRET is set in environment variables
const axios = require("axios");


// const generatePDF = async (req, res) => {
//     try {
//         const { patient, appointmentDetails, doctorDetails, predictedDisease } = req.body;
//         // Create a PDF document
//         const doc = new PDFDocument({ size: 'A4', margin: 5 });

//         // Path to save the PDF
//         const filePath = path.join(__dirname, `reports/${appointmentDetails.id}_report.pdf`);
//         const writeStream = fs.createWriteStream(filePath);
//         doc.pipe(writeStream);

//         // ====== Header Section (Blue Header) ======
//         doc.rect(0, 0, doc.page.width, 60).fill('#1f89e5'); // Blue background
//         doc.image('logo_blue.png', 10, 5, { height: 50, align: 'left' }); // Logo
//         doc
//             .fontSize(20)
//             .fillColor('white')
//             .text('Digital Health Hub', 70, 15, { align: 'center' });
//         doc
//             .fontSize(18)
//             .text('Report / Prescription', { align: 'center' });
//         doc.moveTo(0, 60).lineTo(doc.page.width, 60).stroke();

//         // ====== Second Header (Patient and Doctor Details) ======
//         // Patient Details (Left)
//         doc
//             .fontSize(12)
//             .fillColor('black')
//             .text(`Patient ID: ${patient.patientID}`, 16, 80)
//             .text(`Name: ${patient.name}`, 16, 100)
//             .text(`Mobile No: ${patient.mobile}`, 16, 120)
//             .text(`Email: ${patient.email}`, 16, 140)
//             .text(`Address: ${patient.address}`, 16, 160)
//             .text(`Hospital Name: ${appointmentDetails.hospital}`, 16, 180);

//         // Doctor Details (Right)
//         doc
//             .text(`Doctor Name: ${doctorDetails.name}`, doc.page.width / 2, 80, { align: 'right' })
//             .text(`Doctor ID: ${doctorDetails.doctorID}`, doc.page.width / 2, 100, { align: 'right' })
//             .text(`Specialization: ${doctorDetails.specialization}`, doc.page.width / 2, 120, { align: 'right' })
//             .text(`Email: ${doctorDetails.email}`, doc.page.width / 2, 140, { align: 'right' })
//             .text(
//                 `Appointment Date & Time: ${appointmentDetails.date}, ${appointmentDetails.time}`,
//                 doc.page.width / 2,
//                 160,
//                 { align: 'right' }
//             );

//         doc.moveTo(10, 200).lineTo(doc.page.width - 10, 200).stroke();

//         // ====== Main Body Section ======
//         doc
//             .fontSize(12)
//             .text(`Appointment ID: ${appointmentDetails.id}`, 16, 220)
//             .text(`Date: ${new Date().toLocaleDateString()}`, doc.page.width - 100, 220, { align: 'right' });

//         // Table for Disease Prediction Details
//         const tableStartY = 260;
//         const labelWidth = doc.page.width * 0.3; // 30% for labels
//         const valueWidth = doc.page.width * 0.7; // 70% for values
//         const padding = 3;

//         const tableData = [
//             { label: 'Predicted Disease', value: predictedDisease.disease },
//             { label: 'Description', value: predictedDisease.description },
//             { label: 'Precautions', value: predictedDisease.precautions.join(', ') },
//             { label: 'Medications', value: predictedDisease.medications.join(', ') },
//             { label: 'Workout', value: predictedDisease.workout },
//             { label: 'Diets', value: predictedDisease.diets.join(', ') },
//         ];

//         // Render Table Rows
//         let currentY = tableStartY;
//         for (const { label, value } of tableData) {
//             doc
//                 .fontSize(10)
//                 .fillColor('black')
//                 .rect(10, currentY, labelWidth - 10, 20)
//                 .stroke()
//                 .fill()
//                 .text(label, 15, currentY + padding);

//             doc
//                 .rect(labelWidth, currentY, valueWidth - 20, 20)
//                 .stroke()
//                 .fill()
//                 .text(value, labelWidth + padding, currentY + padding, { width: valueWidth - 40 });

//             currentY += 22;
//         }

//         // Doctor Suggestion Box
//         doc
//             .rect(doc.page.width * 0.1, currentY + 10, doc.page.width * 0.8, 200)
//             .stroke()
//             .fill()
//             .text('Doctor Suggestion:', doc.page.width * 0.1 + 10, currentY + 20);

//         // Doctor Signature
//         doc
//             .text(`Doctor Signature: ${doctorDetails.name}`, doc.page.width - 150, doc.page.height - 50);

//         // End the PDF and save it
//         doc.end();

//         // Send the PDF file back to the client
//         writeStream.on('finish', () => {
//             res.download(filePath, `${appointmentDetails.id}_report.pdf`, (err) => {
//                 if (err) {
//                     console.error('Error sending PDF:', err);
//                 }
//                 // Optionally delete the file after download
//                 // fs.unlinkSync(filePath);
//             });
//         });
//     } catch (error) {
//         console.error('Error generating PDF:', error);
//         res.status(500).json({ status: 'error', message: 'Internal Server Error' });
//     }
// };

// module.exports={generatePDF}