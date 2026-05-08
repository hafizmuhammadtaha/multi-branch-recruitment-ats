const express = require('express');
const router = express.Router();
const { createBranch, getBranches } = require('../controllers/branch.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

// GET all branches and POST a new branch
router.route('/')
    .get(getBranches)
    .post(protect, authorize('admin'), createBranch);

module.exports = router;