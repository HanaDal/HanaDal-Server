const mongoose = require('mongoose');

const Qna = new mongoose.Schema({
  tags: [String],
  title: String,
  writer: { type: String, ref: 'users' },
  content: String,
  comment: [{
    writer: { type: String, ref: 'users' },
    content: String,
  }],
});

module.exports = mongoose.model('qna', Qna);
