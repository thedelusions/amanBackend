const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
    report_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Report',
        required: true,
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    comment_text: {
        type: String,
        required: true,
    },
}, {
    timestamps: { createdAt: 'created_at', updatedAt: false },
    toJSON: {
      transform: function(doc, ret) {
        ret.created_at = new Date(ret.created_at).toLocaleString();
        return ret;
      }
    }
  });

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;