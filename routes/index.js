// routes/index.js

const express = require('express');
const router = express.Router();
const authRoutes = require('./auth');
const canvasRoutes = require('./canvas');

// Home page
router.get('/', (req, res) => {
  res.send('Welcome to the SaaS app!');
});

router.use('/auth', authRoutes);
router.use('/', canvasRoutes);

module.exports = router;
