const Application = require('../models/application.model');
const Job = require('../models/job.model');
const sendEmail = require('../services/email.service');

// @desc    Apply for a job
// @route   POST /api/applications
exports.applyToJob = async (req, res, next) => {
    try {
        const { jobId } = req.body;
        const resumeFile = req.files?.resume?.[0];
        const coverLetterFile = req.files?.coverLetter?.[0];

        if (!resumeFile) {
            res.status(400);
            throw new Error('Please upload a PDF resume');
        }

        const job = await Job.findById(jobId);
        if (!job) {
            res.status(404);
            throw new Error('Job not found');
        }

        if (job.availableSeats <= 0) {
            res.status(400);
            throw new Error('No available seats for this job');
        }

        const application = await Application.create({
            candidate: req.user._id,
            job: jobId,
            resumeUrl: resumeFile.path, // Automatically saved to Cloudinary via middleware
            coverLetterUrl: coverLetterFile?.path,
            status: 'Submitted'
        });

        await Job.findByIdAndUpdate(jobId, { $inc: { availableSeats: -1 } });

        res.status(201).json({ success: true, data: application });
    } catch (error) {
        next(error);
    }
};

// @desc    Get current candidate's applications
// @route   GET /api/applications/me
exports.getMyApplications = async (req, res, next) => {
    try {
        const applications = await Application.find({ candidate: req.user._id })
            .populate('job', 'title description branch availableSeats')
            .populate('candidate', 'name email');

        res.status(200).json({ success: true, data: applications });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all applications (HR/Admin)
// @route   GET /api/applications
exports.getApplications = async (req, res, next) => {
    try {
        const filter = {};
        if (req.query.status) filter.status = req.query.status;
        if (req.query.jobId) filter.job = req.query.jobId;

        const applications = await Application.find(filter)
            .populate('job', 'title branch')
            .populate('candidate', 'name email');

        res.status(200).json({ success: true, data: applications });
    } catch (error) {
        next(error);
    }
};

// @desc    Get an application by ID
// @route   GET /api/applications/:id
exports.getApplicationById = async (req, res, next) => {
    try {
        const application = await Application.findById(req.params.id)
            .populate('job', 'title description branch availableSeats')
            .populate('candidate', 'name email');

        if (!application) {
            res.status(404);
            throw new Error('Application not found');
        }

        if (req.user.role === 'candidate' && !application.candidate._id.equals(req.user._id)) {
            res.status(403);
            throw new Error('Not authorized to view this application');
        }

        res.status(200).json({ success: true, data: application });
    } catch (error) {
        next(error);
    }
};

// @desc    Update Application Status (Shortlist/Reject)
// @route   PUT /api/applications/:id/status
exports.updateStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        const application = await Application.findById(req.params.id).populate('candidate', 'email name');

        if (!application) {
            res.status(404);
            throw new Error('Application not found');
        }

        application.status = status;
        await application.save();

        if (status === 'Shortlisted' || status === 'Rejected' || status === 'Selected') {
            await sendEmail({
                email: application.candidate.email,
                subject: `Application Status: ${status}`,
                message: `Hi ${application.candidate.name}, your application status is now ${status}.`
            });
        }

        res.status(200).json({ success: true, data: application });
    } catch (error) {
        next(error);
    }
};

// @desc    Send custom HR message to applicant
// @route   POST /api/applications/:id/message
exports.sendCustomMessage = async (req, res, next) => {
    try {
        const { subject, message } = req.body;
        const application = await Application.findById(req.params.id).populate('candidate', 'email name');

        if (!application) {
            res.status(404);
            throw new Error('Application not found');
        }

        await sendEmail({
            email: application.candidate.email,
            subject: subject || 'Message from HR',
            message: `Hi ${application.candidate.name},\n\n${message}`
        });

        res.status(200).json({ success: true, message: 'Custom message sent successfully' });
    } catch (error) {
        next(error);
    }
};