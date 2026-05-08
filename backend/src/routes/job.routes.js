const express = require('express');
const router = express.Router();
const { createJob, getJobs } = require('../controllers/job.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.route('/')
    .get(getJobs)
    .post(protect, authorize('hr', 'admin'), createJob);

module.exports = router;