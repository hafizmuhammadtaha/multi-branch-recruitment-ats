const express = require('express');
const router = express.Router();
const { scheduleInterview, getInterviews } = require('../controllers/interview.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.route('/')
    .get(protect, getInterviews)
    .post(protect, authorize('hr', 'admin'), scheduleInterview);

module.exports = router;