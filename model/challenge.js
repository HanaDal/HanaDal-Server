const mongoose = require('mongoose');

const Challenge = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
  pictureKey: { type: String },
  name: String,
  description: String,
  achievementRate: { type: Number, default: 0 },
  isPublic: Boolean,
  isStrict: Boolean,
  tags: [String],
  cheer: { type: Number, default: 0 },
  issue: [{
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    title: String,
    content: String,
    comment: [{
      author: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
      content: String,
    }],
  },
  ],
  diary: [{
    title: String,
    content: String,
  }],
  todo: [String],
  startDate: { type: Date, default: Date.now() },
});

module.exports = mongoose.model('challenge', Challenge);
