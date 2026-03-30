const mongoose = require('mongoose');

/**
 * Connects to MongoDB using the URI from environment variables.
 * @returns {Promise<void>}
 * @throws Will exit process on connection error.
 */
const MongooseConnect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

module.exports = MongooseConnect;