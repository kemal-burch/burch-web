/**
 *
 * @module lib/logger
 * @type {exports}
 */
var config = require('../config/config');
var winston = require('winston');
require('winston-mongodb').MongoDB;


module.exports = function (module) {
    var path = module.filename.split('/').slice(-2).join('/'); //using filename in log statements

    var transportsObj = [];
    var transportList = config.ERROR_TRANSPORT;

    for(transportValue in transportList) {
        if(transportList[transportValue] == 'file')
            transportsObj.push( new winston.transports.File({ filename: config.ERROR_TRANSPORT_LOG_FILE_PATH }));
        if(transportList[transportValue] == 'mongodb')
            transportsObj.push(  new (winston.transports.MongoDB)({host :config.LOGDB_MONGO_USERNAME+':'+config.LOGDB_MONGO_PASSWORD+'@'+config.LOGDB_MONGO_HOST, db:config.LOGDB_MONGO_DBNAME, level:config.ERROR_LEVEL_ERROR,collection: config.LOGDB_MONGO_ERRORLOG}));
        if(transportList[transportValue] == 'console')
            transportsObj.push(new winston.transports.Console({
                colorize:   true,
                level:      config.ERROR_LEVEL_DEBUG,
                label:      path
            }));
    }
    return new winston.Logger({transports:transportsObj});
}