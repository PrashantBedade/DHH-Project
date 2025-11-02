const { ContactUs } = require("../models/contactus");
const nodemailer = require("nodemailer");
require("dotenv").config();

const sendContactUsEmail = async (req, res) => {
  const { name, phoneNo, address, email, message } = req.body;

  try {
    // Save data to the database
    await ContactUs.create({ name, phoneNo, address, email, message });

    // Email configuration
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    // Email details
    const mailOptions = {
      from: process.env.EMAIL,
      to: process.env.EMAIL, // Send email to yourself
      subject: `Contact Us Form Submission by ${name}`,
      text: `
        Name: ${name}
        Phone No: ${phoneNo}
        Address: ${address}
        Email: ${email}
        Message: ${message}
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return res
      .status(200)
      .json({ message: "Contact form submitted successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    return res
      .status(500)
      .json({
        message: "Failed to submit the contact form. Please try again.",
      });
  }
};

module.exports = { sendContactUsEmail };
