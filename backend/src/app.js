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

// CORS — deployment-ready: allows Vercel frontend URL in production, all origins in dev
const corsOptions = {
    origin: process.env.FRONTEND_URL || '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/branches', branchRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/interviews', interviewRoutes);
app.use('/api/users', userRoutes);

// Health check endpoint for deployment verification
app.get('/api/health', (req, res) => {
    res.status(200).json({ success: true, message: 'TechVista ATS API is running', timestamp: new Date().toISOString() });
});

// Global Error Handler (Must be last)
app.use(errorHandler);

module.exports = app;