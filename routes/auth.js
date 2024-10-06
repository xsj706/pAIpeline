// routes/auth.js

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const User = require('../models/User');

// Registration page
router.get('/register', (req, res) => {
  res.sendFile('register.html', { root: './public' });
});

// Handle registration
router.post('/register', async (req, res) => {
  const { username, password, password2 } = req.body;
  let errors = [];

  if (!username || !password || !password2) {
    errors.push({ msg: 'Please fill in all fields' });
  }
  if (password !== password2) {
    errors.push({ msg: 'Passwords do not match' });
  }
  if (errors.length > 0) {
    res.send(errors);
  } else {
    try {
      let user = await User.findOne({ where: { username } });
      if (user) {
        errors.push({ msg: 'Username is already registered' });
        res.send(errors);
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({ username, password: hashedPassword });
        res.redirect('/auth/login');
      }
    } catch (err) {
      console.error(err);
      res.send('Error registering user');
    }
  }
});

// Login page
router.get('/login', (req, res) => {
  res.sendFile('login.html', { root: './public' });
});

// Handle login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/auth/login',
    failureFlash: true
  })(req, res, next);
});

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/auth/login');
});

module.exports = router;
