const app = require('../src/app');
const connectDB = require('../src/config/db');

// Connect to MongoDB Atlas
// In a serverless environment, the connection will be cached
connectDB();

// Export the Express app for Vercel's serverless builder
module.exports = app;
