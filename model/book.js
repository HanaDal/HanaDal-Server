const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Book = new Schema({
    title: String,
    owner: {type: String, ref: 'users'},
    achievementRate: Number,
    completeDate: Date,
    content: String
});

module.exports = mongoose.model('Book', Book);