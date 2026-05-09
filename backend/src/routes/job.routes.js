const express = require('express');
const router = express.Router();
const { createJob, getJobs, getJobById, updateJob, deleteJob } = require('../controllers/job.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.route('/')
    .get(getJobs)
    .post(protect, authorize('hr', 'admin'), createJob);

router.route('/:id')
    .get(getJobById)
    .put(protect, authorize('hr', 'admin'), updateJob)
    .delete(protect, authorize('hr', 'admin'), deleteJob);

module.exports = router;