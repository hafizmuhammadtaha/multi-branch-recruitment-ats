const cloudinary = require('../config/cloudinary');

const uploadToCloudinary = async (filePath, folder) => {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            folder: folder,
            resource_type: 'auto'
        });
        return result.secure_url; 
    } catch (error) {
        throw new Error('Cloudinary Upload Failed');
    }
};

const removeFromCloudinary = async (publicId) => {
    try {
        await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        console.error('Cloudinary Deletion Failed:', error.message);
    }
};

module.exports = { uploadToCloudinary, removeFromCloudinary };