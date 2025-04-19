const mongoose = require('mongoose');

const eveentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
    unique: true,
  },
  date: {
    type: Date,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  responsible_person: {
    type: String,
    required: true,
  },
  status: {
    type: Boolean,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  }
});

module.exports = mongoose.model('eveent', eveentSchema);
