	/*
 * Module dependencies ------
 
 - Handlebars templating
 - SASS CSS pre-processing

 */
var express = require('express'),
	connect = require('connect'),
	sass = require('node-sass'),
	exphbs  = require('express3-handlebars'),
	hbshelpers = require('handlebars-helpers'),
	util = require('util'),
	nib = require('nib'),
	mongoose = require('mongoose'),
  port = process.env.PORT || 5000;

/* ------------------------- */

var app = express();

/*
 * Mongo Connection --------
 */
mongoose.connect('mongodb://localhost/gigster', function(err) { if (err) console.log(err);});

// DB connection open
var gigSchema = mongoose.Schema({
	name: String,
	artist: String,
	venue: String,
	gig_date: Date,
	future: Boolean,
	created_date: Date
});

var Gig = mongoose.model('Gig', gigSchema);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
});

/* ------------------------- */

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.use(express.logger('dev'));

var server = connect.createServer(
  sass.middleware({
      src: __dirname + '/public/stylesheets/sass', 
      dest: __dirname + '/public/stylesheets', 
      debug: true
  }),
  connect.static(__dirname + '/public')
);

// app configuration ==========================================================

require('./config/passport')(passport); // pass passport for configuration

app.configure(function() {

  // set up our express application
  app.use(express.logger('dev')); // log every request to the console
  app.use(express.cookieParser()); // read cookies (needed for auth)
  app.use(express.bodyParser()); // get information from html forms

  app.set('view engine', 'ejs'); // set up ejs for templating

  // required for passport
  app.use(express.session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
  app.use(passport.initialize());
  app.use(passport.session()); // persistent login sessions
  app.use(flash()); // use connect-flash for flash messages stored in session

});

// routes ======================================================================

require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport


// local port ==================================================================

server.listen(port);
app.listen(3000);