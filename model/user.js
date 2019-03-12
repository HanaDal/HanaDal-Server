const mongoose = require('mongoose');

const User = new mongoose.Schema({
  id: String,
  name: String,
  pictureUrl: String,
  point: { type: Number, default: 0 },
  tags: [String],
  items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'item' }],
  cheering: [{ type: mongoose.Schema.Types.ObjectId, ref: 'challenge' }],
});

module.exports = mongoose.model('user', User);
