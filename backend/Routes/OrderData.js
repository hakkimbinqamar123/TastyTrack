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
    data.unshift({ Order_date: req.body.order_date });

    try {
        let existingOrder = await Order.findOne({ 'email': req.body.email });

        if (existingOrder === null) {
            const newOrder = new Order({
                email: req.body.email,
                order_data: [data],
                status: req.body.status ? req.body.status : "pending",
                deliveryAddress: req.body.deliveryAddress, // Include delivery address in the order schema
            });
            console.log(newOrder)

            await newOrder.save();
            await CartModel.deleteOne({ 'email': req.body.email });

            res.json({ success: true });
        } else {
            await Order.findOneAndUpdate(
                { email: req.body.email },
                { $push: { order_data: data }, deliveryAddress: req.body.deliveryAddress }
            );

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
        let myData = await Order.findOne({ 'email': req.body.email });
        res.json({ orderData: myData });
    } catch (error) {
        res.status(500).send("Server Error: " + error.message);
    }
});

router.post('/allOrderData', async (req, res) => {
    try {
        const allOrders = await Order.find({});
        console.log("all orders: ", allOrders)
        res.json({ allOrders });
    } catch (error) {
        res.status(500).send("Server Error: " + error.message);
    }
});

router.post('/updateOrderStatus', async (req, res) => {
    const orderId = req.body.orderId; // Change _id to orderId
    const itemId = req.body.itemId; // Add itemId
    const newStatus = req.body.status;

    try {
        // Update the specific item's status in the order_data array
        await Order.findOneAndUpdate(
            { _id: orderId, 'order_data._id': itemId }, // Find the order with the given orderId and the item with the given itemId
            { $set: { 'order_data.$.status': newStatus } } // Update the status of the matched item
        );

        res.json({ success: true });
    } catch (error) {
        console.error('Error updating order status:', error.message);
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
