const express = require('express');
const router = express.Router();
const Accepted = require('../models/accepted');

router.post('/', async (req, res) => {
    const { participant, events, qrcode } = req.body;

    try {
        const newAccepted = new Accepted({ participant, events, qrcode });
        await newAccepted.save();
        res.status(201).json({ message: "Participant accepted successfully", newAccepted });
    } catch (error) {
        res.status(400).json({ message: "Error accepting participant", error });
    }
});

router.get('/', async (req, res) => {
    try {
        const acceptedParticipants = await Accepted.find();
        res.status(200).json(acceptedParticipants);
    } catch (error) {
        res.status(500).json({ message: "Error fetching accepted participants", error });
    }
});

module.exports = router;