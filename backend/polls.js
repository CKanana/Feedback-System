

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { Poll } = require('./schema');
const jwt = require('jsonwebtoken');

// Middleware to verify token
const auth = (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

// Get Active Polls
router.get('/', auth, async (req, res) => {
    try {
        const polls = await Poll.aggregate([
            { $match: { status: 'active' } },
            { $sort: { createdAt: -1 } },
            {
                $addFields: {
                    totalVotes: { $size: "$votedBy" },
                    userVote: {
                        $filter: {
                            input: "$votedBy",
                            as: "vote",
                            cond: { $eq: ["$$vote.user", new mongoose.Types.ObjectId(req.user.userId)] }
                        }
                    }
                }
            },
            {
                $project: {
                    question: 1,
                    options: 1,
                    anonymous: 1,
                    totalVotes: 1,
                    voted: { $arrayElemAt: ["$userVote.option", 0] }
                }
            }
        ]);

        // Format for frontend
        const formattedPolls = polls.map(poll => {
            return {
                id: poll._id,
                question: poll.question,
                options: poll.options.map(o => o.text),
                voted: poll.voted || null,
                anonymous: poll.anonymous,
                totalVotes: poll.totalVotes
            };
        });

        res.json(formattedPolls);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// Get polls relevant to the logged-in user (user or staff)
router.get('/my', auth, async (req, res) => {
    try {
        const userId = req.user.userId;
        const userDept = req.user.department;
        const polls = await Poll.find({
            $or: [
                { 'recipients.users': userId },
                { 'recipients.departments': userDept }
            ],
            status: 'active'
        }).sort({ createdAt: -1 });
        res.json(polls);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// Vote on a Poll
router.post('/:id/vote', auth, async (req, res) => {
    try {
        const { option } = req.body;
        const poll = await Poll.findById(req.params.id);

        if (poll.votedBy.some(v => v.user.toString() === req.user.userId)) {
            return res.status(400).json({ msg: 'Already voted' });
        }

        const optionIndex = poll.options.findIndex(o => o.text === option);
        if (optionIndex === -1) return res.status(400).json({ msg: 'Option not found' });

        poll.options[optionIndex].votes += 1;
        poll.votedBy.push({ user: req.user.userId, option });
        await poll.save();

        res.json(poll);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// Create Poll (Admin Only)
router.post('/', auth, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Access denied' });
    try {
        const { question, options, anonymous, recipients } = req.body;
        const newPoll = new Poll({
            question,
            options: options.map(text => ({ text, votes: 0 })),
            createdBy: req.user.userId,
            anonymous,
            recipients: recipients || { users: [], departments: [] }
        });
        const poll = await newPoll.save();
        res.json(poll);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// Poll results/analytics (admin only)
router.get('/:id/results', auth, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Access denied' });
    try {
        const poll = await Poll.findById(req.params.id);
        if (!poll) return res.status(404).json({ msg: 'Poll not found' });
        // Build results summary
        const results = poll.options.map(opt => ({
            text: opt.text,
            votes: opt.votes || 0
        }));
        res.json({
            question: poll.question,
            totalVotes: poll.votedBy.length,
            options: results
        });
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// List all polls created by this admin (admin only, all statuses)
router.get('/all', auth, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Access denied' });
    try {
        const polls = await Poll.find({ createdBy: req.user.userId }).sort({ createdAt: -1 });
        res.json(polls);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// Get poll details (admin only)
router.get('/:id', auth, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Access denied' });
    try {
        const poll = await Poll.findById(req.params.id);
        if (!poll) return res.status(404).json({ msg: 'Poll not found' });
        res.json(poll);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// Edit Poll (Admin Only)
router.put('/:id', auth, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Access denied' });
    try {
        const { question, options, anonymous, status } = req.body;
        const poll = await Poll.findById(req.params.id);
        if (!poll) return res.status(404).json({ msg: 'Poll not found' });
        if (question !== undefined) poll.question = question;
        if (options !== undefined) poll.options = options.map(text => ({ text }));
        if (anonymous !== undefined) poll.anonymous = anonymous;
        if (status !== undefined) poll.status = status;
        await poll.save();
        res.json(poll);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// Delete Poll (Admin Only)
router.delete('/:id', auth, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Access denied' });
    try {
        const poll = await Poll.findByIdAndDelete(req.params.id);
        if (!poll) return res.status(404).json({ msg: 'Poll not found' });
        res.json({ msg: 'Poll deleted' });
    } catch (err) {
        res.status(500).send('Server error');
    }
});

module.exports = router;
