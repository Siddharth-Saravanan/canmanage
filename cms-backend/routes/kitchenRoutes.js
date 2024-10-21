const express = require('express');
const router = express.Router();
const Item = require('../models/item');  // Assuming item model is stored here

// Route to get all items
router.get('/items', async (req, res) => {
  try {
    const items = await Item.find();
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching items' });
  }
});

// Route to add a new item
router.post('/items', async (req, res) => {
  const { itemName, category, price, stock, timeSlot } = req.body;

  const newItem = new Item({
    itemName,
    category,
    price,
    stock,
    timeSlot,
  });

  try {
    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ message: 'Error adding item' });
  }
});

// Route to update an item's stock or availability
router.put('/items/:id', async (req, res) => {
  const { stock, availability } = req.body;

  try {
    const updatedItem = await Item.findByIdAndUpdate(req.params.id, { stock, availability }, { new: true });
    res.status(200).json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: 'Error updating item' });
  }
});

// Optional: Route to delete an item
router.delete('/items/:id', async (req, res) => {
  try {
    await Item.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting item' });
  }
});

module.exports = router;
