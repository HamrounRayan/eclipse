const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const Notification = require('../models/notification');
const isAdmin = require('../middleware/isAdmin')

router.get('/',authenticate,isAdmin, async (req, res) => {
  try {
    const notifications = await Notification.find();
    
    res.status(200).json({
      message: 'Welcome to your dashboard',
      notifications,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error loading dashboard', error });
  }
});

module.exports = router;
