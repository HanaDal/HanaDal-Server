const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Post = new Schema({
    writer: {type: String, ref: 'users'},
    content: String,
    coment: [{
        writer: {type: String, ref: 'users'},
        content: String
    }]
});

module.exports = Post;