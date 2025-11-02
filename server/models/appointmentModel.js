const { DataTypes } = require('sequelize');
const { sequelizeHospital } = require('../db');

const Appointment = sequelizeHospital.define('Appointment1', {
    hospital: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    doctorID: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    date: { 
        type: DataTypes.DATEONLY, 
        allowNull: false 
    },
    time: { 
        type: DataTypes.TIME, 
        allowNull: false 
    },
    patientID: { // Updated to handle custom ID format like Rugna001
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true, // Ensures the field is not empty
        },
    },
}, {
    timestamps: true,
    uniqueKeys: {
        unique_appointment: {
            fields: ['doctorID', 'date', 'time'], // Unique constraint on doctorID, date, and time
        },
    },
});

module.exports = { Appointment };
