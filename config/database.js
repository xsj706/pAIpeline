// config/database.js

const { Sequelize } = require('sequelize');
require('dotenv').config();

const isProduction = process.env.NODE_ENV === 'production';

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  protocol: 'postgres',
  logging: false,
  ssl: isProduction, // Use SSL in production
  dialectOptions: isProduction
    ? {
        ssl: {
          require: true,
          rejectUnauthorized: false, // Allow self-signed certificates (Heroku)
        },
      }
    : {},
});

module.exports = sequelize;
