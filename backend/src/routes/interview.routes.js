const express = require('express');
const router = express.Router();
const { scheduleInterview } = require('../controllers/interview.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.post('/', protect, authorize('hr', 'admin'), scheduleInterview);

module.exports = router;