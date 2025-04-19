const express = require('express');
const router = express.Router();
const Event = require('../models/eveent');
const xlsx = require('xlsx');
const mongoose = require('mongoose');
const Eveent = require('../models/eveent');

router.post('/', async (req, res) => {
    const { title, description, date, location, responsible_person, status, type, duration } = req.body;

    try {
        const newEvent = new Event({ title, description, date, location, responsible_person, status, type, duration });
        await newEvent.save();
        res.status(201).json({ message: "Event created successfully", newEvent });
    } catch (error) {
        res.status(400).json({ message: "Error creating event", error });
    }
});

router.get('/', async (req, res) => {
    try {
        const events = await Event.find();
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ message: "Error fetching events", error });
    }
});

module.exports = router;