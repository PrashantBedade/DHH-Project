const jwt = require("jsonwebtoken");
const { sequelizeBloodBank } = require("../db"); // Import bloodbank db instance
const { DataTypes, Op } = require("sequelize");
const { RegisterBloodbank } = require("../models/registerBloodbankModel");
require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET;

const defineBloodModel=(tableName)=>{
  return sequelizeBloodBank.define("Blood", {
    bloodbank_name: { type: DataTypes.STRING },
    owner_name: { type: DataTypes.STRING },
    address: { type: DataTypes.STRING },
    phone_no: { type: DataTypes.INTEGER },
    license_no: { type: DataTypes.STRING },
    bloodbank_type: { type: DataTypes.STRING },
    blood_id: {
      type: DataTypes.STRING,
      unique: true, // Ensure blood_id is unique
      allowNull: false,
    },
    blood_type: { type: DataTypes.STRING, allowNull: false },
    donation_date: { type: DataTypes.DATE, allowNull: false },
    expiration_date: { type: DataTypes.DATE, allowNull: false },
    volume_ml: { type: DataTypes.FLOAT },
    blood_component: { type: DataTypes.STRING },
    donor_id: { type: DataTypes.STRING },
    donor_name: { type: DataTypes.STRING, allowNull: false },
    donor_age: { type: DataTypes.INTEGER, allowNull: false },
    donor_phone_no: { type: DataTypes.INTEGER, allowNull: false },
    donor_address: { type: DataTypes.STRING, allowNull: false },
    storage_location: { type: DataTypes.STRING, allowNull: false },
    quantity_available: { type: DataTypes.STRING, allowNull: false },
    blood_condition: { type: DataTypes.STRING, allowNull: false },
    blood_status: { type: DataTypes.STRING, allowNull: false },
  },
  {
    tableName, // Use bloodbankId as the table name
    timestamps: true, // Set to false if the table doesn't include createdAt/updatedAt
  }
);};


const addBlood = async (req, res) => {
  try {
    // Extract the JWT token from the authorization header
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token

    // Extract bloodbank ID from the decoded token
    const bloodbankId = decoded.bloodbank_id;

    if (!bloodbankId) {
      return res
        .status(400)
        .json({ error: "Bloodbank ID missing in token or invalid token." });
    }

    // Fetch bloodbank details from the `registerpharmacies` table
    const bloodbankDetails = await RegisterBloodbank.findOne({
      where: { bloodbank_id: bloodbankId },
    });

    if (!bloodbankDetails) {
      return res.status(404).json({ error: "Bloodbank not found." });
    }

    // Extract bloodbank-specific fields
    const {
      bloodbank_name,
      owner_name,
      address,
      phone_no,
      license_no,
      bloodbank_type,
    } = bloodbankDetails;

    // Get blood details from request body
    const {
      blood_id,
      blood_type,
      donation_date,
      volume_ml,
      blood_component,
      donor_id,
      donor_name,
      donor_age,
      donor_phone_no,
      donor_address,
      storage_location,
      quantity_available,
      blood_condition,
      blood_status,
    } = req.body;

    // Validate input fields
    if (
      !blood_id ||
      !blood_type ||
      !donation_date ||
      !volume_ml ||
      !blood_component ||
      !donor_id ||
      !donor_name ||
      !donor_age ||
      !donor_phone_no ||
      !donor_address ||
      !storage_location ||
      !quantity_available ||
      !blood_condition ||
      !blood_status
    ) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    // Define expiration date rules based on blood component
    const expirationRules = {
      "Red Blood Cell": 42,
      Platelets: 5,
      Plasma: 365,
      Cryo: 365,
      "Whole Blood": 35,
    };

    // Calculate expiration date
    const expirationDays = expirationRules[blood_component];
    if (!expirationDays) {
      return res
        .status(400)
        .json({ error: "Invalid blood component provided." });
    }
    const expiration_date = new Date(donation_date);
    expiration_date.setDate(expiration_date.getDate() + expirationDays);

    // Dynamically define the table name based on the bloodbank_id
    const tableName = bloodbankId;

    // Define the blood schema for the bloodbank (dynamic table)
    const Blood = sequelizeBloodBank.define(
      "Blood",
      {
        bloodbank_name: { type: DataTypes.STRING },
        owner_name: { type: DataTypes.STRING },
        address: { type: DataTypes.STRING },
        phone_no: { type: DataTypes.INTEGER },
        license_no: { type: DataTypes.STRING },
        bloodbank_type: { type: DataTypes.STRING },
        blood_id: {
          type: DataTypes.STRING,
          unique: true, // Ensure blood_id is unique
          allowNull: false,
        },
        blood_type: { type: DataTypes.STRING, allowNull: false },
        donation_date: { type: DataTypes.DATE, allowNull: false },
        expiration_date: { type: DataTypes.DATE, allowNull: false },
        volume_ml: { type: DataTypes.FLOAT },
        blood_component: { type: DataTypes.STRING },
        donor_id: { type: DataTypes.STRING },
        donor_name: { type: DataTypes.STRING, allowNull: false },
        donor_age: { type: DataTypes.INTEGER, allowNull: false },
        donor_phone_no: { type: DataTypes.INTEGER, allowNull: false },
        donor_address: { type: DataTypes.STRING, allowNull: false },
        storage_location: { type: DataTypes.STRING, allowNull: false },
        quantity_available: { type: DataTypes.STRING, allowNull: false },
        blood_condition: { type: DataTypes.STRING, allowNull: false },
        blood_status: { type: DataTypes.STRING, allowNull: false },
      },
      {
        tableName, // Use bloodbankId as the table name
        timestamps: true, // Set to false if the table doesn't include createdAt/updatedAt
      }
    );

    // Sync the table (ensure it exists in the database)
    await Blood.sync();

    // Create the new blood record in the bloodbank's table
    const newBlood = await Blood.create({
      bloodbank_name,
      owner_name,
      address,
      phone_no,
      license_no,
      bloodbank_type,
      blood_id,
      blood_type,
      donation_date,
      expiration_date,
      volume_ml,
      blood_component,
      donor_id,
      donor_name,
      donor_age,
      donor_phone_no,
      donor_address,
      storage_location,
      quantity_available,
      blood_condition,
      blood_status,
    });

    // Return success response
    res.status(201).json({ message: "Blood added successfully!", newBlood });
  } catch (error) {
    console.error("Error adding blood:", error);

    // Handle unique constraint violation
    if (error.name === "SequelizeUniqueConstraintError") {
      return res
        .status(400)
        .json({ error: "Blood ID must be unique. Please use a different ID." });
    }

    res.status(500).json({ error: "Server error, please try again later." });
  }
};


