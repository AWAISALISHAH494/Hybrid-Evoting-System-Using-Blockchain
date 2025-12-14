const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { authenticate } = require('../middleware/auth');

/**
 * POST /api/auth/register
 * Register a new voter
 */
router.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        if (password.length < 8) {
            return res.status(400).json({ error: 'Password must be at least 8 characters' });
        }

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = new User({
            email,
            password: hashedPassword,
            role: 'voter'
        });

        await user.save();

        // Generate OTP for verification (in production, send via email)
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.otp = {
            code: otp,
            expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
        };
        await user.save();

        // Log OTP in development mode
        if (process.env.NODE_ENV === 'development') {
            console.log('\n🔐 ===== REGISTRATION OTP =====');
            console.log(`📧 Email: ${email}`);
            console.log(`🔑 OTP Code: ${otp}`);
            console.log(`⏰ Expires: ${user.otp.expiresAt.toLocaleString()}`);
            console.log('==============================\n');
        }

        res.status(201).json({
            message: 'Registration successful. Please verify your email.',
            userId: user.userId,
            otp: process.env.NODE_ENV === 'development' ? otp : undefined // Only in dev
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
});

/**
 * POST /api/auth/login
 * Login user
 */
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Check password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate OTP for 2FA
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.otp = {
            code: otp,
            expiresAt: new Date(Date.now() + 10 * 60 * 1000)
        };
        await user.save();

        // Log OTP in development mode
        if (process.env.NODE_ENV === 'development') {
            console.log('\n🔐 ===== LOGIN OTP =====');
            console.log(`📧 Email: ${email}`);
            console.log(`🔑 OTP Code: ${otp}`);
            console.log(`⏰ Expires: ${user.otp.expiresAt.toLocaleString()}`);
            console.log('=======================\n');
        }

        res.json({
            message: 'OTP sent. Please verify to complete login.',
            userId: user.userId,
            requiresOTP: true,
            otp: process.env.NODE_ENV === 'development' ? otp : undefined
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});

/**
 * POST /api/auth/verify-otp
 * Verify OTP and complete login
 */
router.post('/verify-otp', async (req, res) => {
    try {
        const { userId, otp } = req.body;

        const user = await User.findOne({ userId });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Check OTP
        if (!user.otp || user.otp.code !== otp) {
            return res.status(401).json({ error: 'Invalid OTP' });
        }

        if (new Date() > user.otp.expiresAt) {
            return res.status(401).json({ error: 'OTP expired' });
        }

        // Mark as verified
        user.isVerified = true;
        user.otp = undefined;
        await user.save();

        // Generate JWT
        const token = jwt.sign(
            { userId: user.userId, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            message: 'Login successful',
            token,
            user: {
                userId: user.userId,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error('OTP verification error:', error);
        res.status(500).json({ error: 'Verification failed' });
    }
});

/**
 * GET /api/auth/me
 * Get current user
 */
router.get('/me', authenticate, async (req, res) => {
    res.json({
        user: {
            userId: req.user.userId,
            email: req.user.email,
            role: req.user.role,
            isVerified: req.user.isVerified
        }
    });
});

/**
 * POST /api/auth/logout
 * Logout user (client-side token removal)
 */
router.post('/logout', authenticate, (req, res) => {
    res.json({ message: 'Logout successful' });
});

module.exports = router;
