const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

// Protect routes - Verify JWT
const protect = async (req, res, next) => {
    let token = req.headers.authorization?.split(' ')[1];

    if (!token) return res.status(401).json({ message: "Not authorized, no token" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password');
        next();
    } catch (error) {
        res.status(401).json({ message: "Not authorized, token failed" });
    }
};

// Role-Based Access Control (RBAC) [cite: 146]
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: `Role ${req.user.role} is not authorized` });
        }
        next();
    };
};

module.exports = { protect, authorize };