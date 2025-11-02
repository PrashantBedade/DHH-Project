// middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
const { verifyToken } = require("../utils/jwtUtils");
require("dotenv").config();

const hospitalAdminAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Extract token from Authorization header
  if (!token) {
      return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; // Attach decoded token to req.user (instead of req.admin)
      next(); // Proceed to the next middleware/controller
  } catch (error) {
      res.status(403).json({ error: 'Forbidden: Invalid token' });
  }
};


const patientAuth = (req, res, next) => {
  // Check for the Authorization header
  const token = req.headers["authorization"]?.split(" ")[1]; // Bearer token

  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    // Verify the token
    const decoded = verifyToken(token);

    // Store the patientID (or other relevant information) in the request object
    req.patientID = decoded.patientID;

    next(); // Proceed to the next middleware/route handler
  } catch (error) {
    return res.status(400).json({ error: "Invalid or expired token." });
  }
};
const pathologyAuth = (req, res, next) => {
  // Check for the Authorization header
  const token = req.headers["authorization"]?.split(" ")[1]; // Bearer token

  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    // Verify the token
    const decoded = verifyToken(token);

    // Store the pathologyID (or other relevant information) in the request object
    req.pathologyID = decoded.pathologyID;

    next(); // Proceed to the next middleware/route handler
  } catch (error) {
    return res.status(400).json({ error: "Invalid or expired token." });
  }
};

const doctorAuth = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1]; // Extract Bearer token

  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    // Verify token with the secret key used for signing it
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Replace with your actual secret key
    req.user = decoded; // Store the decoded token payload in req.user
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    return res.status(400).json({ error: "Invalid or expired token." });
  }
};

const receptionistAuth = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1]; // Extract Bearer token

  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    // Verify token with the secret key used for signing it
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Replace with your actual secret key
    req.user = decoded; // Store the decoded token payload in req.user
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    return res.status(400).json({ error: "Invalid or expired token." });
  }
};

const nurseAuth = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1]; // Extract Bearer token

  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    // Verify token with the secret key used for signing it
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Replace with your actual secret key
    req.nurseID = decoded.nurseID; // Attach nurseID to the request object
    req.user = decoded; // Store the decoded token payload in req.user
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    return res.status(400).json({ error: "Invalid or expired token." });
  }
};

// const nurseAuth1 = (req, res, next) => {
//   const token = req.header('Authorization')?.split(' ')[1]; // Token from 'Authorization' header

//   if (!token) {
//       return res.status(403).json({ message: 'Access denied. No token provided.' });
//   }

//   jwt.verify(token, 'your_secret_key', (err, decoded) => {
//       if (err) {
//           return res.status(400).json({ message: 'Invalid token.' });
//       }
//       req.receptionistID = decoded.receptionistID; // Attach the receptionistID to the request object
//       next();
//   });
// };

const systemAdminAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract token from Authorization header
  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user="CPcolabDigitalHealthHub@2024-2025";
    // Ensure the token belongs to the system admin
    if (decoded.username !== "CPcolabDigitalHealthHub@2024-2025") {
      return res.status(403).json({ error: "Forbidden:bcd Unauthorized access" });
    }

    req.systemAdmin = decoded; // Attach decoded token to req.systemAdmin
    next(); // Proceed to the next middleware/controller
  } catch (error) {
    res.status(403).json({ error: "Forbidden: abc or expired token" });
  }
};



// PharmacyauthMiddleware for pharmacy
// const PharmacyauthMiddleware = (req, res, next) => {
//   try {
//     // Extract the JWT token from the Authorization header
//     const token = req.header('Authorization')?.replace('Bearer ', '');
//     if (!token) {
//       return res.status(401).json({ error: 'Authentication token is missing.' });
//     }

//     // Verify the token using JWT_SECRET
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     // Check if pharmacy_id exists in the token payload
//     if (!decoded.pharmacy_id) {
//       return res.status(403).json({ error: 'Pharmacy ID is not valid or missing in token.' });
//     }

//     // Attach pharmacy_id to the request object for future use
//     req.pharmacy_id = decoded.pharmacy_id;

//     // Proceed to the next middleware or route handler
//     next();
//   } catch (error) {
//     console.error(error);
//     res.status(401).json({ error: 'Invalid or expired token.' });
//   }
// };

// PharmacyauthMiddleware for pharmacy
const PharmacyauthMiddleware = (req, res, next) => {
  try {
    // Extract the JWT token from the Authorization header
    const token = req.header("Authorization")?.replace("Bearer ", "");
    // console.log("Extracted Token:", token); // Debugging token extraction
    if (!token) {
      return res
        .status(401)
        .json({ error: "Authentication token is missing." });
    }

    // Verify the token using JWT_SECRET
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded Token Payload:", decoded); // Debugging decoded token

    // Check if pharmacy_id exists in the token payload
    if (!decoded.pharmacy_id) {
      return res
        .status(403)
        .json({ error: "Pharmacy ID is not valid or missing in token." });
    }

    // Attach pharmacy_id to the request object for future use
    req.pharmacy_id = decoded.pharmacy_id;

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.error("JWT Verification Error:", error); // Detailed logging
    res.status(401).json({ error: "Invalid or expired token." });
  }
};


const BloodBankAuthMiddleware = (req, res, next) => {
  try {
    // Extract the JWT token from the Authorization header
    const token = req.header("Authorization")?.replace("Bearer ", "");
    // console.log("Extracted Token:", token); // Debugging token extraction
    if (!token) {
      return res
        .status(401)
        .json({ error: "Authentication token is missing." });
    }

    // Verify the token using JWT_SECRET
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded Token Payload:", decoded); // Debugging decoded token

    // Check if bloodbank_id exists in the token payload
    if (!decoded.bloodbank_id) {
      return res
        .status(403)
        .json({ error: "Bloodbank ID is not valid or missing in token." });
    }

    // Attach bloodbank_id to the request object for future use
    req.bloodbank_id = decoded.bloodbank_id;

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.error("JWT Verification Error:", error); // Detailed logging
    res.status(401).json({ error: "Invalid or expired token." });
  }
};


module.exports = {
  hospitalAdminAuth,
  patientAuth,
  doctorAuth,
  nurseAuth,
  receptionistAuth,
  systemAdminAuth,
  PharmacyauthMiddleware,
  BloodBankAuthMiddleware,
  pathologyAuth
};
