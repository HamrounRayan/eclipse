const jwt = require('jsonwebtoken');

function authenticate(req, res, next) {
  const token = req.cookies.jwt;

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'hebbelna_debban');
    req.user = decoded; // Attach decoded user info to request
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
}

module.exports = authenticate;
