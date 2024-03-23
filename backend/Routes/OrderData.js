const express = require('express');
const router = express.Router();
const Order = require('../models/Orders');
const { body, validationResult } = require('express-validator');
const CartModel = require('../models/Cart');
const cors = require('cors');
const app = express();
const mailService =  require('../controllers/emailController')

// Enable CORS for all routes
app.use(cors());

router.post('/orderData', [
  body('order_data.*.price').notEmpty(),
  body('order_data.*.size').notEmpty(),
  body('order_data.*.qty').notEmpty(),
  body('order_data.*.name').notEmpty(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const userEmail = req.body.email;
    const deliveryAddress = req.body.deliveryAddress;
    const orderDate = new Date().toDateString(); // You may adjust the date format as needed

    const orderDataForBackend = req.body.order_data.map((food) => ({
      ...food,
      Order_date: orderDate,
      status: 'pending',
      // _id: new mongoose.Types.ObjectId(),
    }));

    let existingOrder = await Order.findOne({ email: userEmail });

    if (existingOrder === null) {
      const newOrder = new Order({
        email: userEmail,
        order_data: orderDataForBackend,
        deliveryAddress: deliveryAddress,
      });
      console.log(newOrder)

      await newOrder.save();
      await CartModel.deleteOne({ email: userEmail });

      res.json({ success: true });
    } else {
      await Order.findOneAndUpdate(
        { email: userEmail },
        { $push: { order_data: { $each: orderDataForBackend } }, deliveryAddress: deliveryAddress }
      );

      await CartModel.deleteOne({ email: userEmail });

      res.json({ success: true });
      mailService.sendEmail({
        to: userEmail,
        subject: 'Order Placed',
        html: `
          <p>Your order has been placed! Please find the order details below:</p>
          <ul>
            ${orderDataForBackend.map(food => `
              <li>
                <strong>Name:</strong> ${food.name}, 
                <strong>Price:</strong> ${food.price}, 
                <strong>Size:</strong> ${food.size}, 
                <strong>Quantity:</strong> ${food.qty}
              </li>
            `).join('')}
          </ul>
          <p>Please check your profile for more details.</p>
        `
      });
    

    }
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server Error: " + error.message);
  }
});



router.post('/myorderData', async (req, res) => {
  try {
    let myData = await Order.findOne({ 'email': req.body.email });
    // console.log("ordeData: ", myData)
    res.json({ orderData: myData });
  } catch (error) {
    res.status(500).send("Server Error: " + error.message);
  }
});

router.post('/allOrderData', async (req, res) => {
  try {
    // Fetch all orders
    const allOrders = await Order.find({});
    // console.log("all orders: ", allOrders)
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

// Fetch orders
router.post('/myorderData', async (req, res) => {
  try {
      const { email } = req.body;
      const orderData = await Order.find({ email });
      res.json({ orderData });
  } catch (error) {
      console.error('Fetch error:', error.message);
      res.status(500).send('Internal Server Error');
  }
});

router.post('/cancelOrder', async (req, res) => {
  try {
      const { orderId } = req.body;

      // Update the order using the orderId within the order_data array
      const updatedOrder = await Order.findOneAndUpdate(
          { 'order_data._id': orderId },
          { $pull: { 'order_data': { _id: orderId } } },
          { new: true } // to return the modified document
      );

      if (!updatedOrder) {
          return res.status(404).send('Order not found');
      }

      res.json({ message: 'Order canceled successfully' });
  } catch (error) {
      console.error('Cancel Order error:', error.message);
      res.status(500).send('Internal Server Error');
  }
});



// Update order (you may need to adjust this based on your update logic)
router.put('/api/updateOrder', async (req, res) => {
  try {
      const { orderId } = req.body;
      // Implement the logic to update the order based on the request body
      // ...

      res.json({ message: 'Order updated successfully' });
  } catch (error) {
      console.error('Update Order error:', error.message);
      res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
