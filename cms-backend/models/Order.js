const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    orderId: {
        type: String,
        required: true,
        unique: true
    },
    items: [
        {
            itemName: String,
            price: Number,
            quantity: Number,
            total: Number,
        }
    ],
    totalPrice: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

// Middleware to generate a unique orderId before saving
orderSchema.pre('save', function (next) {
    if (!this.orderId) {
        this.orderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;  // Example orderId format: "ORD-123456"
    }
    next();
});

module.exports = mongoose.model('Order', orderSchema);
