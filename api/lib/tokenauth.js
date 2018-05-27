/**
 * Token Library ,Here token encoding and decoding is done
 * @module lib/tokenauth
 */
var jwt   = require('jsonwebtoken');
var mongoose   = require('mongoose');
var authModel = require('./../models/auth');
var url = require('url');
var config = require('./../config/config.js');
var userModel    = require('../models/users');
var async = require('async');
var db_constants = require('../config/db_constants');
var util = require('./commonFunc');


/**
 * middleware function to generate a token
 **/
module.exports.getToken = function(auth,callback) {
    //Generate secret token
    var token = jwt.sign(
        {   id : auth._id,
            usr_id: auth.usr_id
        },
        config.SECRETTOKEN
    );
     callback(token);
};


module.exports.ValidateToken = function(req, res, cb){
    //console.log("\n\n config.SECRETTOKEN",config.SECRETTOKEN)
    var parsed_url = url.parse(req.url, true);
    var token = (req.body && req.body.access_token) || parsed_url.query.access_token || req.headers["x-access-token"] || req.headers["access-token"]; 
    if (token) {
            jwt.verify(token, config.SECRETTOKEN, function(err, decoded) {
                if(err) {
                    console.log("jwt.decode failed" + err);
                    return res.status(401).json({"status": "Failure", "msg": "Invalid token"});
                }
                authModel.authenticateDecodedToken(decoded.usr_id, function (err, user) {
                    if (user != null) {
                        req.user = user;
                        return cb();
                    } else {
                        console.log("user does not exist");
                        return res.status(401).json({"status": "Failure", "msg": "Invalid token"});
                    }
                })
            });

    } else {
        console.log("token is empty");
        return res.status(401).json({"status": "Failure", "msg": "Invalid token"});
    }
};

