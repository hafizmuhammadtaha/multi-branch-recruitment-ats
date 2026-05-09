const User = require('../models/user.model');
const bcrypt = require('bcryptjs');

// @desc    Get current logged in user profile
// @route   GET /api/users/me
exports.getMe = async (req, res, next) => {
    try {
        res.status(200).json({ success: true, data: req.user });
    } catch (error) {
        next(error);
    }
};

// @desc    Update current logged in user profile
// @route   PUT /api/users/me
exports.updateMe = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        const user = await User.findById(req.user._id);

        if (!user) { res.status(404); throw new Error('User not found'); }

        if (email && email !== user.email) {
            const emailTaken = await User.findOne({ email });
            if (emailTaken) { res.status(400); throw new Error('Email already in use'); }
            user.email = email;
        }

        if (name) user.name = name;
        if (password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
        }

        // Handle profile picture upload
        if (req.file) {
            user.profilePicUrl = req.file.path; // Cloudinary URL via multer-storage-cloudinary
        }

        await user.save();

        res.status(200).json({
            success: true,
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                profilePicUrl: user.profilePicUrl,
            }
        });
    } catch (error) {
        next(error);
    }
};