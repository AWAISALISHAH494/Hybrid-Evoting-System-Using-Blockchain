const express = require('express');
const router = express.Router();
const Receipt = require('../models/Receipt');
const Vote = require('../models/Vote');

/**
 * GET /api/explorer/recent
 * Get recent vote transactions
 */
router.get('/recent', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 20;

        // Get recent receipts
        const receipts = await Receipt.find()
            .sort({ timestamp: -1 })
            .limit(limit)
            .select('receiptId voteHash timestamp electionId blockchainTxHash');

        res.json({
            transactions: receipts,
            count: receipts.length
        });

    } catch (error) {
        console.error('Explorer error:', error);
        res.status(500).json({ error: 'Failed to fetch transactions' });
    }
});

/**
 * GET /api/explorer/stats
 * Get blockchain statistics
 */
router.get('/stats', async (req, res) => {
    try {
        const totalVotes = await Vote.countDocuments();
        const totalReceipts = await Receipt.countDocuments();
        const verifiedReceipts = await Receipt.countDocuments({ verified: true });

        res.json({
            totalVotes,
            totalReceipts,
            verifiedReceipts,
            verificationRate: totalReceipts > 0
                ? ((verifiedReceipts / totalReceipts) * 100).toFixed(2)
                : 0
        });

    } catch (error) {
        console.error('Stats error:', error);
        res.status(500).json({ error: 'Failed to fetch stats' });
    }
});

module.exports = router;
