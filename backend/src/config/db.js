const mongoose = require('mongoose');

// Cache connection for serverless environments (like Vercel) to prevent connection pooling issues
let isConnected = false;

const connectDB = async () => {
    if (isConnected) {
        return;
    }

    try {
        // Connect to MongoDB Atlas
        const conn = await mongoose.connect(process.env.MONGO_URI);

        isConnected = conn.connections[0].readyState;
    } catch (error) {
        // Important: Don't use process.exit(1) here as it will crash the serverless function
        throw error;
    }
};

module.exports = connectDB;