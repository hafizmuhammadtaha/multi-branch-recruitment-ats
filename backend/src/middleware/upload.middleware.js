const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        let folderName = 'ats_resumes';
        let allowedFormats = ['pdf'];

        if (file.fieldname === 'coverLetter') {
            folderName = 'ats_cover_letters';
            allowedFormats = ['pdf', 'docx']; // [cite: 91]
        }

        return {
            folder: folderName,
            allowed_formats: allowedFormats,
            resource_type: 'auto'
        };
    },
});

const upload = multer({ storage });

module.exports = upload;