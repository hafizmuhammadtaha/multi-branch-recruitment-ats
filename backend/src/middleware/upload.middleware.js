const path = require('path');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const resumeMimeTypes = ['application/pdf'];
const coverLetterMimeTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

const fileFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();

    if (file.fieldname === 'resume') {
        if (ext !== '.pdf' || !resumeMimeTypes.includes(file.mimetype)) {
            return cb(new Error('Resume must be a PDF file'), false);
        }
    }

    if (file.fieldname === 'coverLetter') {
        if (!['.pdf', '.docx'].includes(ext) || !coverLetterMimeTypes.includes(file.mimetype)) {
            return cb(new Error('Cover letter must be PDF or DOCX'), false);
        }
    }

    cb(null, true);
};

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
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit for security
});

module.exports = upload; 