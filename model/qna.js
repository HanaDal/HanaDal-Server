const mongoose = require('mongoose');

const Qna = new mongoose.Schema({
  title: String,
  tags: [String],
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
  content: String,
  comment: [{
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    content: String,
  }],
  answerCount: { type: Number, default: 0 },
});

module.exports = mongoose.model('qna', Qna);
