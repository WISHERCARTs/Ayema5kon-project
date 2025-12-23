// backend/middleware/auth.js

const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7)
    : null;

  if (!token) {
    return res.status(401).json({ error: true, message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // decoded: { userId, role, iat, exp }
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: true, message: "Invalid token" });
  }
}

function requireRole(role) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: true, message: "No user in request" });
    }
    if (req.user.role !== role) {
      return res.status(403).json({ error: true, message: "Forbidden" });
    }
    next();
  };
}

module.exports = { verifyToken, requireRole };