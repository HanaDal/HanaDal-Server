const mongoose = require('mongoose');

const Book = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
  name: String,
  pictureUrl: String,
  achievementRate: Number,
  completeDate: Date,
  content: [String],
});

module.exports = mongoose.model('book', Book);
