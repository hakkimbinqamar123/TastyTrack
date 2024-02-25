const express = require('express')
const router = express.Router()
const FoodItems = require('../models/Food_items');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();

app.use(cors());

router.post('/foodData', (req, res) => {
    try {
        console.log(global.food_items)
        res.send([global.food_items, global.foodCategory])
    } catch (error) {
        console.error(error.message)
        res.send("Server Error")
    }
})

// Add food item route
router.post(
    '/addFoodItem',
    [
        body('name', 'Name is required').not().isEmpty(),
        body('CategoryName', 'Category Name is required').not().isEmpty(),
        body('img', 'Image URL is required').not().isEmpty(),
        body('options.*.type', 'Option type is required').not().isEmpty(),
        body('options.*.price', 'Option price is required').not().isEmpty(),
    ],

    async (req, res) => {
        const adminKey = req.headers['adminkey'];
        const authToken = req.headers['authorization'];
        console.log(adminKey)
        console.log(authToken)

        // Check if admin key and token are present
        if (!adminKey || !authToken) {
            return res.status(401).json({ success: false, message: 'Unauthorized user' });
        }

        try {
            // Verify admin key
            console.log('Received adminKey:', adminKey);
            if (adminKey !== 'adminkey') {
                console.log('Admin key verification failed');
                return res.status(401).json({ success: false, message: 'Unauthorized user' });
            }

            // Verify token
            const decoded = jwt.verify(authToken, 'adminkey');
            console.log('Decoded token:', decoded);
            if (!decoded || decoded.id !== req.body.id) {
                console.log('Token verification failed');
                return res.status(401).json({ success: false, message: 'Unauthorized user' });
            }

            // Check validation errors
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ success: false, errors: errors.array() });
            }

            // Check if the food item already exists
            const existingItem = await FoodItems.findOne({ name: req.body.name });
            if (existingItem) {
                return res.status(400).json({ success: false, message: "Food Item Already Exist!" });
            }

            // Create a new food item
            const newMenu = new FoodItems({
                CategoryName: req.body.CategoryName,
                name: req.body.name,
                img: req.body.img,
                options: req.body.options,
                description: req.body.description
            });

            // Save the new food item
            await newMenu.save();

            return res.status(200).json({ success: true, message: 'Food Item added successfully' });
        } catch (error) {
            console.log(error);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    }
);

// Update food item route
router.post(
    '/updateFoodItem',
    [
        body('item_id', 'ID is required').not().isEmpty(),
        body('name', 'Name is required').not().isEmpty(),
        body('CategoryName', 'Category Name is required').not().isEmpty(),
        body('img', 'Image URL is required').not().isEmpty(),
        body('options.*.type', 'Option type is required').not().isEmpty(),
        body('options.*.price', 'Option price is required').not().isEmpty(),
    ],

    async (req, res) => {
        const adminKey = req.headers['adminkey'];
        const authToken = req.headers['authorization'];
        const itemId = req.body.item_id;

        // Check if admin key and token are present
        if (!adminKey || !authToken) {
            return res.status(401).json({ success: false, message: 'Unauthorized user' });
        }

        try {
            // Verify admin key
            if (adminKey !== 'adminkey') {
                return res.status(401).json({ success: false, message: 'Unauthorized user' });
            }

            // Verify token
            const decoded = jwt.verify(authToken, 'adminkey');
            if (!decoded || decoded.id !== req.body.id) {
                return res.status(401).json({ success: false, message: 'Unauthorized user' });
            }

            // Check validation errors
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ success: false, errors: errors.array() });
            }

            // Check if the food item exists
            const existingItem = await FoodItems.findById(itemId);
            if (!existingItem) {
                return res.status(404).json({ success: false, message: "Food Item not found" });
            }

            // Update the food item
            existingItem.CategoryName = req.body.CategoryName;
            existingItem.name = req.body.name;
            existingItem.img = req.body.img;
            existingItem.options = req.body.options;
            existingItem.description = req.body.description;

            // Save the updated food item
            await existingItem.save();

            return res.status(200).json({ success: true, message: 'Food Item updated successfully' });
        } catch (error) {
            console.log(error);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    }
);


// Delete food item route
router.post('/deleteFoodItem', async (req, res) => {
    const adminKey = req.headers['adminkey'];
    const authToken = req.headers['token'];
    const itemId = req.body.item_id;

    // Check if admin key and token are present
    if (!adminKey || !authToken) {
        return res.status(401).json({ success: false, message: 'Unauthorized user' });
    }

    try {
        // Verify admin key
        if (adminKey !== 'adminkey') {
            return res.status(401).json({ success: false, message: 'Unauthorized user' });
        }

        // Verify token
        const decoded = jwt.verify(authToken, 'adminkey');
        if (!decoded || decoded.id !== req.body.id) {
            return res.status(401).json({ success: false, message: 'Unauthorized user' });
        }

        // Check if the food item exists
        const existingItem = await FoodItems.findById(itemId);
        if (!existingItem) {
            return res.status(404).json({ success: false, message: "Food Item not found" });
        }
        // Delete the food item
        const result = await FoodItems.deleteOne({ _id: itemId });

        return res.status(200).json({ success: true, message: 'Food Item deleted successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

module.exports = router;
