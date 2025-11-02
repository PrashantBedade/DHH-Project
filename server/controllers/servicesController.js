const { RegisterPharmacy } = require("../models/registerPharmacyModel");
const { RegisterBloodbank } = require("../models/registerBloodbankModel");
const { Pathology } = require("../models/registerPathologyModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// const { sequelize1 } = require("../db2");
const {
  sequelizePharmacy,
  sequelizeBloodBank,
  sequelizePathology,
} = require("../db"); // Import pharmacy db instance

exports.registerPharmacy = async (req, res) => {
  try {
    const {
      pharmacy_id,
      pharmacy_name,
      address,
      owner_name,
      license_no,
      phone_no,
      password,
      confirm_password,
    } = req.body;

    // Check if the pharmacy ID already exists
    const existingPharmacy = await RegisterPharmacy.findOne({
      where: { pharmacy_id },
    });
    if (existingPharmacy) {
      return res
        .status(400)
        .json({ message: "Pharmacy with this ID already exists." });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Check if any required field is missing
    if (!pharmacy_name || !owner_name || !license_no || !phone_no) {
      return res.status(400).json({ message: "All fields are required" });
    }
    // Create a new pharmacy record
    const newPharmacy = await RegisterPharmacy.create({
      pharmacy_id,
      pharmacy_name,
      address,
      owner_name,
      license_no,
      phone_no,
      password: hashedPassword,
    });

    // Create dynamic table for the pharmacy
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS ${pharmacy_id} (
        id INT AUTO_INCREMENT PRIMARY KEY,
        pharmacy_name VARCHAR(255),
        owner_name VARCHAR(255),
        address VARCHAR(255),
        phone_no VARCHAR(255),
        name VARCHAR(255),
        price DECIMAL(10, 2),
        manufacturer_name VARCHAR(255),
        type VARCHAR(255),
        pack_size_label VARCHAR(255),
        short_composition1 VARCHAR(255),
        short_composition2 VARCHAR(255),
        mfg_date DATE,
        exp_date DATE
      )
    `;
    await sequelizePharmacy.query(createTableQuery);

    res.status(201).json({
      message: "Pharmacy registered and table created successfully.",
      pharmacy: newPharmacy,
    });
  } catch (error) {
    console.error("Error registering pharmacy:", error);
    res
      .status(500)
      .json({ message: "Error registering pharmacy.", error: error.message });
  }
};



exports.registerBloodbank = async (req, res) => {
  try {
    const {
      bloodbank_id,
      bloodbank_name,
      address,
      owner_name,
      license_no,
      phone_no,
      bloodbank_type,
      password,
      confirm_password,
    } = req.body;

    // Check if the bloodbank ID already exists
    const existingBloodbank = await RegisterBloodbank.findOne({
      where: { bloodbank_id },
    });
    if (existingBloodbank) {
      return res
        .status(400)
        .json({ message: "Bloodbank with this ID already exists." });
    }

    // Check if password and confirm_password match
    if (password !== confirm_password) {
      return res.status(400).json({ message: "Passwords do not match." });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if any required field is missing
    if (!bloodbank_name || !owner_name || !license_no || !phone_no || !bloodbank_type) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Create a new blood bank record
    const newBloodbank = await RegisterBloodbank.create({
      bloodbank_id,
      bloodbank_name,
      address,
      owner_name,
      license_no,
      phone_no,
      bloodbank_type,
      password: hashedPassword,
    });

    // Create dynamic table for the blood bank using its bloodbank_id
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS ${bloodbank_id} (
        id INT AUTO_INCREMENT PRIMARY KEY,
        bloodbank_name VARCHAR(255) NOT NULL,
        address VARCHAR(255) NOT NULL,
        owner_name VARCHAR(255) NOT NULL,
        license_no VARCHAR(255) NOT NULL,
        phone_no VARCHAR(255) NOT NULL,
        bloodbank_type VARCHAR(255) NOT NULL,
        blood_id VARCHAR(255) NOT NULL UNIQUE,
        blood_type VARCHAR(10) NOT NULL,
        donation_date DATE NOT NULL,
        expiration_date DATE NOT NULL,
        volume_ml INT NOT NULL,
        blood_component VARCHAR(255) NOT NULL,
        donor_id VARCHAR(255) NOT NULL,
        donor_name VARCHAR(255) NOT NULL,
        donor_age INT NOT NULL,
        donor_phone_no VARCHAR(15) NOT NULL,
        donor_address VARCHAR(255) NOT NULL,
        storage_location VARCHAR(255) NOT NULL,
        quantity_available INT NOT NULL,
        blood_condition VARCHAR(50) NOT NULL,
        blood_status VARCHAR(50) NOT NULL,
        createdAt DATETIME NOT NULL,
        updatedAt DATETIME NOT NULL
      )
    `;

    // Execute the query to create the blood bank's table
    await sequelizeBloodBank.query(createTableQuery);

    res.status(201).json({
      message: "Bloodbank registered and table created successfully.",
      bloodbank: newBloodbank,
    });
  } catch (error) {
    console.error("Error registering bloodbank:", error);
    res
      .status(500)
      .json({ message: "Error registering bloodbank.", error: error.message });
  }
};


exports.registerPathology = async (req, res) => {
  try {
    const {
      pathologyID,
      pathology_name,
      owner_name,
      license_no,
      mobile_no,
      email_id,
      address,
      password,
      confirm_password,
    } = req.body;

    // Validate that passwords match
    if (password !== confirm_password) {
      return res.status(400).json({ message: "Passwords do not match." });
    }

    // Check if the Pathology ID already exists
    const existingPathology = await Pathology.findByPk(pathologyID);
    if (existingPathology) {
      return res
        .status(400)
        .json({ message: "Pathology with this ID already exists." });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new Pathology record
    const newPathology = await Pathology.create({
      pathologyID,
      pathology_name,
      owner_name,
      license_no,
      mobile_no,
      email_id,
      address,
      password: hashedPassword,
    });

    const createTableQuery = `
    CREATE TABLE IF NOT EXISTS ${pathologyID} (
      id INT AUTO_INCREMENT PRIMARY KEY,
      patientID VARCHAR(255) NOT NULL,
      date DATE NOT NULL,
      time TIME NOT NULL,
      testperformed VARCHAR(255) NOT NULL,
      performedBy VARCHAR(255) NOT NULL,
      cost FLOAT NOT NULL,
      paidorunpaid ENUM('paid', 'unpaid') NOT NULL,
      createdAt DATETIME NOT NULL,
      updatedAt DATETIME NOT NULL
    )
  `;

    // Execute the query to create the table dynamically
    await sequelizePathology.query(createTableQuery);

    res.status(201).json({
      message: "Pathology registered and table created successfully.",
      pathology: newPathology,
    });
  } catch (error) {
    console.error("Error registering Pathology:", error);
    res
      .status(500)
      .json({ message: "Error registering Pathology.", error: error.message });
  }
};
