'use strict'; 

/**
 * Module dependencies.
 */
var dbModel = require('./db_model');
var Common = new (require('../helpers/Common'))();
var MD5     = require('md5');
module.exports.collectionName = 'users';


/** user Schema **/
var userSchema = {
	id : {type : Number},
    username : {type : String},
    first_name : {type : String},
	surname : {type : String},
	email : {type : String, index: {unique: true, dropDups: true}},
	password : {type : String},
    address : {type : String},
	picture : {type : String},
    phone : {type : String},
	status : {type : Number, default:1}, //{0:New, 1:Active, 2:Paused, 3:Deleted}
    crtd_on: {type: Number, default: Common.getTimestamp()},
    mod_on: {type: Number, default: Common.getTimestamp()},
    lastLogin: { type: Number },
    token: {type: String}
};

exports.baseModel = new dbModel(module.exports.collectionName, userSchema,true);

/**
 * Function to save user to database
 * @param mappedJson {JSON_obj} the json object to be added
 * @param: callback {String} the callback function
 */
module.exports.addUser = function(mappedJson, callback) {
    mappedJson.password = MD5(mappedJson.password);
    exports.baseModel.create(mappedJson, function(error, newUser){
        callback(error, newUser);
    });
};

/**
 * Function to update user data in database
 * @param userId {int} the user id
 * @param obj {JSON_obj} the json object to be updated
 * @param: callback {String} the callback function
 */
module.exports.updateUser = function(userId, obj, option, callback) {

    if(obj.password){
        obj.password = MD5(obj.password);
    }
    exports.baseModel.update(userId, obj, option, function(err,updatedUser){
        callback(err, updatedUser);
    });

};


/**
 * Function to fetch all user's details 
 */
module.exports.fetchAllUser = function(conditions, selectparams, limit, sort, callback){    
    var results = exports.baseModel.find(conditions, selectparams, limit, sort, function(error, usersData){
        callback(error, usersData);
    })
}

/**
 * Function to find users by email
 * @param email {String} the email of employee
 * @param callback {String} the callback function
 */

module.exports.getUserByEmail = function(email, callback) {
    var emlLowerCase = '';
    if(email) {
        emlLowerCase = email.toLowerCase();
    }
    exports.baseModel.findOne({email: emlLowerCase},'', function(err, doc) {
        callback(err, doc);
    });
};

/**
 * Function to compare password for valid or invalid. return null for valid and  string "Invalid password" for invalid
 * @param userPassword {String} the user password
 * @param dbPassword {String} the password from database
 * @param cb {String} the callback function
 */
module.exports.comparePassword = function(userPassword, dbPassword, cb) {
    if (MD5(userPassword) == dbPassword){
        cb(null);
    }else{
        cb('Invalid password');
    }
};

module.exports.checkUserStatus = function(status, cb) {
    if (status == 1){
        cb(null);
    }else{
        cb('inactive user');
    }
};


module.exports.getUserById = function (usrId, callback) {
    exports.baseModel.findOne({id: usrId},'', function(err, doc) {
        callback(err, doc);
    });
};

module.exports.getUserByResetToken = function (resetToken, callback) {
    exports.baseModel.findOne({resetPasswordToken: resetToken},'', function(err, doc) {
        callback(err, doc);
    });
};

/**
 * Function to update user data in database
 * @param userId {int} the user id
 * @param obj {JSON_obj} the json object to be updated
 * @param: callback {String} the callback function
 */
module.exports.expireResetLink = function(timestamp, obj, option, callback) {

    exports.baseModel.update(timestamp, obj, option, function(err,updatedUser){
        callback(err, updatedUser);
    });

};