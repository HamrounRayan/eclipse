const mongoose = require('mongoose');

const participantSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  admin: {
    type: Boolean,
    default: false,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  }
});

module.exports = mongoose.model('Participant', participantSchema);
