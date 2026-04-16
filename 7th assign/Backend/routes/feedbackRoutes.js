const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');

// @route   GET /api/feedback
// @desc    Get all student feedback/reviews
router.get('/', async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.status(200).json(feedbacks);
  } catch (error) {
    console.error('Fetch error:', error);
    res.status(500).json({ message: 'Server error retrieving feedback' });
  }
});

// @route   POST /api/feedback
// @desc    Submit a new feedback review
router.post('/', async (req, res) => {
  try {
    const { courseName, studentName, rating, comments } = req.body;

    if (!courseName || !studentName || !rating || !comments) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const newFeedback = new Feedback({
      courseName,
      studentName,
      rating,
      comments
    });

    const savedFeedback = await newFeedback.save();
    res.status(201).json(savedFeedback);
  } catch (error) {
    console.error('Submit error:', error);
    res.status(500).json({ message: 'Server error submitting feedback' });
  }
});

module.exports = router;
