const cloudinary = require("cloudinary").v2;
require("dotenv").config();

/**
 * Configures Cloudinary with credentials from environment variables.
 * Throws an error if required variables are missing.
 * @returns {Object} The cloudinary instance.
 */
const connectCloudinary = () => {
  const { CLOUD_NAME, API_KEY, API_SECRET } = process.env;

  if (!CLOUD_NAME || !API_KEY || !API_SECRET) {
    const missing = [];
    if (!CLOUD_NAME) missing.push('CLOUD_NAME');
    if (!API_KEY) missing.push('API_KEY');
    if (!API_SECRET) missing.push('API_SECRET');
    throw new Error(`Missing Cloudinary environment variables: ${missing.join(', ')}`);
  }

  try {
    cloudinary.config({
      cloud_name: CLOUD_NAME,
      api_key: API_KEY,
      api_secret: API_SECRET,
    });
    console.log('Cloudinary configured successfully');
    return cloudinary;
  } catch (error) {
    console.error('Failed to configure Cloudinary:', error);
    throw error;
  }
};

module.exports = connectCloudinary;