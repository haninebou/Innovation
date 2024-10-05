const db = require('../config/db');

const addToCart = (req, res) => {
  const { userId, productId, quantity, color, size } = req.body;

  const sqlCheck = "SELECT * FROM carts WHERE user_id = ? AND product_id = ? AND color = ? AND size = ?";
  db.query(sqlCheck, [userId, productId, color, size], (err, result) => {
    if (err) return res.status(500).json(err);

    if (result.length > 0) {
      const newQuantity = result[0].quantity + quantity;
      const sqlUpdate = "UPDATE carts SET quantity = ? WHERE user_id = ? AND product_id = ? AND color = ? AND size = ?";
      db.query(sqlUpdate, [newQuantity, userId, productId, color, size], (err) => {
        if (err) return res.status(500).json(err);
        return res.json({ message: 'Cart updated successfully' });
      });
    } else {
      const sqlInsert = "INSERT INTO carts (user_id, product_id, quantity, color, size) VALUES (?, ?, ?, ?, ?)";
      db.query(sqlInsert, [userId, productId, quantity, color, size], (err) => {
        if (err) return res.status(500).json(err);
        return res.json({ message: 'Product added to cart' });
      });
    }
  });
};

const getCartItems = (req, res) => {
  const { userId } = req.params;

  const sql = `
    SELECT c.id, p.name, p.price, c.quantity, p.image, c.color, c.size 
    FROM carts c 
    JOIN products p ON c.product_id = p.id 
    WHERE c.user_id = ?
  `;

  db.query(sql, [userId], (err, result) => {
    if (err) return res.status(500).json(err);
    return res.json(result);
  });
};

// Update the quantity of an item in the cart
const updateCartItem = (req, res) => {
  const { userId, productId, quantity, color, size } = req.body;

  const sql = "UPDATE carts SET quantity = ? WHERE user_id = ? AND product_id = ? AND color = ? AND size = ?";
  db.query(sql, [quantity, userId, productId, color, size], (err) => {
    if (err) return res.status(500).json(err);
    return res.json({ message: 'Cart item updated successfully' });
  });
};

// Remove an item from the cart
const removeCartItem = (req, res) => {
  const { userId, productId, color, size } = req.body;

  const sql = "DELETE FROM carts WHERE user_id = ? AND product_id = ? AND color = ? AND size = ?";
  db.query(sql, [userId, productId, color, size], (err) => {
    if (err) return res.status(500).json(err);
    return res.json({ message: 'Cart item removed successfully' });
  });
};

module.exports = {
  addToCart,
  getCartItems,
  updateCartItem,
  removeCartItem
};
