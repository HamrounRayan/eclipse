const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');


// Import routes
const eventRoutes = require('./routes/eveent');
const requestRoutes = require('./routes/accepted');
const signUPRoutes = require('./routes/SignUp');
const notificationRoutes = require('./routes/notification');
const signINRoutes = require('./routes/signIn');
const dashboardRoutes = require('./routes/dashboard');

const app = express();
const PORT = 3000;
const MONGODB_URI = 'mongodb+srv://eclipse:eclipse@cluster0.ojrzavk.mongodb.net/your-db-name?retryWrites=true&w=majority';
const JWT_SECRET = 'your_jwt_secret';  // You should replace this with a secure environment variable

// Middleware
app.use(express.json());
app.use(cookieParser());

// MongoDB connection
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Connected to MongoDB Atlas'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Routes
app.use('/api/events', eventRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/signUp', signUPRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/signIn', signINRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Login Route - Set JWT in cookie
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  // Your authentication logic here
  if (username === 'user' && password === 'password') {
    // Create a JWT token
    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });

    // Set JWT in a cookie
    res.cookie('auth_token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

    return res.status(200).json({ message: 'Logged in successfully' });
  }

  return res.status(400).json({ message: 'Invalid credentials' });
});

// Middleware to protect routes by verifying JWT token from cookies
function authenticate(req, res, next) {
  const token = req.cookies.auth_token;  // Access the JWT token from the cookies

  if (!token) {
    return res.status(401).json({ message: 'No token found, authorization denied' });
  }

  try {
    // Verify the JWT token using the secret
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Attach the decoded user information to the request
    next(); // Proceed to the next route handler
  } catch (error) {
    return res.status(400).json({ message: 'Invalid token' });
  }
}

// Example of a protected route
app.get('/api/protected', authenticate, (req, res) => {
  res.status(200).json({ message: 'Protected data', user: req.user });
});

// Logout Route - Clear JWT from cookies
app.post('/api/logout', (req, res) => {
  res.clearCookie('auth_token');  // Clear the JWT cookie
  res.status(200).json({ message: 'Logged out successfully' });
});

// Basic Route
app.get('/', (req, res) => {
  res.send('🎉 Event Management API is live!');
});

// Global Error Handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 Route
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start the Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
