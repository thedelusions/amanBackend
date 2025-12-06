const express = require('express');
const router = express.Router();
const https = require('https');

const User = require('../models/user');
const Report = require('../models/report');
const Comment = require('../models/comment');

const verifyToken = require('../middleware/verify-token');

// Helper function to send Discord webhook notification
function sendDiscordNotification(report) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  
  if (!webhookUrl) {
    console.warn('Discord webhook URL not configured');
    return;
  }

  try {
    const message = {
      content: `**New Report Submitted**\n\n` +
               `**Title:** ${report.title}\n` +
               `**Type:** ${report.type}\n` +
               `**Area:** ${report.area}\n` +
               `**Description:** ${report.description}\n` +
               `**Status:** ${report.status}\n\n` +
               `[View Report](https://aman-frontend.vercel.app/reports/${report._id})`
    };

    const url = new URL(webhookUrl);
    const data = JSON.stringify(message);

    const options = {
      hostname: url.hostname,
      port: 443,
      path: url.pathname + url.search,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data),
      },
    };

    const req = https.request(options, (res) => {
      if (res.statusCode !== 200 && res.statusCode !== 204) {
        console.error('Failed to send Discord notification. Status:', res.statusCode);
      }
    });

    req.on('error', (error) => {
      console.error('Error sending Discord notification:', error.message);
    });

    req.write(data);
    req.end();
  } catch (error) {
    console.error('Error sending Discord notification:', error.message);
  }
}

//new report
router.post('/', verifyToken, async (req, res) => {

  try {
    const { area, title, type, description } = req.body;

    const missingFields = [];
    if (!title || title.trim() === '') missingFields.push('title');
    if (!type || type.trim() === '') missingFields.push('type');
    if (!description || description.trim() === '') missingFields.push('description');
    if (!area || area.trim() === '') missingFields.push('area');

    if (missingFields.length > 0) {
      return res.status(400).json({ 
        message: 'Missing or empty required fields', 
        missingFields 
      });
    }

    const report = await Report.create({
      author: req.user._id,
      area,
      title,
      type,
      description,
      status: 'pending',
    });

    // Send Discord notification after successfully creating the report (non-blocking)
    sendDiscordNotification(report);

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