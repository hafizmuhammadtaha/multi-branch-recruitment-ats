require('dotenv').config({ path: './.env' }); // Ensure env variables are loaded first
const app = require('./app');
const connectDB = require('./config/db');

// Connect to MongoDB Atlas [cite: 23, 24]
connectDB();

const PORT = process.env.PORT || 5000;

// This will now work because app is correctly imported from app.js
app.listen(PORT, () => {
    console.log(`🚀 Server running in dev mode on port ${PORT}`);
});