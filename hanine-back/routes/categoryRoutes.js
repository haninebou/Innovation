// routes/categoryRoutes.js
const express = require('express');
const {
  getCategories,
  addCategory,
  deleteCategory,
  updateCategory,
  upload
} = require('../controllers/categoryController');
const router = express.Router();

router.get('/', getCategories);
router.post('/', upload.array('photos', 4), addCategory);
router.delete('/:id', deleteCategory);
router.put('/:id', upload.array('photos', 4), updateCategory);

module.exports = router;
