const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const productRoutes = require('./routes/productRoutes');
const commentRoutes = require('./routes/commentRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const adminRoutes = require('./routes/adminRoutes'); // Import the new order routes
const db = require('./config/db');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Static files
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/auth', authRoutes);
app.use('/categories', categoryRoutes);
app.use(productRoutes);
app.use(commentRoutes);
app.use(cartRoutes);
app.use(orderRoutes);  // Use the new order routes
app.use('/admin', adminRoutes);

// Root route
app.get('/', (req, res) => {
  res.json("Welcome to the backend");
});

// Port binding for deployment environments like Render
const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
