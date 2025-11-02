const jwt = require("jsonwebtoken");
const { HospitalAdmin, Patient1, Doctor, Nurse, Receptionist, RegisterPharmacy, RegisterBloodbank, Pathology } = require("../models");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.header("Authorization");
  
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(400).json({ message: "Invalid token" });
  }
};

// Middleware to check if user is authorized based on role
const authorizeRole = (roles) => {
  return async (req, res, next) => {
    const { role } = req.body;

    // Ensure the role exists and is one of the authorized roles
    if (!roles.includes(role)) {
      return res.status(403).json({ message: "Access forbidden: Unauthorized role" });
    }

    // Find user by role
    let user;
    switch (role) {
      case "Patient":
        user = await Patient1.findOne({ where: { patientID: req.user.id } });
        break;
      case "Hospital":
        user = await HospitalAdmin.findOne({ where: { username: req.user.id } });
        break;
      case "Doctor":
        user = await Doctor.findOne({ where: { doctorID: req.user.id } });
        break;
      case "Nurse":
        user = await Nurse.findOne({ where: { nurseID: req.user.id } });
        break;
      case "Receptionist":
        user = await Receptionist.findOne({ where: { receptionistID: req.user.id } });
        break;
      case "Pharmacy":
        user = await RegisterPharmacy.findOne({ where: { pharmacy_id: req.user.id } });
        break;
      case "Blood Bank":
        user = await RegisterBloodbank.findOne({ where: { bloodbankID: req.user.id } });
        break;
      case "Pathology":
        user = await Pathology.findOne({ where: { pathologyID: req.user.id } });
        break;
      default:
        return res.status(403).json({ message: "Access forbidden: Invalid role" });
    }

    if (!user) {
      return res.status(404).json({ message: `${role} not found` });
    }

    req.user = user;  // Attach user info to request
    next();
  };
};

module.exports = { verifyToken, authorizeRole };
