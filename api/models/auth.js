/**
 * Model for the auth_info collection.
 * This module perform schema validation and database operations on auth_info collection
 * @module models/auth
 * @type {string}
 */
var Common = new (require('../helpers/Common'))();

module.exports.collectionName = 'auth_infos';
/**
 * The schema for authinfo collection
 * @type {{usr_type: {type: (String|*|Function), required: boolean}, usr_id: {type: (String|*|Function), required: boolean}, crtd_on: {type: (Date|*), default: Function}, mod_on: {type: (Date|*), default: Function}}}
 */
var authSchema ={
    //usr_type: { type: String, required: true },
    usr_id: { type: String, required: true },
    crtd_on: {type: Number, default: Common.getTimestamp()},
    mod_on: {type: Number, default: Common.getTimestamp()}
}

var dbModel = require('./db_model');
exports.baseModel = new dbModel(module.exports.collectionName, authSchema);

/**
 * Function does authentication for user
 * @param user {String} the user type
 * @param userId {String} the user id
 * @param callback {String} the callback function
 */
module.exports.addAuth = function(userId, callback) {
    exports.baseModel.create({"usr_id" : userId},function(err, newauth){
       return callback(err, newauth);
    });
};

/**
 * Function to authenticate decoded token values
 * @param usr_id {String} the user id
 * @param usr_type {String} the user type
 * @param cb {String} the callback function
 */
module.exports.authenticateDecodedToken = function(usr_id, cb) {
    exports.baseModel.findOne({usr_id: usr_id},'_id usr_id ', function(err, doc) {
        cb(err, doc);
    });
};

/**
 * Function to authenticate decoded token with _id and usr_id combo
 * @param usr_id {String} the user id
 * @param usr_type {String} the user type
 * @param cb {String} the callback function
 */
module.exports.authenticateDecodedTokenNew = function(_id, usr_id, cb) {
    exports.baseModel.findOne({_id:_id, usr_id: usr_id},'_id usr_id ', function(err, doc) {
        cb(err, doc);
    });
};

/**
 * Function to delete token value for user
 * @param userId {String} the customer id
 * @param userType {String} the user type
 * @param callback {String} the callback function
 */
module.exports.deleteAuth = function(userId,callback) {
    exports.baseModel.delete({usr_id: userId }, function(err,deletedAuth){
        callback(err,deletedAuth);
    });
};


