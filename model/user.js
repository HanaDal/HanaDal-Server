const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = new Schema({
    _id: String,
    name: String,
    picture: String,
    point: { type: Number, default: 0 },
    tags: [String],
    items: {
        skin: [String],
        badge: [String]
    },
    cheering: [{
        _id: {type: String, ref: 'challenges'}
    }]
});

module.exports = mongoose.model('User', User);