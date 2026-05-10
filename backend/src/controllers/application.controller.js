const Application = require('../models/application.model');
const Job = require('../models/job.model');
const sendEmail = require('../services/email.service');

// HTML email template generator
const generateStatusEmail = (candidateName, status, jobTitle) => {
    const statusColors = {
        'Shortlisted': { bg: '#FEF3C7', text: '#92400E', label: 'Shortlisted' },
        'Rejected': { bg: '#FEE2E2', text: '#991B1B', label: 'Not Selected' },
        'Selected': { bg: '#D1FAE5', text: '#065F46', label: 'Selected' },
    };
    const style = statusColors[status] || { bg: '#F3F4F6', text: '#374151', label: status };

    return `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.07);">
        <div style="background: linear-gradient(135deg, #4f46e5 0%, #4338ca 100%); padding: 32px 24px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700;">TechVista Solutions</h1>
            <p style="color: #c7d2fe; margin: 8px 0 0; font-size: 14px;">Recruitment & Applicant Tracking System</p>
        </div>
        <div style="padding: 32px 24px;">
            <p style="font-size: 16px; color: #374151; margin: 0 0 16px;">Hi <strong>${candidateName}</strong>,</p>
            <p style="font-size: 15px; color: #6B7280; margin: 0 0 24px;">
                We have an update regarding your application for <strong style="color: #111827;">${jobTitle || 'the position'}</strong>.
            </p>
            <div style="background: ${style.bg}; border-radius: 8px; padding: 16px 20px; text-align: center; margin: 0 0 24px;">
                <p style="margin: 0; font-size: 13px; color: ${style.text}; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">Application Status</p>
                <p style="margin: 8px 0 0; font-size: 22px; font-weight: 700; color: ${style.text};">${style.label}</p>
            </div>
            ${status === 'Selected' ? '<p style="font-size: 15px; color: #6B7280;">Congratulations! Our HR team will be in touch with the next steps shortly.</p>' : ''}
            ${status === 'Shortlisted' ? '<p style="font-size: 15px; color: #6B7280;">You have been shortlisted! Please keep an eye on your email for interview scheduling details.</p>' : ''}
            ${status === 'Rejected' ? '<p style="font-size: 15px; color: #6B7280;">We appreciate your interest and encourage you to apply for future openings that match your skills.</p>' : ''}
            <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 24px 0;" />
            <p style="font-size: 13px; color: #9CA3AF; margin: 0; text-align: center;">
                This is an automated message from TechVista ATS. Please do not reply directly to this email.
            </p>
        </div>
    </div>`;
};

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
            .populate('job', 'title description department branch availableSeats')
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
            .populate('job', 'title department branch')
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
            .populate('job', 'title description department branch availableSeats')
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

// @desc    Update Application Status (Shortlist/Reject/Select)
// @route   PUT /api/applications/:id/status
exports.updateStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        const application = await Application.findById(req.params.id)
            .populate('candidate', 'email name')
            .populate('job', 'title');

        if (!application) {
            res.status(404);
            throw new Error('Application not found');
        }

        application.status = status;
        await application.save();

        // Send professional HTML email for key status changes
        if (['Shortlisted', 'Rejected', 'Selected'].includes(status)) {
            const jobTitle = application.job?.title || 'the applied position';
            await sendEmail({
                email: application.candidate.email,
                subject: `Application Update: ${status} — TechVista Solutions`,
                message: `Hi ${application.candidate.name}, your application for ${jobTitle} status is now ${status}.`,
                html: generateStatusEmail(application.candidate.name, status, jobTitle)
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

        const htmlContent = `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.07);">
            <div style="background: linear-gradient(135deg, #4f46e5 0%, #4338ca 100%); padding: 32px 24px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700;">TechVista Solutions</h1>
                <p style="color: #c7d2fe; margin: 8px 0 0; font-size: 14px;">Message from HR Department</p>
            </div>
            <div style="padding: 32px 24px;">
                <p style="font-size: 16px; color: #374151; margin: 0 0 16px;">Hi <strong>${application.candidate.name}</strong>,</p>
                <div style="background: #F9FAFB; border-left: 4px solid #4f46e5; border-radius: 0 8px 8px 0; padding: 16px 20px; margin: 0 0 24px;">
                    <p style="font-size: 15px; color: #374151; margin: 0; white-space: pre-wrap;">${message}</p>
                </div>
                <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 24px 0;" />
                <p style="font-size: 13px; color: #9CA3AF; margin: 0; text-align: center;">
                    This message was sent by the HR team at TechVista Solutions via ATS.
                </p>
            </div>
        </div>`;

        await sendEmail({
            email: application.candidate.email,
            subject: subject || 'Message from HR — TechVista Solutions',
            message: `Hi ${application.candidate.name},\n\n${message}`,
            html: htmlContent
        });

        res.status(200).json({ success: true, message: 'Custom message sent successfully' });
    } catch (error) {
        next(error);
    }
};