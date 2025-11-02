const { DataTypes } = require('sequelize');
const { sequelizeHospital } = require('../db'); // Use sequelizeHospital instance from db.js

const HospitalAdmin = sequelizeHospital.define('HospitalAdmin', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, { timestamps: true });
  

module.exports = {HospitalAdmin};
