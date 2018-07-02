const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Challenge = new Schema({
    owner: {type: String, ref: 'users'},
    picture: String,
    title: String,
    description: String,
    option: {
        isPublic: Boolean,
        isStrict: Boolean
    },
    tags: [{ tag: String }],
    cheer: Number,
    issue: [{
        writer: {type: String, ref: 'users'},
        content: String,
        comment: [{
            writer: {type: String, ref: 'users'},
            content: String
        }]}
    ],
    diary: [{
        content: String,
        todo: String
    }],
    startDate: Date
});

module.exports = mongoose.model('Challenge', Challenge);