const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true,
        default: () => `USER-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['voter', 'admin'],
        default: 'voter'
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    hasVoted: {
        type: Map,
        of: Boolean,
        default: new Map()
    },
    otp: {
        code: String,
        expiresAt: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update timestamp on save
userSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('User', userSchema);
