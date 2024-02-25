const express = require('express');
const router = express.Router();
const Admin = require('../models/admin');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');  

const app = express();

app.use(cors()); 

router.post(
    '/createadmin',
    [
        body('username').isLength({ min: 5 }).withMessage("Username must be at least 5 characters long."),
        body('password').isLength({ min: 8 })
            .withMessage("Password must be at least 8 characters long.")
            .matches(/[a-z]/).withMessage("Password must contain a lowercase letter.")
            .matches(/[A-Z]/).withMessage("Password must contain an uppercase letter.")
            .matches(/[0-9]/).withMessage("Password must contain a number.")
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array(), message: "Invalid data in fields" });
        } else {
            try {
                const { username, password } = req.body;

                // Check if username already exists
                const existingAdmin = await Admin.findOne({ username });
                if (existingAdmin) {
                    return res.status(400).json({ message: "Username already exists. Choose a different username." });
                }

                // Hash the password before saving
                const hashedPassword = await bcrypt.hash(password, 10);

                let admin = new Admin({ username, password: hashedPassword });
                await admin.save();

                return res.status(200).send({ message: "Admin created successfully." });
            } catch (err) {
                console.error(err.message);
                return res.status(500).json({ message: "Server error!" });
            }
        }
    }
);

router.post('/adminlogin', async (req, res) => {
    const { username, password } = req.body;

    try {
        let user = await Admin.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: "No account found with this username." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Password incorrect." })
        }

        const token = jwt.sign({ _id: user._id }, "adminkey", { expiresIn: '7d' });
        res.json({ "status": "Success", "adminkey": "adminkey", "id": user._id, "token": token });        
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
