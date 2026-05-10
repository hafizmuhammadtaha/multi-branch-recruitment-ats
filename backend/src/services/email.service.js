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
        const info = await transporter.sendMail(mailOptions);
        console.log(`[EMAIL OK] Sent to ${options.email} | MessageId: ${info.messageId}`);
    } catch (error) {
        console.error(`[EMAIL FAIL] To: ${options.email} | Subject: ${options.subject}`);
        console.error(`[EMAIL FAIL] Error name: ${error.name}`);
        console.error(`[EMAIL FAIL] Error message: ${error.message}`);
        console.error(`[EMAIL FAIL] Error code: ${error.code || 'N/A'}`);
        console.error(`[EMAIL FAIL] SMTP response: ${error.response || 'N/A'}`);
        // Re-throw so callers can decide how to handle it
        throw error;
    }
};

module.exports = sendEmail;