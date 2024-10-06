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
router.get('/:userId/:pipelineId', ensureAuthenticated, (req, res) => {
  if (req.user.id !== parseInt(req.params.userId)) {
    return res.status(403).send('Forbidden');
  }
  res.sendFile('canvas.html', { root: './public' });
});

// Save canvas data
router.post('/save-canvas', ensureAuthenticated, async (req, res) => {
  const { data } = req.body;
  try {
    await Canvas.create({ data, userId: req.user.id });
    res.send('Canvas saved successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error saving canvas');
  }
});

// Load canvas data
router.get('/load-canvas', ensureAuthenticated, async (req, res) => {
  try {
    const canvas = await Canvas.findOne({ where: { userId: req.user.id } });
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
