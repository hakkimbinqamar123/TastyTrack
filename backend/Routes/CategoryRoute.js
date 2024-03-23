const express = require('express');
const router = express.Router();
const Category = require('../models/Food_category');
const cors = require('cors');

router.use(cors()); // Use CORS middleware for the router

router.options('/add-to-cart', cors());

router.use(cors({
    origin: 'http://localhost:3000', // Adjust the origin to match your client's URL
    credentials: true,
}));


// Route to add a new category
router.post('/categories', async (req, res) => {
    try {
        // Extract category name from request body
        const { categoryName } = req.body;

        // Create a new category document
        const newCategory = new Category({
            CategoryName: categoryName
        });

        // Save the new category to the database
        const savedCategory = await newCategory.save();

        // Respond with the saved category data
        res.status(201).json(savedCategory);
    } catch (err) {
        // Handle errors
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});



// Route to fetch all categories
router.get('/fetchcategories', async (req, res) => {
    try {
        // Fetch all categories from the database
        const categories = await Category.find({}, 'CategoryName');
        res.status(200).json(categories);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
