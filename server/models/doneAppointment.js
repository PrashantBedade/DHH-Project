const { DataTypes } = require('sequelize');
const { sequelizeHospital } = require('../db');

const DoneAppointment = sequelizeHospital.define('DoneAppointment', {
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
    patientID: { 
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
        },
    },
}, {
    timestamps: true,
});

module.exports = { DoneAppointment };
