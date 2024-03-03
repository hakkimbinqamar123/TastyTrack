const mongoose = require('mongoose')

const { Schema } = mongoose

const PaymentSchema = new Schema({
    email:{
        type: String,
        required: true
    },
    orderId:{
        type: String,
        required: true
    },
    paymentId: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        require: true
    },
    order_id: {
        type: String,
        require: true
    }

})

module.exports = mongoose.model('payment',PaymentSchema)