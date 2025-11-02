const jwt = require("jsonwebtoken");
const { sequelizePharmacy } = require("../db"); // Import pharmacy db instance
const { DataTypes, Op } = require("sequelize");
const { RegisterPharmacy } = require("../models/registerPharmacyModel");
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;


const addMedicine = async (req, res) => {
  try {
    // Extract the JWT token from the authorization header
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token

    // Extract pharmacy ID from the decoded token
    const pharmacyId = decoded.pharmacy_id;

    if (!pharmacyId) {
      return res
        .status(400)
        .json({ error: "Pharmacy ID missing in token or invalid token." });
    }

    // Fetch pharmacy details from the `registerpharmacies` table
    const pharmacyDetails = await RegisterPharmacy.findOne({
      where: { pharmacy_id: pharmacyId },
    });

    if (!pharmacyDetails) {
      return res.status(404).json({ error: "Pharmacy not found." });
    }

    // Extract pharmacy-specific fields
    const { pharmacy_name, owner_name, address, phone_no } = pharmacyDetails;

    // Get medicine details from request body
    const {
      name,
      price,
      manufacturer_name,
      type,
      pack_size_label,
      short_composition1,
      short_composition2,
      mfg_date,
      exp_date,
    } = req.body;

    // Validate input fields
    if (
      !name ||
      !price ||
      !manufacturer_name ||
      !type ||
      !mfg_date ||
      !exp_date
    ) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    // Dynamically define the table name based on the pharmacy_id
    const tableName = pharmacyId;

    // Define the medicine schema for the pharmacy (dynamic table)
    const Medicine = sequelizePharmacy.define(
      "Medicine",
      {
        pharmacy_name: {
          type: DataTypes.STRING,
        },
        owner_name: {
          type: DataTypes.STRING,
        },
        address: {
          type: DataTypes.STRING,
        },
        phone_no: {
          type: DataTypes.STRING,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        price: {
          type: DataTypes.FLOAT,
          allowNull: false,
        },
        manufacturer_name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        type: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        pack_size_label: {
          type: DataTypes.STRING,
        },
        short_composition1: {
          type: DataTypes.STRING,
        },
        short_composition2: {
          type: DataTypes.STRING,
        },
        mfg_date: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        exp_date: {
          type: DataTypes.DATE,
          allowNull: false,
        },
      },
      {
        tableName, // Use pharmacyId as the table name
        timestamps: false, // Set to false if the table doesn't include createdAt/updatedAt
      }
    );

    // Sync the table (ensure it exists in the database)
    await Medicine.sync();

    // Create the new medicine record in the pharmacy's table
    const newMedicine = await Medicine.create({
      pharmacy_name,
      owner_name,
      address,
      phone_no,
      name,
      price,
      manufacturer_name,
      type,
      pack_size_label,
      short_composition1,
      short_composition2,
      mfg_date,
      exp_date,
    });

    // Return success response
    res
      .status(201)
      .json({ message: "Medicine added successfully!", newMedicine });
  } catch (error) {
    console.error("Error adding medicine:", error);
    res.status(500).json({ error: "Server error, please try again later." });
  }
};

// Helper function to define the medicine model dynamically
const defineMedicineModel = (tableName) => {
  return sequelizePharmacy.define(
    "Medicine",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      pharmacy_name: {
        type: DataTypes.STRING,
      },
      owner_name: {
        type: DataTypes.STRING,
      },
      address: {
        type: DataTypes.STRING,
      },
      phone_no: {
        type: DataTypes.STRING,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      price: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      manufacturer_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      pack_size_label: {
        type: DataTypes.STRING,
      },
      short_composition1: {
        type: DataTypes.STRING,
      },
      short_composition2: {
        type: DataTypes.STRING,
      },
      mfg_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      exp_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      tableName,
      timestamps: false,
    }
  );
};

const getMedicines = async (req, res) => {
  try {
    // Extract the JWT token from the Authorization header
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token

    // Extract pharmacy_id from the decoded token
    const pharmacyId = decoded.pharmacy_id;

    if (!pharmacyId) {
      return res.status(400).json({ error: 'Pharmacy ID missing in token or invalid token.' });
    }

    // Dynamically define the table name based on pharmacy_id
    const tableName = pharmacyId;

    // Define the medicine model dynamically for the specific pharmacy table
    // const Medicine = sequelizePharmacy.define(
    //   'Medicine',
    //   {
    //     name: { type: DataTypes.STRING },
    //     price: { type: DataTypes.FLOAT },
    //     manufacturer_name: { type: DataTypes.STRING },
    //     type: { type: DataTypes.STRING },
    //     pack_size_label: { type: DataTypes.STRING },
    //     short_composition1: { type: DataTypes.STRING },
    //     short_composition2: { type: DataTypes.STRING },
    //     mfg_date: { type: DataTypes.DATE },
    //     exp_date: { type: DataTypes.DATE },
    //   },
    //   {
    //     tableName, // Use pharmacy_id as the table name
    //     timestamps: false, // Set to false if the table doesn't include createdAt/updatedAt
    //   }
    // );

    // Sync the table (ensure it exists in the database)
    // await Medicine.sync();
  // Define the medicine model dynamically
  const Medicine = defineMedicineModel(tableName);

  // Sync the table (ensure it exists in the database)
  await Medicine.sync();

    // Fetch all medicines from the pharmacy-specific table
    const medicines = await Medicine.findAll({
      attributes: [
        'id',
        'name', 
        'price', 
        'manufacturer_name', 
        'type', 
        'pack_size_label', 
        'short_composition1', 
        'short_composition2', 
        'mfg_date', 
        'exp_date'
      ], // Specify the columns to retrieve
    });

    if (!medicines || medicines.length === 0) {
      return res.status(404).json({ message: 'No medicines found for this pharmacy.' });
    }

    // Return success response with the medicines data
    res.status(200).json({ medicines });
  } catch (error) {
    console.error('Error fetching medicines:', error.message);

    if (error.name === 'SequelizeDatabaseError') {
      return res
        .status(500)
        .json({ error: 'Invalid table name or database issue.' });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid or expired token.' });
    }

    res.status(500).json({ error: 'Server error, please try again later.' });
  }
};

// Update Medicine
const updateMedicine = async (req, res) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const pharmacyId = decoded.pharmacy_id;

    if (!pharmacyId) {
      return res
        .status(400)
        .json({ error: "Pharmacy ID missing in token or invalid token." });
    }

    //   const { id } = req.params; // Medicine ID
    const {
      id,
      name,
      price,
      manufacturer_name,
      type,
      pack_size_label,
      short_composition1,
      short_composition2,
      mfg_date,
      exp_date,
    } = req.body;

    if (!id) {
      return res.status(400).json({ error: "Medicine ID is required." });
    }

    const Medicine = defineMedicineModel(pharmacyId);

    // Find the medicine record by ID
    const medicine = await Medicine.findByPk(id);
    if (!medicine) {
      return res.status(404).json({ error: "Medicine not found." });
    }

    // Update the medicine record
    await medicine.update({
      name,
      price,
      manufacturer_name,
      type,
      pack_size_label,
      short_composition1,
      short_composition2,
      mfg_date,
      exp_date,
    });

    res.status(200).json({
      message: "Medicine updated successfully!",
      updatedMedicine: medicine,
    });
  } catch (error) {
    console.error("Error updating medicine:", error);
    res.status(500).json({ error: "Server error, please try again later." });
  }
};

