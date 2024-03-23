const express = require('express');
const router = express.Router();
const Rating = require('../models/Rating'); 
const cors = require('cors');

const app = express();

app.use(cors());

router.post('/submit-rating', async (req, res) => {
    try {
        const { itemId, userEmail, rating } = req.body;

        // Create a new rating document
        const newRating = new Rating({
            itemId,
            userEmail: userEmail, 
            rating,
        });

        // Save the rating to the database
        await newRating.save();

        res.status(201).json({ success: true, message: 'Rating submitted successfully' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// Route to fetch average rating for an item
router.get('/average-rating/:itemId', async (req, res) => {
    try {
        const itemId = req.params.itemId;

        // Find all ratings for the given item
        const ratings = await Rating.find({ itemId });

        // Calculate the average rating
        let totalRating = 0;
        ratings.forEach((rating) => {
            totalRating += rating.rating;
        });
        const averageRating = ratings.length > 0 ? totalRating / ratings.length : 0;

        res.status(200).json({ success: true, averageRating });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});


module.exports = router;
