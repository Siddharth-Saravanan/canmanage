const express = require('express');
const router = express.Router();
const Item = require('../models/item');

// Get all items with optional search and category filtering
router.get('/', async (req, res) => {
    try {
        const { search, category } = req.query;
        let filter = {};
        
        if (search) {
            filter.itemName = { $regex: search, $options: 'i' };  // Case-insensitive search
        }

        if (category && category !== 'All') {
            filter.category = category;
        }

        const items = await Item.find(filter);
        res.json(items);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to retrieve items' });
    }
});

module.exports = router;
