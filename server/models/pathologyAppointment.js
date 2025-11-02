const { Sequelize, DataTypes } = require('sequelize');
const { sequelizePathology } = require('../db');

const PathologyAppointment = sequelizePathology.define('PathologyAppointment', {
  appointmentID: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  pathologyID: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  patientID: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  test_type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  appointment_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  appointment_time: {
    type: DataTypes.TIME,
    allowNull: false,
  },
}, {
  timestamps: true,
  tableName: 'pathology_appointments',
});

PathologyAppointment.sync();

module.exports = { PathologyAppointment };
