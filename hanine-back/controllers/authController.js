const bcrypt = require('bcrypt');
const db = require('../config/db');

// Signup controller
const signup = async (req, res) => {
  const { username, email, password, address, phone } = req.body;

  // Check password length
  if (password.length < 5) {
    return res.status(400).json("Password must be at least 5 characters long");
  }

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    const role = 'user'; // Force the role to 'user'
    
    // SQL query to insert a new user with the 'user' role
    const sql = 'INSERT INTO users (username, email, password, address, phone, role) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(sql, [username, email, hashedPassword, address, phone, role], (err, result) => {
      if (err) {
        console.error('Error inserting user:', err);
        return res.status(500).json("Internal server error during user insertion");
      }
      res.status(200).json({ userId: result.insertId, message: "Sign up successful" });
    });
  } catch (err) {
    console.error('Error hashing password:', err);
    res.status(500).json("Internal server error during password hashing");
  }
};

// Login controller
const login = (req, res) => {
  const { email, password } = req.body;

  const sql = 'SELECT * FROM users WHERE email = ?';
  db.query(sql, [email], async (err, results) => {
    if (err) {
      console.error('Error fetching user:', err);
      return res.status(500).json("Server error");
    }

    if (results.length === 0) {
      return res.status(401).json("User not found");
    }

    const user = results[0];
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json("Invalid credentials");
    }

    // Include the role in the response for frontend logic (e.g., admin check)
    res.status(200).json({ userId: user.id, role: user.role, message: "Login successful" });
  });
};

// Get user profile controller
const getUserProfile = (req, res) => {
  const { id } = req.params;

  const sql = 'SELECT username, email, address, phone FROM users WHERE id = ?';
  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error('Error fetching user profile:', err);
      return res.status(500).json("Server error");
    }

    if (results.length === 0) {
      return res.status(404).json("User not found");
    }

    const user = results[0];
    res.status(200).json(user);
  });
};

// Update user profile controller
const updateUserProfile = (req, res) => {
  const { id } = req.params;
  const { email, address, phone } = req.body;

  let sql = 'UPDATE users SET ';
  const params = [];

  if (email) {
    sql += 'email = ?';
    params.push(email);
  }

  if (address) {
    if (params.length > 0) sql += ', ';
    sql += 'address = ?';
    params.push(address);
  }

  if (phone) {
    if (params.length > 0) sql += ', ';
    sql += 'phone = ?';
    params.push(phone);
  }

  sql += ' WHERE id = ?';
  params.push(id);

  db.query(sql, params, (err, result) => {
    if (err) {
      console.error('Error updating user profile:', err);
      return res.status(500).json("Error updating user profile");
    }
    res.status(200).json("Profile updated successfully");
  });
};

// Change password controller
const changePassword = async (req, res) => {
  const { userId, oldPassword, newPassword } = req.body;

  const sql = 'SELECT * FROM users WHERE id = ?';
  db.query(sql, [userId], async (err, results) => {
    if (err) {
      console.error('Error fetching user:', err);
      return res.status(500).json("Server error");
    }

    if (results.length === 0) {
      return res.status(404).json("User not found");
    }

    const user = results[0];
    const passwordMatch = await bcrypt.compare(oldPassword, user.password);
    if (!passwordMatch) {
      return res.status(401).json("Old password is incorrect");
    }

    try {
      // Hash the new password
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
      const updateSql = 'UPDATE users SET password = ? WHERE id = ?';
      db.query(updateSql, [hashedNewPassword, userId], (err, result) => {
        if (err) {
          console.error('Error updating password:', err);
          return res.status(500).json("Error changing password");
        }
        res.status(200).json("Password changed successfully");
      });
    } catch (err) {
      console.error('Error hashing new password:', err);
      res.status(500).json("Error changing password");
    }
  });
};

module.exports = { signup, login, getUserProfile, changePassword, updateUserProfile };
