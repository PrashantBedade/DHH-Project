const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { Patient1 } = require("../models/Patient");
const { Doctor } = require("../models/Doctor");
const { Nurse1 } = require("../models/Nurse");
const { Receptionist } = require("../models/Receptionist");
const { HospitalAdmin } = require("../models/HospitalAdmin");
const { RegisterPharmacy } = require("../models/registerPharmacyModel");
const { RegisterBloodbank } = require("../models/registerBloodbankModel");
const { Pathology } = require("../models/registerPathologyModel");

const {
  sequelizeHospital,
  sequelizePatient,
  sequelizePharmacy,
  sequelizeBloodBank,
  sequelizePathology,
} = require("../db");

require("dotenv").config();

// Secret key for JWT token
// const JWT_SECRET = process.env.JWT_SECRET;

// // Function to generate JWT token
// const generateToken = (id) => {
//   return jwt.sign({ id }, JWT_SECRET, { expiresIn: "24h" });
// };

// const loginUser = async (
//     req,
//     res,
//     userModel,
//     idField,
//     passwordField,
//     userType
//   ) => {
//     try {
//       console.log("userModel:", userModel); // Log userModel to check if it's undefined

//       const { username, password } = req.body;

//       if (!userModel) {
//         return res.status(400).json({ message: `User model not provided for ${userType}` });
//       }

//       const user = await userModel.findOne({ where: { [idField]: username } });

//       if (!user) {
//         return res.status(404).json({ message: `${userType} not found` });
//       }

//       const isPasswordValid = await bcrypt.compare(password, user[passwordField]);

//       if (!isPasswordValid) {
//         return res.status(400).json({ message: "Invalid credentials" });
//       }

//       const token = generateToken(user[idField]);

//       return res.status(200).json({
//         message: `${userType} logged in successfully`,
//         token,
//       });
//     } catch (error) {
//       console.error("Error logging in user:", error);
//       return res.status(500).json({ message: "Internal server error" });
//     }
//   };

//   const handleLogin = async (req, res) => {
//     const { role } = req.body; // Get the selected role from the form

//     switch (role) {
//       case "Patient":
//         await loginUser(
//           req,
//           res,
//           Patient1,  // Ensure Patient1 is defined
//           "patientID",
//           "password",
//           "Patient"
//         );
//         break;
//       case "Hospital":
//         await loginUser(
//           req,
//           res,
//           HospitalAdmin,  // Ensure Hospital is defined
//           "username",
//           "password",
//           "Hospital"
//         );
//         break;
//       case "Doctor":
//         await loginUser(
//           req,
//           res,
//           Doctor,  // Ensure Doctor is defined
//           "doctorID",
//           "password",
//           "Doctor"
//         );
//         break;
//       case "Nurse":
//         await loginUser(
//           req,
//           res,
//           Nurse,  // Ensure Nurse is defined
//           "nurseID",
//           "password",
//           "Nurse"
//         );
//         break;
//       case "Receptionist":
//         await loginUser(
//           req,
//           res,
//           Receptionist,  // Ensure Receptionist is defined
//           "receptionistID",
//           "password",
//           "Receptionist"
//         );
//         break;
//       case "Pharmacy":
//         await loginUser(
//           req,
//           res,
//           RegisterPharmacy,  // Ensure RegisterPharmacy is defined
//           "pharmacy_id",
//           "password",
//           "Pharmacy"
//         );
//         break;
//       case "Blood Bank":
//         await loginUser(
//           req,
//           res,
//           RegisterBloodbank,  // Ensure RegisterBloodbank is defined
//           "bloodbankID",
//           "password",
//           "Blood Bank"
//         );
//         break;
//       case "Pathology":
//         await loginUser(
//           req,
//           res,
//           Pathology,  // Ensure Pathology is defined
//           "pathologyID",
//           "password",
//           "Pathology"
//         );
//         break;
//       default:
//         return res.status(400).json({ message: "Invalid role selected" });
//     }
//   };

// module.exports = { handleLogin };

// Secret key for JWT token
const JWT_SECRET = process.env.JWT_SECRET;

