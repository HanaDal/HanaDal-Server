const mongoose = require('mongoose');

const Book = new mongoose.Schema({
  title: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
  achievementRate: Number,
  completeDate: Date,
  content: [String],
});

module.exports = mongoose.model('book', Book);
