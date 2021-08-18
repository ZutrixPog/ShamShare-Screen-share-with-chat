const {Schema, model} = require('mongoose');

const Room = new Schema({
    peerid: String
});

module.exports = model('Room', Room);