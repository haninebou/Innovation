const express = require('express');
const { checkAdmin } = require('../middlewares/authMiddleware');
const router = express.Router();

// Example protected admin route
router.get('/dashboard', checkAdmin, (req, res) => {
  res.status(200).json({ message: "Welcome to the admin dashboard!" });
});

module.exports = router;
