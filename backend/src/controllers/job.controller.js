const Job = require('../models/job.model');

// @desc    Create a job post (HR/Admin)
// @route   POST /api/jobs
exports.createJob = async (req, res, next) => {
    try {
        const { title, description, branch, availableSeats } = req.body;

        const job = await Job.create({
            title,
            description,
            branch,
            availableSeats
        });

        res.status(201).json({ success: true, data: job });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all jobs with branch details
// @route   GET /api/jobs
exports.getJobs = async (req, res, next) => {
    try {
        // Populating branch name as per project requirement
        const jobs = await Job.find().populate('branch', 'name');
        res.status(200).json({ success: true, data: jobs });
    } catch (error) {
        next(error);
    }
};