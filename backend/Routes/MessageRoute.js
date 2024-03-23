const express = require('express');
const router = express.Router();
const Contact = require('../models/Message'); 
const cors = require('cors');

const app = express();

app.use(cors());

// POST route to handle form submission
router.post('/contact', async (req, res) => {
  try {
    const { firstName, lastName, email, phone, city, message } = req.body;

    // Create a new contact instance
    const newContact = new Contact({
      firstName,
      lastName,
      email,
      phone,
      city,
      message
    });

    console.log("data: ", newContact)

    // Save the contact instance to the database
    await newContact.save();

    res.status(201).json({ message: 'Contact message saved successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
