const express = require('express');
const router = express.Router();
const Election = require('../models/Election');
const { authenticate, requireAdmin } = require('../middleware/auth');

/**
 * GET /api/elections
 * Get all elections
 */
router.get('/', authenticate, async (req, res) => {
    try {
        const elections = await Election.find()
            .select('-__v')
            .sort({ createdAt: -1 });

        res.json({ elections });
    } catch (error) {
        console.error('Get elections error:', error);
        res.status(500).json({ error: 'Failed to fetch elections' });
    }
});

/**
 * GET /api/elections/:id
 * Get election by ID
 */
router.get('/:id', authenticate, async (req, res) => {
    try {
        const election = await Election.findOne({ electionId: req.params.id });

        if (!election) {
            return res.status(404).json({ error: 'Election not found' });
        }

        res.json({ election });
    } catch (error) {
        console.error('Get election error:', error);
        res.status(500).json({ error: 'Failed to fetch election' });
    }
});

/**
 * POST /api/elections
 * Create new election (Admin only)
 */
router.post('/', authenticate, requireAdmin, async (req, res) => {
    try {
        const { title, description, candidates, startDate, endDate } = req.body;

        // Validation
        if (!title || !description || !candidates || !startDate || !endDate) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        if (candidates.length < 2) {
            return res.status(400).json({ error: 'At least 2 candidates required' });
        }

        if (new Date(startDate) >= new Date(endDate)) {
            return res.status(400).json({ error: 'End date must be after start date' });
        }

        // Create election
        const election = new Election({
            title,
            description,
            candidates: candidates.map((c, index) => ({
                candidateId: `CANDIDATE-${Date.now()}-${index}`,
                name: c.name,
                party: c.party || 'Independent',
                photo: c.photo || ''
            })),
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            createdBy: req.userId
        });

        await election.save();

        res.status(201).json({
            message: 'Election created successfully',
            election
        });

    } catch (error) {
        console.error('Create election error:', error);
        res.status(500).json({ error: 'Failed to create election' });
    }
});

/**
 * PUT /api/elections/:id
 * Update election (Admin only)
 */
router.put('/:id', authenticate, requireAdmin, async (req, res) => {
    try {
        const { title, description, candidates, startDate, endDate, status } = req.body;

        const election = await Election.findOne({ electionId: req.params.id });

        if (!election) {
            return res.status(404).json({ error: 'Election not found' });
        }

        // Update fields
        if (title) election.title = title;
        if (description) election.description = description;
        if (candidates) election.candidates = candidates;
        if (startDate) election.startDate = new Date(startDate);
        if (endDate) election.endDate = new Date(endDate);
        if (status) election.status = status;

        await election.save();

        res.json({
            message: 'Election updated successfully',
            election
        });

    } catch (error) {
        console.error('Update election error:', error);
        res.status(500).json({ error: 'Failed to update election' });
    }
});

/**
 * DELETE /api/elections/:id
 * Delete election (Admin only)
 */
router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
    try {
        const election = await Election.findOneAndDelete({ electionId: req.params.id });

        if (!election) {
            return res.status(404).json({ error: 'Election not found' });
        }

        res.json({ message: 'Election deleted successfully' });

    } catch (error) {
        console.error('Delete election error:', error);
        res.status(500).json({ error: 'Failed to delete election' });
    }
});

module.exports = router;
