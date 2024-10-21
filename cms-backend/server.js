// server.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/auth'); 
const adminRoutes = require('./routes/adminRoutes');
const kitchenRoutes = require('./routes/kitchenRoutes');
const itemRoutes = require('./routes/itemRoutes');  // Assuming you have item routes
const orderRoutes = require('./routes/orderRoutes');  // New order route

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;


// Middleware
app.use(express.json());
// app.use(cors({ origin: 'http://localhost:3000' }));

app.use(cors({
  origin: 'http://localhost:3000', // Frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected'))
.catch((error) => console.error('MongoDB connection error:', error));



// Basic route to verify server is running
app.get('/', (req, res) => {
  res.send('Backend is running');
});



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
//   console.log('JWT Secret:', process.env.JWT_SECRET);
});

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api', kitchenRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/orders', orderRoutes);