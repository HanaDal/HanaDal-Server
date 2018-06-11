const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Post = require('./post');

const Qna = new Schema({
    tags: [{ tag: String }],
    Post
    //위의 Post가 잘 되는지 확인
});

module.exports = mongoose.model('qnas', Qna);