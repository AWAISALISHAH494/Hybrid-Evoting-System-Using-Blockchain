const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Middleware to verify JWT token and authenticate user
 */
async function authenticate(req, res, next) {
    try {
        // Get token from header
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ error: 'No authentication token provided' });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find user
        const user = await User.findOne({ userId: decoded.userId });

        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }

        // Attach user to request
        req.user = user;
        req.userId = user.userId;

        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid authentication token' });
    }
}

/**
 * Middleware to check if user is admin
 */
function requireAdmin(req, res, next) {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
    }
    next();
}

/**
 * Middleware to check if user is verified
 */
function requireVerified(req, res, next) {
    if (!req.user.isVerified) {
        return res.status(403).json({ error: 'Email verification required' });
    }
    next();
}

module.exports = {
    authenticate,
    requireAdmin,
    requireVerified
};
