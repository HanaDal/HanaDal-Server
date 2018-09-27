const mongoose = require('mongoose');

const Book = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
  name: String,
  pictureUrl: String,
  achievementRate: Number,
  views: Number,
  completeDate: Date,
  content: [String],
});

module.exports = mongoose.model('book', Book);
