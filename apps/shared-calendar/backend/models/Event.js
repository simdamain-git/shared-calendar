const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  dateTime: { type: Date, required: true },
  groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' },
  type: { type: String, enum: ['event', 'task', 'birthday'], required: true },
  repetition: { type: String, enum: ['once', 'daily', 'weekly', 'monthly', 'custom'], required: true },
  customRepetition: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

module.exports = mongoose.model('Event', eventSchema);
