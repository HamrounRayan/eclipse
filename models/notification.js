const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  participant: { type: String, required: true },
  events: { type: String, required: true },
  read: { type: Boolean, default: false },
  statuss: {
    type: String,
    enum: ['pending', 'accepted', 'refused'],
    default: 'pending',
  }
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
