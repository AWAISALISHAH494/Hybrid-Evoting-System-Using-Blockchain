const express = require('express');
const router = express.Router();
const Receipt = require('../models/Receipt');
const merkleService = require('../utils/merkle');

/**
 * POST /api/verify/merkle
 * Verify a vote using Merkle proof
 */
router.post('/merkle', async (req, res) => {
    try {
        const { receiptId } = req.body;

        if (!receiptId) {
            return res.status(400).json({ error: 'Receipt ID is required' });
        }

        // Get receipt with Merkle proof
        const receipt = await Receipt.findOne({ receiptId });

        if (!receipt) {
            return res.status(404).json({ error: 'Receipt not found' });
        }

        if (!receipt.merkleProof || !receipt.merkleRoot) {
            return res.status(400).json({
                error: 'Merkle proof not available. Election may not be finalized yet.'
            });
        }

        // Verify the Merkle proof
        const isValid = merkleService.verifyProof(
            receipt.voteHash,
            receipt.merkleProof,
            receipt.merkleRoot
        );

        res.json({
            verified: isValid,
            receiptId: receipt.receiptId,
            voteHash: receipt.voteHash,
            merkleRoot: receipt.merkleRoot,
            merkleProof: receipt.merkleProof,
            timestamp: receipt.timestamp,
            message: isValid
                ? '✅ Vote verified! Your vote is cryptographically proven to be included in the final results.'
                : '❌ Verification failed. Vote may have been tampered with.'
        });

    } catch (error) {
        console.error('Merkle verification error:', error);
        res.status(500).json({ error: 'Failed to verify Merkle proof' });
    }
});

module.exports = router;
