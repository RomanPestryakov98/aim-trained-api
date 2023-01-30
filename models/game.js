const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  time: {
    type: Number,
    required: true,
  },
  record: {
    type: Number,
    required: true,
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('game', gameSchema);