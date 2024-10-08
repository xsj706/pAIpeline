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
router.get('/dashboard', ensureAuthenticated, async (req, res) => {
  try {
    const pipelines = await Canvas.findAll({ where: { userId: req.user.id } });
    res.render('dashboard', { user: req.user, pipelines });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error loading dashboard');
  }
});

// Canvas page
router.get('/canvas/:userId/:pipelineId', ensureAuthenticated, (req, res) => {
  if (req.user.id !== parseInt(req.params.userId)) {
    return res.status(403).send('Forbidden');
  }
  res.sendFile('canvas.html', { root: './public' });
});



// Route to create a new pipeline
router.get('/new-pipeline/:pipelineName', ensureAuthenticated, async (req, res) => {
  const { pipelineName } = req.params;
  
  try {
    // Check if pipeline already exists for the user
    const existingPipeline = await Canvas.findOne({ where: { userId: req.user.id, pipelineId: pipelineName } });
    if (existingPipeline) {
      return res.status(400).send('Pipeline with this name already exists.');
    }

    // Create a new pipeline entry
    await Canvas.create({ userId: req.user.id, pipelineId: pipelineName, data: {} });
    res.redirect(`/canvas/${req.user.id}/${pipelineName}`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error creating pipeline');
  }
});


// Save canvas data
router.post('/save-canvas', ensureAuthenticated, async (req, res) => {
  const { data } = req.body;
  try {
    await Canvas.create({ data, userId: req.user.id });
    console.error(data);
    res.send('Canvas saved successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error saving canvas');
  }
});

// Load canvas data
router.get('/load-canvas/:pipelineId', ensureAuthenticated, async (req, res) => {
  try {
    const canvas = await Canvas.findOne({
      where: {
        userId: req.user.id,
        pipelineId: req.params.pipelineId
      }
    });
    if (canvas) {
      res.json(canvas.data);
    } else {
      res.json({});
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Error loading canvas');
  }
});

module.exports = router;
