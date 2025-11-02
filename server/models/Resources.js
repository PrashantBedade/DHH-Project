const { DataTypes } = require("sequelize");
const { sequelizeHospital } = require("../db");

const Resource = sequelizeHospital.define("Resource", {
  resourceID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  resourceType: { type: DataTypes.STRING, allowNull: false },
  category: { type: DataTypes.STRING, allowNull: false },
  total: { type: DataTypes.INTEGER, allowNull: false },
  available: { type: DataTypes.INTEGER, allowNull: false },
  lastUpdated: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
});

module.exports = { Resource };
