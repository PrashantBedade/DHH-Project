const { DataTypes } = require('sequelize');
const { sequelizeHospital } = require('../db');

const Doctors = sequelizeHospital.define('Doctors', {
    doctor_id: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true 
    },
    firstName: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    lastName: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    email: { 
        type: DataTypes.STRING, 
        allowNull: false, 
        unique: true 
    },
    phone: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    specialization: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    availability_status: { 
        type: DataTypes.BOOLEAN, 
        defaultValue: true 
    },
});

// Define associations for Doctors
Doctors.associate = (models) => {
    Doctors.hasMany(models.TimeSlots, { foreignKey: 'doctor_id' });
    Doctors.hasMany(models.Appointments, { foreignKey: 'doctor_id' });
};

module.exports = { Doctors };
