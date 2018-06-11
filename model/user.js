const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = new Schema({
    _id: String,
    name: String,
    introduce: String,  
    picture: String,
    point: Number,
    tags: [{ tag: String }],
    items: {
        skin: [{itemNo: String}],
        badge: [{itemNo: String}]
    }
    //응원한 도전 목록
});

module.exports = mongoose.model('users', User);