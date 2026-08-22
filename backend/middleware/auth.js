const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-me-in-production';

const verifyAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split('Bearer ')[1];

  try {
    const decodedToken = jwt.verify(token, JWT_SECRET);
    req.user = decodedToken;
    req.isAdmin = decodedToken.role === 'admin';

    next();
  } catch (error) {
    console.error('Token verification error:', error.message);
    return res.status(401).json({ error: `Unauthorized: Invalid or expired token` });
  }
};

module.exports = verifyAuth;
