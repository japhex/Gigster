var Gig = require('./models/gig.js');

// app/routes.js
module.exports = function(app, passport) {

	// =====================================
	// HOME PAGE (LOAD ALL GIGS) ===========
	// =====================================
	app.get('/', function (req, res) {
		Gig.find().sort({gig_date: 'asc'}).exec(function (err, gigs) {
		  res.render('home', { title : 'Home', gigs: gigs});
		});
	});

	// =====================================
	// CREATE NEW GIG ======================
	// =====================================
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

	// =====================================
	// UPDATE A GIG (FIND BY ID) ===========
	// =====================================
	app.post('/update/:id', function (req, res) {
		Gig.findByIdAndUpdate(req.params.id, {artist:req.body.artist,venue:req.body.venue,gig_date:req.body.gig_date}, function (err) {
			res.redirect( '/' );
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

	// =====================================
	// LOGIN ===============================
	// =====================================
	// show the login form
	app.get('/login', function(req, res) {

		// render the page and pass in any flash data if it exists
		res.render('login.ejs', { message: req.flash('loginMessage') });
	});

	// process the login form
	app.post('/login', passport.authenticate('local-login', {
		successRedirect : '/profile', // redirect to the secure profile section
		failureRedirect : '/login', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));

	// =====================================
	// SIGNUP ==============================
	// =====================================
	// show the signup form
	app.get('/signup', function(req, res) {

		// render the page and pass in any flash data if it exists
		res.render('signup.ejs', { message: req.flash('signupMessage') });
	});

	// process the signup form
	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/profile', // redirect to the secure profile section
		failureRedirect : '/signup', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));

	// =====================================
	// PROFILE SECTION =========================
	// =====================================
	// we will want this protected so you have to be logged in to visit
	// we will use route middleware to verify this (the isLoggedIn function)
	app.get('/profile', isLoggedIn, function(req, res) {
		res.render('profile.ejs', {
			user : req.user // get the user out of session and pass to template
		});
	});

	// =====================================
	// FACEBOOK ROUTES =====================
	// =====================================
	// route for facebook authentication and login
	app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

	// handle the callback after facebook has authenticated the user
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
