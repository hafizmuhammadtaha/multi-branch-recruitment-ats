const Branch = require('../models/branch.model');

// @desc    Create a new branch (Admin only)
// @route   POST /api/branches
exports.createBranch = async (req, res, next) => {
    try {
        const { name } = req.body;
        const branchExists = await Branch.findOne({ name });

        if (branchExists) {
            res.status(400);
            throw new Error('Branch already exists');
        }

        const branch = await Branch.create({ name });
        res.status(201).json({ success: true, data: branch });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all branches
// @route   GET /api/branches
exports.getBranches = async (req, res, next) => {
    try {
        const branches = await Branch.find();
        res.status(200).json({ success: true, data: branches });
    } catch (error) {
        next(error);
    }
};