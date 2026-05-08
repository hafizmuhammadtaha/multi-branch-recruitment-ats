const Application = require('../models/application.model');
const sendEmail = require('../services/email.service');

// @desc    Apply for a job
// @route   POST /api/applications
exports.applyToJob = async (req, res, next) => {
    try {
        const { jobId } = req.body;

        if (!req.file) {
            res.status(400);
            throw new Error('Please upload a PDF resume');
        }

        const application = await Application.create({
            candidate: req.user._id,
            job: jobId,
            resumeUrl: req.file.path, // Automatically saved to Cloudinary via middleware
            status: 'Submitted'
        });

        res.status(201).json({ success: true, data: application });
    } catch (error) {
        next(error);
    }
};

// @desc    Update Application Status (Shortlist/Reject)
// @route   PUT /api/applications/:id/status
exports.updateStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        const application = await Application.findByIdAndUpdate(req.params.id, { status }, { new: true })
            .populate('candidate', 'email name');

        // Requirement: Notify candidate via email if status changes
        if (status === 'Shortlisted' || status === 'Rejected') {
            await sendEmail({
                email: application.candidate.email,
                subject: `Application Status: ${status}`,
                message: `Hi ${application.candidate.name}, your application is now ${status}.`
            });
        }

        res.status(200).json({ success: true, data: application });
    } catch (error) {
        next(error);
    }
};