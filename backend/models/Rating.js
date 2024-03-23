const mongoose = require('mongoose');

const { Schema } = mongoose;

const ratingSchema = new Schema({
  itemId: {
    type: Schema.Types.ObjectId,
    ref: 'FoodItems',
    required: true,
  },
  userEmail: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

// Check if the model has already been compiled to prevent overwriting
module.exports = mongoose.models.Rating || mongoose.model('Rating', ratingSchema);
