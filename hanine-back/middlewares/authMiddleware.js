const db = require('../config/db');

// Middleware to check if user is admin
const checkAdmin = (req, res, next) => {
  const { userId } = req.body;

  const sql = 'SELECT role FROM users WHERE id = ?';
  db.query(sql, [userId], (err, results) => {
    if (err) {
      return res.status(500).json("Server error");
    }

    if (results.length === 0) {
      return res.status(404).json("User not found");
    }

    const userRole = results[0].role;
    if (userRole !== 'admin') {
      return res.status(403).json("Access denied, admin only");
    }

    next();  // Proceed to admin route if user is admin
  });
};

module.exports = { checkAdmin };
