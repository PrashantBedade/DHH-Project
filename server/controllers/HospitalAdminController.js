const bcrypt = require("bcrypt");
const { Doctor } = require("../models/Doctor");
const { Nurse1 } = require("../models/Nurse");
const { Receptionist } = require("../models/Receptionist");
const jwt = require("jsonwebtoken");
const { comparePassword, generateToken } = require("../utils/jwtUtils");
const { HospitalAdmin } = require("../models/HospitalAdmin");
const { Hospital } = require("../models/Hospital");
require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET;

// Login Hospital Admin
exports.loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find Admin
    const admin = await HospitalAdmin.findOne({ where: { username } });
    if (!admin) {
      return res.status(404).json({ error: "Admin not found." });
    }

    // Check Password
    const validPassword = await comparePassword(password, admin.password);
    if (!validPassword) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Generate JWT Token
    const token = generateToken(
      { id: admin.id, username: admin.username },
      "QAWSEDRFTGYHUJIKOLPMNBVCXZ",
      { expiresIn: "1d" }
    );

    res.status(200).json({ message: "Login successful!", token });
  } catch (error) {
    res.status(500).json({ error: "Failed to login.", details: error.message });
  }
};

// Add Staff
exports.addStaff = async (req, res) => {
  try {
    const {
      ID,
      role,
      name,
      surname,
      licenseNo,
      specialization,
      email,
      phone,
      password,
    } = req.body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    let staff;
    switch (role) {
      case "doctor":
        staff = await Doctor.create({
          doctorID: ID,
          firstName: name,
          surname,
          licenseNo,
          specialization,
          email,
          phone,
          password: hashedPassword,
        });
        break;

      case "nurse":
        staff = await Nurse1.create({
          nurseID: ID,
          firstName: name,
          surname,
          email,
          phone,
          password: hashedPassword,
        });
        break;

      case "receptionist":
        staff = await Receptionist.create({
          receptionistID: ID,
          firstName: name,
          surname,
          email,
          phone,
          password: hashedPassword,
        });
        break;

      default:
        return res.status(400).json({ error: "Invalid role provided" });
    }

    res.status(201).json({ message: "Staff added successfully", staff });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to add staff" });
  }
};

// Get Admin and Hospital Details
exports.getAdminAndHospitalDetails = async (req, res) => {
  try {
    const { id } = req.user; // Get ID from token

    // Fetch Admin and Hospital details
    const admin = await HospitalAdmin.findOne({ where: { username: id } });
    if (!admin) {
      return res.status(404).json({ error: "Hospital Admin not found." });
    }

    const hospital = await Hospital.findOne({ where: { adminUsername: id } });
    if (!hospital) {
      return res.status(404).json({ error: "Hospital details not found." });
    }

    res.status(200).json({
      admin,
      hospital,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to retrieve details.",
      details: error.message,
    });
  }
};
