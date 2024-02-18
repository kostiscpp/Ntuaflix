const jwt = require('jsonwebtoken');

exports.authenticateadmin = (req, res, next) => {
  const token = req.headers['x-observatory-auth'];
  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
      
      // Check if the role is admin
    if (decoded.role !== 'admin') {
      return res.status(401).json({ error: 'Unauthorized: Requires admin role' });
    }

    req.user = decoded; // Optional: Attach user data to request object
    next();
  });
}
exports.authenticateuser = (req, res, next) => {
  const token = req.headers['x-observatory-auth'];
  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
      
      // Check if the role is user or admin
    if (decoded.role !== 'user' && decoded.role !== 'admin') {
      return res.status(401).json({ error: 'Unauthorized: Requires user or admin role' });
    }
    req.user = decoded; // Optional: Attach user data to request object
  
    next();
  });
};
