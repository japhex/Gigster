// config/auth.js

// expose our config directly to our application using module.exports
module.exports = {

	'facebookAuth' : {
		'clientID' 		: '677577118944252', // your App ID
		'clientSecret' 	: '13c52bf59b3519a7d61e61367917f43f', // your App Secret
		'callbackURL' 	: 'http://localhost:8080/auth/facebook/callback'
	},

	'twitterAuth' : {
		'consumerKey' 		: 'your-consumer-key-here',
		'consumerSecret' 	: 'your-client-secret-here',
		'callbackURL' 		: 'http://localhost:8080/auth/twitter/callback'
	},

	'googleAuth' : {
		'clientID' 		: 'your-secret-clientID-here',
		'clientSecret' 	: 'your-client-secret-here',
		'callbackURL' 	: 'http://localhost:8080/auth/google/callback'
	}

};

// 'liveFacebook' : {
// 	'clientID' 		: '677931992242098', // your App ID
// 	'clientSecret' 	: '8d7a8328354f319183d392d42cd4f6da', // your App Secret
// 	'callbackURL' 	: 'http://gigsterapp.herokuapp.com/auth/facebook/callback'
// }