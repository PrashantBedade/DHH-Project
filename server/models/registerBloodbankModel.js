const { DataTypes } = require('sequelize');
const {  sequelizeBloodBank} = require('../db');

const RegisterBloodbank = sequelizeBloodBank.define(
  'RegisterBloodbank',
  {
    bloodbank_id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    bloodbank_name: {
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
    bloodbank_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: 'registerbloodbank1',
    timestamps: true,
  }
);

module.exports = {RegisterBloodbank};
