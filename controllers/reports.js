const express = require('express');
const router = express.Router();

const User = require('../models/user');
const Report = require('../models/report');
const Comment = require('../models/comment');

const verifyToken = require('../middleware/verify-token');

//new report
router.post('/', verifyToken, async (req, res) => {

  try {
    const { area, title, type, description } = req.body;

    if (!title || !type || !description || !area) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const report = await Report.create({
      author: req.user._id,
      area,
      title,
      type,
      description,
      status: 'pending',
    });

    res.status(201).json(report);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


//get all reports
router.get('/', async (req, res) => {
  try {
    const reports = await Report.find({status: 'approved'}).populate('author', 'name');
    res.status(200).json(reports);
  } catch (err) {
    res.status(500).json({ message: 'Error getting the reports', error: err.message });
  }
});

//get reports in user area for the community page 
router.get('/area/:area', verifyToken, async (req, res) => {
  try {
    const reports = await Report.find({
      status: 'approved',
      area: req.params.area,
    });

    res.status(200).json(reports);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching community reports' });
  }
});

//show singel report
router.get('/:id', async (req, res) => {
  try {
    const report = await Report.findById(req.params.id).populate('author', 'name');
    
    res.status(200).json(report);
  } catch (err) {
    res.status(500).json({ message: 'Error getting the report', error: err.message });
  }
});

//update report
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    const updatedReport = await Report.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json(updatedReport);
  } catch (err) {
    res.status(500).json({ message: 'Error updating the report', error: err.message });
  }
});

//delete report
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);

    await Comment.deleteMany({ report_id: req.params.id });

    const deletedReport = await Report.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Report deleted', report: deletedReport });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting the report', error: err.message });
  }
});

module.exports = router;