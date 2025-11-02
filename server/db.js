// const { Sequelize, DataTypes } = require('sequelize');

// // Database configurations
// const DB_USER = 'root';
// const DB_PASSWORD = 'Chetan@1234e'; // Replace with your MySQL password
// const DB_HOST = 'localhost';

// // Sequelize instance for MySQL (root connection for creating databases)
// const sequelizeMySQL = new Sequelize('mysql', DB_USER, DB_PASSWORD, {
//   host: DB_HOST,
//   dialect: 'mysql',
//   logging: false, // Turn off logging for raw queries
// });

// // Sequelize instances for specific databases
// const sequelizeHospital = new Sequelize('dhh_db', DB_USER, DB_PASSWORD, {
//   host: DB_HOST,
//   dialect: 'mysql',
//   logging: false,
// });

// const sequelizePatient = new Sequelize('patient_db', DB_USER, DB_PASSWORD, {
//   host: DB_HOST,
//   dialect: 'mysql',
//   logging: false,
// });

// const sequelizePharmacy = new Sequelize('pharmacy_db1', DB_USER, DB_PASSWORD, {
//   host: DB_HOST,
//   dialect: 'mysql',
//   logging: false,
// });

// // Create a map for database instances
// const databases = {
//   hospital: sequelizeHospital,
//   patient: sequelizePatient,
//   pharmacy: sequelizePharmacy,
// };

// // Function to authenticate a specific database
// const authenticateDatabase = async (dbName) => {
//   const dbInstance = databases[dbName];

//   if (!dbInstance) {
//     console.error(`Database "${dbName}" not found.`);
//     return;
//   }

//   try {
//     await dbInstance.authenticate();
//     console.log(`${dbName} database connected successfully.`);
//     await dbInstance.sync({ force: false }); // Use force: false to avoid overwriting data
//     console.log(`${dbName} tables synchronized.`);
//   } catch (error) {
//     console.error(`Error in ${dbName} database:`, error);
//   }
// };

// // Function to create required databases if they don't exist
// const createDatabases = async () => {
//   try {
//     await sequelizeMySQL.authenticate();
//     console.log('MySQL server connected successfully.');

//     await sequelizeMySQL.query(`CREATE DATABASE IF NOT EXISTS dhh_db;`);
//     console.log('Hospital database is ready.');

//     await sequelizeMySQL.query(`CREATE DATABASE IF NOT EXISTS patient_db;`);
//     console.log('Patient database is ready.');

//     await sequelizeMySQL.query(`CREATE DATABASE IF NOT EXISTS pharmacy_db1;`);
//     console.log('Pharmacy database is ready.');
//   } catch (error) {
//     console.error('Error creating databases:', error);
//   }
// };

// // Function to initialize tables for a specific database
// const initTables = async (dbName) => {
//   const dbInstance = databases[dbName];

//   if (!dbInstance) {
//     console.error(`Database "${dbName}" not found.`);
//     return;
//   }

//   try {
//     if (dbName === 'pharmacy') {
//       // Create tables specific to the pharmacy database
//       await dbInstance.query(`
//         CREATE TABLE IF NOT EXISTS loginlog (
//           pharmacy_id VARCHAR(255) NOT NULL,
//           owner_name VARCHAR(255) NOT NULL,
//           hash_password TEXT NOT NULL,
//           jwt_token TEXT NOT NULL,
//           createdAt DATETIME NOT NULL,
//           updatedAt DATETIME NOT NULL,
//           PRIMARY KEY (pharmacy_id)
//         )
//       `);
//       console.log('Pharmacy "loginlog" table initialized.');

//       await dbInstance.query(`
//         CREATE TABLE IF NOT EXISTS registerpharmacies (
//           pharmacy_id VARCHAR(255) NOT NULL,
//           pharmacy_name VARCHAR(255) NOT NULL,
//           address TEXT NOT NULL,
//           owner_name VARCHAR(255) NOT NULL,
//           license_no VARCHAR(255) NOT NULL,
//           phone_no VARCHAR(20) NOT NULL,
//           password TEXT NOT NULL,
//           createdAt DATETIME NOT NULL,
//           updatedAt DATETIME NOT NULL,
//           PRIMARY KEY (pharmacy_id)
//         )
//       `);
//       console.log('Pharmacy "registerpharmacies" table initialized.');
//     }

//     // Add other database-specific table initializations as needed
//   } catch (error) {
//     console.error(`Error initializing tables for ${dbName}:`, error);
//   }
// };

// // Main function to initialize the entire system
// const initializeSystem = async () => {
//   await createDatabases();

//   // Authenticate and sync each database
//   for (const dbName of Object.keys(databases)) {
//     await authenticateDatabase(dbName);
//   }

//   // Initialize tables for specific databases
//   await initTables('pharmacy'); // Add other databases as needed
// };

// initializeSystem();

// module.exports = { sequelizeHospital, sequelizePatient, sequelizePharmacy };



const { Sequelize } = require("sequelize");

// Database configurations
const DB_USER = "root";
const DB_PASSWORD = "Prashant@123";
const DB_HOST = "localhost";

// Sequelize instance for MySQL (root connection for creating databases)
const sequelizeMySQL = new Sequelize("mysql", DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  dialect: "mysql",
  logging: false,
});

