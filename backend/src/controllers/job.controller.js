const Job = require('../models/job.model');
const Branch = require('../models/branch.model');

// @desc    Create a job post (HR/Admin)
// @route   POST /api/jobs
exports.createJob = async (req, res, next) => {
    try {
        const { title, description, department, branch, availableSeats } = req.body;

        const job = await Job.create({
            title,
            description,
            department,
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
        const filter = {};

        if (req.query.branch) {
            const branch = await Branch.findOne({ name: new RegExp(`^${req.query.branch}$`, 'i') });
            if (branch) filter.branch = branch._id;
            else filter.branch = null;
        }

        if (req.query.title) {
            filter.title = { $regex: req.query.title, $options: 'i' };
        }

        if (req.query.department) {
            filter.department = req.query.department;
        }

        const jobs = await Job.find(filter).populate('branch', 'name');
        res.status(200).json({ success: true, data: jobs });
    } catch (error) {
        next(error);
    }
};

// @desc    Get job details by ID
// @route   GET /api/jobs/:id
exports.getJobById = async (req, res, next) => {
    try {
        const job = await Job.findById(req.params.id).populate('branch', 'name');
        if (!job) {
            res.status(404);
            throw new Error('Job not found');
        }
        res.status(200).json({ success: true, data: job });
    } catch (error) {
        next(error);
    }
};

// @desc    Update a job post (HR/Admin)
// @route   PUT /api/jobs/:id
exports.updateJob = async (req, res, next) => {
    try {
        const { title, description, department, branch, availableSeats } = req.body;
        const job = await Job.findById(req.params.id);

        if (!job) {
            res.status(404);
            throw new Error('Job not found');
        }

        if (title) job.title = title;
        if (description) job.description = description;
        if (department) job.department = department;
        if (branch) job.branch = branch;
        if (availableSeats !== undefined) job.availableSeats = availableSeats;

        await job.save();
        const updatedJob = await Job.findById(req.params.id).populate('branch', 'name');
        res.status(200).json({ success: true, data: updatedJob });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete a job post (HR/Admin)
// @route   DELETE /api/jobs/:id
exports.deleteJob = async (req, res, next) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) {
            res.status(404);
            throw new Error('Job not found');
        }

        await Job.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: 'Job deleted successfully' });
    } catch (error) {
        next(error);
    }
};