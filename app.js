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
	passport = require('passport'),
	util = require('util'),
	FacebookStrategy = require('passport-facebook').Strategy,
	nib = require('nib'),
	mongoose = require('mongoose');

/* ------------------------- */

passport.serializeUser(function(user, done) {
  done(null, user);
});
 
passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(new FacebookStrategy({
  clientID: "677577118944252",
  clientSecret: "13c52bf59b3519a7d61e61367917f43f",
  callbackURL: 'http://gigster.pagekite.me/auth/facebook/callback'
}, function(accessToken, refreshToken, profile, done) {
  process.nextTick(function() {
    //Assuming user exists
    done(null, profile);
  });
}));

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

app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.logger());
app.use(express.cookieParser("thissecretrocks"));
app.use(express.bodyParser());
app.use(express.methodOverride()); // must come after bodyParser
app.use(express.cookieSession({ secret: 'thissecretrocks', cookie: { maxAge: 60000 } }));
app.use(passport.initialize());
app.use(passport.session());

/* ------------------------- */

/*
 * Routes ------------------
 */
// Load all snippets
app.get('/', function (req, res) {
	Gig.find().sort({gig_date: 'asc'}).execFind(function (err, gigs) {
	  res.render('home', { title : 'Home', gigs: gigs, user: req.session.user});
	});	
});

// POST REQUESTS
// New Gig post
app.post('/create', function (req, res) {
    new Gig({
        name: req.body.name,
        artist: req.body.artist,
        venue: req.body.venue,
        gig_date: req.body.gigDate,
        future: req.body.future,
        created_date: Date.now()
    }).save(function(err, gig, count){
    	res.redirect( '/' );
	});
});

// Update Gig
app.post('/update/:id', function (req, res) {
	Gig.findByIdAndUpdate(req.params.id, {artist:req.body.artist,venue:req.body.venue,gig_date:req.body.gig_date}, function (err) {
		res.redirect( '/' );
	});
});

// Delete Gig
app.get('/delete/:id', function (req, res) {
	Gig.remove({_id: req.params.id}, function (err) {
		res.redirect( '/' );
	});
});

// JSON RESPONSE METHODS
// JSON | Load all gigs
app.get('/gigs', function (req, res) {
	Gig.find(function (err, gigs) {
		res.json({ title : 'Home', gigs: gigs});
	});
});

// USER SHIT
app.get('/account', ensureAuthenticated, function(req, res){
  res.render('account', { user: req.user });
});

app.get('/login', function(req, res){
  res.render('login', { user: req.user });
});

app.get('/auth/facebook', passport.authenticate('facebook'));
 
app.get('/auth/facebook/callback', passport.authenticate('facebook', {
  successRedirect: '/',
  failureRedirect: '/error'
}));

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

// WRITE API ACTION THAT GETS GIGS IN 2 LOTS. 
// API CALL TO '/futureshows' WHICH MAKES SURE THE DATE IS GREATER THAN TODAYS DATE
// API CALL TO '/pastshows' WHICH MAKES SURE THE DATE IS LESS THAN TODAYS DATE

// JSON | Load snippet by ID
// app.get('/snips/:id', function (req, res) {
//   	return ToDo.findById(req.params.id, function (err, todo) {
//     if (!err) {
//     	return res.json(todo);
//     } else {
//     	return console.log(err);
//     }
//   });
// });

// HTTP RESPONSE METHODS
// HTTP | Send gig request
// -- To do: send entire gig object in request, this sends ane email to user with a link that means they can sign up to 'attend' the gig
// app.get('/gigrequest', function (req, res) {
// 	ToDo.find(function (err, todos) {
// 		res.json({ title : 'Home', gigs: gigs});
// 	});
// });


/* ------------------------- */

/*
 * Local Port --------------
 */
var port = process.env.PORT || 5000;
server.listen(port);
app.listen(3000);
/* ------------------------- */

// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}