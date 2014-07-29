// server.js

// set up ======================================================================
// get all the tools we need
var express  = require('express');
var engine = require('ejs-locals');
var connect = require('connect');
var app      = express();
var port     = process.env.PORT || 8080;
var mongoose = require('mongoose');
var passport = require('passport');
var sass = require('node-sass');
var flash    = require('connect-flash');
var	util = require('util');
var	nib = require('nib');
var serveStatic = require('serve-static');

var configDB = require('./config/database.js');

// configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database

require('./config/passport')(passport); // pass passport for configuration
app.use(express.logger('dev'));

// SASS ========================================================================

app.use(serveStatic(__dirname + '/public'));

// app configuration ==========================================================

app.configure(function() {

	// set up our express application
	app.use(express.logger('dev')); // log every request to the console
	app.use(express.cookieParser()); // read cookies (needed for auth)
	app.use(express.bodyParser()); // get information from html forms

	app.engine('ejs', engine);
	app.set('view engine', 'ejs'); // set up ejs for templating

	// required for passport
	app.use(express.session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
	app.use(passport.initialize());
	app.use(passport.session()); // persistent login sessions
	app.use(flash()); // use connect-flash for flash messages stored in session

});

// routes ======================================================================
require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);
