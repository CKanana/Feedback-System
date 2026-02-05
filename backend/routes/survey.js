const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { Survey, SurveyDraft } = require('../schema');
const jwt = require('jsonwebtoken');

// Middleware to verify token and admin role
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

// Get all surveys created by the logged-in admin (with responses for analytics)
router.get('/all', auth, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Access denied' });
    try {
        const surveys = await Survey.find({ createdBy: req.user.userId })
            .populate('responses.user', 'name email')
            .sort({ createdAt: -1 });
        res.json(surveys);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// Get surveys relevant to the logged-in user (user or staff)
router.get('/my', auth, async (req, res) => {
    try {
        const userId = req.user.userId;
        const userDept = req.user.department;
        const surveys = await Survey.find({
            $or: [
                { 'recipients.users': userId },
                { 'recipients.departments': userDept }
            ]
        }).sort({ createdAt: -1 });
        res.json(surveys);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// Create Survey (Admin Only)
router.post('/', auth, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Access denied' });
    try {
        const { title, description, questions, recipients } = req.body;
        const newSurvey = new Survey({
            title,
            description,
            questions,
            createdBy: req.user.userId,
            recipients: recipients || { users: [], departments: [] }
        });
        const survey = await newSurvey.save();
        res.json(survey);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// Delete Survey (Admin Only)
router.delete('/:id', auth, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Access denied' });
    try {
        const survey = await Survey.findByIdAndDelete(req.params.id);
        if (!survey) return res.status(404).json({ msg: 'Survey not found' });
        res.json({ msg: 'Survey deleted' });
    } catch (err) {
        res.status(500).send('Server error');
    }
});

module.exports = router;
