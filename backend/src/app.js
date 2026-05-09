const express = require('express');
const cors = require('cors');
const errorHandler = require('./middleware/error.middleware');

// Import Routes
const authRoutes = require('./routes/auth.routes');
const branchRoutes = require('./routes/branch.routes');
const jobRoutes = require('./routes/job.routes');
const applicationRoutes = require('./routes/application.routes');
const interviewRoutes = require('./routes/interview.routes');
const userRoutes = require('./routes/user.routes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/branches', branchRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/interviews', interviewRoutes);
app.use('/api/users', userRoutes);

// Global Error Handler (Must be last)
app.use(errorHandler);

module.exports = app;