const transporter = require('../config/email');

const sendEmail = async (options) => {
    const mailOptions = {
        from: `"ATS Recruitment" <${process.env.GMAIL_USER}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Email failed to send:', error.message);
    }
};

module.exports = sendEmail;