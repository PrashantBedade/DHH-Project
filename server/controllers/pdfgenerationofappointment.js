const PDFDocument = require('pdfkit');
const fs = require('fs');

const generatePDF = (appointmentDetails, res) => {
    const doc = new PDFDocument();

    // Set headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=Appointment-Confirmation.pdf');

    // Generate PDF content
    doc.pipe(res);
    doc.fontSize(16).text("Appointment Confirmation", { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Hospital: ${appointmentDetails.hospital}`);
    doc.text(`Doctor: ${appointmentDetails.doctor}`);
    doc.text(`Date: ${appointmentDetails.date}`);
    doc.text(`Time: ${appointmentDetails.time}`);
    doc.end();
};

module.exports = { generatePDF };
