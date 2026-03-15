const JWT = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

// Generate a JWT token
const GenerateToken = (person) => {
  const token = JWT.sign(
    {
      id: person._id,
      email: person.email,
      name: person.userName,
      role: person.role || "consumer",
      location: person.userLocation,
    },
    process.env.JWT_SECRET,
    { expiresIn: "3d" }
  );
  return token;
};

// Verify a JWT token
const verifyToken = async(token) => {
  if (!token || typeof token !== "string") {
    console.error("Invalid token format");
    return { success: false, error: "Invalid token format" };
  }
  try {
    const person = JWT.verify(token, process.env.JWT_SECRET);
    return person;
  } catch (err) {
    console.error("Error verifying token:", err.message);
    return { success: false, error: err.message };
  }
};

module.exports = { GenerateToken, verifyToken };
