var Gig = require('./models/gig.js');
var User = require('./models/user.js');
//var helpers = require('gigster-utils');
var request = require('request');
var async = require('async');

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
	        venueLat: req.body.venueLat,
	        venueLong: req.body.venueLong,
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
	// app.post('/update/:id', function (req, res) {
	// 	Gig.findByIdAndUpdate(req.params.id, {artist:req.body.artist,venue:req.body.venue,gig_date:req.body.gig_date,venueLat:req.body.venueLat,venueLong:req.body.venueLong}, function (err) {
	// 		res.redirect('/profile');
	// 	});
	// });

	// Change to put method
	app.post('/update/:id', function(req, res) {
		Gig.findOne({_id:req.params.id}, function(err,gig){
			if (err) {
				res.send(422,'update failed');
			} else {
				//Cycle through all fields and only update ones that have a value
				for (var field in Gig.schema.paths) {
				   if ((field !== '_id') && (field !== '__v')) {
				      if (req.body[field] !== undefined) {
				         gig[field] = req.body[field];
				      }
				   }  
				}
				gig.save();
				res.redirect( '/profile' );
			}
		});
	});

	// =====================================
	// DELETE A GIG (FIND BY ID) ===========
	// =====================================
	app.get('/delete/:id', function (req, res) {
		Gig.remove({_id: req.params.id}, function (err) {
			res.redirect( '/profile' );
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

	// --==--==--==--==--==--==--==--==--==--

	// User API

	// --==--==--==--==--==--==--==--==--==--	

	// =====================================
	// SHOW ALL USERS ======================
	// =====================================	
	app.get('/users', isLoggedIn, function (req, res) {
		User.find().exec(function (err, users) {
			Gig.find().where('_id').in(req.user.gigs).exec(function (err, records) {
				res.render('users.ejs', { 
					users : users,
					user: req.user,
					gigStack: records,
					//helpers: helpers
				});
			});
		});
	});

	// =====================================
	// SHOW USER ===========================
	// =====================================
	app.get('/users/:username', isLoggedIn, function (req, res) {
		User.findOne({username: req.params.username}, function (err, user) {
			Gig.find().sort({gig_date: -1}).where('_id').in(user.gigs).exec(function (err, records) {
				// Organise gigs into past and future
				var currentDate = new Date(),
					futureGigs = [],
					pastGigs = [];

				for(var i=0; i< records.length; i++) {
					if (currentDate - records[i].gig_date < 0) {
						futureGigs.push(records[i]);
					} else {
						pastGigs.push(records[i]);
					}
				}

				futureGigs.sort(function(a,b){
				  return new Date(a.gig_date) - new Date(b.gig_date);
				});

				res.render('partials/models/user/_viewUser.ejs', { 
					title : user.name,
					user: user,
					gigStack: records,
					futureGigStack: futureGigs,
					pastGigStack: pastGigs
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
	// Async requests for different API calls


	app.get('/profile', isLoggedIn, function(req, res) {
		Gig.find().sort({gig_date: -1}).where('_id').in(req.user.gigs).exec(function (err, records) {

			// Organise gigs into past and future
			var currentDate = new Date(),
				futureGigs = [],
				pastGigs = [];

			for(var i=0; i< records.length; i++) {
				if (currentDate - records[i].gig_date < 0) {
					futureGigs.push(records[i]);
				} else {
					pastGigs.push(records[i]);
				}
			}

			futureGigs.sort(function(a,b){
			  return new Date(a.gig_date) - new Date(b.gig_date);
			});

			request('http://ws.audioscrobbler.com/2.0/?method=user.gettopartists&user=' + req.user.lastfm + '&api_key=87a726f5832926366bd09f6a3935d792&format=json', function(err, resp, body) {
				res.render('profile.ejs', {
					user : req.user,
					futureGigStack : futureGigs,
					pastGigStack : pastGigs,
					gigStack: records,
					lastFmArtists : JSON.parse(body)
				});
			});
		});
	}); 



	// TESTING FOR EXTENDED PROFILE
	// 
	// 
	// app.get('/new_profile', isLoggedIn, function(req,res) {

	//     var gigStack = function(callback) {
	//         Gig.find().sort({gig_date: -1}).where('_id').in(req.user.gigs).exec(function (err, records) {
	//             callback(null, records);
	//         });
	//     };

	//     var lastFmArtists = function(gigRecords, callback) {
	// 	    request('http://ws.audioscrobbler.com/2.0/?method=user.gettopartists&user=' + req.user.lastfm + '&api_key=87a726f5832926366bd09f6a3935d792&format=json&limit=5', function(err, resp, body) {
	// 	        callback(null, gigRecords, JSON.parse(body));
	// 	    });
	//     };

	//     var bandsInTown = function(gigRecords, lastFmArtists, callback) {
	// 	    var gigDates = [];

	// 	    var sendRequest = function(artist, requestCallback) {
	// 	        request('http://api.bandsintown.com/artists/' + artist.name + '/events/search.json?api_version=2.0&app_id=gigster&location=London,UK&radius=10', function(err,results){
	// 	        	gigDates.push(results);
	// 	        });
	// 	    };

	// 	    async.map(lastFmArtists.topartists.artist, sendRequest, function(err, responseArray) {
	// 	    	console.log(gigDates);
	// 	        callback(null, gigRecords, lastFmArtists, bandsArray);
	// 	    });
	// 	};

	// 	async.waterfall([gigStack,lastFmArtists,bandsInTown],function(err,result){
	// 		res.render('new_profile.ejs', {
	// 			user: req.user,
	// 			gigsAndData: result
	// 		});
	// 	});
	// });

	// =====================================
	// UPDATE USER =========================
	// =====================================
	// we will want this protected so you have to be logged in to visit
	// we will use route middleware to verify this (the isLoggedIn function)
	// Change to put method
	app.post('/user/update/:id', isLoggedIn, function(req, res) {
		User.findOne({_id:req.params.id}, function(err,user){
			if (err) {
				res.send(422,'update failed');
			} else {
				//Cycle through all fields and only update ones that have a value
				for (var field in User.schema.paths) {
				   if ((field !== '_id') && (field !== '__v')) {
				      if (req.body[field] !== undefined) {
				         user[field] = req.body[field];
				      }  
				   }  
				}
				user.save();
				res.redirect( '/profile' );
			}
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
