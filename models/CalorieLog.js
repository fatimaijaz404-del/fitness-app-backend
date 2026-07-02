const mongoose = require('mongoose');

const calorieLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  foodName: {
    type: String,
    required: true
  },
  calories: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const CalorieLog = mongoose.model('CalorieLog', calorieLogSchema);

module.exports = CalorieLog;