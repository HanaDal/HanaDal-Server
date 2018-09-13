const mongoose = require('mongoose');

const User = new mongoose.Schema({
  _id: String,
  name: String,
  picture: String,
  point: { type: Number, default: 0 },
  tags: [String],
  items: {
    skin: [String],
    badge: [String],
  },
  cheering: [{ type: mongoose.Schema.Types.ObjectId, ref: 'challenges' }],
});

module.exports = mongoose.model('user', User);
