const mongoose = require('mongoose');

const Book = new mongoose.Schema({
  title: String,
  owner: { type: String, ref: 'users' },
  achievementRate: Number,
  completeDate: Date,
  content: String,
});

module.exports = mongoose.model('book', Book);
