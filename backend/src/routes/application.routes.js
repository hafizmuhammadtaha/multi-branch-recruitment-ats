const express = require('express');
const router = express.Router();
const { applyToJob, updateStatus } = require('../controllers/application.controller');
const { protect, authorize } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');

// Candidates apply with a PDF resume
router.post('/', protect, authorize('candidate'), upload.single('resume'), applyToJob);

// HR/Admin updates status
router.put('/:id/status', protect, authorize('hr', 'admin'), updateStatus);

module.exports = router;