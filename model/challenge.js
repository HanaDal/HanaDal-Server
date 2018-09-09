const mongoose = require('mongoose');

const Challenge = new mongoose.Schema({
  owner: { type: String, ref: 'users' },
  picture: String,
  title: String,
  description: String,
  isPublic: Boolean,
  isStrict: Boolean,
  tags: [{ tag: String }],
  cheer: Number,
  issue: [{
    writer: { type: String, ref: 'users' },
    content: String,
    comment: [{
      writer: { type: String, ref: 'users' },
      content: String,
    }],
  },
  ],
  diary: [{
    title: String,
    content: String,
    todo: String,
  }],
  startDate: Date,
});

module.exports = mongoose.model('Challenge', Challenge);
