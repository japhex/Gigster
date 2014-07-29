// config/database.js
module.exports = {

	'url' : process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/gigster' // looks like mongodb://<user>:<pass>@mongo.onmodulus.net:27017/Mikha4ot
};