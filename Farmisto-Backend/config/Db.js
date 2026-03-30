const mongoose = require('mongoose');

/**
 * Connects to MongoDB using the URI from environment variables.
 * @param {Object} [options] - Optional mongoose connection options.
 * @returns {Promise<typeof mongoose>} Resolves with mongoose instance.
 */
const MongooseConnect = async (options = {}) => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error('MONGO_URI is not defined in environment variables');
  }

  const connOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    ...options,
  };

  try {
    await mongoose.connect(uri, connOptions);
    console.log('MongoDB connected successfully');

    // Connection event listeners
    mongoose.connection.on('reconnected', () => {
      console.log('MongoDB reconnected');
    });
    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected. Attempting to reconnect...');
    });
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    return mongoose;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    // Optionally, exit process if connection is critical
    process.exit(1);
  }
};

module.exports = MongooseConnect;