// Delete Medicine
const deleteMedicine = async (req, res) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const pharmacyId = decoded.pharmacy_id;

    if (!pharmacyId) {
      return res
        .status(400)
        .json({ error: "Pharmacy ID missing in token or invalid token." });
    }

    //   const { id } = req.params; // Medicine ID
    const { id } = req.body; // Medicine ID

    if (!id) {
      return res.status(400).json({ error: "Medicine ID is required." });
    }

    const Medicine = defineMedicineModel(pharmacyId);

    // Find the medicine record by ID
    const medicine = await Medicine.findByPk(id);
    if (!medicine) {
      return res.status(404).json({ error: "Medicine not found." });
    }

    // Delete the medicine record
    await medicine.destroy();

    res.status(200).json({ message: "Medicine deleted successfully!" });
  } catch (error) {
    console.error("Error deleting medicine:", error);
    res.status(500).json({ error: "Server error, please try again later." });
  }
};

const viewMedicine = async (req, res) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const pharmacyId = decoded.pharmacy_id;

    if (!pharmacyId) {
      return res
        .status(400)
        .json({ error: "Pharmacy ID missing in token or invalid token." });
    }

    const { id } = req.body; // Medicine ID (optional)

    const Medicine = defineMedicineModel(pharmacyId);

    // Fetch specific medicine if ID is provided, else fetch all medicines
    let medicines;
    if (id) {
      medicines = await Medicine.findByPk(id);
      if (!medicines) {
        return res.status(404).json({ error: "Medicine not found." });
      }
    } else {
      medicines = await Medicine.findAll();
    }

    res
      .status(200)
      .json({ message: "Medicines fetched successfully!", medicines });
  } catch (error) {
    console.error("Error viewing medicines:", error);
    res.status(500).json({ error: "Server error, please try again later." });
  }
};

