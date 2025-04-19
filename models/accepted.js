const mongoose = require('mongoose');

const acceptedSchema = new mongoose.Schema({
    participant: {
        type: String,
        required: true,
    },
    events: {
        type: String,
        required: true,
    },
    qrcode: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model('accepted', acceptedSchema);