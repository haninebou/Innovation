// controllers/categoryController.js
const db = require('../config/db');
const multer = require('multer');

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// GET all categories
const getCategories = (req, res) => {
  const sql = "SELECT * FROM categories";
  db.query(sql, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.json(data);
  });
};

// POST add a new category
const addCategory = (req, res) => {
  const { name } = req.body;
  const photos = req.files.map(file => file.path);
  const sql = "INSERT INTO categories (name, photos) VALUES (?, ?)";
  db.query(sql, [name, JSON.stringify(photos)], (err, result) => {
    if (err) return res.status(500).json(err);
    return res.json({ message: 'Category added successfully', id: result.insertId });
  });
};

// DELETE a category by ID
const deleteCategory = (req, res) => {
  const categoryId = req.params.id;
  const sql = "DELETE FROM categories WHERE id = ?";
  db.query(sql, [categoryId], (err, result) => {
    if (err) return res.status(500).json(err);
    return res.json({ message: 'Category deleted successfully' });
  });
};

// PUT update a category by ID
const updateCategory = (req, res) => {
    const categoryId = req.params.id;
    const { name } = req.body;
    const photos = req.files.map(file => file.path);
    const sql = "UPDATE categories SET name = ?, photos = ? WHERE id = ?";
    db.query(sql, [name, JSON.stringify(photos), categoryId], (err, result) => {
        if (err) return res.status(500).json(err);
        return res.json({ message: 'Category updated successfully' });
    });
};


module.exports = {
  getCategories,
  addCategory,
  deleteCategory,
  updateCategory,
  upload
};
