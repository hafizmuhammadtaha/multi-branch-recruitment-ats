const Interview = require('../models/interview.model');
const Application = require('../models/application.model');
const sendEmail = require('../services/email.service');

// @desc    Schedule an interview
// @route   POST /api/interviews
exports.scheduleInterview = async (req, res, next) => {
    try {
        const { applicationId, date, time, message } = req.body;

        const interview = await Interview.create({
            application: applicationId,
            date,
            time,
            message
        });

        // Update application status to reflect the interview
        const application = await Application.findByIdAndUpdate(
            applicationId, 
            { status: 'Interview Scheduled' }, 
            { new: true }
        ).populate('candidate', 'email name');

        // Send confirmation email to candidate
        await sendEmail({
            email: application.candidate.email,
            subject: 'Interview Scheduled - ATS Recruitment',
            message: `Hi ${application.candidate.name}, an interview has been scheduled for ${date} at ${time}. Message: ${message}`
        });

        res.status(201).json({ success: true, data: interview });
    } catch (error) {
        next(error);
    }
};