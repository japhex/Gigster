/*
 * Routes ------------------
 */

module.exports = function(app, passport) {
	// Load all snippets
	app.get('/', function (req, res) {
		Gig.find().sort({gig_date: 'asc'}).execFind(function (err, gigs) {
		  res.render('home', { title : 'Home', gigs: gigs});
		});
		console.log(req);
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

	// route for login form
	// route for processing the login form
	// route for signup form
	// route for processing the signup form

	// route for showing the profile page
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

	// route for logging out
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/');
}