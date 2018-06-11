const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Post = require('./post');

const Challenge = new Schema({
    owner: {type: String, ref: 'users'},
    title: String,
    description: String,
    option: {
        isPublic: Boolean,
        isStrict: Boolean
    },
    tags: [{ tag: String }],
    issue: [Post],
    //TODO: 할일, 다이어리, 응원
});

module.exports = mongoose.model('challenges', Challenge);