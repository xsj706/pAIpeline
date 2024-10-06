// server.js

require('dotenv').config();

const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const app = express();
const path = require('path');
const sequelize = require('./config/database');
const passportConfig = require('./config/passportConfig');

// Passport configuration
passportConfig(passport);

// EJS as the template engine
app.set('view engine', 'ejs');

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET || 'your_secret_key',
  resave: false,
  saveUninitialized: false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', require('./routes'));

// Database connection and model synchronization
sequelize.authenticate()
  .then(() => {
    console.log('Database connected...');
    return sequelize.sync();
  })
  .then(() => {
    console.log('Models synchronized.');
  })
  .catch(err => {
    console.error('Error connecting to the database:', err);
  });

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
