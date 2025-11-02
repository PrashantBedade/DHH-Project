// db.js
const { Sequelize } = require('sequelize');

// Define your database connection
const sequelize = new Sequelize('contactus_db', 'root', 'Prashant@123', {
    host: 'localhost',
    dialect: 'mysql',
});

// Test the connection
(async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected successfully!');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
})();

module.exports = { sequelize };
