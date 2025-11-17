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
        const comments = await Comment.find({ report_id: req.params.report_id })
        // replace user_id ObjectId with actual user information (we only show their name)
        .populate('user_id', 'name')
         // show newest comments at the top
        .sort({ created_at: -1});

    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json({ message: 'Error getting comments', error: err.message });
  }
});

router.delete('/:id', verifyToken , async (req, res) => {
    try {
        await Comment.findByIdAndDelete(req.params.id);
        res.status(200).json({message: 'Comment deleted'});

    }  catch (err) {
        res.status(500).jsonn({ message: 'Error deleting comment', error: err.message });
    }
});

module.exports = router;

