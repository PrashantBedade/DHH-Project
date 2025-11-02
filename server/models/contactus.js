const { DataTypes } = require('sequelize');
const { sequelize } = require('../db2');  // Correct import of sequelize instance

const ContactUs = sequelize.define('ContactUs', {
    name: { type: DataTypes.STRING, allowNull: false },
    phoneNo: { type: DataTypes.STRING, allowNull: false },
    address: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false },
    message: { type: DataTypes.TEXT, allowNull: false },
}, {
    timestamps: true,
});

// Sync model with database (done once when the app initializes)
(async () => {
    try {
        await ContactUs.sync({ alter: true });
        console.log('ContactUs table synced successfully!');
    } catch (error) {
        console.error('Error syncing ContactUs table:', error);
    }
})();

module.exports = {ContactUs};