const getPharmacyById = async (req, res) => {
  try {
    // Extract token from the request header
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Authorization token is required' });
    }

    // Verify the token and extract pharmacy_id
    const decoded = jwt.verify(token, JWT_SECRET);
    const pharmacyId = decoded.pharmacy_id;
    if (!pharmacyId) {
      return res.status(400).json({ message: 'Invalid token' });
    }

    // Fetch the pharmacy by ID
    const pharmacy = await RegisterPharmacy.findOne({
      where: { pharmacy_id: pharmacyId },
      attributes: ['pharmacy_id', 'pharmacy_name', 'address', 'owner_name', 'license_no', 'phone_no'],
    });

    if (!pharmacy) {
      return res.status(404).json({ message: 'Pharmacy not found' });
    }

    return res.status(200).json(pharmacy);
  } catch (error) {
    console.error('Error fetching pharmacy by ID:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const searchAllMedicines = async (req, res) => {
  const { searchTerm } = req.body;

  try {
    if (!searchTerm) {
      return res.status(400).json({ error: "Search term is required" });
    }

    const tableNamePattern = "dhh%";

    const searchInTable = async (tableName) => {
      const [results] = await sequelizePharmacy.query(
        `SELECT TABLE_NAME FROM information_schema.tables 
         WHERE TABLE_NAME = :tableName AND TABLE_SCHEMA = 'pharmacy_db1';`,
        {
          replacements: { tableName },
          type: sequelizePharmacy.QueryTypes.SELECT,
        }
      );

      if (!results) {
        console.warn(`Table ${tableName} does not exist. Skipping.`);
        return [];
      }

      const Medicine = sequelizePharmacy.define(
        "Medicine",
        {
          name: { type: DataTypes.STRING },
          price: { type: DataTypes.FLOAT },
          manufacturer_name: { type: DataTypes.STRING },
          type: { type: DataTypes.STRING },
          pack_size_label: { type: DataTypes.STRING },
          short_composition1: { type: DataTypes.STRING },
          short_composition2: { type: DataTypes.STRING },
          mfg_date: { type: DataTypes.DATE },
          exp_date: { type: DataTypes.DATE },
          pharmacy_name: { type: DataTypes.STRING },
          owner_name: { type: DataTypes.STRING },
          address: { type: DataTypes.STRING },
          phone_no: { type: DataTypes.STRING },
        },
        {
          tableName,
          timestamps: false,
        }
      );

      return await Medicine.findAll({
        where: {
          name: { [Op.like]: `%${searchTerm}%` },
        },
        attributes: {
          exclude: ["id"],
        },
      });
    };

    const query = `
      SELECT TABLE_NAME
      FROM information_schema.tables
      WHERE table_name LIKE 'dhh%' 
      AND table_schema = 'pharmacy_db1';
    `;

    const tables = await sequelizePharmacy.query(query, {
      type: sequelizePharmacy.QueryTypes.SELECT,
    });

    if (tables.length === 0) {
      return res
        .status(404)
        .json({ error: "No tables matching the 'dhh%' pattern found." });
    }

    let allResults = [];
    sequelizePharmacy.models = {}; // Clear cache
    for (let table of tables) {
      const tableName = table.TABLE_NAME;
      console.log(`Querying table: ${tableName}`);
      const results = await searchInTable(tableName);
      allResults = [...allResults, ...results];
    }

    if (allResults.length === 0) {
      return res
        .status(404)
        .json({ error: "No medicines found matching the search term" });
    }

    res.status(200).json({
      message: "Medicines fetched successfully!",
      medicines: allResults.map(({ dataValues }) => {
        const { id, ...rest } = dataValues;
        return rest;
      }),
    });
  } catch (error) {
    console.error("Error searching medicines:", error);
    res.status(500).json({ error: "Server error, please try again later." });
  }
};


module.exports = {
  addMedicine,
  updateMedicine,
  deleteMedicine,
  viewMedicine,
  searchAllMedicines,
  getPharmacyById,
  getMedicines
};
