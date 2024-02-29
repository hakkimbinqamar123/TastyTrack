const express = require('express');
const router = express.Router();
const Order = require('../models/Orders');
const CartModel = require('../models/Cart');
const cors = require('cors');
const app = express();

// Enable CORS for all routes
app.use(cors());

router.post('/orderData', async (req, res) => {
    let data = req.body.order_data;
    data.unshift({ Order_date: req.body.order_date });  // Use unshift to add at the beginning

    try {
        let existingOrder = await Order.findOne({ 'email': req.body.email });

        if (existingOrder === null) {
            const newOrder = new Order({
                email: req.body.email,
                order_data: [data],
                status: req.body.status ? req.body.status : "pending"
            });

            // Save the new order to generate a unique _id
            await newOrder.save();

            // Clear the cart data in the database as well
            // Assuming you have a separate model for the cart data
            // Adjust the following line based on your actual model structure
            await CartModel.deleteOne({ 'email': req.body.email });

            res.json({ success: true });
        } else {
            await Order.findOneAndUpdate({ email: req.body.email },
                { $push: { order_data: data } });

            // Clear the cart data in the database as well
            // Assuming you have a separate model for the cart data
            // Adjust the following line based on your actual model structure
            await CartModel.deleteOne({ 'email': req.body.email });

            res.json({ success: true });
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Server Error: " + error.message);
    }
});



router.post('/myorderData', async (req, res) => {
    try {
        let myData = await Order.findOne({'email': req.body.email});
        res.json({ orderData: myData });
    } catch (error) {
        res.status(500).send("Server Error: " + error.message);
    }
});

router.post('/allOrderData', async (req, res) => {
    try {
        // Fetch all orders
        const allOrders = await Order.find({});
        console.log("all orders: ", allOrders)
        res.json({ allOrders });
    } catch (error) {
        res.status(500).send("Server Error: " + error.message);
    }
});

router.post('/updateOrderStatus', async (req, res) => {
    const orderId = req.body._id
    const newStatus = req.body.status;

    try {
        // Update the order status in the database
        await Order.findOneAndUpdate({ _id: orderId }, { $set: { status: newStatus } });

        res.json({ success: true });
    } catch (error) {
        console.error('Error updating order status:', error.message);
        res.status(500).json({ success: false, error: error.message });
    }
});


module.exports = router;
