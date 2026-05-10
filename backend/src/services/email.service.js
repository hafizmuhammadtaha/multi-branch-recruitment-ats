const transporter = require('../config/email');

const sendEmail = async (options) => {
    const mailOptions = {
        from: `"TechVista ATS" <${process.env.GMAIL_USER}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
    };

    // Support HTML emails for professional formatting
    if (options.html) {
        mailOptions.html = options.html;
    }

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Email failed to send:', error.message);
    }
};

module.exports = sendEmail;