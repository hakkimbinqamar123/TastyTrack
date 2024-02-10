const express = require('express')
const router = express.Router()
const User = require('../models/User')
const { body, validationResult } = require('express-validator');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const jwtSecret = "Thisisafooddeliveryappcalledgo$#"

router.post("/createuser", [
    body('email').isEmail(),
    body('name').isLength({ min: 5 }),
    body('password', 'Incorrect Password').isLength({ min: 5 })],
    async (req, res) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const salt = await bcrypt.genSalt(10);
        let secPassword = await bcrypt.hash(req.body.password, salt)
        try {
            // Check if the email already exists
            const existingUser = await User.findOne({ email: req.body.email });

            if (existingUser) {
                return res.status(400).json({ success: false, message: 'Email already exists' });
            }

            // If the email doesn't exist, create a new user
            await User.create({
                name: req.body.name,
                password: secPassword,
                email: req.body.email,
                location: req.body.location
            });

            res.json({ success: true });

        } catch (error) {
            console.log(error);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    });





router.post("/loginuser", [
    body('email').isEmail(),
    body('password', 'Incorrect Password').isLength({ min: 5 })],
    async (req, res) => {
        console.log("first");
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        let email = req.body.email;
        try {
            // Normalize and sanitize the email before querying the database
            email = email.toLowerCase().trim();

            let userData = await User.findOne({ email: email });
            console.log(userData);

            if (!userData) {
                // Return a generic error message to avoid exposing details
                return res.status(400).json({ errors: "Invalid credentials" });
            }

            const pwdCompare = await bcrypt.compare(req.body.password, userData.password);

            if (!pwdCompare) {
                // Return a generic error message to avoid exposing details
                return res.status(400).json({ errors: "Invalid credentials" });
            }

            const data = {
                user: {
                    id: userData.id
                }
            }

            // Ensure to use a secure secret for jwt signing
            const authToken = jwt.sign(data, jwtSecret);

            return res.json({ success: true, authToken: authToken });

        } catch (error) {
            console.error(error);
            res.status(500).json({ errors: "Server error" });
        }
    }
);


router.post('/customerprofile', async (req, res) => {
    try {
        let myData = await User.findOne({ 'email': req.body.email})
        console.log(myData)
        res.json(myData); 
    } catch (error) {
        res.status(500).send("Server Error: " + error.message)
    }
})



module.exports = router 