const searchAllBlood = async (req, res) => {
  const { searchTerm1, searchTerm2 } = req.body;

  try {
    // Validate that at least one search term is provided
    if (!searchTerm1 && !searchTerm2) {
      return res.status(400).json({
        error: "At least one search term (blood_type or blood_component) is required.",
      });
    }

    // Query the list of tables that match the pattern 'bb%' in your database
    const tableQuery = `
      SELECT TABLE_NAME
      FROM information_schema.tables
      WHERE table_name LIKE 'bb%' 
      AND table_schema = 'bloodbank_db';
    `;

    const tables = await sequelizeBloodBank.query(tableQuery, {
      type: sequelizeBloodBank.QueryTypes.SELECT,
    });

    if (tables.length === 0) {
      return res
        .status(404)
        .json({ error: "No tables matching the 'bb%' pattern found." });
    }

    // Aggregate search results from all matching tables
    let allResults = [];
    for (const table of tables) {
      const tableName = table.TABLE_NAME;

      // Construct dynamic WHERE conditions
      const conditions = [];
      if (searchTerm1) {
        conditions.push(`blood_type LIKE :searchTerm1`);
      }
      if (searchTerm2) {
        conditions.push(`blood_component LIKE :searchTerm2`);
      }
      const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

      // Use raw SQL for querying each table
      const searchQuery = `
        SELECT bloodbank_name, owner_name, address, phone_no, license_no, 
               bloodbank_type, blood_id, blood_type, donation_date, expiration_date,
               volume_ml, blood_component, donor_id, donor_name, donor_age,
               donor_phone_no, donor_address, storage_location, quantity_available,
               blood_condition, blood_status
        FROM ${tableName}
        ${whereClause}
      `;

      const replacements = {};
      if (searchTerm1) replacements.searchTerm1 = `%${searchTerm1}%`;
      if (searchTerm2) replacements.searchTerm2 = `%${searchTerm2}%`;

      const results = await sequelizeBloodBank.query(searchQuery, {
        replacements,
        type: sequelizeBloodBank.QueryTypes.SELECT,
      });

      allResults = [...allResults, ...results];
    }

    if (allResults.length === 0) {
      return res
        .status(404)
        .json({ error: "No blood found matching the search criteria." });
    }

    res.status(200).json({
      message: "Blood banks fetched successfully!",
      Blood: allResults,
    });
  } catch (error) {
    console.error("Error searching blood:", error);
    res.status(500).json({ error: "Server error, please try again later." });
  }
};

