
function isAdmin(req, res, next) {
    if (req.user && req.user.admin === true) {
      next();
    } else {
      return res.status(403).json({ message: 'Access denied: Admins only' });
    }
  }
  
  module.exports = isAdmin;
  