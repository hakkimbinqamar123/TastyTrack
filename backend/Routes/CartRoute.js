const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const cors = require('cors');

router.use(cors()); // Use CORS middleware for the router

router.options('/add-to-cart', cors());

router.use(cors({
    origin: 'http://localhost:3000', // Adjust the origin to match your client's URL
    credentials: true,
}));

router.post('/get-cart', async (req, res) => {
    const { email } = req.body;

    try {
        const cart = await Cart.findOne({ email });

        if (cart) {
            res.json({ success: true, cart });
        } else {
            console.log("Cart not found for email:", email);
            res.json({ success: false, message: 'Cart not found for the specified email' });
        }
    } catch (error) {
        console.error('Error getting cart data:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
    }
});

router.post('/add-to-cart', async (req, res) => {
    const { email, name, qty, size, price, img } = req.body;

    // console.log("Received data in /add-to-cart:", req.body);


    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    try {
        let cart = await Cart.findOne({ email });
        console.log("cart data: ", cart)

        if (!cart) {
            // If the user's cart doesn't exist, create a new cart
            cart = new Cart({
                email,
                items: [{
                    name: req.body.name,
                    qty: req.body.qty,
                    size: req.body.size,
                    price: req.body.price,
                    img: req.body.img
                }]
            });
            console.log(cart)
            console.log(name)
            console.log(qty)
            console.log(size)
            console.log(price)
            await cart.save();
        } else {
            // If the user's cart exists, update the existing cart
            const existingItem = cart.items.find(item => item.name === name && item.size === size);

            if (existingItem) {
                // If the item already exists in the cart, update the quantity
                existingItem.qty += parseInt(qty);
            } else {
                // If the item doesn't exist in the cart, add it to the cart
                cart.items.push({
                    name,
                    qty: parseInt(qty),
                    size,
                    price: parseFloat(price),
                    img
                });
            }

            await cart.save();
        }

        res.json({ success: true });
    } catch (error) {
        console.error('Error in /api/add-to-cart:', error);

        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            res.status(400).json({ success: false, message: 'Validation Error', errors });
        } else {
            res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
        }
    }
});


// Add a route to update an item in the cart
router.post('/update-cart-item', async (req, res) => {
    const { email, name, size, qty } = req.body;

    try {
        const cart = await Cart.findOne({ 'email': email });

        if (cart) {
            // Find the item in the cart
            const itemToUpdate = cart.items.find(item => item.name === name && item.size === size);

            if (itemToUpdate) {
                // Update the quantity
                itemToUpdate.qty = parseInt(qty);
                await cart.save();
                res.json({ success: true });
            } else {
                res.status(404).json({ success: false, message: 'Item not found in the cart' });
            }
        } else {
            res.status(404).json({ success: false, message: 'Cart not found' });
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Server Error: " + error.message);
    }
});

// Add a route to delete an item from the cart
router.post('/remove-from-cart', async (req, res) => {
    const { email, name, size } = req.body;

    try {
        const cart = await Cart.findOne({ 'email': email });

        if (cart) {
            // Remove the item from the cart
            cart.items = cart.items.filter(item => !(item.name === name && item.size === size));
            await cart.save();

            // Send a success response to the client
            res.json({ success: true });
        } else {
            res.status(404).json({ success: false, message: 'Cart not found' });
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Server Error: " + error.message);
    }
});


module.exports = router;
