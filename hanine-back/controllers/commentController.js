const db = require('../config/db');

// POST add a comment to a product
const addComment = (req, res) => {
  const { productId, userName, comment, rating } = req.body;

  const sql = "INSERT INTO comments (product_id, user_name, comment, rating) VALUES (?, ?, ?, ?)";
  db.query(sql, [productId, userName, comment, rating], (err, result) => {
    if (err) {
      console.error('Error adding comment:', err);
      return res.status(500).json(err);
    }
    return res.json({ message: 'Comment added successfully', id: result.insertId });
  });
};

// GET fetch comments for a product
const fetchComments = (req, res) => {
  const { productId } = req.params;

  const sql = "SELECT * FROM comments WHERE product_id = ?";
  db.query(sql, [productId], (err, comments) => {
    if (err) {
      console.error('Error fetching comments:', err);
      return res.status(500).json(err);
    }

    // Calculate the average rating
    const totalRating = comments.reduce((sum, comment) => sum + comment.rating, 0);
    const averageRating = comments.length > 0 ? totalRating / comments.length : 0;

    return res.json({ comments, averageRating });
  });
};

module.exports = {
  addComment,
  fetchComments,
};
