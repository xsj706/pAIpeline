// models/Canvas.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Canvas = sequelize.define('Canvas', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  data: {
    type: DataTypes.JSONB
  }
});

// Associations
User.hasMany(Canvas, { foreignKey: 'userId' });
Canvas.belongsTo(User, { foreignKey: 'userId' });

module.exports = Canvas;
