const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Qna = new Schema({
    tags: [String],
    writer: {type: String, ref: 'users'},
    content: String,
    comment: [{
        writer: {type: String, ref: 'users'},
        content: String
    }]
});

module.exports = mongoose.model('Qna', Qna);