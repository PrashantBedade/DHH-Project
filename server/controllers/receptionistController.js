// controllers/receptionistController.js
const { Receptionist } = require('../models/Receptionist');
const { sequelizeHospital } = require('../db');

const getReceptionistByID = async (req, res) => {
    try {
        // Use the receptionistID from the decoded token (req.user)
        const receptionist = await Receptionist.findOne({
            where: { receptionistID: req.user.receptionistID }, // Fetch using the receptionistID from token
        });

        if (!receptionist) {
            return res.status(404).json({ message: 'Receptionist not found' });
        }

        // Exclude the password from the response for security
        const { password, ...receptionistInfo } = receptionist.toJSON();
        res.json(receptionistInfo);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const updateReceptionistByID = async (req, res) => {
    try {
        const { firstName, surname, email, phone } = req.body;

        const receptionist = await Receptionist.findOne({
            where: { receptionistID: req.user.receptionistID }, // Use the receptionistID from the token
        });

        if (!receptionist) {
            return res.status(404).json({ message: 'Receptionist not found' });
        }

        receptionist.firstName = firstName || receptionist.firstName;
        receptionist.surname = surname || receptionist.surname;
        receptionist.email = email || receptionist.email;
        receptionist.phone = phone || receptionist.phone;

        await receptionist.save();

        const { password, ...updatedReceptionist } = receptionist.toJSON();
        res.json(updatedReceptionist);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { getReceptionistByID,updateReceptionistByID };
