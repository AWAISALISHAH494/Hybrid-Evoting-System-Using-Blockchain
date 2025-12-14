const express = require('express');
const router = express.Router();
const QRCode = require('qrcode');
const Vote = require('../models/Vote');
const Receipt = require('../models/Receipt');
const Election = require('../models/Election');
const User = require('../models/User');
const { encryptVote, generateHash, generateSignature } = require('../utils/crypto');
const { authenticate, requireVerified } = require('../middleware/auth');

/**
 * POST /api/vote
 * Cast a vote
 */
router.post('/', authenticate, requireVerified, async (req, res) => {
    try {
        const { electionId, candidateId } = req.body;

        // Validation
        if (!electionId || !candidateId) {
            return res.status(400).json({ error: 'Election ID and Candidate ID are required' });
        }

        // Check election exists and is active
        const election = await Election.findOne({ electionId });
        if (!election) {
            return res.status(404).json({ error: 'Election not found' });
        }

        const now = new Date();
        if (now < election.startDate || now > election.endDate) {
            return res.status(400).json({ error: 'Election is not currently active' });
        }

        // Check if user has already voted
        const user = await User.findOne({ userId: req.userId });
        if (user.hasVoted.get(electionId)) {
            return res.status(400).json({ error: 'You have already voted in this election' });
        }

        // Validate candidate
        const candidate = election.candidates.find(c => c.candidateId === candidateId);
        if (!candidate) {
            return res.status(400).json({ error: 'Invalid candidate' });
        }

        // Encrypt vote
        const voteData = JSON.stringify({
            electionId,
            candidateId,
            timestamp: new Date().toISOString()
        });

        const encryptedVote = encryptVote(voteData);
        const voteHash = generateHash(encryptedVote);

        // Generate receipt
        const receiptId = `RECEIPT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
        const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify/${receiptId}`;
        const digitalSignature = generateSignature(voteHash);

        // Generate QR code
        const qrCodeData = JSON.stringify({
            receiptId,
            voteHash,
            timestamp: new Date().toISOString()
        });
        const qrCode = await QRCode.toDataURL(qrCodeData);

        // Save vote
        const vote = new Vote({
            electionId,
            encryptedVote,
            voteHash,
            receiptId,
            ipAddress: req.ip || req.connection.remoteAddress
        });
        await vote.save();

        // Save receipt
        const receipt = new Receipt({
            receiptId,
            voteHash,
            electionId,
            digitalSignature,
            qrCode,
            verificationUrl
        });
        await receipt.save();

        // Mark user as voted
        user.hasVoted.set(electionId, true);
        await user.save();

        res.status(201).json({
            message: 'Vote cast successfully',
            receipt: {
                receiptId,
                voteHash,
                timestamp: vote.timestamp,
                digitalSignature,
                qrCode,
                verificationUrl
            }
        });

    } catch (error) {
        console.error('Vote casting error:', error);
        res.status(500).json({ error: 'Failed to cast vote' });
    }
});

/**
 * GET /api/vote/verify/:receiptId
 * Verify a vote receipt
 */
router.get('/verify/:receiptId', async (req, res) => {
    try {
        const receipt = await Receipt.findOne({ receiptId: req.params.receiptId });

        if (!receipt) {
            return res.status(404).json({ error: 'Receipt not found' });
        }

        // Find corresponding vote
        const vote = await Vote.findOne({ receiptId: receipt.receiptId });

        if (!vote) {
            return res.status(404).json({ error: 'Vote not found' });
        }

        // Verify hash matches
        const isValid = vote.voteHash === receipt.voteHash;

        // Mark receipt as verified
        if (!receipt.verified) {
            receipt.verified = true;
            await receipt.save();
        }

        res.json({
            verified: isValid,
            receipt: {
                receiptId: receipt.receiptId,
                voteHash: receipt.voteHash,
                timestamp: receipt.timestamp,
                electionId: receipt.electionId,
                blockchainTxHash: vote.blockchainTxHash || null
            }
        });

    } catch (error) {
        console.error('Receipt verification error:', error);
        res.status(500).json({ error: 'Failed to verify receipt' });
    }
});

/**
 * GET /api/vote/receipt/:receiptId
 * Get receipt details
 */
router.get('/receipt/:receiptId', authenticate, async (req, res) => {
    try {
        const receipt = await Receipt.findOne({ receiptId: req.params.receiptId });

        if (!receipt) {
            return res.status(404).json({ error: 'Receipt not found' });
        }

        res.json({ receipt });

    } catch (error) {
        console.error('Get receipt error:', error);
        res.status(500).json({ error: 'Failed to fetch receipt' });
    }
});

module.exports = router;
