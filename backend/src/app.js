const express = require('express');
const cors = require('cors');
const errorHandler = require('./middleware/error.middleware');
const authRoutes = require('./routes/auth.routes');

const app = express();

// Standard Production Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/branches', require('./routes/branch.routes'));
app.use('/api/jobs', require('./routes/job.routes'));

// Global Error Handler (Must be last)
app.use(errorHandler);

module.exports = app;