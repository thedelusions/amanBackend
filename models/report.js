const mongoose = require('mongoose');

const reportSchema = mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    require: true,
  }, 
  areaName: {
    type: String,
    require: true,
  },
  title: {
    type: String,
    require: true,
  },
  type: {
    type: String,
    enum: ['suspicious', 'lost', 'found', 'other'],
    require: true,
  },
  description: {
    type: String,
    require: true,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
});

const Report = mongoose.model('Report', reportSchema);

module.exports = Report;
