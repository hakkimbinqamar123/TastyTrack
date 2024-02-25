const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    CategoryName: {
        type: String,
        required: true
    }
});

const category = mongoose.model('Menu', categorySchema);

module.exports = category;
