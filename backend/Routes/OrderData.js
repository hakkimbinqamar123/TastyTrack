const express = require('express')
const router = express.Router()
const Order = require('../models/Orders')
const CartModel = require('../models/Cart')
const cors = require('cors');
const app = express();

// Enable CORS for all routes
app.use(cors());

router.post('/orderData', async (req, res) => {
    let data = req.body.order_data;
    await data.splice(0, 0, { Order_date: req.body.order_date });

    try {
        let eId = await Order.findOne({ 'email': req.body.email });

        if (eId === null) {
            await Order.create({
                email: req.body.email,
                order_data: [data]
            });

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
        let myData = await Order.findOne({'email': req.body.email})
        console.log(myData)
        res.json({ orderData: myData })
    } catch (error) {
        res.status(500).send("Server Error: " + error.message)
    }
})

module.exports = router;
