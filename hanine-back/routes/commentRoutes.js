const express = require('express');
const { addComment, fetchComments } = require('../controllers/commentController');

const router = express.Router();

// POST add a comment
router.post('/products/:productId/comments', addComment);

// GET fetch comments for a product
router.get('/products/:productId/comments', fetchComments);

module.exports = router;
