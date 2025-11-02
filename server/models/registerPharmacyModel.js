const { DataTypes } = require('sequelize');
const {  sequelizePharmacy} = require('../db');

const RegisterPharmacy = sequelizePharmacy.define(
  'RegisterPharmacy',
  {
    pharmacy_id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    pharmacy_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.TEXT,
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
    phone_no: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: 'registerpharmacies',
    timestamps: true,
  }
);

module.exports = {RegisterPharmacy};