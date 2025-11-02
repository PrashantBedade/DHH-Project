const { DataTypes } = require('sequelize');
const {sequelizeHospital} = require('../db');

const Receptionist = sequelizeHospital.define('Receptionist1', {
    receptionistID: { type: DataTypes.STRING, allowNull: false },
    firstName: { type: DataTypes.STRING, allowNull: false },
    surname: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    phone: { type: DataTypes.STRING, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
});

module.exports = {Receptionist};
