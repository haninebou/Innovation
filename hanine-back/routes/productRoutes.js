const express = require('express');
const {
  addProduct,
  fetchProducts,
  fetchProductById,
  deleteProduct,
  updateProduct,
  upload,
} = require('../controllers/productController');

const router = express.Router();

// POST add a product
router.post('/addpro', upload.array('images'), addProduct);

// GET fetch all products or filter by category
router.get('/products', fetchProducts);

// GET fetch a single product by ID
router.get('/products/:id', fetchProductById);

// DELETE delete a product by ID
router.delete('/products/:id', deleteProduct);

// PUT update a product by ID
router.put('/products/:id', upload.array('images'), updateProduct);

module.exports = router;