const updateBlood = async (req, res) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const bloodbankID = decoded.bloodbank_id;

    if (!bloodbankID) {
      return res
        .status(400)
        .json({ error: "Bloodbank ID missing in token or invalid token." });
    }

    //   const { id } = req.params; // Blood ID
    const {
      id,
      expiration_date,
      donor_age,
      donor_phone_no,
      donor_address,
      storage_location,
      quantity_available,
      blood_condition,
      blood_status
    } = req.body;

    if (!id) {
      return res.status(400).json({ error: "Blood ID is required." });
    }

    const Blood = defineBloodModel(bloodbankID);

    // Find the blood record by ID
    const blood = await Blood.findByPk(id);
    if (!blood) {
      return res.status(404).json({ error: "Blood not found." });
    }

    // Update the blood record
    await blood.update({
      expiration_date,
      donor_age,
      donor_phone_no,
      donor_address,
      storage_location,
      quantity_available,
      blood_condition,
      blood_status
    });

    res.status(200).json({
      message: "Blood Record updated successfully!",
      updatedBlood: blood,
    });
  } catch (error) {
    console.error("Error updating medicine:", error);
    res.status(500).json({ error: "Server error, please try again later." });
  }
};

const getBloodrecord = async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'Authorization token is missing.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const bloodbankId = decoded?.bloodbank_id;

    if (!bloodbankId) {
      return res.status(400).json({ error: 'Invalid or missing bloodbank ID in token.' });
    }

    const tableName = `${bloodbankId}`;
    const Blood = defineBloodModel(tableName);

    await Blood.sync();

    const bloodRecords = await Blood.findAll({
      attributes: [
        'id',
        'blood_id',
        'blood_type',
        'donation_date',
        'expiration_date',
        'volume_ml',
        'donor_id',
        'blood_component',
        'storage_location',
        'Quantity_Available',
        'blood_condition',
        'blood_status',
      ],
    });

    if (!bloodRecords.length) {
      return res.status(404).json({ message: 'No blood records found.' });
    }

    res.status(200).json({ blood: bloodRecords });
  } catch (error) {
    console.error('Error fetching blood records:', error.message);

    if (error.name === 'SequelizeDatabaseError') {
      return res.status(500).json({ error: 'Database error or invalid table name.' });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid or expired token.' });
    }

    res.status(500).json({ error: 'Server error, please try again later.' });
  }
};

const deletebloodrecord = async (req, res) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const bloodbankId = decoded.bloodbank_id;

    if (!bloodbankId) {
      return res
        .status(400)
        .json({ error: "Bloodbank ID missing in token or invalid token." });
    }

    const { id } = req.body; // blood ID

    if (!id) {
      return res.status(400).json({ error: "Bloodbank ID is required." });
    }

    const Blood = defineBloodModel(bloodbankId);

    // Find the medicine record by ID
    const blood = await Blood.findByPk(id);
    if (!blood) {
      return res.status(404).json({ error: "Bloodbank not found." });
    }

    // Delete the medicine record
    await blood.destroy();

    res.status(200).json({ message: "Bloodbank deleted successfully!" });
  } catch (error) {
    console.error("Error deleting Blood Record:", error);
    res.status(500).json({ error: "Server error, please try again later." });
  }
};

const geBloodbankById = async (req, res) => {
  try {
    // Extract token from the request header
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Authorization token is required' });
    }

    // Verify the token and extract bloodbank_id
    const decoded = jwt.verify(token, JWT_SECRET);
    const bloodbankId = decoded.bloodbank_id;
    if (!bloodbankId) {
      return res.status(400).json({ message: 'Invalid token' });
    }

    // Fetch the bloodbank by ID
    const bloodbank = await RegisterBloodbank.findOne({
      where: { bloodbank_id: bloodbankId },
      attributes: ['bloodbank_id', 'bloodbank_name', 'address', 'owner_name', 'license_no', 'phone_no','bloodbank_type'],
    });

    if (!bloodbank) {
      return res.status(404).json({ message: 'Bloodbank not found' });
    }

    return res.status(200).json(bloodbank);
  } catch (error) {
    console.error('Error fetching bloodbank by ID:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    return res.status(500).json({ message: 'Internal server error' });
  }
};


module.exports = { addBlood,searchAllBlood,updateBlood,getBloodrecord ,deletebloodrecord,geBloodbankById};
