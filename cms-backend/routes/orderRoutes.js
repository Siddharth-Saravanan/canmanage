const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// Create a new order
router.post('/', async (req, res) => {
    try {
        const { items, totalPrice } = req.body;
        const newOrder = new Order({ items, totalPrice });
        await newOrder.save();
        res.status(201).json(newOrder);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to create order' });
    }
});

// Get all orders for order history
router.get('/', async (req, res) => {
    try {
        const orders = await Order.find();
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to retrieve orders' });
    }
});

module.exports = router;
