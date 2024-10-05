const db = require('../config/db');
const multer = require('multer');
const path = require('path');

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + path.basename(file.originalname));
  }
});
const upload = multer({ storage });

// POST add a new product
const addProduct = (req, res) => {
  const { name, price, description, categoryId, stock, colors, sizes } = req.body;
  const images = req.files ? req.files.map(file => file.path) : []; // Handle missing files gracefully

  const sql = "INSERT INTO products (name, price, description, category_id, stock, colors, sizes, images) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
  db.query(sql, [name, price, description, categoryId, stock, JSON.stringify(colors.split(',')), JSON.stringify(sizes.split(',')), JSON.stringify(images)], (err, result) => {
    if (err) {
      console.error('Error adding product:', err);
      return res.status(500).json(err);
    }
    return res.json({ message: 'Product added successfully', id: result.insertId });
  });
};

// GET fetch all products or filter by category
const fetchProducts = (req, res) => {
  const { category } = req.query;
  let sql = `
    SELECT p.id, p.name, p.price, p.stock, p.description, c.name AS categoryName, p.images, p.colors, p.sizes 
    FROM products p 
    JOIN categories c ON p.category_id = c.id
  `;

  if (category) {
    sql += ` WHERE p.category_id = ${db.escape(category)}`;
  }

  db.query(sql, (err, data) => {
    if (err) {
      console.error('Error fetching products:', err);
      return res.status(500).json(err);
    }

   
      // Inside fetchProducts function in the backend (productController.js)
data.forEach(product => {
  product.images = JSON.parse(product.images); // Parse images JSON
  product.colors = JSON.parse(product.colors); // Parse colors JSON
  product.sizes = JSON.parse(product.sizes);   // Parse sizes JSON
});

   

    return res.json(data);
  });
};

// GET fetch a product by ID
const fetchProductById = (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM products WHERE id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Error fetching product details:', err);
      return res.status(500).json({ error: 'Error fetching product details' });
    }

    if (result.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    result[0].images = JSON.parse(result[0].images); // Parse images JSON
    result[0].colors = JSON.parse(result[0].colors); // Parse colors JSON
    result[0].sizes = JSON.parse(result[0].sizes); // Parse sizes JSON

    return res.json(result[0]);
  });
};

// DELETE a product by ID
const deleteProduct = (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM products WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Error deleting product:', err);
      return res.status(500).json(err);
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    return res.json({ message: 'Product deleted successfully' });
  });
};

// PUT update a product by ID
const updateProduct = (req, res) => {
  const { id } = req.params;
  const { name, price, description, categoryId, stock, colors, sizes } = req.body;
  let images = [];

  // Check if new files were uploaded
  if (req.files && req.files.length > 0) {
    images = req.files.map(file => file.path);
  }

  const sqlSelect = "SELECT images FROM products WHERE id = ?";
  db.query(sqlSelect, [id], (err, result) => {
    if (err) return res.status(500).json(err);

    let existingImages = JSON.parse(result[0].images);

    if (images.length > 0) {
      images = [...existingImages, ...images];
    } else {
      images = existingImages;
    }

    const sqlUpdate = "UPDATE products SET name = ?, price = ?, description = ?, category_id = ?, stock = ?, colors = ?, sizes = ?, images = ? WHERE id = ?";
    db.query(sqlUpdate, [name, price, description, categoryId, stock, JSON.stringify(colors.split(',')), JSON.stringify(sizes.split(',')), JSON.stringify(images), id], (err, result) => {
      if (err) return res.status(500).json(err);

      return res.json({ message: 'Product updated successfully' });
    });
  });
};

module.exports = {
  addProduct,
  fetchProducts,
  fetchProductById,
  deleteProduct,
  updateProduct,
  upload,
};
