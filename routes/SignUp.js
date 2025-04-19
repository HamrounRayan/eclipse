const express = require('express');
const router = express.Router();
const Participants = require('../models/participant');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Load from env instead of hardcoding secrets
const JWT_SECRET = process.env.JWT_SECRET || 'hebbelna_debban'; 

router.post('/', async (req, res) => {
  try {
    const { fullName, email, admin, password } = req.body;

    if (!password || password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }

    const existingUser = await Participants.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const participant = new Participants({
      fullName,
      email,
      admin: admin || false,
      password: hashedPassword
    });

    await participant.save();

    const token = jwt.sign(
      { id: participant._id, admin: participant.admin },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // for HTTPS only in production
      sameSite: 'strict',
      maxAge: 2 * 60 * 60 * 1000 // 2 hours
    });

    res.status(201).json({
      token,
      user: {
        id: participant._id,
        email: participant.email,
        admin: participant.admin
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});


module.exports = router;
