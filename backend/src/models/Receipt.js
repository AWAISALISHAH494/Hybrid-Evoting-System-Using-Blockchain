const mongoose = require('mongoose');

const receiptSchema = new mongoose.Schema({
    receiptId: {
        type: String,
        required: true,
        unique: true,
        default: () => `RECEIPT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
    },
    voteHash: {
        type: String,
        required: true
    },
    electionId: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    digitalSignature: {
        type: String,
        required: true
    },
    qrCode: {
        type: String, // base64 encoded QR code
        required: true
    },
    verificationUrl: {
        type: String,
        required: true
    },
    verified: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('Receipt', receiptSchema);
