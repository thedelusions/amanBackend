const express = require('express');
const router = express.Router();

const User = require('../models/user');
const Report = require('../models/report');

const verifyToken = require('../middleware/verify-token');

//new report
router.post('/', verifyToken, async (req, res) => {
  try {
    const { areaName, title, type, description } = req.body;

    const report = await Report.create({
      author: req.user._id,
      areaName,
      title,
      type,
      description
    });


    res.status(201).json(report);
  } catch (err) {
    res.status(500).json({ message: 'Error creating report', error: err.message });
  }
});

//get all reports
router.get('/', async (req, res) => {
  try {
    const reports = await Report.find().populate('author', 'username');
    res.status(200).json(reports);
  } catch (err) {
    res.status(500).json({ message: 'Error getting the reports', error: err.message });
  }
});

//show singel report
router.get('/:id', async (req, res) => {
  try {
    const report = await Report.findById(req.params.id).populate('author', 'username');
    
    res.status(200).json(report);
  } catch (err) {
    res.status(500).json({ message: 'Error getting the report', error: err.message });
  }
});

module.exports = router;