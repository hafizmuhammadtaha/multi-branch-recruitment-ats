const express = require('express');
const router = express.Router();
const {
    applyToJob,
    getMyApplications,
    getApplications,
    getApplicationById,
    updateStatus,
    sendCustomMessage
} = require('../controllers/application.controller');
const { protect, authorize } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');

// Candidates apply with a PDF resume and optional cover letter
router.post(
    '/',
    protect,
    authorize('candidate'),
    upload.fields([
        { name: 'resume', maxCount: 1 },
        { name: 'coverLetter', maxCount: 1 }
    ]),
    applyToJob
);

router.get('/me', protect, authorize('candidate'), getMyApplications);
router.get('/', protect, authorize('hr', 'admin'), getApplications);
router.get('/:id', protect, getApplicationById);
router.put('/:id/status', protect, authorize('hr', 'admin'), updateStatus);
router.post('/:id/message', protect, authorize('hr', 'admin'), sendCustomMessage);

module.exports = router;