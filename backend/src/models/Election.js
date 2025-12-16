const mongoose = require('mongoose');

const electionSchema = new mongoose.Schema({
    electionId: {
        type: String,
        required: true,
        unique: true,
        default: () => `ELECTION-${Date.now()}`
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    candidates: [{
        candidateId: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        party: {
            type: String,
            default: 'Independent'
        },
        photo: {
            type: String,
            default: ''
        }
    }],
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'active', 'ended', 'finalized'],
        default: 'pending'
    },
    createdBy: {
        type: String,
        required: true
    },
    blockchainTxHash: {
        type: String,
        default: null
    },
    resultHash: {
        type: String,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Virtual property to calculate current status
electionSchema.virtual('currentStatus').get(function () {
    const now = new Date();

    if (this.status === 'finalized') {
        return 'finalized';
    }

    if (now < this.startDate) {
        return 'pending';
    } else if (now >= this.startDate && now <= this.endDate) {
        return 'active';
    } else {
        return 'ended';
    }
});

// Update status before saving
electionSchema.pre('save', function (next) {
    const now = new Date();

    // Don't override finalized status
    if (this.status === 'finalized') {
        return next();
    }

    if (now < this.startDate) {
        this.status = 'pending';
    } else if (now >= this.startDate && now <= this.endDate) {
        this.status = 'active';
    } else if (now > this.endDate) {
        this.status = 'ended';
    }

    next();
});

// Enable virtuals in JSON
electionSchema.set('toJSON', { virtuals: true });
electionSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Election', electionSchema);
