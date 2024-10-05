const express = require('express');
const { getOrders, getOrderById, createOrder } = require('../controllers/orderController');

const router = express.Router();

// GET all orders
router.get('/orders', getOrders);

// GET specific order by ID
router.get('/orders/:id', getOrderById);

// POST create a new order
router.post('/orders', createOrder); // New route to create an order

module.exports = router;
