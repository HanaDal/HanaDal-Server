const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = new Schema({
    _id: String,
    name: String,
    introduce: String,  
    picture: String,
    point: Number,
    tags: [String],
    items: {
        skin: [{itemNo: {type: String, ref: 'items'}}],
        badge: [{itemNo: {type: String, ref: 'items'}}]
    },
    cheering: [{
        _id: {type: String, ref: 'challenges'}
    }]
});

module.exports = mongoose.model('User', User);