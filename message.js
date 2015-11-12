const mongoose = require('mongoose');
const Schema = require('mongoose').Schema;

const message = Schema({
    url: String
})

module.exports = mongoose.model('Messages', message);
