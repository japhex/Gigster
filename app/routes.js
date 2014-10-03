var Gig = require('./models/gig.js');
var User = require('./models/user.js');

// app/routes.js
module.exports = function(app, passport) {

	// =====================================
	// HOME PAGE ===========================
	// =====================================
	app.get('/', function (req, res) {
		res.render('partials/_home.ejs', { 
			title : 'Home', 
			user : req.user
		});
	});

	// --==--==--==--==--==--==--==--==--==--

	// Gig API

	// --==--==--==--==--==--==--==--==--==--

	// =====================================
	// CREATE NEW GIG ======================
	// =====================================
	app.post('/create', isLoggedIn, function (req, res) {
	    new Gig({
	        name: req.body.name,
	        artist: req.body.artist,
	        venue: req.body.venue,
	        gig_date: req.body.gigDate,
	        future: req.body.future,
	        created_date: Date.now()
	    }).save(function(err, gig, count){
			User.findByIdAndUpdate(req.user._id, {$addToSet: {gigs: gig._id}}, function (err) {
				res.redirect( '/profile' );
			});
		});
	});

	// =====================================
	// UPDATE A GIG (FIND BY ID) ===========
	// =====================================
	app.post('/update/:id', function (req, res) {
		Gig.findByIdAndUpdate(req.params.id, {artist:req.body.artist,venue:req.body.venue,gig_date:req.body.gig_date}, function (err) {
			res.redirect( '/profile' );
		});
	});

	// =====================================
	// DELETE A GIG (FIND BY ID) ===========
	// =====================================
	app.get('/delete/:id', function (req, res) {
		Gig.remove({_id: req.params.id}, function (err) {
			res.redirect( '/' );
		});
	});

	// =====================================
	// LOAD ALL GIGS =======================
	// =====================================
	app.get('/gigs', function (req, res) {
		Gig.find(function (err, gigs) {
			res.json({ title : 'Home', gigs: gigs});
		});
	});	

	// --==--==--==--==--==--==--==--==--==--

	// Event API

	// --==--==--==--==--==--==--==--==--==--

	// =====================================
	// CREATE NEW EVENT ====================
	// =====================================
	app.post('/createEvent', isLoggedIn, function (req, res) {
	    new Event({
	        name: req.body.name,
	        artist: req.body.artist,
	        venue: req.body.venue,
	        gig_date: req.body.gigDate,
	        future: req.body.future,
	        created_date: Date.now()
	    }).save(function(err, gig, count){
			User.findByIdAndUpdate(req.user._id, {$addToSet: {gigs: gig._id}}, function (err) {
				res.redirect( '/profile' );
			});
		});
	});

	// =====================================
	// UPDATE AN EVENT (FIND BY ID) ========
	// =====================================
	app.post('/update/:id', function (req, res) {
		Gig.findByIdAndUpdate(req.params.id, {
			artist:req.body.artist,
			venue:req.body.venue,
			gig_date:req.body.gig_date
		}, function (err) {
			res.redirect( '/' );
		});
	});

	// =====================================
	// DELETE AN EVENT (FIND BY ID) ========
	// =====================================
	app.get('/delete/:id', function (req, res) {
		Gig.remove({_id: req.params.id}, function (err) {
			res.redirect( '/' );
			// Need to include gigStack in request params as well as user to re-render the page and pass back the correct data.
		});
	});

	// --==--==--==--==--==--==--==--==--==--

	// User API

	// --==--==--==--==--==--==--==--==--==--	

	// =====================================
	// SHOW USER ===========================
	// =====================================
	app.get('/users/:username', function (req, res) {
		User.findOne({username: req.params.username}, function (err, user) {
			Gig.find().sort({gig_date: -1}).where('_id').in(user.gigs).exec(function (err, records) {
				res.render('partials/models/user/_viewUser.ejs', { 
					title : user.name,
					user: user,
					gigStack: records
				});
			});
		});
	});

	// =====================================
	// LOGIN ===============================
	// =====================================
	// show the login form
	app.get('/login', function(req, res) {
		res.render('login.ejs', { message: req.flash('loginMessage') });
	});

	// process the login form
	app.post('/login', passport.authenticate('local-login', {
		successRedirect : '/profile', 
		failureRedirect : '/login', 
		failureFlash : true
	}));

	// =====================================
	// SIGNUP ==============================
	// =====================================
	// show the signup form
	app.get('/signup', function(req, res) {
		res.render('signup.ejs', { message: req.flash('signupMessage') });
	});

	// process the signup form
	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/profile', 
		failureRedirect : '/signup', 
		failureFlash : true
	}));

	// =====================================
	// PROFILE SECTION =========================
	// =====================================
	// we will want this protected so you have to be logged in to visit
	// we will use route middleware to verify this (the isLoggedIn function)
	app.get('/profile', isLoggedIn, function(req, res) {
		Gig.find().sort({gig_date: -1}).where('_id').in(req.user.gigs).exec(function (err, records) {
			res.render('profile.ejs', {
				user : req.user,
				gigStack : records
			});
		});
	});

	// =====================================
	// UPDATE USER =========================
	// =====================================
	// we will want this protected so you have to be logged in to visit
	// we will use route middleware to verify this (the isLoggedIn function)
	app.post('/user/update/:id', isLoggedIn, function(req, res) {
		User.findByIdAndUpdate(req.params.id, {
			username : req.body.username,
			name : req.body.name,
			email : req.body.email
		}, function (err) {
			res.redirect( '/profile' );
		});
	});

	// =====================================
	// FACEBOOK ROUTES =====================
	// =====================================
	// route for facebook authentication and login
	app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

	app.get('/auth/facebook/callback',
		passport.authenticate('facebook', {
			successRedirect : '/profile',
			failureRedirect : '/'
		}));

	// =====================================
	// LOGOUT ==============================
	// =====================================
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});
};

// route middleware to make sure
function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/');
}
