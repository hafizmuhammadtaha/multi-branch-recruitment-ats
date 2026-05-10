const Interview = require('../models/interview.model');
const Application = require('../models/application.model');
const sendEmail = require('../services/email.service');

// HTML email template for interview invitations
const generateInterviewEmail = (candidateName, jobTitle, date, time, message) => {
    return `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.07);">
        <div style="background: linear-gradient(135deg, #4f46e5 0%, #4338ca 100%); padding: 32px 24px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700;">TechVista Solutions</h1>
            <p style="color: #c7d2fe; margin: 8px 0 0; font-size: 14px;">Interview Invitation</p>
        </div>
        <div style="padding: 32px 24px;">
            <p style="font-size: 16px; color: #374151; margin: 0 0 16px;">Hi <strong>${candidateName}</strong>,</p>
            <p style="font-size: 15px; color: #6B7280; margin: 0 0 24px;">
                We are pleased to invite you for an interview for the position of <strong style="color: #111827;">${jobTitle || 'the applied role'}</strong>.
            </p>
            <div style="background: #EEF2FF; border-radius: 12px; padding: 24px; margin: 0 0 24px;">
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 8px 0; font-size: 14px; color: #6B7280; font-weight: 600; width: 100px;">📅 Date</td>
                        <td style="padding: 8px 0; font-size: 15px; color: #111827; font-weight: 700;">${new Date(date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; font-size: 14px; color: #6B7280; font-weight: 600;">🕐 Time</td>
                        <td style="padding: 8px 0; font-size: 15px; color: #111827; font-weight: 700;">${time}</td>
                    </tr>
                </table>
            </div>
            ${message ? `
            <div style="background: #F9FAFB; border-left: 4px solid #4f46e5; border-radius: 0 8px 8px 0; padding: 16px 20px; margin: 0 0 24px;">
                <p style="font-size: 13px; color: #6B7280; margin: 0 0 4px; font-weight: 600;">Additional Details:</p>
                <p style="font-size: 15px; color: #374151; margin: 0; white-space: pre-wrap;">${message}</p>
            </div>
            ` : ''}
            <p style="font-size: 15px; color: #6B7280; margin: 0 0 8px;">Please confirm your attendance by replying to this email. We look forward to meeting you!</p>
            <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 24px 0;" />
            <p style="font-size: 13px; color: #9CA3AF; margin: 0; text-align: center;">
                This is an automated message from TechVista ATS. Please do not reply directly to this email.
            </p>
        </div>
    </div>`;
};

// @desc    Schedule an interview
// @route   POST /api/interviews
exports.scheduleInterview = async (req, res, next) => {
    try {
        const { applicationId, date, time, message } = req.body;

        const application = await Application.findById(applicationId)
            .populate('candidate', 'email name')
            .populate('job', 'title');
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

        // Send professional HTML email to candidate
        const jobTitle = application.job?.title || 'the applied position';
        await sendEmail({
            email: application.candidate.email,
            subject: `Interview Scheduled: ${jobTitle} — TechVista Solutions`,
            message: `Hi ${application.candidate.name}, an interview has been scheduled for ${date} at ${time}. ${message || ''}`,
            html: generateInterviewEmail(application.candidate.name, jobTitle, date, time, message)
        });

        res.status(201).json({ success: true, data: interview });
    } catch (error) {
        next(error);
    }
};

// @desc    Get interviews
// @route   GET /api/interviews
exports.getInterviews = async (req, res, next) => {
    try {
        let filter = {};

        if (req.user.role === 'candidate') {
            const applications = await Application.find({ candidate: req.user._id });
            const applicationIds = applications.map((app) => app._id);
            filter.application = { $in: applicationIds };
        }

        const interviews = await Interview.find(filter)
            .populate({ path: 'application', populate: [{ path: 'candidate', select: 'name email' }, { path: 'job', select: 'title department branch' }] });

        res.status(200).json({ success: true, data: interviews });
    } catch (error) {
        next(error);
    }
};