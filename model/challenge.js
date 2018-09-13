const mongoose = require('mongoose');

const Challenge = new mongoose.Schema({
  author: { type: String, ref: 'Users' },
  pictureUrl: { type: String, default: 'https://images.unsplash.com/photo-1517057011470-8f36d636e6ca?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=9dcecd9ec3b07624dedb0df0c7b3eeee&dpr=1&auto=format&fit=crop&w=1000&q=80&cs=tinysrgb' },
  title: String,
  description: String,
  achievementRate: { type: Number, default: 0 },
  isPublic: Boolean,
  isStrict: Boolean,
  tags: [String],
  cheer: { type: Number, default: 0 },
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
  }],
  todo: [[String]],
  startDate: { type: Date, default: Date.now() },
});

module.exports = mongoose.model('challenge', Challenge);
