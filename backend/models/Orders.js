const mongoose = require('mongoose')

const { Schema } = mongoose

const OrderSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  order_data: {
    type: Array,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'delivered'],
    default: 'pending'
  },
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
})

module.exports = mongoose.model('order', OrderSchema)
