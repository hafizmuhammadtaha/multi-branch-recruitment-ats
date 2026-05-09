const Interview = require('../models/interview.model');
const Application = require('../models/application.model');
const sendEmail = require('../services/email.service');

// @desc    Schedule an interview
// @route   POST /api/interviews
exports.scheduleInterview = async (req, res, next) => {
    try {
        const { applicationId, date, time, message } = req.body;

        const application = await Application.findById(applicationId).populate('candidate', 'email name');
        if (!application) {
            res.status(404);
            throw new Error('Application not found');
        }

        const interview = await Interview.create({
            application: applicationId,
            date,
            time,
            message
        });

        // Update application status to reflect the interview
        await Application.findByIdAndUpdate(applicationId, { status: 'Interview Scheduled' });

        // Send confirmation email to candidate
        await sendEmail({
            email: application.candidate.email,
            subject: 'Interview Scheduled - ATS Recruitment',
            message: `Hi ${application.candidate.name}, an interview has been scheduled for ${date} at ${time}. ${message}`
        });

        res.status(201).json({ success: true, data: interview });
    } catch (error) {
        next(error);
    }
};