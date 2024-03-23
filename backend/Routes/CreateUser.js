const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const jwtSecret = 'Thisisafooddeliveryappcalledgo$#';
const cors = require('cors');

const app = express();
app.use(cors()); 

router.post(
  '/createuser',
  [
    body('email')
      .isEmail()
      .normalizeEmail()
      .matches(/^[a-zA-Z0-9._!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+$/)
      .withMessage('Invalid email format'),
    body('name').isLength({ min: 5 }),
    body('password')
      .isLength({ min: 5 })
      .custom(password => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[a-zA-Z\d\W_]{8,12}$/.test(password))
      .withMessage('Password must contain at least one lowercase letter, one uppercase letter, one digit, one special character, and be 8-12 characters long'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const salt = await bcrypt.genSalt(10);
    const secPassword = await bcrypt.hash(req.body.password, salt);

    try {
      const existingUser = await User.findOne({ email: req.body.email });

      if (existingUser) {
        return res.status(400).json({ success: false, message: 'Email already exists' });
      }

      const newUser = await User.create({
        name: req.body.name,
        password: secPassword,
        email: req.body.email,
        location: req.body.location,
      });

      const data = {
        user: {
          id: newUser.id,
        },
      };

      const authToken = jwt.sign(data, jwtSecret);
      res.json({ success: true, authToken: authToken });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  }
);

router.post(
  '/loginuser',
  [
    body('email').isEmail(),
    body('password', 'Incorrect Password').isLength({ min: 5 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let email = req.body.email;
    try {
      email = email.toLowerCase().trim();

      let userData = await User.findOne({ email: email });

      if (!userData) {
        return res.status(400).json({ errors: 'Invalid credentials' });
      }

      const pwdCompare = await bcrypt.compare(req.body.password, userData.password);

      if (!pwdCompare) {
        return res.status(400).json({ errors: 'Invalid credentials' });
      }

      const data = {
        user: {
          id: userData.id,
        },
      };

      const authToken = jwt.sign(data, jwtSecret);
      return res.json({ success: true, authToken: authToken });
    } catch (error) {
      console.error(error);
      res.status(500).json({ errors: 'Server error' });
    }
  }
);

router.post('/customerprofile', async (req, res) => {
  try {
    let myData = await User.findOne({ email: req.body.email });
    res.json(myData);
  } catch (error) {
    res.status(500).send('Server Error: ' + error.message);
  }
});

//view all customers
router.post('/viewallcustomers', async (req, res) => {
  try {
    const allCustomers = await User.find({});
    res.json(allCustomers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ errors: 'Server error' });
  }
});


// Change Password route
router.post(
  '/changepassword',
  [
    body('password')
    .isLength({ min: 5 })
    .custom(password => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[a-zA-Z\d\W_]{8,12}$/.test(password))
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, one digit, one special character, and be 8-12 characters long'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
      const { email, oldPassword, newPassword } = req.body;

      // Find user by email
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({ success: false, message: 'User not found' });
      }

      // Compare old password with the one in the database
      const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);

      if (!isPasswordMatch) {
        return res.status(400).json({ success: false, message: 'Incorrect old password' });
      }

      // Hash the new password
      const salt = await bcrypt.genSalt(10);
      const hashedNewPassword = await bcrypt.hash(newPassword, salt);

      // Update the user with the new hashed password
      user.password = hashedNewPassword;
      await user.save();

      return res.json({ success: true, message: 'Password updated successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  }
);


// View Specific User Details route
router.post('/viewuser', async (req, res) => {
  try {
    const userId = req.body.id;

    // Find user by id
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.json({ success: true, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});


// Edit Profile route
router.post('/editprofile', async (req, res) => {
  try {
    const { id, name, email, location } = req.body;

    // Find user by id
    const user = await User.findById(id);

    if (!user) {
      return res.status(400).json({ success: false, message: 'User not found' });
    }

    // Update user details
    user.name = name;
    user.email = email;
    user.location = location;

    await user.save();

    return res.json({ success: true, message: 'Profile updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});


module.exports = router;
