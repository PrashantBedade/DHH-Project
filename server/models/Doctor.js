const { DataTypes } = require('sequelize');
const {sequelizeHospital} = require('../db');

const Doctor = sequelizeHospital.define('Doctor2', {
    doctorID: { type: DataTypes.STRING, allowNull: false },
    firstName: { type: DataTypes.STRING, allowNull: false },
    surname: { type: DataTypes.STRING, allowNull: false },
    licenseNo: { type: DataTypes.STRING },
    specialization: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    phone: { type: DataTypes.STRING, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    available: { type: DataTypes.BOOLEAN, defaultValue: true },
});

module.exports = {Doctor};
