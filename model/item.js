const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Item = new Schema([{
    name: String,
    cost: Number,
    picture: String,
    category: String
}]);

module.exports = mongoose.model('Item', Item);