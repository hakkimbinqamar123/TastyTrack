const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    CategoryName: {
        type: String,
        required: true
    }
});

const category = mongoose.model('food_category', categorySchema, 'food_category');

module.exports = category;
