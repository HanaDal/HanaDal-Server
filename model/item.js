const mongoose = require('mongoose');

const Item = new mongoose.Schema({
  name: String,
  cost: Number,
  picture: String,
  category: String,
});

module.exports = mongoose.model('item', Item);
