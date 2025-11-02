const bcrypt = require('bcrypt');
const { generateToken } = require('../utils/jwtUtils');
const {Hospital} = require('../models/Hospital');
const {HospitalAdmin} = require('../models/HospitalAdmin');
require('dotenv').config();
const { SYSTEM_ADMIN_USERNAME, SYSTEM_ADMIN_PASSWORD } = process.env;


// Login System Admin
exports.loginSystemAdmin = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required.' });
    }

    // Validate credentials against environment variables
    if (username !== process.env.SYSTEM_ADMIN_USERNAME) {
        return res.status(401).json({ error: 'Invalid username.' });
    }
    if (password !== process.env.SYSTEM_ADMIN_PASSWORD) {
        return res.status(401).json({ error: 'Invalid password.' });
    }

    // Generate token
    const token = generateToken({ username });

    res.status(200).json({
        message: 'Login successful.',
        token,
    });
};



exports.registerHospitalAndAdmin = async (req, res) => {
    const { hospital_name, address, contactNumber, email, adminName, adminUsername, adminPassword } = req.body;

    if (!hospital_name || !address || !contactNumber || !email || !adminName || !adminUsername || !adminPassword) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    try {
        // Check if email already exists
        const existingAdmin = await HospitalAdmin.findOne({ where: { email } });
        if (existingAdmin) {
            return res.status(400).json({ error: 'Email already exists. Please use a different email.' });
        }

        // Check if username already exists
        const existingUsername = await HospitalAdmin.findOne({ where: { username: adminUsername } });
        if (existingUsername) {
            return res.status(400).json({ error: 'Username already exists. Please choose a different username.' });
        }

        // Hash the admin password
        const hashedPassword = await bcrypt.hash(adminPassword, 10);

        // Create the hospital admin
        const admin = await HospitalAdmin.create({
            name: adminName,
            email,
            username: adminUsername,
            password: hashedPassword,
        });

        // Create the hospital
        const hospital = await Hospital.create({
            hospital_name,
            address,
            contactNumber,
            email,
            adminUsername: admin.username,
        });

        res.status(201).json({
            message: 'Hospital and Hospital Admin registered successfully!',
            hospital,
            admin,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to register Hospital and Admin.', details: error.message });
    }
};
