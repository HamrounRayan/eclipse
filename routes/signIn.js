const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Participants = require('../models/participant');
const cookieParser = require('cookie-parser');

// Middleware to parse cookies
router.use(cookieParser());

// JWT secret, ideally from environment variables
const JWT_SECRET = 'your_jwt_secret';  // Replace with an environment variable in production

// POST request to handle login
router.post('/', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find participant by email
    const participant = await Participants.findOne({ email });
    if (!participant) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, participant.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: participant._id, admin: participant.admin },
      JWT_SECRET, 
      { expiresIn: '1d' }  // Token expires in 1 day
    );

    // Set JWT in a cookie
    res.cookie("jwt", token, {
      httpOnly: true,  // Can't be accessed via JavaScript
      secure: process.env.NODE_ENV === 'production',  // Set to true in production for secure cookies
      maxAge: 2 * 60 * 60 * 1000,  // Cookie expires in 2 hours
    });

    // Send user info along with JWT
    res.json({
      token,
      user: {
        id: participant._id,
        email: participant.email,
        admin: participant.admin
      }
    });

  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Middleware to protect routes and check JWT
function authenticate(req, res, next) {
  const token = req.cookies.jwt;  // Access the JWT token from the cookies

  if (!token) {
    return res.status(401).json({ message: 'Authorization denied. No token found.' });
  }

  try {
    // Verify the JWT token using the secret
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;  // Attach the decoded user info to the request
    next();  // Proceed to the next route handler
  } catch (err) {
    return res.status(400).json({ message: 'Invalid token.' });
  }
}

// Example of a protected route
router.get('/protected', authenticate, (req, res) => {
  res.status(200).json({ message: 'This is protected data', user: req.user });
});

// Logout route - to clear the JWT cookie
router.post('/logout', (req, res) => {
  res.clearCookie('jwt');  // Clear the JWT cookie
  res.status(200).json({ message: 'Logged out successfully' });
});

module.exports = router;
