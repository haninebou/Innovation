const express = require('express');
const {
  addToCart,
  getCartItems,
  updateCartItem,
  removeCartItem,
} = require('../controllers/cartController');

const router = express.Router();

// POST add a product to cart
router.post('/cart/add', addToCart); 

// GET fetch cart items for a user
router.get('/cart/:userId', getCartItems); 

// PUT update cart item quantity (requires both color and size to update a specific variant)
router.put('/cart/update', updateCartItem); 

// DELETE remove a cart item (requires both color and size to remove a specific variant)
router.delete('/cart/remove', removeCartItem); 

module.exports = router;
