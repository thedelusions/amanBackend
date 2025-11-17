const mongoose = require('mongoose');
const areasFile = require('./bh.json');

const areas = areasFile.map(a => a.city);

const reportSchema = mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }, 
  area: {
    type: String,
    enum: areas,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['suspicious', 'lost', 'found', 'other'],
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: {
      transform: function(doc, ret) {
        ret.created_at = new Date(ret.created_at).toLocaleString();
        ret.updated_at = new Date(ret.updated_at).toLocaleString();
        return ret;
      }
    }
  });

const Report = mongoose.model('Report', reportSchema);

module.exports = Report;
