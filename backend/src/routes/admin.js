const express = require('express');
const router = express.Router();
const Election = require('../models/Election');
const Vote = require('../models/Vote');
const { authenticate, requireAdmin } = require('../middleware/auth');
const { decryptVote, generateHash } = require('../utils/crypto');

/**
 * GET /api/admin/analytics/:electionId
 * Get election analytics
 */
router.get('/analytics/:electionId', authenticate, requireAdmin, async (req, res) => {
    try {
        const { electionId } = req.params;

        const election = await Election.findOne({ electionId });
        if (!election) {
            return res.status(404).json({ error: 'Election not found' });
        }

        // Get all votes for this election
        const votes = await Vote.find({ electionId });

        // Count votes per candidate (decrypt and tally)
        const results = {};
        election.candidates.forEach(c => {
            results[c.candidateId] = {
                name: c.name,
                party: c.party,
                votes: 0
            };
        });

        votes.forEach(vote => {
            try {
                const decrypted = decryptVote(vote.encryptedVote);
                const voteData = JSON.parse(decrypted);
                if (results[voteData.candidateId]) {
                    results[voteData.candidateId].votes++;
                }
            } catch (error) {
                console.error('Error decrypting vote:', error);
            }
        });

        // Calculate statistics
        const totalVotes = votes.length;
        const votesPerHour = {};

        votes.forEach(vote => {
            const hour = new Date(vote.timestamp).getHours();
            votesPerHour[hour] = (votesPerHour[hour] || 0) + 1;
        });

        res.json({
            election: {
                title: election.title,
                status: election.status
            },
            totalVotes,
            results: Object.values(results),
            votesPerHour,
            startDate: election.startDate,
            endDate: election.endDate
        });

    } catch (error) {
        console.error('Analytics error:', error);
        res.status(500).json({ error: 'Failed to fetch analytics' });
    }
});

/**
 * POST /api/admin/finalize/:electionId
 * Finalize election results and store on blockchain
 */
router.post('/finalize/:electionId', authenticate, requireAdmin, async (req, res) => {
    try {
        const { electionId } = req.params;

        const election = await Election.findOne({ electionId });
        if (!election) {
            return res.status(404).json({ error: 'Election not found' });
        }

        if (election.status === 'finalized') {
            return res.status(400).json({ error: 'Election already finalized' });
        }

        // Get all votes
        const votes = await Vote.find({ electionId });

        // Tally results
        const results = {};
        election.candidates.forEach(c => {
            results[c.candidateId] = 0;
        });

        votes.forEach(vote => {
            try {
                const decrypted = decryptVote(vote.encryptedVote);
                const voteData = JSON.parse(decrypted);
                if (results[voteData.candidateId] !== undefined) {
                    results[voteData.candidateId]++;
                }
            } catch (error) {
                console.error('Error decrypting vote:', error);
            }
        });

        // Generate result hash for blockchain
        const resultData = JSON.stringify({
            electionId,
            results,
            totalVotes: votes.length,
            timestamp: new Date().toISOString()
        });

        const resultHash = generateHash(resultData);

        // Build Merkle tree from vote hashes
        console.log('🌳 Building Merkle tree from vote hashes...');
        const merkleService = require('../utils/merkle');
        const Receipt = require('../models/Receipt');
        const voteHashes = votes.map(v => v.voteHash);
        const { tree, root, leaves } = merkleService.buildTree(voteHashes);

        console.log(`✅ Merkle tree built. Root: ${root}`);
        console.log(`📊 Total votes in tree: ${voteHashes.length}`);

        // Generate Merkle proofs for all receipts
        console.log('🔐 Generating Merkle proofs for receipts...');
        const receipts = await Receipt.find({ electionId });
        for (const receipt of receipts) {
            const vote = votes.find(v => v.receiptId === receipt.receiptId);
            if (vote) {
                const proof = merkleService.generateProof(tree, vote.voteHash);
                receipt.merkleProof = proof;
                receipt.merkleRoot = root;
                await receipt.save();
            }
        }
        console.log(`✅ Generated ${receipts.length} Merkle proofs`);

        // Store on blockchain (use Merkle root)
        console.log('📡 Storing Merkle root on Sepolia blockchain...');
        const blockchainService = require('../services/blockchain');

        let blockchainTxHash = null;
        try {
            const blockchainResult = await blockchainService.storeElectionResult(
                electionId,
                root, // Store Merkle root on blockchain
                votes.length
            );

            blockchainTxHash = blockchainResult.txHash;
            console.log(`✅ Blockchain storage successful! TX: ${blockchainTxHash}`);
        } catch (blockchainError) {
            console.error('⚠️ Blockchain storage failed:', blockchainError.message);
            // Continue anyway - results are still stored locally
        }

        // Update election
        election.status = 'finalized';
        election.resultHash = resultHash;
        election.merkleRoot = root;
        election.blockchainTxHash = blockchainTxHash;
        await election.save();

        res.json({
            message: 'Election finalized successfully',
            resultHash,
            blockchainTxHash,
            results,
            totalVotes: votes.length,
            etherscanUrl: blockchainTxHash
                ? `https://sepolia.etherscan.io/tx/${blockchainTxHash}`
                : null
        });

    } catch (error) {
        console.error('Finalize election error:', error);
        res.status(500).json({ error: 'Failed to finalize election' });
    }
});

/**
 * POST /api/admin/manual-votes
 * Add manual votes (paper ballots)
 */
router.post('/manual-votes', authenticate, requireAdmin, async (req, res) => {
    try {
        const { electionId, votes } = req.body;

        // Validation
        if (!electionId || !votes || !Array.isArray(votes)) {
            return res.status(400).json({ error: 'Invalid request data' });
        }

        const election = await Election.findOne({ electionId });
        if (!election) {
            return res.status(404).json({ error: 'Election not found' });
        }

        // Process manual votes
        const manualVotes = [];

        for (const manualVote of votes) {
            const { candidateId, count } = manualVote;

            // Validate candidate
            const candidate = election.candidates.find(c => c.candidateId === candidateId);
            if (!candidate) {
                continue;
            }

            // Create encrypted votes for each manual vote
            for (let i = 0; i < count; i++) {
                const voteData = JSON.stringify({
                    electionId,
                    candidateId,
                    timestamp: new Date().toISOString(),
                    source: 'manual'
                });

                const encryptedVote = require('../utils/crypto').encryptVote(voteData);
                const voteHash = generateHash(encryptedVote);
                const receiptId = `MANUAL-RECEIPT-${Date.now()}-${i}`;

                const vote = new Vote({
                    electionId,
                    encryptedVote,
                    voteHash,
                    receiptId,
                    ipAddress: 'manual-entry'
                });

                await vote.save();
                manualVotes.push(vote);
            }
        }

        res.json({
            message: `${manualVotes.length} manual votes added successfully`,
            count: manualVotes.length
        });

    } catch (error) {
        console.error('Manual votes error:', error);
        res.status(500).json({ error: 'Failed to add manual votes' });
    }
});

module.exports = router;
