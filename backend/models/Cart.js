const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    items: [{
        name: {
            type: String,
            required: true
        },
        qty: {
            type: Number,
            required: true
        },
        size: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        }
    }]
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
