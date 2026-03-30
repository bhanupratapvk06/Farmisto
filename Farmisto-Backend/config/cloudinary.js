const cloudinary = require('cloudinary').v2;
require('dotenv').config();

/**
 * Configures Cloudinary with credentials from environment variables.
 * Throws an error if required variables are missing or invalid.
 * @returns {Object} The cloudinary instance.
 */
const connectCloudinary = () => {
  const { CLOUD_NAME, API_KEY, API_SECRET } = process.env;

  // Trim and validate
  const cloudName = typeof CLOUD_NAME === 'string' ? CLOUD_NAME.trim() : '';
  const apiKey = typeof API_KEY === 'string' ? API_KEY.trim() : '';
  const apiSecret = typeof API_SECRET === 'string' ? API_SECRET.trim() : '';

  const missing = [];
  if (!cloudName) missing.push('CLOUD_NAME');
  if (!apiKey) missing.push('API_KEY');
  if (!apiSecret) missing.push('API_SECRET');

  if (missing.length) {
    throw new Error(`Missing or empty Cloudinary environment variables: ${missing.join(', ')}`);
  }

  try {
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
      secure: true,
    });
    console.log('Cloudinary configured successfully');
    return cloudinary;
  } catch (error) {
    console.error('Failed to configure Cloudinary:', error);
    throw error;
  }
};

module.exports = connectCloudinary;