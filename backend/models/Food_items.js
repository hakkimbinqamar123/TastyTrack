const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
    CategoryName: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    img: {
        type: String,
        required: true
    },
    options: [{
        type: {
            type: String,
            required: true
        },
        price: {
            type: String,
            required: true
        }
    }],
    description: {
        type: String,
        required: true
    }
});

const Food_item = mongoose.model('food_item', menuSchema);

module.exports = Food_item;
