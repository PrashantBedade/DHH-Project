const { Sequelize, DataTypes } = require("sequelize");
const { sequelizePathology } = require("../db"); // Import Sequelize instance from db.js

const Pathology = sequelizePathology.define(
  "Pathology",
  {
    pathologyID: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
      unique: true,
    },
    pathology_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    owner_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    license_no: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    mobile_no: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email_id: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
    tableName: "pathologies", // Use a specific table name
  }
);

// Sync the model with the database (create the table if not exists)
Pathology.sync();

module.exports = { Pathology };
