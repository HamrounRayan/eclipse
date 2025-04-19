const express = require('express');
const router = express.Router();
const Notification = require('../models/notification');

router.post('/', async (req, res) => {
    const { participant, events, read, statuss } = req.body;
  
    try {
      const newNotification = new Notification({ participant, events, read, statuss });
      await newNotification.save();
      res.status(201).json({ message: "Notification created successfully", newNotification });
    } catch (error) {
      res.status(400).json({ message: "Error creating notification", error });
    }
  });
  

router.get('/', async (req, res) => {
    try {
        const notifications = await Notification.find();
        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ message: "Error fetching notifications", error });
    }
});

module.exports = router;