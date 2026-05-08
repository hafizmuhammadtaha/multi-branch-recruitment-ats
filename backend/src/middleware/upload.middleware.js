const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

// Configure storage for Cloudinary
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        // Default settings for Resumes
        let folderName = 'ats_resumes';
        let allowedFormats = ['pdf'];

        // Handling specific field for Cover Letters as per requirements
        if (file.fieldname === 'coverLetter') {
            folderName = 'ats_cover_letters';
            allowedFormats = ['pdf', 'docx'];
        }

        return {
            folder: folderName,
            allowed_formats: allowedFormats,
            resource_type: 'auto', // CRITICAL: Ensures PDF/Docx are handled as documents
            flags: 'attachment'    // Optional: Helps browser handle file delivery
        };
    },
});

// Initialize multer with Cloudinary storage
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } // Optional: 5MB limit for security
});

module.exports = upload;