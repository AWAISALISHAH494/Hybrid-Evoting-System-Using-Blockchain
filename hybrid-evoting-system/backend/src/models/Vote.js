const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
    voteId: {
        type: String,
        required: true,
        unique: true,
        default: () => `VOTE-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    },
    electionId: {
        type: String,
        required: true,
        index: true
    },
    encryptedVote: {
        type: String,
        required: true
    },
    voteHash: {
        type: String,
        required: true,
        unique: true
    },
    receiptId: {
        type: String,
        required: true,
        unique: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    ipAddress: {
        type: String,
        required: true
    },
    blockchainTxHash: {
        type: String,
        default: null
    }
});

// Index for faster queries
voteSchema.index({ electionId: 1, timestamp: -1 });

module.exports = mongoose.model('Vote', voteSchema);
