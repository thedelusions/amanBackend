const express = require('express');
const router = express.Router();

const Comment = require('../models/comment');
const verifyToken = require('../middleware/verify-token');

router.post('/', verifyToken, async (req, res) => {
    try {
        const { report_id, comment_text } = req.body;
        const comment = await Comment.create({
            report_id,
            user_id: req.user._id,
            comment_text,
        });

        res.status(201).json(comment);
    } catch (err) {
        res.status(500).json({message: 'Error Creating comment', error: err.message });

    }
    });

router.get('/:report_id', async (req, res) => {
    try {
        const comments = await Comment.find({ reports_id: req.params.report_id })
        .populate('user_id', 'name')
        .sort({ created_at: -1});

    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json({ message: 'Error getting comments', error: err.message });
  }
});
