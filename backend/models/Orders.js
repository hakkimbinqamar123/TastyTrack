const mongoose = require('mongoose');

const { Schema } = mongoose;

const FoodItemSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  qty: {
    type: Number,
    required: true,
  },
  size: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  Order_date: {
    type: String, // Change the type to String
    default: new Date().toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    }),
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'delivered'],
    default: 'pending',
  },
  img: {
    type: String, // Add 'img' property
    required: true,
  },
});

const OrderSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  order_data: [FoodItemSchema], // Use the FoodItemSchema here
  deliveryAddress: {
    fullName: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    zipCode: {
      type: String,
      required: true,
    },
    mobile: {
      type: String,
      required: true,
    },
  },
});

module.exports = mongoose.model('order', OrderSchema);
