const express = require('express');
const router = express.Router();

const User = require('../models/user');
const Report = require('../models/report');

const verifyToken = require('../middleware/verify-token');

//new report
router.post('/', verifyToken, async (req, res) => {
  try {
    const { areaName, title, type, description } = req.body;

    const report = await Report({
      author: req.user._id,
      areaName,
      title,
      type,
      description
    });

    await report.create();

    res.status(201).json(report);
  } catch (err) {
    res.status(500).json({ message: 'Error creating report:', error: err.message });
  }
});

module.exports = router;