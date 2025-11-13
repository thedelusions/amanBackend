const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verify-token');
const verifyAdmin = require('../middleware/verify-admin');
const Report = require('../models/report');
const User = require('../models/user');

// Get all reports
router.get('/', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const reports = await Report.find().populate('author', 'name email');
    res.status(200).json(reports);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching reports', error: err.message });
  }
});

// Approve a report
router.put('/:id/approve', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const report = await Report.findByIdAndUpdate(
      req.params.id,
      { status: 'approved' },
    );

    if (!report) return res.status(404).json({ message: 'Report not found' });

    res.status(200).json(report);
  } catch (err) {
    res.status(500).json({ message: 'Error approving report', error: err.message });
  }
});

// Reject a report
router.put('/:id/reject', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const report = await Report.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected' },
    );

    if (!report) return res.status(404).json({ message: 'Report not found' });

    res.status(200).json(report);
  } catch (err) {
    res.status(500).json({ message: 'Error rejecting report', error: err.message });
  }
});

// Mark a report as pending
router.put('/:id/pending', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const report = await Report.findByIdAndUpdate(
      req.params.id,
      { status: 'pending' },
    );

    if (!report) return res.status(404).json({ message: 'Report not found' });

    res.status(200).json(report);
  } catch (err) {
    res.status(500).json({ message: 'Error setting report to pending', error: err.message });
  }
});

//access all users
router.get('/users', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const users = await User.find({}).select('-hashedPassword');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "failed to fetch users" });
  }
});

module.exports = router;
