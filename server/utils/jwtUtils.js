const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const secretKey = process.env.JWT_SECRET; // Use environment variable for security

// Generate JWT Token
const generateToken = (payload) => {
    return jwt.sign(payload, secretKey, { expiresIn: '24h' });
};

// Verify JWT Token
const verifyToken = (token) => {
    return jwt.verify(token, secretKey);
};

// Hash Password
const hashPassword = (password) => {
    return bcrypt.hash(password, 10);
};

// Compare Password
const comparePassword = (password, hashedPassword) => {
    return bcrypt.compare(password, hashedPassword);
};

module.exports = { generateToken, verifyToken, hashPassword, comparePassword };
