const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
    trim: true
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastUpdatedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

noteSchema.pre('save', function(next) {
  if (this.isModified('content') || this.isModified('title')) {
    this.lastUpdatedAt = new Date();
  }
  next();
});

module.exports = mongoose.model('Note', noteSchema);
