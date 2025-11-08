const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verify-token');
const User = require('../models/user');

//get user profile
router.get('/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('-hashedPassword');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//update user profile
router.put('/:id', verifyToken, async (req, res) => {
  try {

    const { name, phone, area, email } = req.body;
    const updatedData = { name, phone, area };

    // email updating should first check if it already exist 
    // it should be handled seperately
    if (email) {
      const emailExists = await User.findOne({ email });
      if (emailExists && emailExists._id !== req.params.id) {
        return res.status(409).json({ error: 'Email already in use' });
      }
      updatedData.email = email;
    }
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updatedData,
    ).select('-hashedPassword');

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
});


module.exports = router;
