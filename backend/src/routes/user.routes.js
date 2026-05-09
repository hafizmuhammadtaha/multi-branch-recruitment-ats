const express = require('express');
const router = express.Router();
const { getMe, updateMe } = require('../controllers/user.controller');
const { protect } = require('../middleware/auth.middleware');
const { uploadProfilePic } = require('../middleware/upload.middleware');

router.get('/me', protect, getMe);
router.put('/me', protect, uploadProfilePic.single('profilePic'), updateMe);

module.exports = router;
