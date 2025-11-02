const { DataTypes } = require('sequelize');
const { sequelizeHospital } = require('../db');

const TimeSlots = sequelizeHospital.define('TimeSlots', {
    slot_id: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true 
    },
    doctor_id: { 
        type: DataTypes.INTEGER, 
        allowNull: false 
    },
    date: { 
        type: DataTypes.DATEONLY, 
        allowNull: false 
    },
    time_slot: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    available: { 
        type: DataTypes.BOOLEAN, 
        defaultValue: true 
    },
});

// Define associations for TimeSlots
TimeSlots.associate = (models) => {
    TimeSlots.belongsTo(models.Doctor, { foreignKey: 'doctorID' });
};

module.exports = { TimeSlots };
