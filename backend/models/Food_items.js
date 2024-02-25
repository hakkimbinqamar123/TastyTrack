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
        half: {
            type: String,
            required: true
        },
        full: {
            type: String
        },
        regular: {
            type: String
        },
        medium: {
            type: String
        },
        large: {
            type: String
        }
    }],
    description: {
        type: String,
        required: true
    }
});

const Menu = mongoose.model('Menu', menuSchema);

module.exports = Menu;
