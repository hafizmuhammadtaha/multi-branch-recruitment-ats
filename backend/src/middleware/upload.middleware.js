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
// PDF Upload Strategy:
//   - resource_type: 'raw'   → forces DOWNLOAD, may corrupt content — BAD for viewing
//   - resource_type: 'auto'  → unpredictable behavior for PDFs — BAD
//   - resource_type: 'image' → Cloudinary natively supports PDFs as image type,
//     serves with Content-Type: application/pdf and Content-Disposition: inline
//     → opens DIRECTLY in the browser's PDF viewer ✅
// DOCX files must use 'raw' since browsers can't render them inline anyway.
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        let folderName = 'ats_resumes';
        let allowedFormats = ['pdf'];
        let resourceType = 'image'; // PDFs open inline in browser as 'image' type

        if (file.fieldname === 'coverLetter') {
            folderName = 'ats_cover_letters';
            allowedFormats = ['pdf', 'docx'];

            // DOCX can't be viewed inline in browser — use 'raw' for download
            const ext = path.extname(file.originalname).toLowerCase();
            if (ext === '.docx') {
                resourceType = 'raw';
            }
        }

        return {
            folder: folderName,
            allowed_formats: allowedFormats,
            resource_type: resourceType
        };
    },
});

// Initialize multer with Cloudinary storage
const upload = multer({
    storage: storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit for security
});

const profilePicStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => ({
        folder: 'ats_profile_pics',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        resource_type: 'image',
        transformation: [{ width: 400, height: 400, crop: 'fill' }]
    }),
});

const uploadProfilePic = multer({
    storage: profilePicStorage,
    fileFilter: (req, file, cb) => {
        const allowed = ['image/jpeg', 'image/png', 'image/webp'];
        if (!allowed.includes(file.mimetype)) {
            return cb(new Error('Profile picture must be JPG, PNG or WEBP'), false);
        }
        cb(null, true);
    },
    limits: { fileSize: 2 * 1024 * 1024 } // 2MB
});

module.exports = { upload, uploadProfilePic };