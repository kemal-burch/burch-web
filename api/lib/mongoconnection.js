/**
 * Sets the database connection using mongoose.
 * @module lib/mongoconnection
 * @type {exports}
 */

var mongoose = require('mongoose');
var config = require('./../config/config');
var db = mongoose.connection;
var connectionInstance;

//if already we have a connection, don't connect to database again
if(connectionInstance) {
	module.exports = connectionInstance;
	return;
}

	 connectionInstance  = mongoose.connect('mongodb://'+ config.MONGO_HOST +'/'+ config.MONGO_DBNAME, {useMongoClient:true});


//error connecting to db
db.on('error', function (err) {
	if(err) {
		throw err;
	}
});
//db connected
db.once('open', function() {
	console.log("MongoDb connected successfully, date is = "+new Date());
});

//export the db connection
mongoose.Promise = global.Promise;
module.exports = connectionInstance;
var logDebug = config.MONGO_LOG_VERBOSE || false;
mongoose.set('debug', logDebug);
	