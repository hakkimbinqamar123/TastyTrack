const express = require('express');
const razorpay = require('razorpay');
const router = express.Router();
require('dotenv').config({ path: '.././.env' });
const cors = require('cors');
const crypto = require("crypto");

const Payment = require('../models/Payment');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

router.post('/payment', async (req, res) => {
    try {
        console.log('Received payment request:', req.body);

        const instance = new razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_SECRET,
        });

        console.log('RAZORPAY_KEY_ID:', process.env.RAZORPAY_KEY_ID);
        console.log('RAZORPAY_SECRET:', process.env.RAZORPAY_SECRET);


        const options = req.body;
        console.log('Payment options:', options);

        const order = await instance.orders.create(options);

        if (!order) {
            console.error('Error creating Razorpay order');
            return res.status(500).send('Error creating Razorpay order');
        }

        console.log('Razorpay order response:', order);
        res.json(order);
    } catch (error) {
        console.error('Error creating Razorpay order:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/verify-payment', async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const sha = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET);
    sha.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const digest = sha.digest("hex");

    if (digest !== razorpay_signature) {
        return res.status(400).json({ msg: "Invalid Transaction!" });
    }

    try {
        // Save payment details to the database
        const paymentData = {
            email: req.body.email,
            orderId: razorpay_order_id,
            paymentId: razorpay_payment_id,
            status: "success",
            amount: req.body.amount,
        };
        console.log(paymentData)

        const savedPayment = await Payment.create(paymentData);

        res.json({
            status: "success",
            orderId: razorpay_order_id,
            paymentId: razorpay_payment_id,
            savedPayment
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
