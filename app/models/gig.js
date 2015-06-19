// app/models/gig.js
// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var gigSchema = mongoose.Schema({
    name: String,
    artist: String,
    venue: String,
    venueLat: String,
    venueLong: String,
    gig_date: Date,
    festival: Boolean,
    start_date: Date,
    end_date: Date,
    created_date: Date,
    set_list: Object
});

// create the model for users and expose it to our app
module.exports = mongoose.model('Gig', gigSchema);
