const { DataTypes } = require("sequelize");
const {sequelizeHospital} = require('../db');

const CasePaper = sequelizeHospital.define("CasePaper", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  patientID: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  symptoms: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  disease: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  accuracy: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  precaution: {
    type: DataTypes.TEXT,
  },
  medication: {
    type: DataTypes.TEXT,
  },
  diet: {
    type: DataTypes.TEXT,
  },
});

module.exports = CasePaper;
