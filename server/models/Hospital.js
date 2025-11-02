const { DataTypes } = require("sequelize");
const { sequelizeHospital } = require("../db"); // Use sequelizeHospital instance from db.js

const Hospital = sequelizeHospital.define("Hospital", {
  hospital_name: { type: DataTypes.STRING, allowNull: false },
  address: { type: DataTypes.STRING, allowNull: false },
  contactNumber: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  adminUsername: { type: DataTypes.STRING, allowNull: false, unique: true },
});

module.exports = {Hospital};
