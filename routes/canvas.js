// routes/canvas.js

const express = require('express');
const router = express.Router();
const Canvas = require('../models/Canvas');

// Middleware to ensure user is authenticated
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/auth/login');
}

// Dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) => {
  res.render('dashboard', { user: req.user });
});

// Canvas page
router.get('/canvas', ensureAuthenticated, (req, res) => {
  res.sendFile('canvas.html', { root: './public' });
});

// Save canvas data
router.post('/save-canvas', ensureAuthenticated, async (req, res) => {
  const { data } = req.body;
  const pipelineId = 'pipeline-123'; // Replace with dynamic pipelineId if needed

  try {
    // Validate incoming data
    if (!data || !Array.isArray(data.circles)) {
      return res.status(400).send('Invalid canvas data format.');
    }

    // Find existing canvas for the user and pipeline
    let canvas = await Canvas.findOne({ where: { userId: req.user.id, pipelineId: pipelineId } });
    if (canvas) {
      // Update existing canvas
      canvas.data = data;
      await canvas.save();
    } else {
      // Create new canvas
      await Canvas.create({ data, userId: req.user.id, pipelineId: pipelineId });
    }
    res.send('Canvas saved successfully');
  } catch (err) {
    console.error('Error saving canvas:', err);
    if (process.env.NODE_ENV === 'development') {
      res.status(500).send(`Error saving canvas: ${err.message}`);
    } else {
      res.status(500).send('Error saving canvas.');
    }
  }
});

// Load canvas data
router.get('/load-canvas', ensureAuthenticated, async (req, res) => {
  const pipelineId = 'pipeline-123'; // Replace with dynamic pipelineId if needed
  try {
    const canvas = await Canvas.findOne({ where: { userId: req.user.id, pipelineId: pipelineId } });
    if (canvas) {
      res.json(canvas.data);
    } else {
      res.json({});
    }
  } catch (err) {
    console.error('Error loading canvas:', err);
    res.status(500).send('Error loading canvas.');
  }
});

module.exports = router;
