// app/models/gig.js
// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var gigSchema = mongoose.Schema({
    name: String,
    artist: String,
    venue: String,
    gig_date: Date,
    created_date: Date
});

// create the model for users and expose it to our app
module.exports = mongoose.model('Gig', gigSchema);
