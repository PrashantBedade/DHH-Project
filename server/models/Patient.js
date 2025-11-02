const { DataTypes } = require('sequelize');
const { sequelizePatient } = require('../db'); // Use the sequelizePatient instance

const Patient1 = sequelizePatient.define('Patient1', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    patientID: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    age: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    dob: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    state: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    city: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    height: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    weight: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    disability: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'No', // "Yes" or "No"
    },
    mobile: {
        type: DataTypes.NUMBER,
        allowNull: false,
        unique: true,
    },
    family: {
        type: DataTypes.NUMBER,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    timestamps: true, // Auto-generate createdAt and updatedAt fields
});

// Sync the model to create the table if it doesn't exist
const syncPatientTable = async () => {
    try {
        await Patient1.sync({ force: false }); // { force: false } will only create the table if it doesn't exist
        console.log('Patient table synchronized!');
    } catch (error) {
        console.error('Error synchronizing Patient table:', error);
    }
};

// Call the sync function
syncPatientTable();

module.exports = { Patient1 };  // Export the model correctly
