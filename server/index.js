const express = require("express");
const sequelize = require("./db");
const sequelize1 = require("./db2");
const bodyParser = require("body-parser");
const cors = require("cors");
const HospitalAdminRoutes = require("./routes/HospitalAdminRoutes");
const loginRoutes = require("./routes/loginRoutes");
const systemAdminRoutes = require("./routes/systemAdminRoutes");
const patientRoutes = require("./routes/patientRoutes"); // Correct import
const contactUsRoutes = require("./routes/contactUsRoutes");
const doctorRoutes = require("./routes/doctorRoute");
const nurseRoutes = require("./routes/nurseRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const receptionistRoutes = require("./routes/receptionistRoutes");

const PharmacyInventoryRoutes = require("./routes/PharmacyInventoryRoutes");
const BloodInventoryRoutes = require("./routes/bloodbankRoutes");
const pathologyRoutes = require("./routes/pathologyRoutes");

const appointmentpdfRoutes = require("./routes/appoitmentpdfRoutes");
const resourceRoutes = require("./routes/resouceRoutes");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware
app.use(express.json());

// CORS configuration
const corsOptions = {
  origin: ["http://127.0.0.1:5500", "http://localhost:3000"], // Replace with your frontend URL
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

// Initialize database
// initDB();

// Routes
app.use("/api/contact", contactUsRoutes);

app.use("/api/Hospitaladmin", HospitalAdminRoutes);
app.use("/api", loginRoutes);
app.use("/api/systemadmin", systemAdminRoutes);
app.use("/api/patient", patientRoutes); // Use the correct route

app.use("/api/ph", PharmacyInventoryRoutes);
app.use("/api/blood", BloodInventoryRoutes);

app.use("/api/nurse", nurseRoutes);

app.use("/api/doctors", doctorRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/appointments", appointmentpdfRoutes);

app.use("/api/receptionist", receptionistRoutes);
app.use("/api/pathology", pathologyRoutes);

app.use("/api/resources", resourceRoutes);

// Test database connection
(async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected successfully.");
    await sequelize.sync({ alter: true });
    console.log("Tables ensured to exist.");
    await sequelize1.authenticate();
    console.log("Database connected successfully.");
    await sequelize1.sync({ alter: true });
    console.log("Tables ensured to exist.");
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
})();

app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err);
  res
    .status(500)
    .json({ message: "Internal Server Error", error: err.message });
});

// Server
const PORT = process.env.PORT || 5011;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Server running on port ${PORT}`);
  console.log(`Server running on port ${PORT}`);
  console.log(`Server running on port ${PORT}`);
  console.log(`Server running on port ${PORT}`);
  console.log(`Server running on port ${PORT}`);
});
