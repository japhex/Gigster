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
mongoose.connect(configDB.url);

require('./config/passport')(passport);
app.use(express.logger('dev'));
app.use(serveStatic(__dirname + '/public'));

// app configuration ==========================================================

app.configure(function() {
	app.use(express.logger('dev'));
	app.use(express.cookieParser());
	app.use(express.bodyParser());
	app.engine('ejs', engine);
	app.set('view engine', 'ejs');
	app.use(express.session({ secret: 'ilovescotchscotchyscotchscotch' }));
	app.use(passport.initialize());
	app.use(passport.session());
	app.use(flash());
});

// routes ======================================================================
require('./app/routes.js')(app, passport);

// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);