const handleLogin = async (req, res) => {
  const { role } = req.body; // Get the selected role from the form

  try {
    let user, token;

    switch (role) {
      case "Patient":
        user = await Patient1.findOne({
          where: { patientID: req.body.username },
        });
        if (!user)
          return res.status(404).json({ message: "Patient not found" });
        const isPatientPasswordValid = await bcrypt.compare(
          req.body.password,
          user.password
        );
        if (!isPatientPasswordValid)
          return res.status(400).json({ message: "Invalid credentials" });
        token = jwt.sign(
          { patientID: user.patientID, userType: "Patient" },
          JWT_SECRET,
          { expiresIn: "24h" }
        );
        break;

      case "Hospital":
        user = await HospitalAdmin.findOne({
          where: { username: req.body.username },
        });
        if (!user)
          return res.status(404).json({ message: "Hospital Admin not found" });

        const isHospitalPasswordValid = await bcrypt.compare(
          req.body.password,
          user.password
        );
        if (!isHospitalPasswordValid)
          return res.status(400).json({ message: "Invalid credentials" });

        // Generate token with both username and hospital_name
        token = jwt.sign(
          {
            id: user.username,
            hospital_name: user.hospital_name,
            userType: "Hospital",
          },
          JWT_SECRET,
          { expiresIn: "24h" }
        );
        break;

      case "Doctor":
        user = await Doctor.findOne({ where: { doctorID: req.body.username } });
        if (!user) return res.status(404).json({ message: "Doctor not found" });
        const isDoctorPasswordValid = await bcrypt.compare(
          req.body.password,
          user.password
        );
        if (!isDoctorPasswordValid)
          return res.status(400).json({ message: "Invalid credentials" });
        token = jwt.sign(
          { doctorID: user.doctorID, userType: "Doctor" },
          JWT_SECRET,
          { expiresIn: "24h" }
        );
        break;

      case "Nurse":
        user = await Nurse1.findOne({ where: { nurseID: req.body.username } });
        if (!user) return res.status(404).json({ message: "Nurse not found" });
        const isNursePasswordValid = await bcrypt.compare(
          req.body.password,
          user.password
        );
        if (!isNursePasswordValid)
          return res.status(400).json({ message: "Invalid credentials" });
        token = jwt.sign(
          { nurseID: user.nurseID, userType: "Nurse" },
          JWT_SECRET,
          {
            expiresIn: "24h",
          }
        );
        break;

      case "Receptionist":
        user = await Receptionist.findOne({
          where: { receptionistID: req.body.username },
        });
        if (!user)
          return res.status(404).json({ message: "Receptionist not found" });
        const isReceptionistPasswordValid = await bcrypt.compare(
          req.body.password,
          user.password
        );
        if (!isReceptionistPasswordValid)
          return res.status(400).json({ message: "Invalid credentials" });
        token = jwt.sign(
          { receptionistID: user.receptionistID, userType: "Receptionist" },
          JWT_SECRET,
          { expiresIn: "24h" }
        );
        break;

      case "Pharmacy":
        user = await RegisterPharmacy.findOne({
          where: { pharmacy_id: req.body.username },
        });
        if (!user)
          return res.status(404).json({ message: "Pharmacy not found" });
        const isPharmacyPasswordValid = await bcrypt.compare(
          req.body.password,
          user.password
        );
        if (!isPharmacyPasswordValid)
          return res.status(400).json({ message: "Invalid credentials" });
        token = jwt.sign({ pharmacy_id: user.pharmacy_id }, JWT_SECRET, {
          expiresIn: "24h",
        });

        break;

      case "Blood Bank":
        user = await RegisterBloodbank.findOne({
          where: { bloodbank_id: req.body.username },
        });
        if (!user)
          return res.status(404).json({ message: "Blood Bank not found" });
        const isBloodBankPasswordValid = await bcrypt.compare(
          req.body.password,
          user.password
        );
        if (!isBloodBankPasswordValid)
          return res.status(400).json({ message: "Invalid credentials" });
        token = jwt.sign({ bloodbank_id: user.bloodbank_id }, JWT_SECRET, {
          expiresIn: "24h",
        });

        break;

      case "Pathology":
        user = await Pathology.findOne({
          where: { pathologyID: req.body.username },
        });
        if (!user)
          return res.status(404).json({ message: "Pathology not found" });
        const isPathologyPasswordValid = await bcrypt.compare(
          req.body.password,
          user.password
        );
        if (!isPathologyPasswordValid)
          return res.status(400).json({ message: "Invalid credentials" });
        token = jwt.sign(
          { pathologyID: user.pathologyID, userType: "Pathology" },
          JWT_SECRET,
          { expiresIn: "24h" }
        );
        break;

      default:
        return res.status(400).json({ message: "Invalid role selected" });
    }

    return res.status(200).json({
      message: `${role} logged in successfully`,
      token,
    });
  } catch (error) {
    console.error("Error logging in:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { handleLogin };
