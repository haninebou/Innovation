const db = require('../config/db');

// Create a new order
const createOrder = (req, res) => {
  const {
    fullName,
    email,
    address,
    phoneNumber,
    state,
    postalCode,
    deliveryMode,
    deliveryPrice,
    subtotal,
    total,
    products
  } = req.body;

  // SQL query to insert the order
  const sqlInsertOrder = `
    INSERT INTO orders (full_name, email, address, phone_number, state, postal_code, delivery_mode, delivery_price, subtotal, total)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(sqlInsertOrder, [
    fullName, email, address, phoneNumber, state, postalCode, deliveryMode, deliveryPrice, subtotal, total
  ], (err, result) => {
    if (err) {
      console.error('Error inserting order:', err);
      return res.status(500).json({ message: 'Failed to create order', error: err });
    }

    const orderId = result.insertId;  // Get the ID of the newly created order

    // Now insert the products into the order_items table
    const orderItems = products.map(product => [
      orderId, product.product_id, product.quantity, product.price
    ]);

    const sqlInsertOrderItems = `
      INSERT INTO order_items (order_id, product_id, quantity, price)
      VALUES ?
    `;

    db.query(sqlInsertOrderItems, [orderItems], (err) => {
      if (err) {
        console.error('Error inserting order items:', err);
        return res.status(500).json({ message: 'Failed to add order items', error: err });
      }

      return res.json({ message: 'Order placed successfully', orderId });
    });
  });
};

// Get all orders
const getOrders = (req, res) => {
  const sql = `
    SELECT * FROM orders
    ORDER BY created_at DESC
  `;

  db.query(sql, (err, orders) => {
    if (err) {
      console.error('Error fetching orders:', err);
      return res.status(500).json(err);
    }

    const sqlOrderItems = `
      SELECT oi.order_id, oi.quantity, oi.price, p.name
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
    `;

    // Fetch all items for all orders
    db.query(sqlOrderItems, (err, items) => {
      if (err) {
        console.error('Error fetching order items:', err);
        return res.status(500).json(err);
      }

      // Add items to the corresponding orders
      const ordersWithItems = orders.map(order => ({
        ...order,
        items: items.filter(item => item.order_id === order.id)
      }));

      return res.json(ordersWithItems);
    });
  });
};

// Get a specific order by ID
const getOrderById = (req, res) => {
  const { id } = req.params;

  const sqlOrder = `
    SELECT * FROM orders WHERE id = ?
  `;

  const sqlOrderItems = `
    SELECT oi.quantity, oi.price, p.name, p.image
    FROM order_items oi
    JOIN products p ON oi.product_id = p.id
    WHERE oi.order_id = ?
  `;

  db.query(sqlOrder, [id], (err, orderResult) => {
    if (err) {
      console.error('Error fetching order:', err);
      return res.status(500).json({ error: 'Error fetching order details' });
    }

    if (orderResult.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    db.query(sqlOrderItems, [id], (err, itemsResult) => {
      if (err) {
        console.error('Error fetching order items:', err);
        return res.status(500).json({ error: 'Error fetching order items' });
      }

      const order = orderResult[0];
      order.items = itemsResult;

      return res.json(order);
    });
  });
};

module.exports = {
  createOrder,
  getOrders,
  getOrderById
};
