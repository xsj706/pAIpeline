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
  },
  pipelineId: {
    type: DataTypes.INTEGER,
    allowNull: true, // Change this to true to allow NULL values
    references: {
      model: 'Pipelines', // Name of the referenced table
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL', // Optional: Define behavior on delete
  },
});

// Associations
User.hasMany(Canvas, { foreignKey: 'userId' });
Canvas.belongsTo(User, { foreignKey: 'userId' });

module.exports = Canvas;