// Sequelize instances for specific databases
const sequelizeHospital = new Sequelize("dhh_db", DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  dialect: "mysql",
  logging: false,
});

const sequelizePatient = new Sequelize("patient_db", DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  dialect: "mysql",
  logging: false,
});

const sequelizePharmacy = new Sequelize("pharmacy_db1", DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  dialect: "mysql",
  logging: false,
});

const sequelizeBloodBank = new Sequelize("bloodbank_db", DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  dialect: "mysql",
  logging: false,
});

const sequelizePathology = new Sequelize(
  "pathology1_db",
  DB_USER,
  DB_PASSWORD,
  {
    host: DB_HOST,
    dialect: "mysql",
    logging: false,
  }
);

// Create a map for database instances
const databases = {
  hospital: sequelizeHospital,
  patient: sequelizePatient,
  pharmacy: sequelizePharmacy,
  bloodbank: sequelizeBloodBank,
  pathology: sequelizePathology,
};

// Function to authenticate a specific database
const authenticateDatabase = async (dbName) => {
  const dbInstance = databases[dbName];

  if (!dbInstance) {
    console.error(`Database "${dbName}" not found.`);
    return;
  }

  try {
    await dbInstance.authenticate();
    console.log(`${dbName} database connected successfully.`);
    await dbInstance.sync({ force: false });
    console.log(`${dbName} tables synchronized.`);
  } catch (error) {
    console.error(`Error in ${dbName} database:`, error);
  }
};

const createDatabases = async () => {
  try {
    await sequelizeMySQL.authenticate();
    console.log("MySQL server connected successfully.");

    await sequelizeMySQL.query(`CREATE DATABASE IF NOT EXISTS dhh_db;`);
    console.log("Hospital database is ready.");

    await sequelizeMySQL.query(`CREATE DATABASE IF NOT EXISTS patient_db;`);
    console.log("Patient database is ready.");

    await sequelizeMySQL.query(`CREATE DATABASE IF NOT EXISTS pharmacy_db1;`);
    console.log("Pharmacy database is ready.");

    await sequelizeMySQL.query(`CREATE DATABASE IF NOT EXISTS bloodbank_db;`);
    console.log("Blood Bank database is ready.");

    await sequelizeMySQL.query(`CREATE DATABASE IF NOT EXISTS pathology1_db;`); // Create pathology1_db
    console.log("Pathology1 database is ready.");
  } catch (error) {
    console.error("Error creating databases:", error);
  }
};

// Function to initialize tables for a specific database
const initTables = async (dbName) => {
  const dbInstance = databases[dbName];

  if (!dbInstance) {
    console.error(`Database "${dbName}" not found.`);
    return;
  }

  try {
    if (dbName === "pharmacy") {
      await dbInstance.query(`
        CREATE TABLE IF NOT EXISTS loginlog (
          pharmacy_id VARCHAR(255) NOT NULL,
          owner_name VARCHAR(255) NOT NULL,
          hash_password TEXT NOT NULL,
          jwt_token TEXT NOT NULL,
          createdAt DATETIME NOT NULL,
          updatedAt DATETIME NOT NULL,
          PRIMARY KEY (pharmacy_id)
        )
      `);
      console.log('Pharmacy "loginlog" table initialized.');
    }

    if (dbName === "bloodbank") {
      await dbInstance.query(`
        CREATE TABLE IF NOT EXISTS loginlog (
          bloodbank_id VARCHAR(255) NOT NULL,
          owner_name VARCHAR(255) NOT NULL,
          hash_password TEXT NOT NULL,
          jwt_token TEXT NOT NULL,
          createdAt DATETIME NOT NULL,
          updatedAt DATETIME NOT NULL,
          PRIMARY KEY (bloodbank_id)
        )
      `);
      console.log('Blood Bank "loginlog" table initialized.');
    }

    if (dbName === "pathology") {
      await dbInstance.query(`
        CREATE TABLE IF NOT EXISTS loginlog (
          pathology_id VARCHAR(255) NOT NULL,
          owner_name VARCHAR(255) NOT NULL,
          hash_password TEXT NOT NULL,
          jwt_token TEXT NOT NULL,
          createdAt DATETIME NOT NULL,
          updatedAt DATETIME NOT NULL,
          PRIMARY KEY (pathology_id)
        )
      `);
      console.log('Pathology "loginlog" table initialized.');
    }
  } catch (error) {
    console.error(`Error initializing tables for ${dbName}:`, error);
  }
};

// Main function to initialize the entire system
const initializeSystem = async () => {
  await createDatabases(); // Create databases if not exist

  // Authenticate and sync each database
  for (const dbName of Object.keys(databases)) {
    await authenticateDatabase(dbName);
  }

  // Initialize tables for Pharmacy, Blood Bank, and Pathology databases
  await initTables("pharmacy");
  await initTables("bloodbank");
  await initTables("pathology");
};

// Start the initialization process
initializeSystem();

// Export sequelize instances for usage in other parts of the application
module.exports = {
  sequelizeHospital,
  sequelizePatient,
  sequelizePharmacy,
  sequelizeBloodBank,
  sequelizePathology,
};
