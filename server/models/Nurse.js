const { DataTypes } = require('sequelize');
const {sequelizeHospital} = require('../db');

const Nurse1 = sequelizeHospital.define('Nurse1', {
    nurseID: { type: DataTypes.STRING, allowNull: false },
    firstName: { type: DataTypes.STRING, allowNull: false },
    surname: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    phone: { type: DataTypes.STRING, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
});

module.exports = {Nurse1};
